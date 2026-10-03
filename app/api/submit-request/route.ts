import {NextRequest, NextResponse} from "next/server";
import {writeClient} from "@/lib/sanityWriteClient";
import {sendSubmissionNotificationEmail} from "@/lib/email";

type ServiceAnswer = {question?: string; answer?: string};
type ServiceAnswerGroup = {service?: string; answers?: ServiceAnswer[]};
type Attachment = {assetId?: string; kind?: string; originalFilename?: string};

type SubmitPayload = {
  // Honeypot: echte bezoekers vullen dit nooit in (onzichtbaar in de UI).
  company?: string;
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
  attachments?: Attachment[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function cleanAttachments(input: unknown): Array<{kind: "image" | "file"; assetId: string; originalFilename: string}> {
  if (!Array.isArray(input)) return [];

  return input
    .map((item: Attachment) => ({
      kind: item?.kind === "image" ? ("image" as const) : ("file" as const),
      assetId: cleanString(item?.assetId),
      originalFilename: cleanString(item?.originalFilename),
    }))
    .filter((item) => item.assetId.startsWith("image-") || item.assetId.startsWith("file-"));
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

export async function POST(request: NextRequest) {
  let payload: SubmitPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: "Invalid JSON"}, {status: 400});
  }

  // Honeypot getriggerd: doe alsof het gelukt is, schrijf niets weg.
  if (cleanString(payload.company)) {
    return NextResponse.json({ok: true}, {status: 201});
  }

  const name = cleanString(payload.name);
  const email = cleanString(payload.email);
  const phone = cleanString(payload.phone);
  const services = Array.isArray(payload.services) ? payload.services.filter((s) => typeof s === "string" && s.trim()) : [];

  const missing: string[] = [];
  if (!name) missing.push("name");
  if (!email || !EMAIL_RE.test(email)) missing.push("email");
  if (!phone) missing.push("phone");
  if (!services.length) missing.push("services");

  if (missing.length) {
    return NextResponse.json({error: "Missing or invalid fields", fields: missing}, {status: 400});
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({error: "Write token not configured"}, {status: 500});
  }

  const postcode = cleanString(payload.postcode);
  const houseNumber = cleanString(payload.houseNumber);
  const address = cleanString(payload.address);
  const location = cleanString(payload.location);
  const fundaUrl = cleanString(payload.fundaUrl);
  const timeline = cleanString(payload.timeline);
  const budgetMin = cleanNumber(payload.budgetMin);
  const budgetMax = cleanNumber(payload.budgetMax);
  const budgetLabel = cleanString(payload.budgetLabel);
  const hoeGevonden = cleanString(payload.hoeGevonden);
  const message = cleanString(payload.message);
  const serviceAnswers = cleanServiceAnswers(payload.serviceAnswers);
  const attachments = cleanAttachments(payload.attachments);
  const submittedAt = new Date().toISOString();

  try {
    await writeClient.create({
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
      attachments: attachments.map((item, i) => ({
        _key: `attachment-${i}`,
        _type: "attachmentItem",
        kind: item.kind,
        originalFilename: item.originalFilename,
        ...(item.kind === "image"
          ? {image: {_type: "image", asset: {_type: "reference", _ref: item.assetId}}}
          : {file: {_type: "file", asset: {_type: "reference", _ref: item.assetId}}}),
      })),
      source: "smart-intake",
      submittedAt,
    });
  } catch (err) {
    console.error("formSubmission (smart-intake) create failed:", err);
    return NextResponse.json({error: "Failed to save submission"}, {status: 500});
  }

  // Beheerder informeren per e-mail. De inzending staat al in Sanity, dus een
  // fout hier mag nooit een foutmelding worden voor de bezoeker.
  try {
    const entries = [
      {fieldKey: "name", label: "Naam", value: name},
      {fieldKey: "email", label: "E-mail", value: email},
      {fieldKey: "phone", label: "Telefoon", value: phone},
      {fieldKey: "services", label: "Diensten", value: services.join(", ")},
      {fieldKey: "address", label: "Adres", value: address || `${postcode} ${houseNumber}`.trim()},
      {fieldKey: "location", label: "Plaats", value: location},
      {fieldKey: "fundaUrl", label: "Funda-link", value: fundaUrl},
      {fieldKey: "budget", label: "Budget", value: budgetLabel},
      {fieldKey: "timeline", label: "Planning", value: timeline},
      {fieldKey: "hoeGevonden", label: "Hoe gevonden", value: hoeGevonden},
      {fieldKey: "message", label: "Vertel ons wat we nog niet weten", value: message},
      ...(attachments.length
        ? [{fieldKey: "attachments", label: "Bijlagen", value: `${attachments.length} bestand(en), zie de inzending in Sanity Studio`}]
        : []),
      ...serviceAnswers.flatMap((group) =>
        group.answers.map((entry) => ({
          fieldKey: `${group.service}: ${entry.question}`,
          label: `${group.service}: ${entry.question}`,
          value: entry.answer,
        }))
      ),
    ];

    await sendSubmissionNotificationEmail({
      formTitle: "Slimme intake",
      submittedAt,
      entries,
    });
  } catch (err) {
    console.error("Admin notification email (smart-intake) failed:", err);
  }

  return NextResponse.json({ok: true}, {status: 201});
}
