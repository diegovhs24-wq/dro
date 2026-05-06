import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import Partners from "@/components/Partners";
import TeamMember from "@/components/TeamMember";

export const metadata: Metadata = {
  title: "Over DRO Renovaties | Renovatiebedrijf Den Haag",
  description:
    "Maak kennis met Therab, zijn vader en het team van DRO Renovaties: tweede generatie bouwervaring met moderne begeleiding."
};

export default function OverOnsPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Over ons"
        title="Tweede generatie bouwervaring, moderne renovatiebegeleiding."
        text="DRO Renovaties combineert vakmanschap met structuur, zodat huiseigenaren grip houden op planning, communicatie en uitvoering."
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="min-h-[360px] rounded-lg bg-[url('/dro-renovaties-team.jpg')] bg-cover bg-center shadow-premium sm:min-h-[430px]" />
          <div>
            <p className="eyebrow">Therab</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Duidelijkheid vooraf maakt het verschil.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-neutral-700">
              <p>
                Mijn naam is Therab. Samen met mijn vader vormen wij de tweede generatie
                binnen DRO Bouwgroep.
              </p>
              <p>
                Met een team van circa 35 vakmensen begeleiden wij dagelijks woningkopers
                van eerste inzicht tot volledige verbouwing.
              </p>
              <p>Wij geloven dat duidelijkheid vooraf het verschil maakt.</p>
            </div>
            <p className="mt-8 border-l-4 border-brand-orange pl-5 text-base font-semibold text-brand-ink">
              Met deze toppers bouwen wij elke dag met trots door.
            </p>
          </div>
        </div>
      </section>
      <TeamMember />
      <Partners />
      <CTASection />
      <Footer />
    </main>
  );
}
