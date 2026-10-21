import {NextRequest, NextResponse} from "next/server";
import {describeError, getLeadsClient} from "@/lib/sanityLeadsClient";
import {sendLeadEmail} from "@/lib/leadEmail";
import {assessLead, deriveChannel} from "@/lib/leadInsights";

type ServiceAnswer = {question?: string; answer?: string};
type ServiceAnswerGroup = {service?: string; answers?: ServiceAnswer[]};

type SubmitPayload = {
  // Honeypot: echte bezoekers vullen dit nooit in (onzichtbaar in de UI).
  // `company` is de oude veldnaam (oudere gecachte scripts); `hp_x7` de nieuwe,
  // die browser-autofill niet herkent (BE-01).
  company?: string;
  hp_x7?: string;
  // Eenmalige ID per inzending uit de browser, om dubbele leads te voorkomen.
  submissionId?: string;
  // Aantal foto's dat bij een herkansing is weggelaten (te grote aanvraag).
  photosDropped?: number;
  name?: string;
  email?: string;
  phone?: string;
  services?: string[];
  postcode?: string;
  houseNumber?: string;
  address?: string;
  location?: string;
  fundaUrl?: string;
  timeline?: string;
  budgetMin?: number;
  budgetMax?: number;
  budgetLabel?: string;
  hoeGevonden?: string;
  message?: string;
  serviceAnswers?: ServiceAnswerGroup[];
  photos?: unknown;
  source?: string;
  attribution?: Record<string, unknown>;
};

// Alleen bekende bronnen; alles anders wordt "smart-intake".
const ALLOWED_SOURCES = new Set(["smart-intake", "lp-totaalrenovatie", "lp-draagmuur"]);
const FORM_TITLES: Record<string, string> = {
  "lp-totaalrenovatie": "Landingspagina totaalrenovatie",
  "lp-draagmuur": "Landingspagina draagmuur",
};
const ATTRIBUTION_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "landingPage",
  "referrer",
  "variant",
  "firstSeenAt",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maximale lengtes per veld (BE-13): voorkomt enorme documenten en mails.
const LIMITS = {short: 200, medium: 500, long: 5000} as const;

function cleanString(value: unknown, max: number = LIMITS.medium): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Telefoon: eerst onzichtbare tekens (bidi-markeringen uit iOS-contacten,
// zero-width) en afwijkende spaties/streepjes normaliseren, dan alleen op het
// aantal cijfers controleren. Het originele nummer wordt opgeslagen.
function normalizePhone(value: string): string {
  return value
    .replace(new RegExp("\\p{Cf}", "gu"), "")
    .replace(/[\u00a0\u2000-\u200a\u202f\u205f\u3000]/g, " ")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function phoneLooksValid(value: string): boolean {
  const digits = (value.match(/\d/g) || []).length;
  return digits >= 9 && digits <= 15;
}
const SUBMISSION_ID_RE = /^[a-zA-Z0-9-]{8,64}$/;

// Eenvoudige rate limit per serverinstantie (best effort). Een WAF-regel in
// Vercel op /api/submit-* is de echte bescherming (zie docs/audit/08).
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 6;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_MAX;
}

const ALLOWED_ORIGIN_RE = /^https:\/\/((www|go)\.)?dro-renovaties\.nl$|^https:\/\/[a-z0-9-]+\.vercel\.app$|^http:\/\/localhost(:\d+)?$/;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

const TIMED_OUT = Symbol("timed-out");

// Elke afwijzing komt in de logs (zonder persoonsgegevens), zodat een
// geblokkeerde echte klant zichtbaar wordt (L3 uit de pre-productiereview).
function reject(status: number, reason: string, extra: Record<string, unknown> = {}) {
  console.warn(`LEAD_REJECTED status=${status} reason=${reason}`);
  return NextResponse.json({error: reason, ...extra}, {status});
}

function cleanNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function cleanAttribution(input: unknown): Record<string, string> | undefined {
  if (!input || typeof input !== "object") return undefined;
  const source = input as Record<string, unknown>;
  const result: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = cleanString(source[key]).slice(0, 200);
    if (value) result[key] = value;
  }
  return Object.keys(result).length ? result : undefined;
}

function cleanServiceAnswers(input: unknown): Array<{service: string; answers: Array<{question: string; answer: string}>}> {
  if (!Array.isArray(input)) return [];

  return input
    .map((group: ServiceAnswerGroup) => ({
      service: cleanString(group?.service),
      answers: Array.isArray(group?.answers)
        ? group.answers
            .map((entry) => ({question: cleanString(entry?.question), answer: cleanString(entry?.answer)}))
            .filter((entry) => entry.question && entry.answer)
        : [],
    }))
    .filter((group) => group.service);
}

// Foto's uit het formulier: in de browser al verkleind tot JPEG (base64).
// Streng begrensd zodat niemand grote of andere bestanden kan wegschrijven.
const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 1_500_000;

