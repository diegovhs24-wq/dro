import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import { processSteps } from "@/components/siteContent";

export const metadata: Metadata = {
  title: "Onze werkwijze | DRO Renovaties",
  description:
    "Ontdek hoe DRO Renovaties renovaties structureert met intake, offerte, planning, uitvoering en oplevering."
};

const focusItems = [
  "Eén vast aanspreekpunt",
  "Vaste volgorde per fase",
  "Afstemming met partners",
  "Controle tot oplevering"
];

const coordinationNodes = ["Intake", "Planning", "Partners", "Oplevering"];

const partnerGroups = [
  {
    title: "Bouwkundig",
    text: "Technische keuzes vooraf helder.",
    items: [
      {
        icon: "constructie",
        name: "Constructeurs",
        text: "Constructieve zekerheid."
      },
      {
        icon: "architect",
        name: "Architecten",
        text: "Indeling en ontwerpkeuzes."
      }
    ]
  },
  {
    title: "Materialen & keuzes",
    text: "Materialen en planning afgestemd.",
    items: [
      {
        icon: "badkamer",
        name: "Badkamerzaken",
        text: "Sanitair en tegels."
      },
      {
        icon: "keuken",
        name: "Keukenzaken",
        text: "Planning en aansluitpunten."
      },
      {
        icon: "bouwmaat",
        name: "Bouwmaat",
        text: "Materialen en levering."
      }
    ]
  },
  {
    title: "Afwerking & installatie",
    text: "Strakke details in uitvoering.",
    items: [
      {
        icon: "vloer",
        name: "Vloerspecialisten",
        text: "Vloeropbouw en afwerking."
      },
      {
        icon: "sanitair",
        name: "Sanisale",
        text: "Badkameronderdelen."
      },
      {
        icon: "apparaten",
        name: "Keukensale",
        text: "Onderdelen en apparatuur."
      }
    ]
  }
];

const partnerIconPaths = {
  constructie: "M12 3l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V7l8-4zM9 12l2 2 4-5",
  architect: "M4 20h16M6 20V9l6-5 6 5v11M10 20v-6h4v6",
  badkamer: "M5 11h14v3a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-3zM7 11V7a3 3 0 0 1 3-3h1M7 19l-1 2M17 19l1 2",
  keuken: "M5 4h14v16H5zM9 4v16M13 8h2M13 12h2",
  bouwmaat: "M4 8h16M6 8v12h12V8M9 12h6M9 16h6M8 8V5h8v3",
  vloer: "M4 6h16v12H4zM4 10h16M8 6v12M12 6v12M16 6v12",
  sanitair: "M7 5h10v14H7zM10 8h4M10 12h4M10 16h4M17 9h2v6h-2",
  apparaten: "M6 6h12v9H6zM8 19h8M10 15v4M14 15v4M9 9h6M9 12h6"
} as const;

type PartnerIconName = keyof typeof partnerIconPaths;

function PartnerIcon({ icon }: { icon: PartnerIconName }) {

  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-orange/10 text-brand-orange">
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d={partnerIconPaths[icon]}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.9"
        />
      </svg>
    </span>
  );
}

export default function WerkwijzePage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Werkwijze"
        title="Onze werkwijze"
        text="Een vaste structuur voor intake, planning, uitvoering en oplevering."
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Complete coördinatie</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Eén centrale regie over uw verbouwing.
            </h2>
            <p className="mt-6 leading-8 text-neutral-600">
              Wij coördineren planning, partners en uitvoering. U houdt overzicht,
              zonder losse partijen zelf aan te sturen.
            </p>
            <div className="mt-7 rounded-lg border-l-4 border-brand-orange bg-brand-soft p-6">
              <p className="text-base font-semibold leading-8 text-brand-ink">
                Voor ons is coördinatie dagelijks werk. Daardoor blijft uw traject
                rustig, logisch en controleerbaar.
              </p>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {focusItems.map((item) => (
                <div
                  className="rounded-lg border border-black/10 bg-white px-4 py-3 text-sm font-bold text-brand-ink shadow-sm"
                  key={item}
                >
                  <span className="mr-2 text-brand-orange">✔</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-brand-ink p-6 text-white shadow-premium sm:p-8">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                  Regiekaart
                </p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight">
                  Uw project, helder aangestuurd.
                </h3>
              </div>
              <span className="rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-white/80">
                Van A tot Z
              </span>
            </div>
            <div className="relative mt-7 grid gap-4 sm:grid-cols-2">
              <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/10 sm:block" />
              {coordinationNodes.map((node, index) => (
                <div
                  className="relative rounded-lg border border-white/10 bg-white/5 p-5"
                  key={node}
                >
                  <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 text-lg font-bold">{node}</p>
                </div>
              ))}
            </div>
            <p className="mt-7 rounded-lg bg-white/10 p-5 text-sm leading-7 text-white/70">
              Eén volgorde. Eén aanspreekpunt. Eén duidelijke oplevering.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-brand-soft py-16 sm:py-20">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Vaste partners</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Vaste partners, centraal aangestuurd.
            </h2>
            <p className="mt-5 leading-8 text-neutral-600">
              Keuzes, leveringen en uitvoering worden vooraf op elkaar afgestemd.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {partnerGroups.map((group) => (
              <article
                className="rounded-lg border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium"
                key={group.title}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">
                  {group.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  {group.text}
                </p>
                <div className="mt-6 grid gap-4">
                  {group.items.map((partner) => (
                    <div className="flex gap-4" key={partner.name}>
                      <PartnerIcon icon={partner.icon as PartnerIconName} />
                      <div>
                        <h3 className="text-base font-bold text-brand-ink">
                          {partner.name}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          {partner.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-16 sm:py-20">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Stappenplan</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Van aanvraag naar oplevering.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-neutral-600">
              Duidelijke fases. Duidelijke verantwoordelijkheden.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {processSteps.map((step, index) => (
              <div
                className="rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-premium"
                key={step}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-sm font-extrabold text-white">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-5 text-lg font-bold">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
      <Footer />
    </main>
  );
}
