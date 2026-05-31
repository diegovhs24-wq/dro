import ProjectCard from "@/components/ProjectCard";
import { CmsPageView } from "@/components/cms/CmsPageView";
import PageStructuredData from "@/components/seo/PageStructuredData";
import { getProjects, getSiteSettings, type IndexPageDoc } from "@/lib/cms";
import { breadcrumbsForPath } from "@/lib/seo/breadcrumbs";

export default async function ProjectsIndexShell({
  page,
}: {
  page: IndexPageDoc;
}) {
  const [projects, siteSettings] = await Promise.all([getProjects(), getSiteSettings()]);

  const { limit, layout } = page.listingSettings ?? {};
  const count = typeof limit === "number" && limit > 0 ? limit : projects.length;
  const visibleProjects = projects.slice(0, count);
  const isList = layout === "list";

  const breadcrumbs = breadcrumbsForPath("/projecten", page.title);
  const description = page.seo?.metaDescription || siteSettings.description;

  return (
    <>
      <PageStructuredData
        breadcrumbs={breadcrumbs}
        description={description}
        faqs={[]}
        organizationSeo={siteSettings.organizationSeo}
        pathname="/projecten"
        siteSettings={siteSettings}
        title={page.title || siteSettings.title}
      />
      <main className="min-h-screen bg-white">
        {page.contentBlocks && page.contentBlocks.length > 0 && (
          <CmsPageView page={page} />
        )}
        <section className="bg-white py-14 sm:py-16">
          <div className="section-shell">
            <div className={isList ? "grid gap-6" : "grid gap-6 lg:grid-cols-3"}>
              {visibleProjects.map((project) => (
                <ProjectCard key={project.slug} {...project} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