function cleanPhotos(input: unknown): Buffer[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, MAX_PHOTOS)
    .filter((p): p is string => typeof p === "string" && p.length > 0 && p.length < MAX_PHOTO_BYTES * 1.4)
    .map((p) => Buffer.from(p, "base64"))
    // JPEG begint altijd met FF D8 FF.
    .filter((buf) => buf.length > 0 && buf.length <= MAX_PHOTO_BYTES && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff);
}

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // Herkomst- en type-controle (BE-08, BE-18). Zonder Origin-header (sommige
  // privacy-browsers) laten we de aanvraag door: liever een spamlead dan een
  // gemiste klant.
  const origin = request.headers.get("origin");
  // "null" komt voor in sandbox/privacy-contexten: doorlaten.
  if (origin && origin !== "null" && !ALLOWED_ORIGIN_RE.test(origin)) {
    return reject(403, "Forbidden");
  }
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return reject(415, "Unsupported content type");
  }

  let payload: SubmitPayload;

  try {
    payload = await request.json();
  } catch {
    return reject(400, "Invalid JSON");
  }

  // Honeypot: NIET meer stil weggooien (BE-01). Autofill kan het veld vullen
  // bij een echte klant. De lead wordt opgeslagen met een spamvlag en de mail
  // gaat uit met "[MOGELIJK SPAM]" in het onderwerp (de rate limit beperkt
  // het volume van echte spam).
  const spamSuspect = Boolean(cleanString(payload.hp_x7) || cleanString(payload.company));
  const requestedId = cleanString(payload.submissionId, 64);
  const submissionKey = SUBMISSION_ID_RE.test(requestedId) ? requestedId : crypto.randomUUID();

  const name = cleanString(payload.name, LIMITS.short);
  const email = cleanString(payload.email, LIMITS.short);
  const phone = normalizePhone(cleanString(payload.phone, 40));
  const services = Array.isArray(payload.services)
    ? payload.services
        .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
        .map((item) => item.trim().slice(0, LIMITS.short))
        .slice(0, 12)
    : [];

  // Een lead wordt alleen geweigerd als er echt niets bruikbaars in zit: een
  // naam, een dienst en minstens één bereikbaar contactgegeven. Een afwijkend
  // telefoonnummer naast een geldig e-mailadres (of andersom) is geen reden
  // om een klant weg te sturen.
  const emailValid = Boolean(email) && EMAIL_RE.test(email);
  const phoneValid = Boolean(phone) && phoneLooksValid(phone);
  const missing: string[] = [];
  if (!name) missing.push("name");
  if (!services.length) missing.push("services");
  if (!emailValid && !phoneValid) missing.push(email ? "email" : "phone");

  if (missing.length) {
    return reject(400, "Missing or invalid fields", {fields: missing});
  }

  // Rate limit pas na validatie, zodat een klant die een typfout herstelt niet
  // in de limiet loopt. Zonder bekend IP geen limiet (geen gedeelde emmer).
  const ip = request.ip || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (ip && rateLimited(ip)) {
    return reject(429, "Too many requests");
  }

  // Ontbreekt de Sanity-configuratie, dan gaat de lead alsnog per mail (BE-03).
  let leads: ReturnType<typeof getLeadsClient> | null = null;
  try {
    leads = getLeadsClient();
  } catch (err) {
    console.error("Leads client niet beschikbaar:", describeError(err));
  }

  const postcode = cleanString(payload.postcode, 20);
  const houseNumber = cleanString(payload.houseNumber, 20);
  const address = cleanString(payload.address, LIMITS.medium);
  const location = cleanString(payload.location, LIMITS.short);
  const fundaUrl = cleanString(payload.fundaUrl, LIMITS.medium);
  const timeline = cleanString(payload.timeline, LIMITS.short);
  const budgetMin = cleanNumber(payload.budgetMin);
  const budgetMax = cleanNumber(payload.budgetMax);
  const budgetLabel = cleanString(payload.budgetLabel, LIMITS.short);
  const hoeGevonden = cleanString(payload.hoeGevonden, LIMITS.short);
  const message = cleanString(payload.message, LIMITS.long);
  const serviceAnswers = cleanServiceAnswers(payload.serviceAnswers);
  const submittedAt = new Date().toISOString();
  const requestedSource = cleanString(payload.source);
  const source = ALLOWED_SOURCES.has(requestedSource) ? requestedSource : "smart-intake";
  const attribution = cleanAttribution(payload.attribution);
  const channel = deriveChannel(source, attribution);
  const assessment = assessLead({services, budgetMin, budgetMax, budgetLabel, timeline, postcode});

  // Volgorde (na pre-productiereview):
  // 1. lead opslaan (max 8 s);
  // 2. mail versturen (max 12 s), ook als opslaan mislukte (dan met waarschuwing);
  // 3. `emailedAt` op de lead zetten, zodat een herhaalde inzending (409) weet of
  //    de mail al is verstuurd;
  // 4. foto's uploaden (max 7 s). Totaal blijft binnen maxDuration (30 s).
  // Alleen als opslaan EN mailen mislukken krijgt de bezoeker een foutmelding.
  const leadId = `submission-${submissionKey}`;
  const photoBuffers = cleanPhotos(payload.photos);
  const photosDropped = typeof payload.photosDropped === "number" && payload.photosDropped > 0 ? Math.min(payload.photosDropped, 12) : 0;

  const leadFields = {
    name,
    email,
    phone,
    services,
    postcode,
    houseNumber,
    address,
    location,
    fundaUrl,
    timeline,
    ...(budgetMin !== undefined ? {budgetMin} : {}),
    ...(budgetMax !== undefined ? {budgetMax} : {}),
    budgetLabel,
    hoeGevonden,
    message,
    serviceAnswers: serviceAnswers.map((group, i) => ({
      _key: `service-${i}`,
      service: group.service,
      answers: group.answers.map((entry, j) => ({_key: `answer-${i}-${j}`, ...entry})),
    })),
    source,
    channel: channel.label,
    leadAssessment: assessment.label,
    ...(attribution ? {attribution} : {}),
    ...(spamSuspect ? {spamSuspect: true} : {}),
    submittedAt,
  };

  let saved = false;
  let duplicate = false;
  let alreadyEmailed = false;

  if (leads) {
    try {
      const created = await withTimeout<{_id: string} | typeof TIMED_OUT>(
        leads.create({_id: leadId, _type: "formSubmission", ...leadFields}),
        8_000,
        TIMED_OUT
      );
      if (created === TIMED_OUT) {
        console.error("formSubmission create timed out");
      } else {
        saved = true;
      }
    } catch (err) {
      // 409: deze inzending bestaat al (herhaalde poging na een time-out). Dan
      // controleren of de eerste poging de mail nog heeft verstuurd (L1).
      if ((err as {statusCode?: number})?.statusCode === 409) {
        duplicate = true;
        saved = true;
        try {
          const existing = await leads.getDocument<{emailedAt?: string}>(leadId);
          alreadyEmailed = Boolean(existing?.emailedAt);
        } catch (lookupErr) {
          console.error("Bestaande lead opvragen mislukt:", describeError(lookupErr));
        }
      } else {
        console.error("formSubmission (smart-intake) create failed:", describeError(err));
      }
    }
  }

  let emailed = alreadyEmailed;
  if (!alreadyEmailed) {
    try {
      emailed = await withTimeout(
        sendLeadEmail({
          documentId: saved ? leadId : undefined,
          notSavedWarning: !saved,
          spamSuspect,
          submittedAt,
          formTitle: FORM_TITLES[source] || "Intake op de website",
          name,
          email,
          phone,
          services,
          address,
          postcode,
          houseNumber,
          location,
          fundaUrl,
          budgetLabel,
          timeline,
          message,
          hoeGevonden,
          serviceAnswers,
          // Foto's worden na de mail aan de lead in de Studio gekoppeld.
          photoCount: photoBuffers.length,
          photosDropped,
          channel,
          assessment,
          attribution,
        }),
        12_000,
        false
      );
    } catch (err) {
      console.error("Admin notification email (smart-intake) failed:", describeError(err));
    }
    if (!emailed) {
      // Zichtbaar in de Vercel-logs; stel hier een log-alert op in (docs/audit/08).
      console.error(`LEAD_EMAIL_FAILED saved=${saved} duplicate=${duplicate}`);
    }
  }

  if (!saved && !emailed) {
    console.error("LEAD_LOST: opslaan en mailen beide mislukt");
    return NextResponse.json({error: "Failed to save submission"}, {status: 500});
  }

  if (saved && leads) {
    const client = leads;
    try {
      if (emailed && !alreadyEmailed) {
        await withTimeout(client.patch(leadId).set({emailedAt: new Date().toISOString()}).commit(), 3_000, null);
      }
      if (!duplicate && photoBuffers.length) {
        const uploads = await withTimeout(
          Promise.allSettled(
            photoBuffers.map((buf, i) =>
              client.assets.upload("image", buf, {filename: `aanvraag-foto-${i + 1}.jpg`, contentType: "image/jpeg"})
            )
          ),
          7_000,
          [] as PromiseSettledResult<{_id: string}>[]
        );
        const photoRefs = uploads.flatMap((result, i) =>
          result.status === "fulfilled"
            ? [{_type: "image" as const, _key: `photo-${i}`, asset: {_type: "reference" as const, _ref: result.value._id}}]
            : []
        );
        if (photoRefs.length) {
          await client.patch(leadId).set({photos: photoRefs}).commit();
        }
        if (photoRefs.length < photoBuffers.length) {
          console.error(`LEAD_PHOTOS_INCOMPLETE stored=${photoRefs.length} received=${photoBuffers.length}`);
        }
      }
    } catch (err) {
      console.error("Nabewerking lead (emailedAt/foto's) mislukt:", describeError(err));
    }
  }

  return NextResponse.json({ok: true, id: leadId, spamSuspect, duplicate}, {status: 201});
}
