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
        intro="Van casco naar woonklaar met duidelijke planning en één uitvoerende partij."
        sections={[
          {
            title: "Wat wij verzorgen",
            items: ["Wanden en plafonds", "Vloeren", "Schilderwerk", "Sanitair en keukenvoorbereiding"]
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
        processTitle="Van casco naar woonklaar."
        processText="Scope, volgorde en disciplines worden vooraf vastgelegd."
        situations={[
          {
            title: "Casco oplevering",
            items: ["Volgorde bepalen", "Keuzes bundelen", "Snel woonklaar"]
          },
          {
            title: "Nieuwbouwwoning",
            items: ["Vloeren en wanden", "Installatie-afwerking", "Schilderklaar of woonklaar"]
          },
          {
            title: "Meerdere woningen",
            items: ["Herhaalbare aanpak", "Vaste teams", "Strakke oplevering"]
          }
        ]}
        examples={["Wanden en vloeren", "Installatie-afwerking", "Woonklaar opleveren"]}
        faqs={[
          {
            question: "Wat valt onder afbouw nieuwbouw?",
            answer: "Denk aan wanden, plafonds, vloeren, schilderwerk, installatie-afwerking en detailafwerking."
          },
          {
            question: "Kunnen jullie direct na sleuteloverdracht starten?",
            answer: "Als keuzes en planning vooraf rond zijn, kunnen we snel schakelen."
          },
          {
            question: "Coördineren jullie alle disciplines?",
            answer: "Ja. U heeft één aanspreekpunt voor de volledige afbouw."
          },
          {
            question: "Kan dit ook voor meerdere woningen?",
            answer: "Ja. We kunnen afbouw projectmatig en herhaalbaar uitvoeren."
          },
          {
            question: "Stemmen jullie materiaalkeuzes af?",
            answer: "Ja. Keuzes worden vooraf afgestemd op planning en uitvoering."
          },
          {
            question: "Hoe wordt opgeleverd?",
            answer: "We controleren per onderdeel en lopen de oplevering samen door."
          }
        ]}
      />
      <Footer />
    </main>
  );
}
