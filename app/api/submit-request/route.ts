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

const PHONE_RE = /^[+0-9 ()./-]{8,25}$/;
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
  return Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))]);
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
  if (origin && !ALLOWED_ORIGIN_RE.test(origin)) {
    return NextResponse.json({error: "Forbidden"}, {status: 403});
  }
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return NextResponse.json({error: "Unsupported content type"}, {status: 415});
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "onbekend";
  if (rateLimited(ip)) {
    return NextResponse.json({error: "Too many requests"}, {status: 429});
  }

  let payload: SubmitPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: "Invalid JSON"}, {status: 400});
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
  const phone = cleanString(payload.phone, 40);
  const services = Array.isArray(payload.services)
    ? payload.services
        .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
        .map((item) => item.trim().slice(0, LIMITS.short))
        .slice(0, 12)
    : [];

  const missing: string[] = [];
  if (!name) missing.push("name");
  if (!email || !EMAIL_RE.test(email)) missing.push("email");
  if (!phone || !PHONE_RE.test(phone)) missing.push("phone");
  if (!services.length) missing.push("services");

  if (missing.length) {
    return NextResponse.json({error: "Missing or invalid fields", fields: missing}, {status: 400});
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

  // Volgorde (BE-02/04/12/14): eerst de lead zelf opslaan, dan foto's, dan
  // mailen. Lukt opslaan niet, dan gaat de volledige lead per mail. Alleen als
  // beide mislukken krijgt de bezoeker een foutmelding (met telefoonnummer).
  const leadId = `submission-${submissionKey}`;
  let documentId: string | undefined;
  let saved = false;

  if (leads) {
    try {
      const created = await leads.create({
        _id: leadId,
        _type: "formSubmission",
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
      });
      documentId = created._id;
      saved = true;
    } catch (err) {
      // 409: deze inzending bestaat al (dubbel verstuurd na een time-out).
      if ((err as {statusCode?: number})?.statusCode === 409) {
        return NextResponse.json({ok: true, id: leadId, duplicate: true}, {status: 201});
      }
      console.error("formSubmission (smart-intake) create failed:", describeError(err));
    }
  }

  // Foto's na het opslaan, parallel en met tijdslimiet: mogen de lead nooit
  // tegenhouden.
  let photoCount = 0;
  const photoBuffers = cleanPhotos(payload.photos);
  if (saved && leads && documentId && photoBuffers.length) {
    const client = leads;
    const uploads = await withTimeout(
      Promise.allSettled(
        photoBuffers.map((buf, i) =>
          client.assets.upload("image", buf, {filename: `aanvraag-foto-${i + 1}.jpg`, contentType: "image/jpeg"})
        )
      ),
      12_000,
      [] as PromiseSettledResult<{_id: string}>[]
    );
    const photoRefs = uploads.flatMap((result, i) =>
      result.status === "fulfilled"
        ? [{_type: "image" as const, _key: `photo-${i}`, asset: {_type: "reference" as const, _ref: result.value._id}}]
        : []
    );
    if (photoRefs.length) {
      try {
        await client.patch(documentId).set({photos: photoRefs}).commit();
        photoCount = photoRefs.length;
      } catch (err) {
        console.error("Foto-koppeling bij aanvraag mislukt:", describeError(err));
      }
    }
  }

  let emailed = false;
  try {
    emailed = await withTimeout(
      sendLeadEmail({
        documentId,
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
        photoCount,
        channel,
        assessment,
        attribution,
      }),
      8_000,
      false
    );
  } catch (err) {
    console.error("Admin notification email (smart-intake) failed:", describeError(err));
  }

  if (!emailed) {
    // Zichtbaar in de Vercel-logs; stel hier een log-alert op in (docs/audit/08).
    console.error(`LEAD_EMAIL_FAILED saved=${saved}`);
  }

  if (!saved && !emailed) {
    console.error("LEAD_LOST: opslaan en mailen beide mislukt");
    return NextResponse.json({error: "Failed to save submission"}, {status: 500});
  }

  return NextResponse.json({ok: true, id: documentId || leadId}, {status: 201});
}
