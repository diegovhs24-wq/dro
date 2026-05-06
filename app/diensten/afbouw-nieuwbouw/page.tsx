import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Afbouw nieuwbouwwoning | DRO Renovaties",
  description:
    "Volledige afbouw van nieuwbouwwoningen: vloeren, wanden, installaties en afwerking zodat u direct kunt wonen."
};

export default function AfbouwNieuwbouwPage() {
  return (
    <main>
      <Header />
      <ServicePage
        eyebrow="Afbouw nieuwbouw"
        title="Afbouw nieuwbouwwoning"
        intro="Wij verzorgen de volledige afbouw van nieuwbouwwoningen zodat u direct kunt wonen. Van casco oplevering naar een strak afgewerkte woning met duidelijke planning."
        sections={[
          {
            title: "Wat wij verzorgen",
            items: ["Wand- en plafondafwerking", "Vloeren", "Schilderwerk", "Verlichting", "Sanitair en keukenvoorbereiding"]
          },
          {
            title: "Voor wie",
            items: ["Nieuwbouwwoning eigenaren", "Kopers met casco oplevering", "Gezinnen die snel willen intrekken"]
          },
          {
            title: "Waarom dit werkt",
            items: ["Minder losse partijen", "Kortere doorlooptijd", "Duidelijke coördinatie"]
          }
        ]}
        processTitle="Van casco naar woonklaar met één planning."
        processText="We bepalen vooraf de scope, volgorde en afstemming tussen alle disciplines. Zo wordt de afbouw efficiënt en netjes uitgevoerd."
      />
      <Footer />
    </main>
  );
}
