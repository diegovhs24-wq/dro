import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Warmtepomp installatie | DRO Renovaties",
  description:
    "Warmtepomp installatie met advies, aansluiting, integratie en oplevering binnen een gestructureerd traject."
};

export default function WarmtepompPage() {
  return (
    <main>
      <Header />
      <ServicePage
        eyebrow="Warmtepomp"
        title="Warmtepomp installatie"
        intro="Warmtepomp installatie met advies, aansluiting en duidelijke oplevering."
        sections={[
          {
            title: "Wat wij doen",
            items: [
              "Advies en selectie systeem",
              "Installatie en aansluiting",
              "Integratie met bestaande installaties",
              "Inregelen en oplevering"
            ]
          },
          {
            title: "Onderdeel van een totaaloplossing",
            items: [
              "Afstemming met renovatie of afbouw",
              "Technische voorbereiding",
              "Controle op werking en oplevering"
            ]
          }
        ]}
        processTitle="Goed afgestemd."
        processText="Systeemkeuze, aansluiting en werking worden gecontroleerd."
        situations={[
          {
            title: "Hybride systeem",
            items: ["Bij bestaande ketel", "Stap naar verduurzaming", "Praktische overgang"]
          },
          {
            title: "All-electric",
            items: ["Volledig elektrisch", "Goede isolatie nodig", "Voorbereiding belangrijk"]
          },
          {
            title: "Renovatie",
            items: ["Afstemmen met installaties", "Ruimte en geluid beoordelen", "Netjes integreren"]
          }
        ]}
        examples={["Advies en selectie", "Installatie en aansluiting", "Inregelen en uitleg"]}
        faqs={[
          {
            question: "Welke warmtepomp past bij mijn woning?",
            answer: "Dat hangt af van isolatie, huidige installatie, ruimte en energiebehoefte."
          },
          {
            question: "Kijken jullie naar bestaande installaties?",
            answer: "Ja. We controleren hoe het systeem kan worden geïntegreerd."
          },
          {
            question: "Is een warmtepomp altijd geschikt?",
            answer: "Niet altijd. Daarom beoordelen we de woning eerst zorgvuldig."
          },
          {
            question: "Regelen jullie inregelen en oplevering?",
            answer: "Ja. Het systeem wordt ingesteld en gecontroleerd op werking."
          },
          {
            question: "Kan dit samen met vloerverwarming?",
            answer: "Ja. Die combinatie wordt vaak samen bekeken voor een efficiënt systeem."
          },
          {
            question: "Krijg ik uitleg over gebruik?",
            answer: "Ja. Bij oplevering leggen we de basisinstellingen en aandachtspunten uit."
          }
        ]}
      />
      <Footer />
    </main>
  );
}
