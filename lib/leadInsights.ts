// Afgeleide gegevens bij een aanvraag: via welk kanaal kwam iemand binnen, en
// past de aanvraag bij wat DRO zoekt. Pure functies zonder bijwerkingen, zodat
// de mail, de database en later Bouwe dezelfde uitkomst gebruiken.

export type LeadAttribution = Partial<
  Record<
    | "gclid"
    | "gbraid"
    | "wbraid"
    | "utm_source"
    | "utm_medium"
    | "utm_campaign"
    | "utm_content"
    | "utm_term"
    | "landingPage"
    | "referrer"
    | "variant"
    | "firstSeenAt",
    string
  >
>;

export type LeadChannel = {key: "google-ads" | "advertentie" | "campagne" | "organisch" | "verwijzing" | "direct"; label: string};

const PAID_MEDIUMS = new Set(["cpc", "ppc", "paid", "paidsearch", "paid-search", "sem"]);
const SEARCH_ENGINES = ["google.", "bing.", "duckduckgo.", "yahoo.", "ecosia.", "startpage."];

export function deriveChannel(source: string, attribution?: LeadAttribution): LeadChannel {
  const a = attribution || {};
  const medium = (a.utm_medium || "").toLowerCase();
  const utmSource = (a.utm_source || "").toLowerCase();
  const hasClickId = Boolean(a.gclid || a.gbraid || a.wbraid);

  // Landingspagina's (lp-...) staan niet in Google en zijn alleen via advertenties te vinden.
  if (hasClickId || source.startsWith("lp-") || (PAID_MEDIUMS.has(medium) && (!utmSource || utmSource === "google"))) {
    return {key: "google-ads", label: "Google Ads"};
  }
  if (PAID_MEDIUMS.has(medium)) return {key: "advertentie", label: `Advertentie (${a.utm_source})`};
  if (utmSource) return {key: "campagne", label: `Campagne (${a.utm_source})`};

  const ref = (a.referrer || "").toLowerCase();
  if (ref && SEARCH_ENGINES.some((engine) => ref.includes(engine))) return {key: "organisch", label: "Organisch zoeken"};
  if (ref) return {key: "verwijzing", label: `Verwijzing (${a.referrer})`};
  return {key: "direct", label: "Website (direct of onbekend)"};
}

export type LeadCheck = {label: string; ok: boolean | null; reason: string};
export type LeadAssessment = {verdict: "kansrijk" | "twijfel" | "past-niet"; label: string; checks: LeadCheck[]};

// Diensten waar de ondergrens van € 50.000 bij hoort (de doelgroep van de campagne).
const LARGE_PROJECT_SERVICES = ["totaalrenovatie", "aanbouw", "uitbouw", "opbouw", "dakopbouw"];
const MIN_BUDGET_LARGE = 50000;

const SOON_PLANNING = ["zo snel mogelijk", "binnen 3 maanden", "over 3 tot 6 maanden", "binnen 6 maanden", "3 tot 6 maanden", "direct"];
const LATE_PLANNING = ["oriënteer", "orienteer", "later", "nog geen"];

// Werkgebied: postcodes 2200 tot en met 3299 (Den Haag e.o., Leiden, Delft,
// Westland, Zoetermeer, Gouda, Alphen, Rotterdam en omgeving). Voor
// draagmuren ruimer: 50 km rond Den Haag (ongeveer 2000 tot en met 3499).
function postcodeInRegion(postcode: string, wide = false): boolean | null {
  const digits = (postcode || "").replace(/\D/g, "").slice(0, 4);
  if (digits.length !== 4) return null;
  const n = Number(digits);
  return wide ? n >= 2000 && n <= 3499 : n >= 2200 && n <= 3299;
}

function parseBudgetLabel(label: string): number | undefined {
  // "€ 50.000 tot € 100.000", "Meer dan € 150.000", "Tot € 50.000"
  const numbers = (label.match(/\d[\d.]*/g) || []).map((x) => Number(x.replace(/\./g, ""))).filter((n) => n >= 1000);
  if (!numbers.length) return undefined;
  if (/^\s*tot\b/i.test(label)) return Math.max(...numbers) - 1;
  return Math.max(...numbers);
}

export function assessLead(input: {
  services: string[];
  budgetMin?: number;
  budgetMax?: number;
  budgetLabel?: string;
  timeline?: string;
  postcode?: string;
}): LeadAssessment {
  const checks: LeadCheck[] = [];
  const large = input.services.some((s) => LARGE_PROJECT_SERVICES.some((k) => s.toLowerCase().includes(k)));
  const draagmuur = input.services.some((s) => /draagmuur|doorbraak/i.test(s));

  // Draagmuur: het formulier vraagt of de prijsindicatie bij het budget past.
  if (draagmuur && !large) {
    const label = (input.budgetLabel || "").toLowerCase();
    if (label.startsWith("lager")) checks.push({label: "Budget", ok: false, reason: "Budget lager dan de prijsindicatie"});
    else if (label.startsWith("past") || label.startsWith("hoger")) checks.push({label: "Budget", ok: true, reason: label.startsWith("hoger") ? "Budget hoger dan de indicatie, mogelijk meer werk" : "Prijsindicatie past bij het budget"});
  }

  if (large) {
    const top = input.budgetMax ?? (input.budgetLabel ? parseBudgetLabel(input.budgetLabel) : undefined);
    if (top === undefined) checks.push({label: "Budget", ok: null, reason: "Budget nog onbekend"});
    else if (top >= MIN_BUDGET_LARGE) checks.push({label: "Budget", ok: true, reason: "Budget past bij onze doelgroep (vanaf € 50.000)"});
    else checks.push({label: "Budget", ok: false, reason: "Budget onder € 50.000"});
  }

  const plan = (input.timeline || "").toLowerCase();
  if (!plan) checks.push({label: "Planning", ok: null, reason: "Planning onbekend"});
  else if (SOON_PLANNING.some((p) => plan.includes(p))) checks.push({label: "Planning", ok: true, reason: `Wil starten: ${input.timeline}`});
  else if (LATE_PLANNING.some((p) => plan.includes(p))) checks.push({label: "Planning", ok: false, reason: "Oriënteert zich nog"});
  else checks.push({label: "Planning", ok: null, reason: `Planning: ${input.timeline}`});

  const region = postcodeInRegion(input.postcode || "", draagmuur);
  if (region === null) checks.push({label: "Regio", ok: null, reason: "Postcode onbekend"});
  else if (region) checks.push({label: "Regio", ok: true, reason: "Adres ligt in ons werkgebied"});
  else checks.push({label: "Regio", ok: false, reason: "Adres ligt buiten ons vaste werkgebied"});

  const fails = checks.filter((c) => c.ok === false).length;
  const unknown = checks.filter((c) => c.ok === null).length;
  if (fails >= 2 || (fails === 1 && checks.find((c) => c.label === "Budget")?.ok === false && unknown > 0)) {
    return {verdict: "past-niet", label: "Past niet", checks};
  }
  if (fails === 0 && unknown === 0) return {verdict: "kansrijk", label: "Kansrijk", checks};
  return {verdict: "twijfel", label: "Twijfel", checks};
}
