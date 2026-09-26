import {NextRequest, NextResponse} from "next/server";
import {writeClient} from "@/lib/sanityWriteClient";
import {sendSubmissionNotificationEmail} from "@/lib/email";

type ServiceAnswer = {question?: string; answer?: string};
type ServiceAnswerGroup = {service?: string; answers?: ServiceAnswer[]};

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
  fundaLink?: string;
  priorities?: string;
  budget?: string;
  timeline?: string;
  serviceAnswers?: ServiceAnswerGroup[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
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
  const budget = cleanString(payload.budget);

  const missing: string[] = [];
  if (!name) missing.push("name");
  if (!email || !EMAIL_RE.test(email)) missing.push("email");
  if (!phone) missing.push("phone");
  if (!services.length) missing.push("services");
  if (!budget) missing.push("budget");

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
  const fundaLink = cleanString(payload.fundaLink);
  const priorities = cleanString(payload.priorities);
  const timeline = cleanString(payload.timeline);
  const serviceAnswers = cleanServiceAnswers(payload.serviceAnswers);
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
      fundaLink,
      priorities,
      budget,
      timeline,
      serviceAnswers: serviceAnswers.map((group, i) => ({
        _key: `service-${i}`,
        service: group.service,
        answers: group.answers.map((entry, j) => ({_key: `answer-${i}-${j}`, ...entry})),
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
      {fieldKey: "fundaLink", label: "Funda-link", value: fundaLink},
      {fieldKey: "budget", label: "Budget", value: budget},
      {fieldKey: "timeline", label: "Planning", value: timeline},
      {fieldKey: "priorities", label: "Belangrijkst", value: priorities},
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
