import type {Metadata} from "next";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {notFound} from "next/navigation";

import {CaseStudyDetail} from "@/components/casestudy/CaseStudy";
import VideoChecklistBlockSection from "@/components/cms/blocks/VideoChecklistBlockSection";
import {Measure, ProjectTile, sizedImage, WHATSAPP_HREF} from "@/components/premium/blocks";
import {premiumFontClass} from "@/components/premium/fonts";
import PageStructuredData from "@/components/seo/PageStructuredData";
import {caseStudyFacts} from "@/lib/caseStudy";
import {getProjectBySlug, getProjects, getSiteSettings, metadataFromSeo} from "@/lib/cms";
import {cleanTitle, projectCategory, projectCover, projectImages, uniqueProjects} from "@/lib/projectCategories";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";
import {BUSINESS} from "@/lib/seo/business";

// params als Promise: werkt op Next 14 (await op een gewoon object) en is
// verplicht vanaf Next 15 (PR #25), zodat beide PR's zonder conflict samengaan.
type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({slug: project.slug}));
}

export async function generateMetadata(props: ProjectPageProps): Promise<Metadata> {
  const params = await props.params;
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project niet gevonden | DRO Renovaties",
      robots: {index: false, follow: false},
    };
  }

  // Uniek per project (straat + plaats) en zonder dubbele spaties (SEO-12).
  const title = `${project.type}, ${project.title} | DRO Renovaties`.replace(/\s+/g, " ").replace(/\s+,/g, ",").trim();

  return metadataFromSeo({}, title, {
    pathname: `/projecten/${params.slug}`,
    fallbackDescription: project.description,
    type: "article",
    image: project.images[0],
  });
}

export const revalidate = 3600;

const NEXT_STEP = {
  groot: {href: "/grote-renovaties#intake", label: "Bespreek een vergelijkbaar project", route: "/grote-renovaties", routeLabel: "Over grote renovaties"},
  constructief: {href: "/constructieve-werken#intake", label: "Bereken uw indicatie", route: "/constructieve-werken", routeLabel: "Over constructief werk"},
  badkamer: {href: "/#intake", label: "Start uw intake", route: "/projecten?type=badkamer", routeLabel: "Meer badkamers"},
  overig: {href: "/#intake", label: "Start uw intake", route: "/projecten", routeLabel: "Alle projecten"},
} as const;

