import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Stuc- en schilderwerk | DRO Renovaties",
  description:
    "Professioneel stuc- en schilderwerk voor een strak, duurzaam en hoogwaardig eindresultaat."
};

export default function StucSchilderwerkPage() {
  return (
    <main>
      <Header />
      <ServicePage
        eyebrow="Afwerking"
        title="Stuc- en schilderwerk"
        intro="Een strakke afwerking bepaalt het eindresultaat van uw woning. Wij verzorgen professioneel stuc- en schilderwerk voor een duurzaam en strak resultaat."
        sections={[
          {
            title: "Wat wij doen",
            items: [
              "Wanden en plafonds stucen",
              "Glad pleisterwerk",
              "Schilderwerk binnen en buiten",
              "Afwerking tot in detail"
            ]
          },
          {
            title: "Onderdeel van een totaaloplossing",
            items: [
              "Afstemming met renovatieplanning",
              "Nette voorbereiding en bescherming",
              "Controle op eindafwerking"
            ]
          }
        ]}
        processTitle="Afwerking die jarenlang mooi blijft."
        processText="Wij zorgen voor een nette, duurzame afwerking die jarenlang mooi blijft."
      />
      <Footer />
    </main>
  );
}
