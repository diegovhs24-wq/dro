import {notFound} from "next/navigation";

import PageStructuredData from "@/components/seo/PageStructuredData";
import ServicePage from "@/components/ServicePage";
import {getReviews, getServiceBySlug, getSiteSettings} from "@/lib/cms";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";

type ServiceDetailRouteProps = {
  slug: string;
};

export default async function ServiceDetailRoute({slug}: ServiceDetailRouteProps) {
  const [siteSettings, reviews, service] = await Promise.all([
    getSiteSettings(),
    getReviews(),
    getServiceBySlug(slug),
  ]);

  if (!service) {
    notFound();
  }

  const pathname = `/diensten/${slug}`;
  const breadcrumbs = breadcrumbsForPath(pathname, service.title);

  return (
    <>
      <PageStructuredData
        breadcrumbs={breadcrumbs}
        description={service.seo?.metaDescription || service.intro}
        faqs={service.faqs}
        organizationSeo={siteSettings.organizationSeo}
        pathname={pathname}
        service={{
          name: service.title,
          description: service.intro,
          slug,
        }}
        siteSettings={siteSettings}
        title={service.title}
      />
      <main>
        <ServicePage {...service} reviews={reviews} />
      </main>
    </>
  );
}
