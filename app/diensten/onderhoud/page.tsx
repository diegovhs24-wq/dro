import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Onderhoud en herstelwerk | DRO Renovaties",
  description:
    "Onderhoud en herstelwerk voor woningen, professioneel uitgevoerd en helder afgestemd."
};

export default function OnderhoudPage() {
  return (
    <main>
      <Header />
      <ServicePage
        eyebrow="Onderhoud"
        title="Onderhoud en herstelwerk"
        intro="Onderhoud en herstelwerk helder afgestemd en netjes uitgevoerd."
        sections={[
          {
            title: "Wat wij doen",
            items: [
              "Klein herstelwerk",
              "Kit- en voegwerk",
              "Inspectie en onderhoud",
              "Oplossen van gebreken"
            ]
          },
          {
            title: "Onderdeel van een totaaloplossing",
            items: [
              "Heldere inspectie vooraf",
              "Praktische planning",
              "Nette uitvoering en afronding"
            ]
          }
        ]}
        processTitle="Netjes uitgevoerd."
        processText="Inspectie, planning en afronding blijven overzichtelijk."
        situations={[
          {
            title: "Herstelwerk",
            items: ["Gebreken oplossen", "Nette afwerking", "Snel duidelijkheid"]
          },
          {
            title: "Periodiek onderhoud",
            items: ["Voorkomen van schade", "Inspectie vooraf", "Praktisch plannen"]
          },
          {
            title: "Na renovatie",
            items: ["Kleine punten nalopen", "Kit en voegwerk", "Woning netjes houden"]
          }
        ]}
        examples={["Inspectie", "Herstel uitvoeren", "Controle en afronding"]}
        faqs={[
          {
            question: "Doen jullie ook klein herstelwerk?",
            answer: "Ja. We pakken kleine herstelpunten professioneel en netjes op."
          },
          {
            question: "Kunnen jullie eerst inspecteren?",
            answer: "Ja. We bekijken wat nodig is voordat we werkzaamheden inplannen."
          },
          {
            question: "Is onderhoud ook voor zakelijke partijen?",
            answer: "Ja. Ook voor vastgoed, mutatie en terugkerend onderhoud."
          },
          {
            question: "Regelen jullie kit- en voegwerk?",
            answer: "Ja. Dat valt onder onderhoud en herstel."
          },
          {
            question: "Hoe snel kan onderhoud worden ingepland?",
            answer: "Dat hangt af van de werkzaamheden. Na intake geven we duidelijkheid."
          },
          {
            question: "Krijg ik advies voor vervolg?",
            answer: "Ja. We geven aan wat direct nodig is en wat later kan."
          }
        ]}
      />
      <Footer />
    </main>
  );
}
