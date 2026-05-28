import {notFound} from "next/navigation";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageStructuredData from "@/components/seo/PageStructuredData";
import ServicePage from "@/components/ServicePage";
import {getReviews, getServiceBySlug, getServices, getSiteSettings} from "@/lib/cms";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";

type ServiceDetailRouteProps = {
  slug: string;
};

export default async function ServiceDetailRoute({slug}: ServiceDetailRouteProps) {
  const [siteSettings, services, reviews, service] = await Promise.all([
    getSiteSettings(),
    getServices(),
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
        <Header services={services} siteSettings={siteSettings} />
        <ServicePage {...service} reviews={reviews} />
        <Footer services={services} siteSettings={siteSettings} />
      </main>
    </>
  );
}
