import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Uitbouw laten plaatsen Den Haag | DRO Renovaties",
  description:
    "Uitbouw of aanbouw laten plaatsen in Den Haag met fundering, constructie, isolatie en afwerking."
};

export default function UitbouwAanbouwPage() {
  return (
    <main>
      <Header />
      <ServicePage
        eyebrow="Uitbouw / aanbouw"
        title="Uitbouw laten plaatsen Den Haag"
        intro="Meer ruimte creëren met een uitbouw vereist een goede voorbereiding en uitvoering. DRO Renovaties zorgt voor structuur, technische afstemming en een nette oplevering."
        sections={[
          {
            title: "Werkzaamheden",
            items: ["Fundering", "Constructie", "Kozijnen en puien", "Dak en isolatie", "Afwerking"]
          },
          {
            title: "Waar wij op sturen",
            items: ["Heldere voorbereiding", "Betrouwbare planning", "Nette bouwplaats", "Controle op details"]
          },
          {
            title: "Ideaal voor",
            items: ["Leefkeukens", "Meer woonruimte", "Woningwaarde verhogen"]
          }
        ]}
        processTitle="Bouwkundige voorbereiding zonder losse eindjes."
        processText="We stemmen constructie, partners, materialen en planning vooraf af. Zo blijft de uitvoering gecontroleerd en weet u welke stappen nodig zijn."
      />
      <Footer />
    </main>
  );
}
