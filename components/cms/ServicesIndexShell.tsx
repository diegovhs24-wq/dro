import ServiceCard from "@/components/ServiceCard";
import { CmsPageView } from "@/components/cms/CmsPageView";
import PageStructuredData from "@/components/seo/PageStructuredData";
import { getServices, getSiteSettings, type IndexPageDoc } from "@/lib/cms";
import { breadcrumbsForPath } from "@/lib/seo/breadcrumbs";

export default async function ServicesIndexShell({
  page,
}: {
  page: IndexPageDoc;
}) {
  const [services, siteSettings] = await Promise.all([getServices(), getSiteSettings()]);

  const { limit, layout } = page.listingSettings ?? {};
  const count = typeof limit === "number" && limit > 0 ? limit : services.length;
  const visibleServices = services.slice(0, count);
  const isFullGrid = layout === "fullGrid";

  const breadcrumbs = breadcrumbsForPath("/diensten", page.title);
  const description = page.seo?.metaDescription || siteSettings.description;

  return (
    <>
      <PageStructuredData
        breadcrumbs={breadcrumbs}
        description={description}
        faqs={[]}
        organizationSeo={siteSettings.organizationSeo}
        pathname="/diensten"
        siteSettings={siteSettings}
        title={page.title || siteSettings.title}
      />
      <main className="min-h-screen bg-white">
        {page.contentBlocks && page.contentBlocks.length > 0 && (
          <CmsPageView page={page} />
        )}
        <section
          className={isFullGrid ? "bg-brand-soft py-14 sm:py-16" : "bg-white py-14 sm:py-16"}
          id="diensten"
        >
          <div className="section-shell">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleServices.map((service) => (
                <ServiceCard key={service.slug} {...service} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
