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
        intro="Zonnepanelen veilig geplaatst, aangesloten en gecontroleerd opgeleverd."
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
        processTitle="Veilig geïnstalleerd."
        processText="Plaatsing, aansluiting en controle worden helder afgestemd."
        situations={[
          {
            title: "Schuin dak",
            items: ["Dakvlak beoordelen", "Montageplan maken", "Veilig installeren"]
          },
          {
            title: "Plat dak",
            items: ["Ballast en ligging", "Windbelasting checken", "Nette kabelroute"]
          },
          {
            title: "Meterkast",
            items: ["Aansluiting controleren", "Groep voorbereiden", "Veilig opleveren"]
          }
        ]}
        examples={["Dakinspectie", "Panelen plaatsen", "Aansluiten en controleren"]}
        faqs={[
          {
            question: "Bekijken jullie eerst het dak?",
            answer: "Ja. We kijken naar dakvlak, ligging, bereikbaarheid en veilige montage."
          },
          {
            question: "Wordt de meterkast meegenomen?",
            answer: "Ja. De aansluiting op de meterkast wordt gecontroleerd en afgestemd."
          },
          {
            question: "Kan dit tijdens een renovatie?",
            answer: "Ja. Dan plannen we dit logisch mee met andere werkzaamheden."
          },
          {
            question: "Hoe wordt kabelwerk weggewerkt?",
            answer: "We kiezen vooraf een nette en veilige kabelroute."
          },
          {
            question: "Controleren jullie na installatie?",
            answer: "Ja. We controleren plaatsing, aansluiting en werking."
          },
          {
            question: "Krijg ik uitleg bij oplevering?",
            answer: "Ja. We nemen de installatie en aandachtspunten kort met u door."
          }
        ]}
      />
      <Footer />
    </main>
  );
}
