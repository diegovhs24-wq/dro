import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Zonnepanelen laten installeren | DRO Renovaties",
  description:
    "Zonnepanelen laten installeren met veilige plaatsing, aansluiting op de meterkast en nette oplevering."
};

export default function ZonnepanelenPage() {
  return (
    <main>
      <Header />
      <ServicePage
        eyebrow="Zonnepanelen"
        title="Zonnepanelen laten installeren"
        intro="Met zonnepanelen verlaagt u direct uw energiekosten en maakt u uw woning duurzamer. Wij verzorgen een complete installatie, van plaatsing tot aansluiting."
        sections={[
          {
            title: "Wat wij doen",
            items: [
              "Plaatsing panelen",
              "Omvormer installatie",
              "Aansluiting op meterkast",
              "Controle en oplevering"
            ]
          },
          {
            title: "Onderdeel van een totaaloplossing",
            items: [
              "Veilige voorbereiding",
              "Nette afstemming met bestaande installatie",
              "Controle voor oplevering"
            ]
          }
        ]}
        processTitle="Netjes en veilig geïnstalleerd."
        processText="Alles wordt netjes en veilig geïnstalleerd, zonder dat u zich ergens zorgen over hoeft te maken."
      />
      <Footer />
    </main>
  );
}