export default async function ProjectDetailPage(props: ProjectPageProps) {
  const params = await props.params;
  const [siteSettings, project, all] = await Promise.all([getSiteSettings(), getProjectBySlug(params.slug), getProjects()]);
  if (!project) notFound();

  const pathname = `/projecten/${params.slug}`;
  const type = cleanTitle(project.type);
  const place = cleanTitle(project.location);
  const title = `${type} in ${place}`;
  const breadcrumbs = breadcrumbsForPath(pathname, cleanTitle(project.title));
  const category = projectCategory(project);
  const next = NEXT_STEP[category];
  const cover = projectCover(project);
  const gallery = Array.from(new Set(projectImages(project).filter((src) => src !== cover)));
  const hasPair = typeof project.beforeImage === "string" && typeof project.afterImage === "string" && Boolean(project.beforeImage && project.afterImage);
  const facts = [
    {term: "Plaats", detail: place},
    {term: "Type", detail: type},
    ...(project.duration ? [{term: "Uitvoering", detail: cleanTitle(project.duration)}] : []),
    ...(project.caseStudy ? caseStudyFacts(project.caseStudy).filter((f) => f.label !== "Locatie" && f.label !== "Uitvoering").map((f) => ({term: f.label, detail: f.value})) : []),
  ];
  const related = uniqueProjects(all)
    .filter((p) => p.slug !== project.slug && projectCategory(p) === category && projectCover(p))
    .slice(0, 3);

  return (
    <div className={`pr ${premiumFontClass}`}>
      <PageStructuredData
        breadcrumbs={breadcrumbs}
        description={project.description}
        organizationSeo={siteSettings.organizationSeo}
        pathname={pathname}
        siteSettings={siteSettings}
        title={title}
      />
      <main>
        <section className="pr-kalk">
          <div className="section-shell grid gap-10 pb-14 pt-10 md:pt-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-14">
            <div className="flex flex-col">
              <nav aria-label="Kruimelpad" className="text-[14px] pr-muted">
                <Link className="hover:underline" href="/">
                  Home
                </Link>
                <span aria-hidden="true"> / </span>
                <Link className="hover:underline" href="/projecten">
                  Projecten
                </Link>
                <span aria-hidden="true"> / </span>
                <span aria-current="page">{cleanTitle(project.title)}</span>
              </nav>
              <h1 className="pr-title mt-6 lg:mt-10">{title}</h1>
              {project.description && <p className="pr-lead mt-6">{project.description}</p>}
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--pr-line)] pt-6">
                {facts.map((f) => (
                  <div key={f.term}>
                    <dt className="text-[14px] pr-muted">{f.term}</dt>
                    <dd className="mt-1 text-[15px] font-semibold leading-snug pr-num">{f.detail}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-auto lg:pt-10" data-track="project_hero">
                <Link className="pr-btn" data-cta="project_next_step" href={next.href}>
                  {next.label}
                </Link>
                <Link className="pr-link text-[15px]" href={next.route}>
                  {next.routeLabel}
                </Link>
              </div>
            </div>
            {cover && (
              <figure>
                <Measure className="mb-3">{cleanTitle(project.title)}</Measure>
                <img alt={`${title}: resultaat`} className="aspect-[4/3] w-full rounded-[4px] object-cover" fetchPriority="high" src={sizedImage(cover, 1600)} />
              </figure>
            )}
          </div>
        </section>

        {(project.work_items.length > 0 || project.story) && (
          <section aria-labelledby="uitgevoerd" className="pr-section">
            <div className="section-shell pr-split">
              <div className="pr-split-head">
                <h2 className="pr-h2" id="uitgevoerd">
                  Wat we hebben gedaan
                </h2>
              </div>
              <div className="grid gap-10 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                {project.story && (
                  <div className="grid max-w-[64ch] gap-5 text-[17px] leading-[1.75]">
                    {project.story
                      .split(/\n\s*\n/)
                      .map((para) => para.trim())
                      .filter(Boolean)
                      .map((para) => (
                        <p key={para.slice(0, 40)}>{para}</p>
                      ))}
                  </div>
                )}
                {project.work_items.length > 0 && (
                  <ul className="self-start border-b border-[var(--pr-line)]">
                    {project.work_items.map((item) => (
                      <li className="border-t border-[var(--pr-line)] py-3 text-[16px]" key={item}>
                        {item.trim()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {project.caseStudy && (
          <section className="pr-section pr-kalk">
            <div className="section-shell">
              <CaseStudyDetail caseStudy={project.caseStudy} location={place} />
            </div>
          </section>
        )}

        {!project.caseStudy && (hasPair || gallery.length > 0) && (
          <section aria-labelledby="fotos" className="pr-section pr-kalk">
            <div className="section-shell">
              <h2 className="pr-h2" id="fotos">
                Foto&apos;s
              </h2>
              {hasPair && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <figure>
                    <img alt={`${title}: voor`} className="aspect-[4/3] w-full rounded-[4px] object-cover" loading="lazy" src={sizedImage(project.beforeImage, 1000)} />
                    <figcaption className="mt-2 text-[14px] pr-muted">Voor</figcaption>
                  </figure>
                  <figure>
                    <img alt={`${title}: na`} className="aspect-[4/3] w-full rounded-[4px] object-cover" loading="lazy" src={sizedImage(project.afterImage, 1000)} />
                    <figcaption className="mt-2 text-[14px] pr-muted">Na</figcaption>
                  </figure>
                </div>
              )}
              {gallery.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((src, i) => (
                    <img alt={`${title}, foto ${i + 1}`} className="aspect-[4/3] w-full rounded-[4px] object-cover" key={src} loading="lazy" src={sizedImage(src, 900)} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {project.videoChecklist?.[0] && <VideoChecklistBlockSection content={project.videoChecklist[0]} />}

        {related.length > 0 && (
          <section aria-labelledby="meer" className="pr-section">
            <div className="section-shell">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="pr-h2" id="meer">
                  Vergelijkbare projecten
                </h2>
                <Link className="pr-link" href={category === "overig" ? "/projecten" : `/projecten?type=${category}`}>
                  Bekijk alle
                </Link>
              </div>
              <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
                {related.map((p) => (
                  <ProjectTile key={p.slug} project={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="pr-section pr-dark">
          <div className="section-shell flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h2 className="pr-h2 max-w-[22ch]">Iets vergelijkbaars van plan?</h2>
              <p className="mt-4 max-w-[52ch] text-white/80">
                Bel {BUSINESS.phone.display}, stuur een WhatsApp of vul de intake in. Scott Huisman neemt uw plannen met u door.
              </p>
            </div>
            <div className="flex flex-wrap gap-4" data-track="project_footer">
              <Link className="pr-btn" data-cta="project_footer_intake" href={next.href}>
                {next.label}
              </Link>
              <a className="pr-btn-light" href={WHATSAPP_HREF} rel="noopener noreferrer" target="_blank">
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
