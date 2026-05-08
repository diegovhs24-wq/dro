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
        intro="Strakke wanden, plafonds en schilderwerk met gecontroleerde afwerking."
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
        processTitle="Afwerking met controle."
        processText="Voorbereiding, bescherming en eindcontrole horen bij het proces."
        situations={[
          {
            title: "Nieuw stucwerk",
            items: ["Strakke ondergrond", "Wanden en plafonds", "Klaar voor afwerking"]
          },
          {
            title: "Schilderwerk",
            items: ["Binnen en buiten", "Nette voorbereiding", "Duurzame lagen"]
          },
          {
            title: "Renovatie-afwerking",
            items: ["Herstel meenemen", "Details strak trekken", "Rustig eindbeeld"]
          }
        ]}
        examples={["Ondergrond voorbereiden", "Strak afwerken", "Eindcontrole"]}
        faqs={[
          {
            question: "Doen jullie stuc- en schilderwerk samen?",
            answer: "Ja. Daardoor sluiten voorbereiding en afwerking beter op elkaar aan."
          },
          {
            question: "Wordt de woning beschermd?",
            answer: "Ja. We beschermen vloeren, kozijnen en andere onderdelen waar nodig."
          },
          {
            question: "Kunnen jullie beschadigingen herstellen?",
            answer: "Ja. Kleine herstelpunten nemen we mee in de voorbereiding."
          },
          {
            question: "Is dit onderdeel van totaalrenovatie?",
            answer: "Ja. Afwerking is vaak de laatste fase van het traject."
          },
          {
            question: "Hoe bewaken jullie kwaliteit?",
            answer: "We controleren ondergrond, lagen en details voor oplevering."
          },
          {
            question: "Stemmen jullie kleuren en afwerking af?",
            answer: "Ja. Keuzes worden vooraf afgestemd zodat de uitvoering helder blijft."
          }
        ]}
      />
      <Footer />
    </main>
  );
}
