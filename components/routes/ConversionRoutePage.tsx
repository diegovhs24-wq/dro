import Link from "next/link";

import {AssuranceTable, FaqList, IntakeBlock, ProjectTile, ReviewQuotes, SectionHead} from "@/components/premium/blocks";
import {premiumFontClass} from "@/components/premium/fonts";
import LintelDrawing from "@/components/premium/LintelDrawing";
import PremiumHero, {type HeroFact} from "@/components/premium/PremiumHero";
import RenovationEstimator from "@/components/routes/RenovationEstimator";
import RouteViewTracker from "@/components/routes/RouteViewTracker";
import PageStructuredData from "@/components/seo/PageStructuredData";
import {caseStudyMatchesRoute} from "@/lib/caseStudy";
import {ROUTE_SOURCES, type ConversionRouteConfig} from "@/lib/conversionRoutes";
import {getPremiumData, weeksRange} from "@/lib/premiumData";
import {projectCover} from "@/lib/projectCategories";
import {breadcrumbsForPath} from "@/lib/seo/breadcrumbs";

const CONSTRUCTIVE_FACTORS = [
  "Breedte van de opening",
  "Dikte en materiaal van de muur",
  "Op welke verdieping",
  "Type ligger en opleggingen",
  "Brandwerend bekleden van de ligger",
  "Afwerking van stucwerk, vloer en plafond",
];

