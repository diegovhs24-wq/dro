import {Resend} from "resend";
import {getSiteUrl} from "@/lib/seo/site";
import type {LeadAssessment, LeadAttribution, LeadChannel} from "@/lib/leadInsights";

// Meldingsmail voor een nieuwe aanvraag. Opbouw: eerst bellen (naam, nummer,
// knoppen), dan of de lead past, dan het project, en de herkomst onderaan.
// Lege velden worden weggelaten. Alleen inline-stijlen en tabellen, zodat de
// mail er in Gmail, Outlook en op de telefoon hetzelfde uitziet.

const C = {
  ink: "#1C1F23",
  muted: "#5B6368",
  weak: "#81898E",
  line: "#D9DDDA",
  soft: "#F4F5F4",
  orange: "#D95B16",
  slate: "#26313A",
  ok: "#2E7D4F",
  okBg: "#E4F2EA",
  warn: "#9A6A00",
  warnBg: "#FBF0D6",
  bad: "#B3362F",
  badBg: "#F9E3E1",
  ads: "#1A56C4",
  adsBg: "#E6EEFB",
};
const FONT = "Arial,Helvetica,sans-serif";

export type LeadEmailData = {
  documentId?: string;
  submittedAt: string;
  formTitle: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  address?: string;
  postcode?: string;
  houseNumber?: string;
  location?: string;
  fundaUrl?: string;
  budgetLabel?: string;
  timeline?: string;
  message?: string;
  hoeGevonden?: string;
  serviceAnswers: Array<{service: string; answers: Array<{question: string; answer: string}>}>;
  photoCount?: number;
  channel: LeadChannel;
  assessment: LeadAssessment;
  attribution?: LeadAttribution;
};

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// "06 12345678" of "+31 6 ..." naar internationaal formaat zonder tekens (31612345678).
function internationalNumber(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `31${digits.slice(1)}`;
  return digits;
}

function studioLink(documentId?: string): string {
  const base = `${getSiteUrl()}/studio-aanvragen`;
  return documentId ? `${base}/intent/edit/id=${encodeURIComponent(documentId)};type=formSubmission` : base;
}

function shortBudget(label?: string): string {
  if (!label || /weet ik/i.test(label)) return "";
  const nums = (label.match(/\d[\d.]*/g) || []).map((x) => Number(x.replace(/\./g, "")));
  const k = (n: number) => `${Math.round(n / 1000)}k`;
  if (/meer dan/i.test(label) && nums[0]) return `€ ${k(nums[0])}+`;
  if (/^\s*tot\b/i.test(label) && nums[0]) return `tot € ${k(nums[0])}`;
  if (nums.length >= 2 && nums[0] >= 1000) return `€ ${k(nums[0])}-${k(nums[1])}`;
  return label.replace(/\s+/g, " ").slice(0, 24);
}

function shortPlanning(timeline?: string): string {
  if (!timeline) return "";
  return timeline.replace(/^binnen /i, "binnen ").replace(/maanden/i, "mnd").slice(0, 24);
}

export function buildLeadSubject(d: LeadEmailData): string {
  const tag = d.channel.key === "google-ads" ? "[Google Ads]" : "[Website]";
  const what = d.services.join(", ") || "Aanvraag";
  const place = d.location ? ` ${d.location.replace(/^'s-Gravenhage$/i, "Den Haag")}` : "";
  const parts = [`${what}${place}`, shortBudget(d.budgetLabel), shortPlanning(d.timeline), d.name].filter(Boolean);
  return `${tag} ${parts.join(" · ")}`;
}

// Korte labels voor bekende intakevragen, zodat de mail op de telefoon leesbaar blijft.
const SHORT_LABELS: Array<[RegExp, string]> = [
  [/woonoppervlakte|oppervlakte/i, "Oppervlakte"],
  [/casco/i, "Omvang"],
  [/bewoond/i, "Bewoond tijdens werk"],
  [/bouwjaar/i, "Bouwjaar"],
  [/type woning/i, "Woning"],
  [/situatie/i, "Situatie"],
  [/vergunning/i, "Vergunning"],
  [/afmeting/i, "Afmeting"],
  [/groot wordt de uitbreiding/i, "Maten uitbreiding"],
  [/uitbreiding/i, "Soort uitbreiding"],
  [/maten van de badkamer/i, "Maten badkamer"],
  [/lang wordt de keuken/i, "Lengte keuken"],
  [/woonlagen/i, "Woonlagen"],
  [/breed wordt de dakkapel/i, "Breedte dakkapel"],
  [/energielabel/i, "Energielabel"],
  [/hoeveel kozijnen/i, "Aantal kozijnen"],
  [/ruimtes samen/i, "Oppervlakte ruimtes"],
  [/m² stucwerk/i, "Stucwerk m²"],
  [/m² schilderwerk/i, "Schilderwerk"],
  [/wilt u laten doen/i, "Klus"],
  [/prijsindicatie/i, "Indicatie"],
  [/past deze indicatie/i, "Budget"],
  [/archief- of bouwtekeningen/i, "Tekeningen"],
  [/muur dragend/i, "Dragend"],
  [/daarna nog gebeuren/i, "Daarna"],
  [/andere dingen die u in huis/i, "Ook laten doen"],
];

