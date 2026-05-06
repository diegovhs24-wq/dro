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
        intro="Goed onderhoud voorkomt problemen en verlengt de levensduur van uw woning. Wij voeren onderhoud en herstelwerk professioneel en efficiënt uit."
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
        processTitle="Uw woning netjes in goede staat."
        processText="Wij zorgen dat uw woning in goede staat blijft en problemen tijdig worden aangepakt."
      />
      <Footer />
    </main>
  );
}
