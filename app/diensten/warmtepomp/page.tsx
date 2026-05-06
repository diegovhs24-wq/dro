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
        intro="Steeds meer woningen stappen over op duurzame verwarmingssystemen. Wij begeleiden en installeren warmtepompen die passen bij uw woning en energiebehoefte."
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
        processTitle="Klaar voor de toekomst."
        processText="U krijgt een systeem dat efficiënt werkt en klaar is voor de toekomst."
      />
      <Footer />
    </main>
  );
}
