/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import {CaseStudyCard} from "@/components/casestudy/CaseStudy";
import PageStructuredData from "@/components/seo/PageStructuredData";
import SmartIntakeWizard from "@/components/SmartIntakeWizard";
import RenovationEstimator from "@/components/routes/RenovationEstimator";
import RouteViewTracker from "@/components/routes/RouteViewTracker";
import {caseStudyMatchesRoute} from "@/lib/caseStudy";
import {getProjects, getSiteSettings, getVerifiedClaims} from "@/lib/cms";
import {ROUTE_SOURCES, ROUTE_TRUST, durationInWeeks, type ConversionRouteConfig} from "@/lib/conversionRoutes";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";
import {BUSINESS, formatReviewSummary, getReviewSnapshot} from "@/lib/seo/business";
import type {ProjectItem} from "@/lib/types";

const WHATSAPP_HREF = `https://wa.me/${BUSINESS.phone.e164.replace("+", "")}`;

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("nl-NL", {day: "numeric", month: "long", year: "numeric"});
}

function projectImage(p: ProjectItem): string | undefined {
  return p.afterImage || p.images?.[0];
}

function weeksRange(projects: ProjectItem[]): string | null {
  const weeks = projects.map((p) => durationInWeeks(p.duration)).filter((w): w is number => typeof w === "number" && w >= 1);
  if (weeks.length < 2) return null;
  const min = Math.min(...weeks);
  const max = Math.max(...weeks);
  return min === max ? `${min} weken` : `${min} tot ${max} weken`;
}

function SectionHead({id, title, intro}: {id: string; title: string; intro?: string}) {
  return (
    <div className="lg:sticky lg:top-28">
      <h2 className="route-h2" id={id}>
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.65] text-lp-muted">{intro}</p>}
    </div>
  );
}

