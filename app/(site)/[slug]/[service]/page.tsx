import type {Metadata} from "next";

import LocationServiceDetailRoute from "@/components/LocationServiceDetailRoute";
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

  // service.title is the SEO-styled page H1 (already includes a city + brand suffix);
  // eyebrow holds the clean short service name for composing "{name} in {city}" copy.
  const serviceName = service.eyebrow || service.title;
  const title = `${serviceName} in ${location.name} | DRO Renovaties`;
  const description = `${service.intro} Actief in ${location.name} en omgeving. Vaste prijs, geen aanbetaling, 4,8 uit 273 reviews.`;

  return metadataFromSeo(
    {metaTitle: title, metaDescription: description},
    title,
    {
      pathname: `/${slug}/${serviceSlug}`,
      fallbackDescription: description,
    }
  );
}

export default async function LocationServiceRoutePage({params}: LocationServicePageProps) {
  const {slug, service} = await params;
  return <LocationServiceDetailRoute citySlug={slug} serviceSlug={service} />;
}
