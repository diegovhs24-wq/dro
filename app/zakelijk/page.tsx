import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Zakelijke afbouwprojecten | DRO Renovaties",
  description:
    "DRO Renovaties ondersteunt zakelijke opdrachtgevers als uitvoeringspartner met complete afbouwprojecten, vaste teams, duidelijke coördinatie en schaalbare uitvoering."
};

const capacityItems = [
  "Meerdere teams inzetbaar",
  "Opschalen bij volume",
  "Vaste kern + flexibele schil",
  "Planning en bezetting bewaakt",
  "Voormannen op locatie"
];

const disciplineItems = [
  "Metselwerk en binnenafbouw",
  "Tegelwerk",
  "Metal stud / HSB wanden",
  "Plafonds",
  "Vloerafwerking",
  "Stuc- en schilderwerk",
  "Timmerwerk",
  "Eindafwerking"
];

const b2bBenefits = [
  "Minder afstemming tussen verschillende partijen",
  "Kortere en beter voorspelbare doorlooptijden",
  "Eén aanspreekpunt voor de volledige uitvoering",
  "Betere grip op planning, kwaliteit en kostenbeheersing"
];

const executionModes = [
  {
    title: "Execution partner",
    text: "Verlengstuk van uw organisatie."
  },
  {
    title: "Capacity provider",
    text: "Teams inzetbaar bij volume."
  },
  {
    title: "Scalable workforce",
    text: "Projectmatig en schaalbaar."
  }
];

const workingUnderName = [
  "Representatief op locatie",
  "Klantgericht richting bewoners",
  "Professionele communicatie"
];

const intakeItems = [
  "Scope beoordelen",
  "Disciplines bepalen",
  "Capaciteit afstemmen"
];

const repeatableItems = [
  "Seriematige uitvoering",
  "Mutatiewoningen",
  "Schaalbare processen",
  "Herhaalbare opleverstandaard"
];

export default function ZakelijkPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Zakelijk"
        title="Uitvoeringspartner voor schaalbare renovatie en afbouw."
        text="Voor opdrachtgevers die capaciteit, structuur en betrouwbare uitvoering zoeken."
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="eyebrow">Complete afbouw</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Eén uitvoerende partij. Meer controle.
              </h2>
              <p className="mt-6 leading-8 text-neutral-600">
                Wij bundelen teams, planning en disciplines onder één
                verantwoordelijkheid.
              </p>
              <div className="mt-8 rounded-lg bg-brand-ink p-6 text-white shadow-premium">
                <p className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                  Geen losse aannemers. Eén gestructureerde uitvoering.
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-black/10 bg-brand-soft p-6">
              <p className="eyebrow">Capaciteit en uitvoering</p>
              <div className="mt-6 grid gap-3">
                {capacityItems.map((item) => (
                  <div
                    className="flex gap-3 rounded-lg bg-white px-4 py-3 text-sm font-bold text-brand-ink shadow-sm"
                    key={item}
                  >
                    <span className="text-brand-orange">✔</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {executionModes.map((mode) => (
              <article
                className="rounded-lg border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium"
                key={mode.title}
              >
                <p className="eyebrow">{mode.title}</p>
                <p className="mt-4 text-sm font-semibold leading-6 text-neutral-700">
                  {mode.text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Disciplines onder één dak</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink">
                  Volledige binnenafbouw, strak gecoördineerd.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-neutral-600">
                Eén planning en één opleverstandaard.
              </p>
            </div>
            <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {disciplineItems.map((item) => (
                <div
                  className="flex gap-3 rounded-lg bg-brand-soft px-4 py-3 text-sm font-semibold text-neutral-700"
                  key={item}
                >
                  <span className="text-brand-orange">✔</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-4">
            <article className="rounded-lg border border-black/10 bg-brand-soft p-6">
              <p className="eyebrow">Projectmatige aanpak</p>
              <p className="mt-5 text-sm leading-7 text-neutral-700">
                Vaste teams, duidelijke fasering en strakke coördinatie.
              </p>
            </article>
            <article className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <p className="eyebrow">Wij werken namens u</p>
              <p className="mt-5 text-sm leading-7 text-neutral-600">
                Representatief richting uw klant en bewoners.
              </p>
              <div className="mt-5 grid gap-2">
                {workingUnderName.map((item) => (
                  <p className="text-sm font-semibold text-brand-ink" key={item}>
                    <span className="mr-2 text-brand-orange">✔</span>
                    {item}
                  </p>
                ))}
              </div>
            </article>
            <article className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <p className="eyebrow">Intake als filtersysteem</p>
              <p className="mt-5 text-sm leading-7 text-neutral-600">
                We beoordelen projecten vooraf voor een efficiënte uitvoering.
              </p>
              <div className="mt-5 grid gap-3">
                {intakeItems.map((item) => (
                  <p className="text-sm font-semibold leading-6 text-brand-ink" key={item}>
                    <span className="mr-2 text-brand-orange">✔</span>
                    {item}
                  </p>
                ))}
              </div>
            </article>
            <article className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <p className="eyebrow">Herhaalbare projecten</p>
              <p className="mt-5 text-sm leading-7 text-neutral-600">
                Voor meerdere woningen, fases of terugkerende werkzaamheden.
              </p>
              <div className="mt-5 grid gap-3">
                {repeatableItems.map((item) => (
                  <p className="text-sm font-semibold leading-6 text-brand-ink" key={item}>
                    <span className="mr-2 text-brand-orange">✔</span>
                    {item}
                  </p>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 rounded-lg border border-brand-orange/20 bg-brand-soft p-6">
            <p className="eyebrow">Wat dit u oplevert</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {b2bBenefits.map((item) => (
                <p className="text-sm font-semibold leading-6 text-brand-ink" key={item}>
                  <span className="mr-2 text-brand-orange">✔</span>
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-6 text-sm font-bold leading-7 text-neutral-700">
              We werken met opdrachtgevers die waarde hechten aan structuur en kwaliteit.
            </p>
          </div>

          <div className="mt-8 rounded-lg bg-brand-ink p-6 text-white shadow-premium sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div>
              <p className="eyebrow">Uitvoeringspartner voor continuïteit</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                Op zoek naar een uitvoeringspartner die kan leveren?
              </h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-0">
              <a className="btn-primary" href="/contact">
                Plan een kennismaking
              </a>
              <a className="btn-secondary" href="tel:+31600000000">
                Bespreek uw project
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
