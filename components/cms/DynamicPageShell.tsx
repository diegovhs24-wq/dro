import PageStructuredData from "@/components/seo/PageStructuredData";
import { CmsPageView } from "@/components/cms/CmsPageView";
import { getSiteSettings, type CmsDynamicPage } from "@/lib/cms";
import { breadcrumbsForPath } from "@/lib/seo/breadcrumbs";

export default async function DynamicPageShell({
  page,
  pathname,
}: {
  page: CmsDynamicPage;
  pathname: string;
}) {
  const siteSettings = await getSiteSettings();
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
        <CmsPageView page={page} />
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