function shortQuestion(question: string): string {
  for (const [re, label] of SHORT_LABELS) if (re.test(question)) return label;
  const q = question.replace(/\?$/, "");
  return q.length > 34 ? `${q.slice(0, 32)}...` : q;
}

function chip(text: string, fg: string, bg: string): string {
  return `<span style="display:inline-block;background:${bg};color:${fg};border-radius:999px;padding:3px 10px;font-family:${FONT};font-size:12px;font-weight:700;">${esc(text)}</span>`;
}

function button(href: string, text: string, primary = false): string {
  const style = primary
    ? `background:${C.orange};border:1px solid ${C.orange};color:#ffffff;`
    : `background:#ffffff;border:1px solid ${C.line};color:${C.ink};`;
  return `<a href="${esc(href)}" style="display:inline-block;${style}font-family:${FONT};font-size:14px;font-weight:700;text-decoration:none;padding:10px 16px;border-radius:6px;margin:0 6px 6px 0;">${esc(text)}</a>`;
}

function section(title: string, inner: string): string {
  return `<tr><td style="padding:16px 22px;border-top:1px solid ${C.line};">
    <p style="margin:0 0 10px 0;font-family:${FONT};font-size:11.5px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${C.weak};">${esc(title)}</p>
    ${inner}
  </td></tr>`;
}

function rows(items: Array<[string, string | undefined, boolean?]>): string {
  const filled = items.filter(([, v]) => v && v.trim() && v.trim() !== "—");
  if (!filled.length) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filled
    .map(
      ([label, value, raw]) => `<tr>
        <td style="padding:4px 12px 4px 0;font-family:${FONT};font-size:13.5px;color:${C.muted};vertical-align:top;width:120px;">${esc(label)}</td>
        <td style="padding:4px 0;font-family:${FONT};font-size:14px;font-weight:600;color:${C.ink};vertical-align:top;">${raw ? value : esc(value as string).replace(/\n/g, "<br/>")}</td>
      </tr>`,
    )
    .join("")}</table>`;
}

function verdictChip(a: LeadAssessment): string {
  if (a.verdict === "kansrijk") return chip(a.label, C.ok, C.okBg);
  if (a.verdict === "past-niet") return chip(a.label, C.bad, C.badBg);
  return chip(a.label, C.warn, C.warnBg);
}

export function renderLeadEmail(d: LeadEmailData): {subject: string; html: string; text: string} {
  const when = new Date(d.submittedAt).toLocaleString("nl-NL", {weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam"});
  const isAds = d.channel.key === "google-ads";
  const intl = internationalNumber(d.phone);
  const callBy = isAds ? "bel binnen 1 werkuur" : "bel vandaag nog";

  const address = d.address || [d.postcode, d.houseNumber].filter(Boolean).join(" ");
  const mapLink = address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "";
  const addressHtml = address
    ? `${esc(address)}${mapLink ? ` &middot; <a href="${esc(mapLink)}" style="color:${C.ads};">kaart</a>` : ""}`
    : "";
  const fundaHtml = d.fundaUrl && /^https?:\/\//i.test(d.fundaUrl) ? `<a href="${esc(d.fundaUrl)}" style="color:${C.ads};">Funda-advertentie openen</a>` : d.fundaUrl;

  const answerRows: Array<[string, string]> = d.serviceAnswers.flatMap((g) => g.answers.map((qa) => [shortQuestion(qa.question), qa.answer] as [string, string]));

  const checks = d.assessment.checks
    .map(
      (c) =>
        `<tr><td style="padding:2px 8px 2px 0;font-family:${FONT};font-size:14px;font-weight:700;color:${c.ok === true ? C.ok : c.ok === false ? C.bad : C.warn};vertical-align:top;">${c.ok === true ? "&#10003;" : c.ok === false ? "&#10007;" : "?"}</td><td style="padding:2px 0;font-family:${FONT};font-size:13.5px;color:${C.ink};">${esc(c.reason)}</td></tr>`,
    )
    .join("");

  const a = d.attribution || {};
  const page = a.landingPage ? `${a.landingPage}${a.variant ? ` (variant ${a.variant})` : ""}` : undefined;

  const html = `<!DOCTYPE html>
