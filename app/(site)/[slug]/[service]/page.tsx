import type {Metadata} from "next";
import {permanentRedirect} from "next/navigation";

import LocationServiceDetailRoute from "@/components/LocationServiceDetailRoute";
import {formatReviewSummary, getReviewSnapshot} from "@/lib/seo/business";
import {
  getLocationBySlug,
  getLocationCityServiceParams,
  getServiceBySlug,
  metadataFromSeo,
} from "@/lib/cms";

type LocationServicePageProps = {
  params: Promise<{
    slug: string;
    service: string;
  }>;
};

export async function generateStaticParams() {
  const pairs = await getLocationCityServiceParams();
  return pairs.map(({city, service}) => ({slug: city, service}));
}

export async function generateMetadata({params}: LocationServicePageProps): Promise<Metadata> {
  const {slug, service: serviceSlug} = await params;
  const [location, service] = await Promise.all([
    getLocationBySlug(slug),
    getServiceBySlug(serviceSlug),
  ]);

  if (!location || !service) {
    return {
      title: "Pagina niet gevonden | DRO Renovaties",
      robots: {index: false, follow: false},
    };
  }

  if (!hasLocalContent(location, serviceSlug)) {
    return {robots: {index: false, follow: true}};
  }

  // service.title is the SEO-styled page H1 (already includes a city + brand suffix);
  // eyebrow holds the clean short service name for composing "{name} in {city}" copy.
  const serviceName = service.eyebrow || service.title;
  const title = `${serviceName} in ${location.name} | DRO Renovaties`;
  const description = `${service.intro} Actief in ${location.name} en omgeving. Betaling per afgeronde fase, ${formatReviewSummary(getReviewSnapshot())}.`;

  return metadataFromSeo(
    {metaTitle: title, metaDescription: description},
    title,
    {
      pathname: `/${slug}/${serviceSlug}`,
      fallbackDescription: description,
    }
  );
}

// Een stad x dienst-pagina bestaat alleen als de stad in Sanity lokale inhoud
// voor die dienst heeft (popularServices). Andere combinaties sturen we door
// naar de stadspagina in plaats van een dunne kopie te tonen.
function hasLocalContent(
  location: {popularServices?: Array<{slug: string}>},
  serviceSlug: string
) {
  return (location.popularServices || []).some((item) => item.slug === serviceSlug);
}

export default async function LocationServiceRoutePage({params}: LocationServicePageProps) {
  const {slug, service} = await params;
  const location = await getLocationBySlug(slug);
  if (location && !hasLocalContent(location, service)) {
    permanentRedirect(`/${slug}`);
  }
  return <LocationServiceDetailRoute citySlug={slug} serviceSlug={service} />;
}
