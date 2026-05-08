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
        intro="Meer ruimte met technische voorbereiding, duidelijke planning en nette afwerking."
        sections={[
          {
            title: "Werkzaamheden",
            items: ["Fundering", "Constructie", "Kozijnen en puien", "Dak, isolatie en afwerking"]
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
        processTitle="Bouwkundig voorbereid."
        processText="Constructie, materialen en uitvoering worden vooraf afgestemd."
        situations={[
          {
            title: "Leefkeuken",
            items: ["Meer licht", "Open verbinding", "Praktische indeling"]
          },
          {
            title: "Extra woonruimte",
            items: ["Constructie beoordelen", "Isolatie meenemen", "Afwerking aansluiten"]
          },
          {
            title: "Aanbouw op maat",
            items: ["Bouwkundig plannen", "Kozijnen afstemmen", "Netjes opleveren"]
          }
        ]}
        examples={["Constructie en fundering", "Wind- en waterdicht", "Binnenafwerking"]}
        faqs={[
          {
            question: "Hoe starten jullie een uitbouw?",
            answer: "We kijken eerst naar constructie, vergunningen, planning en gewenste afwerking."
          },
          {
            question: "Stemmen jullie constructie af?",
            answer: "Ja. Waar nodig werken we met vaste constructeurs en partners."
          },
          {
            question: "Regelen jullie ook de afwerking binnen?",
            answer: "Ja. Denk aan stucwerk, elektra, vloeropbouw en schilderwerk."
          },
          {
            question: "Kan de woning bewoond blijven?",
            answer: "Dat hangt af van de situatie. We bespreken vooraf wat praktisch haalbaar is."
          },
          {
            question: "Hoe blijft de planning beheersbaar?",
            answer: "Door bouwkundige voorbereiding, materiaalkeuzes en fasering vooraf vast te leggen."
          },
          {
            question: "Is isolatie onderdeel van het werk?",
            answer: "Ja. Dak, gevel en aansluitingen worden meegenomen in de uitvoering."
          }
        ]}
      />
      <Footer />
    </main>
  );
}
