// Casestudy's: de uitgebreide versie van een project, voor opdrachtgevers die
// een groot project overwegen. Alles hier is "fail closed": een casestudy wordt
// alleen getoond als in Sanity is aangevinkt dat de klant toestemming heeft
// gegeven, met datum. Budgetband en klantcitaat hebben elk een eigen
// toestemmingsvinkje; zonder vinkje worden ze weggelaten, nooit vervangen.
//
// Geen verzonnen of afgeronde cijfers: lege velden blijven leeg.

export const CASE_STUDY_ROUTES = ["grote-renovatie", "specialistisch"] as const;
export type CaseStudyRoute = (typeof CASE_STUDY_ROUTES)[number];

// Vaste budgetbanden, zodat geen exact bedrag van een klant op de site komt.
export const BUDGET_BANDS = [
  {value: "25-50k", label: "€ 25.000 tot € 50.000"},
  {value: "50-100k", label: "€ 50.000 tot € 100.000"},
  {value: "100-150k", label: "€ 100.000 tot € 150.000"},
  {value: "150-250k", label: "€ 150.000 tot € 250.000"},
  {value: "250k-plus", label: "Meer dan € 250.000"},
] as const;

export type PublicCaseStudy = {
  routes: CaseStudyRoute[];
  district?: string;
  propertyType?: string;
  buildYear?: number;
  areaM2?: number;
  durationWeeks?: number;
  budgetBand?: string;
  clientGoal?: string;
  scope: string[];
  challenge?: string;
  solution?: string;
  details: string[];
  quote?: {text: string; author?: string};
  projectLead?: string;
  beforeImages: string[];
  afterImages: string[];
  consentDate: string;
};

type Raw = Record<string, unknown>;

function str(value: unknown, max = 1200): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function num(value: unknown, min: number, max: number): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return value >= min && value <= max ? value : undefined;
}

function strings(value: unknown, max = 20): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => str(item, 300)).filter((item): item is string => Boolean(item)).slice(0, max);
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(Date.parse(value));
}

export function budgetBandLabel(value?: string): string | undefined {
  return BUDGET_BANDS.find((band) => band.value === value)?.label;
}

// Zet de ruwe Sanity-data om naar wat publiek mag. Geeft null als de casestudy
// niet (volledig) is vrijgegeven.
export function toPublicCaseStudy(raw: unknown): PublicCaseStudy | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Raw;

  if (r.published !== true || !isDate(r.consentDate)) return null;

  const routes = (Array.isArray(r.routes) ? r.routes : []).filter((x): x is CaseStudyRoute =>
    (CASE_STUDY_ROUTES as readonly string[]).includes(x as string),
  );

  const afterImages = strings(r.afterImages, 12);
  const scope = strings(r.scope);
  const clientGoal = str(r.clientGoal);
  // Minimale inhoud: zonder omschrijving, scope en na-foto is het geen casestudy.
  if (!clientGoal || scope.length === 0 || afterImages.length === 0) return null;

  const quoteText = r.quoteConsent === true ? str(r.quote, 600) : undefined;

  return {
    routes,
    district: str(r.district, 120),
    propertyType: str(r.propertyType, 120),
    buildYear: num(r.buildYear, 1500, new Date().getFullYear()),
    areaM2: num(r.areaM2, 1, 5000),
    durationWeeks: num(r.durationWeeks, 0.5, 156),
    budgetBand: r.budgetBandConsent === true ? budgetBandLabel(str(r.budgetBand, 40)) : undefined,
    clientGoal,
    scope,
    challenge: str(r.challenge),
    solution: str(r.solution),
    details: strings(r.details),
    quote: quoteText ? {text: quoteText, author: str(r.quoteAuthor, 120)} : undefined,
    projectLead: str(r.projectLead, 80),
    beforeImages: strings(r.beforeImages, 12),
    afterImages,
    consentDate: (r.consentDate as string).slice(0, 10),
  };
}

export type CaseStudyFact = {label: string; value: string};

// De feitenbalk bovenaan een casestudy: alleen ingevulde velden.
export function caseStudyFacts(cs: PublicCaseStudy, location?: string): CaseStudyFact[] {
  const facts: CaseStudyFact[] = [];
  const place = [location, cs.district].filter(Boolean).join(", ");
  if (place) facts.push({label: "Locatie", value: place});
  if (cs.propertyType) facts.push({label: "Woning", value: cs.buildYear ? `${cs.propertyType}, bouwjaar ${cs.buildYear}` : cs.propertyType});
  if (cs.areaM2) facts.push({label: "Oppervlakte", value: `${cs.areaM2.toLocaleString("nl-NL")} m²`});
  if (cs.durationWeeks) facts.push({label: "Uitvoering", value: `${cs.durationWeeks.toLocaleString("nl-NL")} ${cs.durationWeeks === 1 ? "week" : "weken"}`});
  if (cs.budgetBand) facts.push({label: "Budget", value: cs.budgetBand});
  return facts;
}

export function caseStudyMatchesRoute(cs: PublicCaseStudy, route: CaseStudyRoute): boolean {
  return cs.routes.includes(route);
}
