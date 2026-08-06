import {notFound} from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import LocationPage from "@/components/LocationPage";
import {
  getBlogPostsForServiceSlugs,
  getLocationBySlug,
  getReviews,
  getSiteSettings,
  type LocationDetail,
} from "@/lib/cms";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildJsonLdGraph,
  buildLocationServiceSchema,
  buildWebPageSchema,
} from "@/lib/seo/structured-data";

const LOCATION_FAQ_TEMPLATE = (cityName: string) => [
  {
    question: `Werkt DRO Renovaties ook in ${cityName}?`,
    answer: `Ja. DRO Renovaties voert renovaties uit in ${cityName} en de directe omgeving, met vaste vakteams en één aanspreekpunt van intake tot oplevering.`,
  },
  {
    question: `Wat kost een renovatie in ${cityName}?`,
    answer: "Dat hangt af van de omvang van het project. U ontvangt vooraf een vaste prijs, zonder verrassingen achteraf en zonder aanbetaling.",
  },
  {
    question: "Hoe snel kan DRO Renovaties starten?",
    answer: "Na de intake plannen we een vrijblijvend gesprek in en stemmen we een realistische startdatum met u af, afhankelijk van de omvang van het project.",
  },
  {
    question: "Zijn jullie verzekerd en gecertificeerd?",
    answer: "Ja. DRO Renovaties is VCA-gecertificeerd en volledig verzekerd voor de uitvoering van renovatie- en verbouwprojecten.",
  },
];

export default async function LocationDetailRoute({slug}: {slug: string}) {
  const [siteSettings, location, reviews] = await Promise.all([
    getSiteSettings(),
    getLocationBySlug(slug),
    getReviews(),
  ]);

  if (!location) {
    notFound();
  }

  const relatedArticles = await getBlogPostsForServiceSlugs(
    location.popularServices.map((service) => service.slug)
  );

  const pathname = `/${location.slug}`;
  const breadcrumbs = breadcrumbsForPath(pathname, location.name);
  const faqs = LOCATION_FAQ_TEMPLATE(location.name);
  const title = location.seo?.metaTitle || `Renovatie in ${location.name} | DRO Renovaties`;
  const description = location.seo?.metaDescription || location.intro;

  const graph = [
    buildWebPageSchema({title, description, pathname}),
    buildBreadcrumbList(breadcrumbs),
    buildLocationServiceSchema(
      {
        serviceName: `Renovatie en verbouw in ${location.name}`,
        serviceDescription: location.intro,
        location: {name: location.name, geo: location.geo},
        pathname,
      },
      siteSettings,
      siteSettings.organizationSeo
    ),
    buildFaqPageSchema(faqs),
  ];

  return (
    <>
      <JsonLd data={buildJsonLdGraph(graph)} />
      <LocationPage faqs={faqs} location={location} reviews={reviews} relatedArticles={relatedArticles} />
    </>
  );
}

export type {LocationDetail};