<html lang="nl"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Nieuwe aanvraag</title></head>
<body style="margin:0;padding:0;background:#EEF0EE;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF0EE;padding:20px 10px;">
<tr><td align="center">
<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid ${C.line};border-radius:8px;overflow:hidden;">
  <tr><td style="background:${C.slate};padding:14px 22px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:${FONT};font-size:16px;font-weight:700;color:#ffffff;">Nieuwe aanvraag, ${esc(callBy)}</td>
      <td align="right" style="font-family:${FONT};font-size:12.5px;color:#C9D0D4;white-space:nowrap;">${esc(when)}</td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:18px 22px 12px 22px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:top;">
        <p style="margin:0;font-family:${FONT};font-size:21px;font-weight:700;color:${C.ink};">${esc(d.name)}</p>
        <p style="margin:3px 0 12px 0;font-family:${FONT};font-size:13.5px;color:${C.muted};">${esc(d.phone)} &middot; ${esc(d.email)}</p>
        ${button(`tel:+${intl}`, "Bel nu", true)}${button(`https://wa.me/${intl}`, "WhatsApp")}${button(`mailto:${d.email}`, "Mail")}
      </td>
      <td align="right" style="vertical-align:top;width:120px;">${verdictChip(d.assessment)}<br/>${isAds ? `<span style="display:inline-block;margin-top:6px;">${chip("Google Ads", C.ads, C.adsBg)}</span>` : ""}</td>
    </tr></table>
  </td></tr>
  ${section(
    "Project",
    rows([
      ["Wat", d.services.join(", ")],
      ...answerRows,
      ["Adres", addressHtml, true],
      ["Funda", fundaHtml, true],
      ["Foto's", d.photoCount ? `${d.photoCount} foto${d.photoCount === 1 ? "" : "'s"} &middot; <a href="${esc(studioLink(d.documentId))}" style="color:${C.ads};">bekijken</a>` : undefined, true],
      ["Budget", d.budgetLabel],
      ["Planning", d.timeline],
    ]),
  )}
  ${d.message ? section("Opmerking van de klant", `<div style="background:${C.soft};border-left:3px solid ${C.orange};padding:10px 12px;font-family:${FONT};font-size:14px;line-height:1.5;color:${C.ink};">${esc(d.message).replace(/\n/g, "<br/>")}</div>`) : ""}
  ${checks ? section(`Waarom ${d.assessment.label.toLowerCase()}`, `<table role="presentation" cellpadding="0" cellspacing="0">${checks}</table>`) : ""}
  ${section(
    "Herkomst",
    rows([
      ["Kanaal", d.channel.label],
      ["Campagne", a.utm_campaign],
      ["Zoekwoord", a.utm_term],
      ["Pagina", page],
      ["Verwijzer", a.referrer],
      ["Formulier", d.formTitle],
      ["Hoe gevonden", d.hoeGevonden],
    ]) + `<div style="margin-top:12px;">${button(studioLink(d.documentId), "Bekijk alle gegevens")}</div>`,
  )}
  <tr><td style="padding:12px 22px;background:${C.soft};border-top:1px solid ${C.line};font-family:${FONT};font-size:11.5px;color:${C.weak};">
    Automatisch verstuurd door dro-renovaties.nl. Beantwoorden gaat direct naar de klant. De volledige aanvraag staat in Aanvragen.
  </td></tr>
</table>
</td></tr></table>
</body></html>`;

  const text = [
    `Nieuwe aanvraag (${d.channel.label}), ${callBy}`,
    `${d.name} · ${d.phone} · ${d.email}`,
    `Beoordeling: ${d.assessment.label}`,
    `Wat: ${d.services.join(", ")}`,
    ...answerRows.map(([q, v]) => `${q}: ${v}`),
    address ? `Adres: ${address}` : "",
    d.budgetLabel ? `Budget: ${d.budgetLabel}` : "",
    d.timeline ? `Planning: ${d.timeline}` : "",
    d.message ? `Opmerking: ${d.message}` : "",
    a.utm_campaign ? `Campagne: ${a.utm_campaign}` : "",
    a.utm_term ? `Zoekwoord: ${a.utm_term}` : "",
    `Alle gegevens: ${studioLink(d.documentId)}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {subject: buildLeadSubject(d), html, text};
}

// Ontvangers: standaard Scott (opvolging) met de beheerder in cc. Beide zijn via
// omgevingsvariabelen te overschrijven, zonder codewijziging.
export async function sendLeadEmail(d: LeadEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const admin = process.env.ADMIN_NOTIFICATION_EMAIL;
  const toRaw = process.env.LEAD_NOTIFICATION_TO || "scott@dro-renovaties.nl";

  if (!apiKey || !from) {
    console.warn("Resend niet ingesteld (RESEND_API_KEY / EMAIL_FROM ontbreekt), leadmail overgeslagen");
    return;
  }

  const split = (v?: string) => (v || "").split(",").map((x) => x.trim()).filter(Boolean);
  const to = split(toRaw);
  const cc = split(admin).filter((x) => !to.includes(x));
  const {subject, html, text} = renderLeadEmail(d);

  const resend = new Resend(apiKey);
  const {error} = await resend.emails.send({
    from,
    to: to.length ? to : cc,
    ...(to.length && cc.length ? {cc} : {}),
    replyTo: d.email,
    subject,
    html,
    text,
  });

  if (error) {
    throw Object.assign(new Error("Resend lead notification failed"), {
      name: typeof error.name === "string" ? error.name : "ResendError",
      statusCode: typeof error.statusCode === "number" ? error.statusCode : undefined,
    });
  }
}
