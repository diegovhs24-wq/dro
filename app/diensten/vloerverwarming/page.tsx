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
        intro="Vloerverwarming zorgt voor comfort, een gelijkmatige warmteverdeling en een efficiënter energiegebruik. Wij verzorgen de complete aanleg, afgestemd op uw woning en situatie."
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
        processTitle="Correct aangelegd en klaar voor gebruik."
        processText="Wij zorgen dat het systeem correct wordt aangelegd en direct klaar is voor gebruik."
      />
      <Footer />
    </main>
  );
}