export default async function ConversionRoutePage({route}: {route: ConversionRouteConfig}) {
  const [siteSettings, projects, claims] = await Promise.all([getSiteSettings(), getProjects(), getVerifiedClaims()]);

  const reviews = getReviewSnapshot(siteSettings.organizationSeo);
  const caseStudies = projects.filter((p) => p.caseStudy && caseStudyMatchesRoute(p.caseStudy, route.key));
  const related = projects
    .filter((p) => route.projectTypeMatch.test(`${p.type} ${p.title}`) && projectImage(p))
    .slice(0, 3);
  const heroProject = (caseStudies[0] || related[0]) as ProjectItem | undefined;
  const heroImage = heroProject ? heroProject.caseStudy?.afterImages[0] || projectImage(heroProject) : undefined;
  const duration = weeksRange(projects.filter((p) => route.projectTypeMatch.test(p.type)));

  const breadcrumbs = breadcrumbsForPath(route.path, route.key === "grote-renovatie" ? "Grote renovaties" : "Constructieve werken");

  // Zekerheden: alleen bevestigde feiten; garantie en reactietijd alleen als ze in Sanity zijn bevestigd.
  const assurances: Array<{term: string; detail: string}> = [
    {term: "Bij ondertekening", detail: "U betaalt niets. De startbetaling volgt op de eerste werkdag."},
    {term: "Verzekerd", detail: ROUTE_TRUST.insuranceShort},
    {term: "Erkenningen", detail: ROUTE_TRUST.credentials.join(", ")},
    ...(claims.guarantee ? [{term: "Garantie", detail: claims.guarantee.scope ? `${claims.guarantee.text}. ${claims.guarantee.scope}` : claims.guarantee.text}] : []),
    ...(claims.responseTime ? [{term: "Reactie", detail: claims.responseTime.text}] : []),
  ];

  const faqs = route.faq.map((f) => ({question: f.q, answer: f.a}));

  return (
    <>
      <PageStructuredData
        breadcrumbs={breadcrumbs}
        description={route.metaDescription}
        faqs={faqs}
        organizationSeo={siteSettings.organizationSeo}
        pathname={route.path}
        service={{name: route.serviceName, description: route.metaDescription, slug: route.path.slice(1)}}
        siteSettings={siteSettings}
        title={route.metaTitle.replace(/ \| DRO Renovaties$/, "")}
      />
      <RouteViewTracker route={route.key} />

      <main className="route-page bg-white text-lp-ink">
        {/* Hero */}
        <section className="bg-lp-slate text-white">
          <div className="section-shell grid gap-12 pb-14 pt-12 md:pt-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16 lg:pb-20">
            <div>
              <nav aria-label="Kruimelpad" className="text-[14px] text-white/60">
                <Link className="hover:text-white" href="/">
                  Home
                </Link>
                <span aria-hidden="true"> / </span>
                <span>{breadcrumbs[breadcrumbs.length - 1]?.name}</span>
              </nav>
              <p className="mt-8 text-[17px] text-white/75">{route.eyebrow}</p>
              <h1 className="route-h1 mt-3 max-w-[16ch]">{route.title}</h1>
              <p className="mt-6 max-w-[58ch] text-[18px] leading-[1.65] text-white/85">{route.intro}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" data-track="hero">
                <a className="route-btn" data-cta="hero_intake" href="#intake">
                  {route.primaryCta}
                </a>
                <a className="text-[16px] font-semibold underline decoration-white/30 underline-offset-[6px] hover:decoration-white" href={BUSINESS.phone.href}>
                  Bel {BUSINESS.phone.display}
                </a>
                <a className="text-[16px] text-white/75 underline decoration-white/20 underline-offset-[6px] hover:text-white" href={WHATSAPP_HREF} rel="noopener noreferrer" target="_blank">
                  of stuur een WhatsApp
                </a>
              </div>
            </div>

            <aside aria-label="Vooraf geregeld" className="self-end">
              <dl className="divide-y divide-white/15 border-y border-white/15">
                <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-4 py-4">
                  <dt className="text-[14px] text-white/60">Reviews</dt>
                  <dd className="text-[15px] leading-snug">
                    <span className="font-semibold">{formatReviewSummary(reviews)}</span>
                    <span className="block text-[13px] text-white/55">Stand {formatDate(reviews.asOf)}</span>
                  </dd>
                </div>
                {claims.trustoo && (
                  <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-4 py-4">
                    <dt className="text-[14px] text-white/60">Trustoo</dt>
                    <dd className="text-[15px] leading-snug">
                      <span className="font-semibold">
                        {claims.trustoo.score} uit {claims.trustoo.count} reviews
                      </span>
                      <span className="block text-[13px] text-white/55">Stand {formatDate(claims.trustoo.asOf)}</span>
                    </dd>
                  </div>
                )}
                {assurances.map((a) => (
                  <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-4 py-4" key={a.term}>
                    <dt className="text-[14px] text-white/60">{a.term}</dt>
                    <dd className="text-[15px] leading-snug text-white/90">{a.detail}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        {heroImage && heroProject && (
          <figure className="relative bg-lp-slate">
            <img alt={`${heroProject.type} ${heroProject.title}`.trim()} className="h-[42vh] max-h-[520px] min-h-[260px] w-full object-cover" fetchPriority="high" src={heroImage} />
            <figcaption className="section-shell -mt-12 relative pb-2">
              <Link className="inline-block rounded-[6px] bg-white px-3 py-2 text-[14px] font-medium text-lp-ink shadow-sm hover:underline" href={`/projecten/${heroProject.slug}`}>
                {heroProject.type.trim()}, {heroProject.title.trim()}
              </Link>
            </figcaption>
          </figure>
        )}

        {/* Voor wie */}
        <section aria-labelledby="voor-wie" className="route-section">
          <div className="section-shell route-grid">
            <SectionHead id="voor-wie" intro={route.audience.intro} title={route.audience.title} />
            <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {route.audience.cards.map((card) => (
                <div className="border-t-2 border-lp-ink pt-4" key={card.title}>
                  <h3 className="text-[19px] font-bold leading-snug">{card.title}</h3>
                  <p className="mt-2 text-[16px] leading-[1.65] text-lp-muted">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scope */}
        <section aria-labelledby="scope" className="route-section bg-lp-plaster">
          <div className="section-shell route-grid">
            <SectionHead id="scope" intro={route.scope.intro} title={route.scope.title} />
            <ul className="divide-y divide-lp-line border-y border-lp-line">
              {route.scope.cards.map((card) => (
                <li className="grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8" key={card.title}>
                  <div>
                    <h3 className="text-[19px] font-bold">{card.title}</h3>
                    <p className="mt-1 max-w-[58ch] text-[16px] leading-[1.6] text-lp-muted">{card.text}</p>
                  </div>
                  {card.href && (
                    <Link className="text-[15px] font-semibold text-lp-orange underline-offset-4 hover:underline" data-cta="scope_link" href={card.href}>
                      {card.linkLabel}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Prijs */}
        <section aria-labelledby="prijs" className="route-section">
          <div className="section-shell route-grid">
            <SectionHead id="prijs" intro={route.pricing.intro} title={route.pricing.title} />
            <div>
              {route.key === "grote-renovatie" ? (
                <RenovationEstimator />
              ) : (
                <div className="rounded-[10px] border border-lp-line p-6 md:p-8">
                  <h3 className="text-[19px] font-bold">Waar de prijs van afhangt</h3>
                  <ul className="mt-4 grid gap-3 text-[16px] leading-relaxed sm:grid-cols-2">
                    {["Breedte van de opening", "Dikte en materiaal van de muur", "Op welke verdieping", "Type ligger en opleggingen", "Brandwerend bekleden van de ligger", "Afwerking: stucwerk, vloer en plafond"].map((item) => (
                      <li className="grid grid-cols-[18px_minmax(0,1fr)] gap-2" key={item}>
                        <span aria-hidden="true" className="mt-[0.7em] h-[2px] w-3 bg-lp-orange" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a className="route-btn mt-7" data-cta="pricing_to_intake" data-track="pricing" href="#intake">
                    Bereken uw indicatie
                  </a>
                </div>
              )}
              <p className="mt-5 max-w-[70ch] text-[15px] leading-[1.6] text-lp-muted">{route.pricing.note}</p>
            </div>
          </div>
        </section>

        {/* Werkwijze */}
        <section aria-labelledby="werkwijze" className="route-section bg-lp-plaster">
          <div className="section-shell route-grid">
            <SectionHead id="werkwijze" intro={route.steps.intro} title={route.steps.title} />
            <ol className="route-steps">
              {route.steps.items.map((step) => (
                <li key={step.title}>
                  <h3 className="text-[19px] font-bold">{step.title}</h3>
                  <p className="mt-1 max-w-[58ch] text-[16px] leading-[1.6] text-lp-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Mensen */}
        <section aria-labelledby="team" className="route-section">
          <div className="section-shell route-grid">
            <SectionHead
              id="team"
              intro={`${BUSINESS.legalName} is een familiebedrijf uit Den Haag. Dit zijn de mensen die u spreekt.`}
              title="Met wie u te maken heeft"
            />
            <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {BUSINESS.team.map((member) => (
                <li className="border-t border-lp-line pt-4" key={member.name}>
                  <p className="text-[19px] font-bold">{member.name}</p>
                  <p className="text-[16px] text-lp-muted">{member.jobTitle}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Projecten of casestudy's */}
        {(caseStudies.length > 0 || related.length > 0) && (
          <section aria-labelledby="projecten" className="route-section bg-lp-plaster">
            <div className="section-shell">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="route-h2" id="projecten">
                    {caseStudies.length > 0 ? "Projecten in detail" : "Recente projecten"}
                  </h2>
                  {duration && (
                    <p className="mt-3 max-w-[60ch] text-[17px] text-lp-muted">
                      De uitvoering van vergelijkbare projecten op onze projectpagina duurde {duration}.
                    </p>
                  )}
                </div>
                <Link className="text-[15px] font-semibold text-lp-orange underline-offset-4 hover:underline" href="/projecten">
                  Alle projecten
                </Link>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {caseStudies.length > 0
                  ? caseStudies.slice(0, 3).map((p) => (
                      <CaseStudyCard caseStudy={p.caseStudy!} href={`/projecten/${p.slug}`} key={p.slug} location={p.location} title={p.title.trim()} />
                    ))
                  : related.map((p) => (
                      <Link className="group block overflow-hidden rounded-[10px] border border-lp-line bg-white" data-cta="project_open" href={`/projecten/${p.slug}`} key={p.slug}>
                        <img alt={`${p.type} ${p.title}`.trim()} className="aspect-[4/3] w-full object-cover" decoding="async" loading="lazy" src={projectImage(p)} />
                        <span className="block p-5">
                          <span className="block text-[18px] font-bold group-hover:underline">{p.title.trim()}</span>
                          <span className="mt-1 block text-[15px] text-lp-muted">
                            {p.type.trim()}
                            {p.duration ? `, ${p.duration.trim()}` : ""}
                          </span>
                        </span>
                      </Link>
                    ))}
              </div>
            </div>
          </section>
        )}

        {/* Vragen */}
        <section aria-labelledby="vragen" className="route-section">
          <div className="section-shell route-grid">
            <SectionHead id="vragen" title="Veelgestelde vragen" />
            <div className="divide-y divide-lp-line border-y border-lp-line">
              {route.faq.map((item) => (
                <details className="group py-5" key={item.q}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[18px] font-semibold leading-snug">
                    {item.q}
                    <span aria-hidden="true" className="mt-1 text-[22px] leading-none text-lp-orange transition group-open:rotate-45 motion-reduce:transition-none">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-[66ch] text-[16px] leading-[1.7] text-lp-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Intake */}
        <section aria-labelledby="intake-titel" className="route-section scroll-mt-20 bg-lp-slate text-white" id="intake">
          <div className="section-shell grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div>
              <h2 className="route-h2 text-white" id="intake-titel">
                {route.intake.title}
              </h2>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.65] text-white/80">{route.intake.intro}</p>
              <ul className="mt-8 grid gap-3 text-[16px] text-white/85">
                <li>Vrijblijvend, u zit nergens aan vast.</li>
                <li>
                  Hoe we met uw gegevens omgaan staat in onze{" "}
                  <Link className="underline underline-offset-4 hover:text-white" href="/privacypolicy">
                    privacyverklaring
                  </Link>
                  .
                </li>
                <li>
                  Liever direct contact?{" "}
                  <a className="font-semibold text-white underline underline-offset-4" data-track="intake_side" href={BUSINESS.phone.href}>
                    {BUSINESS.phone.display}
                  </a>
                  , ook via WhatsApp.
                </li>
              </ul>
            </div>
            <div className="text-lp-ink">
              <SmartIntakeWizard
                budgetScaleMax={route.intake.budgetScaleMax}
                budgetStep={route.intake.budgetStep}
                conversionRoute={route.key}
                headingLevel="h2"
                initialBudget={route.intake.initialBudget}
                largeBudget={route.intake.largeBudget}
                serviceOrder={route.intake.serviceOrder}
                servicesSub={route.intake.servicesSub}
                servicesTitle={route.intake.servicesTitle}
                source={ROUTE_SOURCES[route.key]}
                thanksLinks={[
                  {href: "/projecten", label: "Bekijk onze projecten"},
                  {href: "/werkwijze", label: "Onze werkwijze"},
                  {href: "/over-ons", label: "Over DRO Renovaties"},
                ]}
              />
            </div>
          </div>
        </section>

        {/* Andere route */}
        <section className="route-section py-12">
          <div className="section-shell">
            <div className="flex flex-col justify-between gap-5 border-l-[3px] border-lp-orange pl-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-[22px] font-bold">{route.otherRoute.title}</h2>
                <p className="mt-1 max-w-[62ch] text-[16px] text-lp-muted">{route.otherRoute.text}</p>
              </div>
              <Link className="route-btn route-btn-quiet" data-cta="other_route" href={route.otherRoute.href}>
                {route.otherRoute.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