export default async function ConversionRoutePage({route}: {route: ConversionRouteConfig}) {
  const data = await getPremiumData();
  const {projects} = data;

  const matching = projects.filter((p) => route.projectTypeMatch.test(p.type) && projectCover(p));
  const caseStudies = projects.filter((p) => p.caseStudy && caseStudyMatchesRoute(p.caseStudy, route.key));
  const shown = (caseStudies.length ? caseStudies : matching).slice(0, 3);
  const heroProject = caseStudies[0] || projects.find((p) => p.slug === route.heroSlug && projectCover(p)) || matching[0];
  const weeks = weeksRange(projects.filter((p) => route.projectTypeMatch.test(p.type)));
  const crumbs = breadcrumbsForPath(route.path, route.crumbLabel);

  const facts: HeroFact[] = route.estimator
    ? [
        {term: "Indicatie", detail: "€ 1.000 tot € 1.250 per m², excl. btw"},
        ...(weeks ? [{term: "Uitvoering", detail: `${weeks} bij onze projecten`}] : []),
        {term: "Bij ondertekening", detail: "U betaalt niets"},
        {term: "Google-reviews", detail: data.reviewSummary.replace(" Google-reviews", "")},
      ]
    : [
        {term: "Uitvoering", detail: "Meestal 1 tot 3 dagen"},
        {term: "Vooraf", detail: "Constructieberekening"},
        {term: "Verzekerd", detail: "CAR en aansprakelijkheid"},
        {term: "Google-reviews", detail: data.reviewSummary.replace(" Google-reviews", "")},
      ];

  return (
    <div className={`pr ${premiumFontClass}`}>
      <PageStructuredData
        breadcrumbs={crumbs}
        description={route.metaDescription}
        faqs={route.faq.map((f) => ({question: f.q, answer: f.a}))}
        organizationSeo={data.siteSettings.organizationSeo}
        pathname={route.path}
        service={{name: route.serviceName, description: route.metaDescription, slug: route.path.slice(1)}}
        siteSettings={data.siteSettings}
        title={route.metaTitle.replace(/ \| DRO Renovaties$/, "")}
      />
      <RouteViewTracker route={route.key} />

      <main>
        <PremiumHero
          crumbs={crumbs.map((c, i) => ({name: c.name, href: i < crumbs.length - 1 ? c.path : undefined}))}
          facts={facts}
          lead={route.intro}
          primary={{label: route.primaryCta, href: "#intake", cta: "hero_intake"}}
          aside={!heroProject && route.key === "specialistisch" ? <LintelDrawing /> : undefined}
          project={heroProject}
          title={route.title}
        />

        <section aria-labelledby="voor-wie" className="pr-section">
          <div className="section-shell pr-split">
            <SectionHead id="voor-wie" intro={route.audience.intro} title={route.audience.title} />
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {route.audience.cards.map((card) => (
                <div className="border-t-2 border-[var(--pr-ink)] pt-4" key={card.title}>
                  <h3 className="pr-h3">{card.title}</h3>
                  <p className="mt-2 text-[16px] pr-muted">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="scope" className="pr-section pr-kalk">
          <div className="section-shell pr-split">
            <SectionHead id="scope" intro={route.scope.intro} title={route.scope.title} />
            <ul className="border-b border-[var(--pr-line)]">
              {route.scope.cards.map((card) => (
                <li className="grid gap-2 border-t border-[var(--pr-line)] py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-8" key={card.title}>
                  <div>
                    <h3 className="pr-h3">{card.title}</h3>
                    <p className="mt-1 max-w-[58ch] text-[16px] pr-muted">{card.text}</p>
                  </div>
                  {card.href && (
                    <Link className="pr-link text-[15px]" data-cta="scope_link" href={card.href}>
                      {card.linkLabel}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="prijs" className="pr-section">
          <div className="section-shell">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[4.5rem]">
              <h2 className="pr-h2" id="prijs">
                {route.pricing.title}
              </h2>
              <p className="pr-lead self-end">{route.pricing.intro}</p>
            </div>
            <div className="mt-10">
              {route.estimator ? (
                <RenovationEstimator route={route.key} />
              ) : (
                <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
                  <div className="rounded-[6px] border border-[var(--pr-line)] p-6 md:p-8">
                    <p className="pr-measure">prijsindicatie op basis van uw maten</p>
                    <p className="mt-5 max-w-[52ch] text-[17px]">
                      In de intake vult u de breedte en hoogte van de opening in, de dikte van de muur en de verdieping. Daarna ziet u direct een indicatie, inclusief constructieberekening en basisafwerking.
                    </p>
                    <p className="mt-5 rounded-[4px] bg-[var(--pr-kalk)] px-4 py-3 text-[15px] leading-[1.55]">
                      <strong className="font-semibold">Een indicatie, geen offerte.</strong> {route.pricing.note}
                    </p>
                    <a className="pr-btn mt-6" data-cta="pricing_to_intake" data-track="pricing" href="#intake">
                      Bereken uw indicatie
                    </a>
                  </div>
                  <div>
                    <h3 className="pr-h3">Waar de prijs van afhangt</h3>
                    <ul className="mt-4 border-b border-[var(--pr-line)]">
                      {CONSTRUCTIVE_FACTORS.map((item) => (
                        <li className="border-t border-[var(--pr-line)] py-3 text-[16px]" key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section aria-labelledby="werkwijze" className="pr-section pr-kalk">
          <div className="section-shell pr-split">
            <SectionHead id="werkwijze" intro={route.steps.intro} title={route.steps.title} />
            <ol className="pr-steps">
              {route.steps.items.map((step) => (
                <li key={step.title}>
                  <h3 className="pr-h3">{step.title}</h3>
                  <p className="mt-1 max-w-[58ch] text-[16px] pr-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <AssuranceTable
          intro="Per onderwerp hoe het geregeld is, en waaruit dat blijkt."
          items={data.assurances}
          title="Zo is het geregeld"
        />

        {shown.length > 0 && (
          <section aria-labelledby="projecten" className="pr-section pr-kalk">
            <div className="section-shell">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="pr-h2" id="projecten">
                    {caseStudies.length ? "Projecten in detail" : "Vergelijkbare projecten"}
                  </h2>
                  {weeks && <p className="mt-3 pr-muted">De uitvoering van deze projecten duurde {weeks}.</p>}
                </div>
                <Link className="pr-link" href="/projecten">
                  Alle projecten
                </Link>
              </div>
              <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
                {shown.map((p) => (
                  <ProjectTile key={p.slug} project={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        <ReviewQuotes asOf={data.reviewAsOf} reviews={data.featuredReviews} summary={data.reviewSummary} />
        <FaqList items={route.faq} />
        <IntakeBlock
          intro={route.intake.intro}
          title={route.intake.title}
          wizard={{
            budgetScaleMax: route.intake.budgetScaleMax,
            budgetStep: route.intake.budgetStep,
            conversionRoute: route.key,
            initialBudget: route.intake.initialBudget,
            largeBudget: route.intake.largeBudget,
            serviceOrder: route.intake.serviceOrder,
            servicesSub: route.intake.servicesSub,
            servicesTitle: route.intake.servicesTitle,
            source: ROUTE_SOURCES[route.key],
            // Reactietijd alleen als die in Sanity is bevestigd.
            responsePromise: data.claims.responseTime?.text || "zo snel mogelijk",
          }}
        />

        <section className="py-12">
          <div className="section-shell">
            <div className="flex flex-col justify-between gap-5 border-l-2 border-[var(--pr-signal)] pl-6 md:flex-row md:items-center">
              <div>
                <h2 className="pr-h3 text-[22px]">{route.otherRoute.title}</h2>
                <p className="mt-1 max-w-[62ch] text-[16px] pr-muted">{route.otherRoute.text}</p>
              </div>
              <Link className="pr-btn-line" data-cta="other_route" href={route.otherRoute.href}>
                {route.otherRoute.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
