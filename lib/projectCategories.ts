// Indeling van projecten voor het portfolio. Gebaseerd op het veld "type" uit
// Sanity (vrije tekst), daarom tolerant voor spaties, hoofdletters en varianten.

import type {ProjectItem} from "@/lib/types";

export const PROJECT_CATEGORIES = [
  {key: "groot", label: "Grote renovaties", match: /totaal|dakopbouw|aanbouw|uitbouw|opbouw|verbouwing/i},
  {key: "constructief", label: "Constructief", match: /draagmuur|doorbraak|constructie|staal/i},
  {key: "badkamer", label: "Badkamers en toiletten", match: /badkamer|toilet/i},
  {key: "overig", label: "Overig", match: /.*/},
] as const;

export type ProjectCategoryKey = (typeof PROJECT_CATEGORIES)[number]["key"];

export function projectCategory(project: Pick<ProjectItem, "type" | "title">): ProjectCategoryKey {
  const text = `${project.type || ""}`.trim();
  for (const category of PROJECT_CATEGORIES) {
    if (category.key !== "overig" && category.match.test(text)) return category.key;
  }
  return "overig";
}

// Sanity bevat soms dubbele projectdocumenten (zelfde slug); toon elk project één keer.
export function uniqueProjects<T extends {slug: string}>(projects: T[]): T[] {
  const seen = new Set<string>();
  return projects.filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true)));
}

const isUrl = (value: unknown): value is string => typeof value === "string" && value.length > 0;

export function projectImages(project: Pick<ProjectItem, "images">): string[] {
  return (Array.isArray(project.images) ? project.images : []).filter(isUrl);
}

export function projectCover(project: Pick<ProjectItem, "afterImage" | "images" | "caseStudy">): string | undefined {
  return [project.caseStudy?.afterImages[0], project.afterImage, ...projectImages(project)].find(isUrl);
}

// Projecten met een opgeleverd eindbeeld als eerste foto. Bouwfoto's (casco,
// steigers) blijven in het portfolio, maar openen het niet.
export const FEATURED_ORDER = ["fuutlaan-leidschendam", "essehout-zoetermeer", "amersfoort", "jan-muschlaan-den-haag", "borneostraat-den-haag", "paulinastraat"];

// Volgorde: vrijgegeven casestudy's, dan grote renovaties (eindbeelden eerst),
// dan constructief, dan de rest; binnen een groep de volgorde uit Sanity.
export function sortForPortfolio<T extends ProjectItem>(projects: T[]): T[] {
  const rank = (p: T) => (p.caseStudy ? 0 : projectCategory(p) === "groot" ? 1 : projectCategory(p) === "constructief" ? 2 : 3);
  const featured = (p: T) => {
    const i = FEATURED_ORDER.indexOf(p.slug);
    return i === -1 ? FEATURED_ORDER.length : i;
  };
  return projects
    .map((p, i) => ({p, i}))
    .sort((a, b) => rank(a.p) - rank(b.p) || featured(a.p) - featured(b.p) || a.i - b.i)
    .map(({p}) => p);
}

export function cleanTitle(value: string): string {
  return value.replace(/\s+,/g, ",").replace(/\s+/g, " ").trim();
}
