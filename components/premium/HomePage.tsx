import Link from "next/link";

import {AssuranceTable, FaqList, IntakeBlock, ProjectTile, ReviewQuotes, TeamList} from "@/components/premium/blocks";
import PremiumHero from "@/components/premium/PremiumHero";
import PageStructuredData from "@/components/seo/PageStructuredData";
import {GROTE_RENOVATIE, SPECIALISTISCH} from "@/lib/conversionRoutes";
import {getPremiumData, weeksRange} from "@/lib/premiumData";
import {projectCategory, projectCover} from "@/lib/projectCategories";
import {BUSINESS, PAYMENT_TERMS} from "@/lib/seo/business";
import {HOME_DESCRIPTION, HOME_FAQ, HOME_TITLE} from "@/components/premium/homeContent";

export {HOME_DESCRIPTION, HOME_FAQ, HOME_TITLE} from "@/components/premium/homeContent";

export default async function HomePage() {
  const data = await getPremiumData();
  const {projects} = data;
  const withImage = projects.filter((p) => projectCover(p));
  const big = withImage.filter((p) => p.caseStudy || projectCategory(p) === "groot");
  // Vaste openingsfoto voor de homepage (de grote route heeft Jan Muschlaan als
  // eigen openingsfoto); een vrijgegeven casestudy gaat altijd voor.
  const hero = big.find((p) => p.caseStudy) || big.find((p) => p.slug === "fuutlaan-leidschendam") || big[0] || withImage[0];
  const showcase = big.filter((p) => p.slug !== hero?.slug).slice(0, 3);
  const bigWeeks = weeksRange(projects.filter((p) => projectCategory(p) === "groot"));

  return (
    <div className="pr">
      <PageStructuredData
        description={HOME_DESCRIPTION}
        faqs={HOME_FAQ.map((f) => ({question: f.q, answer: f.a}))}
        organizationSeo={data.siteSettings.organizationSeo}
        pathname="/"
        siteSettings={data.siteSettings}
        title={HOME_TITLE}
      />
      <main>
        <PremiumHero
          facts={[
            {term: "Google-reviews", detail: data.reviewSummary.replace(" Google-reviews", "")},
            {term: "Betalingen", detail: PAYMENT_TERMS.short},
            {term: "Verzekerd", detail: "CAR en aansprakelijkheid"},
            {term: "Erkend", detail: "VCA, SBB en VLOK"},
          ]}
          lead={`${BUSINESS.name} is een familiebedrijf uit Den Haag. Wij voeren totaalrenovaties, uitbouwen en constructieve verbouwingen uit, van € 50.000 tot € 250.000 en meer: één aannemer van sloop tot oplevering, met vaste vakteams en vaste aanspreekpunten.`}
          primary={{label: "Start uw projectintake", href: "#intake", cta: "home_hero_intake"}}
          project={hero}
          title="Renovatie en verbouwing, onder één regie"
        />

        {/* Twee routes */}
        <section aria-labelledby="routes" className="pr-section">
          <div className="section-shell">
            <h2 className="pr-h2 max-w-[22ch]" id="routes">
              Waar gaat uw project over?
            </h2>
            <div className="mt-10 grid border-y border-[var(--pr-line)] md:grid-cols-2">
              <RoutePanel
                facts={[
                  {term: "Voor", detail: "Totaalrenovatie, uitbouw, dakopbouw, of een combinatie"},
                  {term: "Indicatie", detail: "€ 1.210 tot € 1.510 per m² incl. btw, voor een totaalrenovatie"},
                  ...(bigWeeks ? [{term: "Uitvoering", detail: `${bigWeeks} bij onze projecten`}] : []),
                ]}
                href={GROTE_RENOVATIE.path}
                label="Naar grote renovaties"
                second={{href: "/totaalrenovatie", label: "Kosten en duur van een totaalrenovatie"}}
                text="De hele woning in één traject: indeling, installaties, isolatie en afwerking, met één planning en één betaalschema."
                title="Een grote renovatie"
              />
              <RoutePanel
                border
                facts={[
                  {term: "Voor", detail: "Draagmuur verwijderen, deuropening, doorbraak, stalen ligger"},
                  {term: "Indicatie", detail: "Direct in de intake, op basis van uw maten"},
                  {term: "Uitvoering", detail: "Meestal 1 tot 3 dagen, na constructieberekening"},
                ]}
                href={SPECIALISTISCH.path}
                label="Naar constructieve werken"
                second={{href: "/constructieve-werken#werkwijze", label: "Zo gaat een draagmuur eruit"}}
                text="Werk aan de constructie van uw woning, berekend door een constructeur en uitgevoerd door vaste vakteams."
                title="Constructief werk"
              />
            </div>
            <p className="mt-6 text-[16px] pr-muted">
              Een badkamer, keuken of iets anders?{" "}
              <a className="pr-link" data-cta="home_general_intake" href="#intake">
                Gebruik de intake onderaan deze pagina
              </a>
              .
            </p>
          </div>
        </section>

        <div className="pr-kalk">
          <AssuranceTable
            intro="Bij een project van deze omvang wilt u vooraf weten hoe het geregeld is. Hieronder staat het per onderwerp, met wat het aantoont."
            items={data.assurances}
            title="Zes vragen die u ons gaat stellen"
          />
        </div>

        {/* Projecten */}
        {showcase.length > 0 && (
          <section aria-labelledby="projecten" className="pr-section">
            <div className="section-shell">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="pr-h2" id="projecten">
                  Recent opgeleverd
                </h2>
                <Link className="pr-link" href="/projecten">
                  Alle projecten
                </Link>
              </div>
              <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
                {showcase.map((p) => (
                  <ProjectTile key={p.slug} project={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        <TeamList />
        <ReviewQuotes asOf={data.reviewAsOf} reviews={data.featuredReviews} summary={data.reviewSummary} />
        <FaqList items={HOME_FAQ} />
        <IntakeBlock
          intro="Vertel ons wat u van plan bent. Het duurt een paar minuten en u zit nergens aan vast."
          title="Start uw projectintake"
          wizard={{
            serviceOrder: ["Totaalrenovatie", "Aanbouw of opbouw", "Draagmuur verwijderen", "Badkamer", "Keuken"],
            largeBudget: [75000, 150000],
            budgetScaleMax: 250000,
            budgetStep: 5000,
            // Reactietijd alleen als die in Sanity is bevestigd.
            responsePromise: data.claims.responseTime?.text || "zo snel mogelijk",
          }}
        />
      </main>
    </div>
  );
}

function RoutePanel({
  title,
  text,
  facts,
  href,
  label,
  second,
  border = false,
}: {
  title: string;
  text: string;
  facts: Array<{term: string; detail: string}>;
  href: string;
  label: string;
  second: {href: string; label: string};
  border?: boolean;
}) {
  return (
    <div className={`flex flex-col py-8 md:py-10 ${border ? "border-t border-[var(--pr-line)] md:border-l md:border-t-0 md:pl-10" : "md:pr-10"}`}>
      <h3 className="pr-h3 text-[clamp(1.4rem,1.1rem+0.9vw,1.85rem)]">{title}</h3>
      <p className="mt-3 max-w-[48ch] pr-muted">{text}</p>
      <dl className="mt-6 grid gap-3">
        {facts.map((f) => (
          <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 text-[16px]" key={f.term}>
            <dt className="pr-muted">{f.term}</dt>
            <dd className="font-medium pr-num">{f.detail}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
        <Link className="pr-btn" data-cta={`home_route_${href.slice(1)}`} href={href}>
          {label}
        </Link>
        <Link className="pr-link text-[15px]" href={second.href}>
          {second.label}
        </Link>
      </div>
    </div>
  );
}
