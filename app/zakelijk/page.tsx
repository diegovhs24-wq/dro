import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Zakelijke afbouwprojecten | DRO Renovaties",
  description:
    "DRO Renovaties ondersteunt zakelijke opdrachtgevers met schaalbare uitvoering, vaste teams en duidelijke coördinatie."
};

const capacity = [
  "Meerdere projecten tegelijk",
  "Opschalen mogelijk",
  "Vaste teams",
  "Gestructureerde uitvoering"
];

const disciplines = [
  "Metselwerk",
  "Tegelwerk",
  "Wanden en plafonds",
  "Afwerking",
  "Timmerwerk"
];

const b2b = [
  "Projectmatige renovaties",
  "Seriematige afbouw",
  "Mutatiewoningen",
  "Schaalbare processen"
];

export default function ZakelijkPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Zakelijk"
        title="Een uitvoeringspartner voor projecten en volume."
        text="Voor opdrachtgevers die capaciteit, structuur en betrouwbare uitvoering zoeken."
      />

      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Positionering</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              Wij functioneren als verlengstuk van uw organisatie.
            </h2>
            <p className="mt-5 text-base font-semibold leading-7 text-neutral-600">
              We nemen uitvoering, coördinatie en bezetting onder één
              verantwoordelijkheid. Daardoor blijft het traject helder voor u en
              representatief richting uw klant.
            </p>
            <div className="mt-7 rounded-lg bg-neutral-950 p-6 text-white shadow-premium">
              <p className="text-2xl font-bold leading-tight">
                Eén partij. Volledige uitvoering. Volledige controle.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {capacity.map((item) => (
              <div className="rounded-lg bg-brand-soft p-5 text-sm font-bold text-brand-ink" key={item}>
                <span className="text-brand-orange">✔</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-14 sm:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="eyebrow">Afbouw / capability</p>
            <h2 className="mt-3 text-2xl font-bold text-brand-ink">
              Complete afbouw onder één verantwoordelijkheid.
            </h2>
            <div className="mt-6 grid gap-3">
              {disciplines.map((item) => (
                <p className="text-sm font-semibold text-neutral-700" key={item}>
                  <span className="mr-2 text-brand-orange">✔</span>
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="eyebrow">Geschikt voor</p>
            <h2 className="mt-3 text-2xl font-bold text-brand-ink">
              Herhaalbare projecten en uitvoering op schaal.
            </h2>
            <div className="mt-6 grid gap-3">
              {b2b.map((item) => (
                <p className="text-sm font-semibold text-neutral-700" key={item}>
                  <span className="mr-2 text-brand-orange">✔</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Plan een kennismaking"
        text="Bespreek uw project, volume en gewenste uitvoering met ons."
      />
      <Footer />
    </main>
  );
}
