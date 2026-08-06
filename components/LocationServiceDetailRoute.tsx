import {notFound} from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";
import LocationServicePage from "@/components/LocationServicePage";
import {
  getBlogPostsForServiceSlugs,
  getLocationBySlug,
  getReviews,
  getServiceBySlug,
  getSiteSettings,
} from "@/lib/cms";
import {
  buildBreadcrumbList,
  buildFaqPageSchema,
  buildJsonLdGraph,
  buildLocationServiceSchema,
  buildWebPageSchema,
} from "@/lib/seo/structured-data";

type LocationServiceDetailRouteProps = {
  citySlug: string;
  serviceSlug: string;
};

export default async function LocationServiceDetailRoute({
  citySlug,
  serviceSlug,
}: LocationServiceDetailRouteProps) {
  const [siteSettings, location, service, reviews] = await Promise.all([
    getSiteSettings(),
    getLocationBySlug(citySlug),
    getServiceBySlug(serviceSlug),
    getReviews(),
  ]);

  if (!location || !service) {
    notFound();
  }

  const relatedArticles = await getBlogPostsForServiceSlugs([serviceSlug]);

  // service.title is the SEO-styled page H1 (already includes a city + brand suffix);
  // eyebrow holds the clean short service name for composing "{name} in {city}" copy.
  const serviceName = service.eyebrow || service.title;
  const pathname = `/${citySlug}/${serviceSlug}`;
  const title = `${serviceName} in ${location.name}`;
  const breadcrumbs = [
    {name: "Home", path: "/"},
    {name: location.name, path: `/${citySlug}`},
    {name: serviceName, path: pathname},
  ];
  const description = `${service.intro} Actief in ${location.name} en omgeving.`;

  const faqs = service.faqs || [];

  const graph = [
    buildWebPageSchema({title, description, pathname}),
    buildBreadcrumbList(breadcrumbs),
    buildLocationServiceSchema(
      {
        serviceName: title,
        serviceDescription: service.intro,
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
      <LocationServicePage
        location={location}
        service={service}
        reviews={reviews}
        relatedArticles={relatedArticles}
      />
    </>
  );
}
