/* eslint-disable @next/next/no-img-element */
import type {Metadata} from "next";
import Link from "next/link";
import {Suspense} from "react";

import {CaseStudyFacts} from "@/components/casestudy/CaseStudy";
import {sizedImage} from "@/components/premium/ProjectTile";
import {premiumFontClass} from "@/components/premium/fonts";
import PortfolioGrid, {PortfolioGridView} from "@/components/premium/PortfolioGrid";
import JsonLd from "@/components/seo/JsonLd";
import PageStructuredData from "@/components/seo/PageStructuredData";
import {getPremiumData, weeksRange} from "@/lib/premiumData";
import {cleanTitle, projectCategory, projectCover} from "@/lib/projectCategories";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";
import {buildPageMetadata} from "@/lib/seo/metadata";
import {absoluteUrl} from "@/lib/seo/site";

export const revalidate = 3600;

const TITLE = "Projecten: renovaties en verbouwingen";
const DESCRIPTION =
  "Opgeleverde totaalrenovaties, uitbouwen, dakopbouwen en badkamers van DRO Renovaties in Den Haag en de Randstad, met plaats, type en doorlooptijd.";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({fallbackTitle: `${TITLE} | DRO Renovaties`, fallbackDescription: DESCRIPTION, pathname: "/projecten"});
}

export default async function ProjectenPage() {
  const data = await getPremiumData();
  const projects = data.projects.filter((p) => projectCover(p));
  const caseStudies = projects.filter((p) => p.caseStudy);
  const bigWeeks = weeksRange(projects.filter((p) => projectCategory(p) === "groot"));
  const crumbs = breadcrumbsForPath("/projecten", "Projecten");

  return (
    <div className={`pr ${premiumFontClass}`}>
      <PageStructuredData
        breadcrumbs={crumbs}
        description={DESCRIPTION}
        organizationSeo={data.siteSettings.organizationSeo}
        pathname="/projecten"
        siteSettings={data.siteSettings}
        title={TITLE}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Projecten van DRO Renovaties",
          itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/projecten/${p.slug}`),
            name: `${cleanTitle(p.type)}, ${cleanTitle(p.title)}`,
          })),
        }}
      />
      <main>
        <section className="pr-kalk">
          <div className="section-shell grid gap-8 pb-12 pt-10 md:pt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-16">
            <div>
              <nav aria-label="Kruimelpad" className="text-[14px] pr-muted">
                <Link className="hover:underline" href="/">
                  Home
                </Link>
                <span aria-hidden="true"> / </span>
                <span aria-current="page">Projecten</span>
              </nav>
              <h1 className="pr-display mt-6 lg:mt-10">Opgeleverd werk</h1>
              <p className="pr-lead mt-6">
                Renovaties en verbouwingen die we hebben uitgevoerd, met plaats, type en doorlooptijd. Bij een uitgewerkte casestudy ziet u ook wat de opdrachtgever wilde en hoe we het hebben opgelost.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--pr-line)] pt-6">
              <div>
                <dt className="text-[14px] pr-muted">Projecten in het portfolio</dt>
                <dd className="mt-1 text-[15px] font-semibold pr-num">{projects.length}</dd>
              </div>
              {bigWeeks && (
                <div>
                  <dt className="text-[14px] pr-muted">Uitvoering grote renovaties</dt>
                  <dd className="mt-1 text-[15px] font-semibold pr-num">{bigWeeks}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>

        {caseStudies.length > 0 && (
          <section aria-labelledby="casestudies" className="pr-section">
            <div className="section-shell">
              <h2 className="pr-h2" id="casestudies">
                Uitgewerkte casestudy&apos;s
              </h2>
              <div className="mt-10 grid gap-16">
                {caseStudies.map((p) => (
                  <article className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12" key={p.slug}>
                    <Link className="block overflow-hidden rounded-[4px]" data-cta="casestudy_open" href={`/projecten/${p.slug}`}>
                      <img alt={`${cleanTitle(p.type)}, ${cleanTitle(p.location)}`} className="aspect-[4/3] w-full object-cover" loading="lazy" src={sizedImage(projectCover(p), 1400)} />
                    </Link>
                    <div>
                      <p className="pr-measure">{cleanTitle(p.type)}</p>
                      <h3 className="pr-h2 mt-4 text-[clamp(1.5rem,1.2rem+1vw,2rem)]">{cleanTitle(p.title)}</h3>
                      <p className="mt-4 pr-muted">{p.caseStudy!.clientGoal}</p>
                      <div className="mt-6">
                        <CaseStudyFacts caseStudy={p.caseStudy!} location={cleanTitle(p.location)} />
                      </div>
                      <Link className="pr-btn-line mt-6" href={`/projecten/${p.slug}`}>
                        Lees de casestudy
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="alle-projecten" className={`pr-section ${caseStudies.length ? "pr-kalk" : ""}`}>
          <div className="section-shell">
            <h2 className="sr-only" id="alle-projecten">
              Alle projecten
            </h2>
            <Suspense fallback={<PortfolioGridView active="alle" projects={projects} />}>
              <PortfolioGrid projects={projects} />
            </Suspense>
          </div>
        </section>

        <section className="pr-section pr-dark">
          <div className="section-shell flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h2 className="pr-h2 max-w-[20ch]">Een vergelijkbaar project in gedachten?</h2>
              <p className="mt-4 max-w-[52ch] text-white/80">Kies de route die bij uw plannen past. U ziet daar ook een indicatie en kunt direct de intake invullen.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link className="pr-btn" data-cta="portfolio_route_groot" href="/grote-renovaties">
                Grote renovatie
              </Link>
              <Link className="pr-btn-light" data-cta="portfolio_route_constructief" href="/constructieve-werken">
                Constructief werk
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
