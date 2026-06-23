import BlogCard from "@/components/BlogCard";
import {CmsPageView} from "@/components/cms/CmsPageView";
import PageStructuredData from "@/components/seo/PageStructuredData";
import {getBlogPosts, getSiteSettings, type IndexPageDoc} from "@/lib/cms";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";

export default async function BlogsIndexShell({page}: {page: IndexPageDoc}) {
  const [posts, siteSettings] = await Promise.all([getBlogPosts(), getSiteSettings()]);

  const {limit, layout} = page.listingSettings ?? {};
  const count = typeof limit === "number" && limit > 0 ? limit : posts.length;
  const visiblePosts = posts.slice(0, count);
  const isList = layout === "list";

  const breadcrumbs = breadcrumbsForPath("/kennisbank", page.title || "Kennisbank");
  const description = page.seo?.metaDescription || siteSettings.description;

  return (
    <>
      <PageStructuredData
        breadcrumbs={breadcrumbs}
        description={description}
        organizationSeo={siteSettings.organizationSeo}
        pathname="/kennisbank"
        siteSettings={siteSettings}
        title={page.title || "Kennisbank"}
      />
      <main className="min-h-screen bg-white">
        {page.contentBlocks && page.contentBlocks.length > 0 ? <CmsPageView page={page} /> : null}
        <section className="bg-white py-14 sm:py-16" id="kennisbank">
          <div className="section-shell">
            <div className={isList ? "grid gap-6" : "grid gap-6 lg:grid-cols-3"}>
              {visiblePosts.map((post) => (
                <BlogCard key={post.slug} {...post} />
              ))}
            </div>
            {!visiblePosts.length ? (
              <div className="rounded-lg bg-brand-soft p-8 text-center">
                <p className="text-lg font-bold text-brand-ink">Er zijn nog geen artikelen gepubliceerd.</p>
                <p className="mt-2 text-sm font-semibold text-neutral-600">
                  Nieuwe renovatie-inzichten verschijnen binnenkort in de kennisbank.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}
