import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageStructuredData from "@/components/seo/PageStructuredData";
import { CmsPageView } from "@/components/cms/CmsPageView";
import { getServices, getSiteSettings, type CmsDynamicPage } from "@/lib/cms";
import { breadcrumbsForPath } from "@/lib/seo/breadcrumbs";

export default async function DynamicPageShell({
  page,
  showFloatingActions = true,
  pathname,
}: {
  page: CmsDynamicPage;
  showFloatingActions?: boolean;
  pathname: string;
}) {
  const [siteSettings, services] = await Promise.all([getSiteSettings(), getServices()]);
  const breadcrumbs = breadcrumbsForPath(pathname, page.title);
  const description = page.seo?.metaDescription || siteSettings.description;

  return (
    <>
      <PageStructuredData
        breadcrumbs={breadcrumbs}
        description={description}
        faqs={extractFaqs(page)}
        organizationSeo={siteSettings.organizationSeo}
        pathname={pathname}
        siteSettings={siteSettings}
        title={page.title || siteSettings.title}
      />
      <main className="min-h-screen bg-white">
        <Header services={services} siteSettings={siteSettings} />
        <CmsPageView page={page} />
        <Footer services={services} siteSettings={siteSettings} />
        {showFloatingActions ? (
          <>
            <a
              aria-label={siteSettings.floatingActions.whatsappLabel}
              className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-base font-bold text-white shadow-2xl transition hover:-translate-y-1"
              href={siteSettings.floatingActions.whatsappHref}
            >
              WA
            </a>
            <a
              className="fixed bottom-5 left-5 z-50 hidden rounded-md bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white shadow-2xl transition hover:-translate-y-1 sm:inline-flex"
              href={siteSettings.floatingActions.intakeHref}
            >
              {siteSettings.floatingActions.intakeLabel}
            </a>
          </>
        ) : null}
      </main>
    </>
  );
}

function extractFaqs(page: CmsDynamicPage) {
  return (
    page.contentBlocks
      ?.filter((block) => block._type === "processFaqBlock")
      .flatMap((block) =>
        "faqs" in block
          ? (block.faqs || []).map((faq) => ({
              question: faq.question,
              answer: Array.isArray(faq.answer) ? faq.answer.join("\n") : faq.answer,
            }))
          : []
      ) || []
  );
}
