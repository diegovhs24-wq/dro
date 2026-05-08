import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Vloerverwarming laten aanleggen | DRO Renovaties",
  description:
    "Vloerverwarming laten aanleggen als onderdeel van een strak begeleid renovatie- of afbouwtraject."
};

export default function VloerverwarmingPage() {
  return (
    <main>
      <Header />
      <ServicePage
        eyebrow="Vloerverwarming"
        title="Vloerverwarming laten aanleggen"
        intro="Vloerverwarming netjes aangelegd als onderdeel van een strak renovatietraject."
        sections={[
          {
            title: "Wat wij doen",
            items: [
              "Frezen of opbouw systeem",
              "Aansluiten op bestaande installatie",
              "Verdeler plaatsen",
              "Testen en afstellen"
            ]
          },
          {
            title: "Onderdeel van een totaaloplossing",
            items: [
              "Afstemming met vloeropbouw",
              "Technische controle vooraf",
              "Heldere planning met de rest van het project"
            ]
          }
        ]}
        processTitle="Correct aangelegd."
        processText="Het systeem wordt afgestemd, getest en netjes opgeleverd."
        situations={[
          {
            title: "Fermacell",
            items: ["Bij droge opbouw", "Laag gewicht", "Snel verder afwerken"]
          },
          {
            title: "Op netten",
            items: ["Bij nieuwe vloeropbouw", "Sterke verdeling", "Geschikt voor grotere ruimtes"]
          },
          {
            title: "Infrezen",
            items: ["Bij bestaande dekvloer", "Beperkte opbouwhoogte", "Snel en netjes uitgevoerd"]
          }
        ]}
        examples={["Vloeropbouw bepalen", "Verdeler plaatsen", "Testen en afstellen"]}
        faqs={[
          {
            question: "Welke methode past bij mijn woning?",
            answer: "Dat hangt af van de vloeropbouw, hoogte en bestaande installatie. We beoordelen dit vooraf."
          },
          {
            question: "Kan vloerverwarming in een bestaande woning?",
            answer: "Ja, vaak via infrezen of een dun opbouwsysteem. We kijken wat technisch logisch is."
          },
          {
            question: "Stemmen jullie dit af met de vloer?",
            answer: "Ja. Vloerverwarming en vloerafwerking worden samen bekeken."
          },
          {
            question: "Wordt het systeem getest?",
            answer: "Ja. We testen en stellen het systeem af voor oplevering."
          },
          {
            question: "Kan dit onderdeel zijn van een renovatie?",
            answer: "Ja. Dan plannen we het logisch in met sloop, afbouw en vloerwerk."
          },
          {
            question: "Krijg ik uitleg bij oplevering?",
            answer: "Ja. We leggen uit hoe het systeem werkt en waar u op moet letten."
          }
        ]}
      />
      <Footer />
    </main>
  );
}
