import {buildAssurances} from "@/lib/assurances";
import {getProjects, getReviews, getSiteSettings, getVerifiedClaims} from "@/lib/cms";
import {durationInWeeks} from "@/lib/conversionRoutes";
import {sortForPortfolio, uniqueProjects} from "@/lib/projectCategories";
import {formatReviewSummary, getReviewSnapshot} from "@/lib/seo/business";
import {BIG_PROJECT_REVIEWS} from "@/lib/googleReviews";
import type {ProjectItem, ReviewItem} from "@/lib/types";

// Reviews die op de premium pagina's staan: echte Google-reviews uit Sanity,
// gekozen omdat ze over grotere verbouwingen, communicatie en planning gaan.
// Reviews die een oud-medewerker als aanspreekpunt noemen, worden niet
// uitgelicht (die persoon werkt niet meer bij DRO).
// Eerst reviews over grotere verbouwingen; badkamerreviews alleen als aanvulling.
const FEATURED_REVIEWERS = ["Sam Van Felius"];

export function formatDutchDate(iso: string) {
  return new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString("nl-NL", {day: "numeric", month: "long", year: "numeric"});
}

export function weeksRange(projects: ProjectItem[]): string | null {
  const weeks = projects.map((p) => durationInWeeks(p.duration)).filter((w): w is number => typeof w === "number" && w >= 1);
  if (weeks.length < 2) return null;
  const min = Math.min(...weeks);
  const max = Math.max(...weeks);
  return min === max ? `${min} weken` : `${min} tot ${max} weken`;
}

export async function getPremiumData() {
  const [siteSettings, rawProjects, claims, reviews] = await Promise.all([getSiteSettings(), getProjects(), getVerifiedClaims(), getReviews()]);
  const projects = sortForPortfolio(uniqueProjects(rawProjects));
  const snapshot = getReviewSnapshot(siteSettings.organizationSeo);
  const fromSanity = FEATURED_REVIEWERS.map((name) => reviews.find((r) => r.name === name)).filter((r): r is ReviewItem => Boolean(r?.quote));
  const featuredReviews: ReviewItem[] = [
    ...fromSanity.map((r) => ({...r, location: "Verbouwing van badkamer, toilet, keuken en muren"})),
    ...BIG_PROJECT_REVIEWS.map((r) => ({name: r.name, location: `${r.project}, ${r.date}`, quote: r.quote})),
  ];

  return {
    siteSettings,
    projects,
    claims,
    assurances: buildAssurances(claims),
    reviewSummary: formatReviewSummary(snapshot),
    reviewAsOf: formatDutchDate(snapshot.asOf),
    featuredReviews,
  };
}
