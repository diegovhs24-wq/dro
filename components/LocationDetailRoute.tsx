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

const LOCATION_FAQ_TEMPLATE = (cityName: string, neighborhoods: string[] = []) => [
  {
    question: `Werkt DRO Renovaties ook in ${cityName}?`,
    answer: neighborhoods.length
      ? `Ja. DRO Renovaties voert renovaties uit in ${cityName} en de directe omgeving, onder meer in ${neighborhoods.slice(0, -1).join(", ")}${neighborhoods.length > 1 ? " en " : ""}${neighborhoods[neighborhoods.length - 1]}. U heeft één aanspreekpunt van intake tot oplevering.`
      : `Ja. DRO Renovaties voert renovaties uit in ${cityName} en de directe omgeving, met vaste vakteams en één aanspreekpunt van intake tot oplevering.`,
  },
  {
    question: `Wat kost een renovatie in ${cityName}?`,
    answer: "Als indicatie: een totaalrenovatie kost bij DRO 1.000 tot 1.250 euro per m² excl. btw, een uitbouw vanaf 2.500 euro per m² excl. btw (compleet met schuifpui), een dakopbouw vanaf 2.000 euro per m² excl. btw en een complete badkamer vanaf 9.000 euro excl. btw (tegels en sanitair apart). Na een opname ontvangt u een offerte met een prijs per onderdeel en een betalingsschema per fase.",
  },
  {
    question: "Hoe snel kan DRO Renovaties starten?",
    answer: "Na de intake plannen we een vrijblijvend gesprek in en stemmen we een realistische startdatum met u af, afhankelijk van de omvang van het project.",
  },
  {
    question: "Zijn jullie verzekerd en gecertificeerd?",
    answer: "DRO Renovaties is VCA-gecertificeerd en heeft een CAR-verzekering en een bedrijfsaansprakelijkheidsverzekering. Wat in een concreet geval gedekt is, hangt af van de polis en de algemene voorwaarden. Op ons eigen werk geldt 12 maanden garantie na oplevering; uw wettelijke rechten als consument blijven altijd gelden.",
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
  const faqs = LOCATION_FAQ_TEMPLATE(location.name, location.neighborhoods);
  const title = location.seo?.metaTitle || `Aannemer ${location.name}: renovatie en verbouwing | DRO Renovaties`;
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
