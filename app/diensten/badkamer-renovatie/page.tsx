import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Badkamer renovatie Den Haag | DRO Renovaties",
  description:
    "Badkamer renovatie in Den Haag met duidelijke planning, gestructureerde uitvoering en professionele begeleiding door DRO Renovaties."
};

export default function BadkamerRenovatiePage() {
  return (
    <main>
      <Header />
      <ServicePage
        eyebrow="Badkamer renovatie"
        title="Badkamer renovatie Den Haag | DRO Renovaties"
        intro="Strakke badkamer renovatie met duidelijke planning, vaste coördinatie en nette oplevering."
        sections={[
          {
            title: "Wat wij verzorgen",
            items: [
              "Sloopwerk en afvoer",
              "Leidingwerk",
              "Elektra en verlichting",
              "Tegelwerk en sanitair"
            ]
          },
          {
            title: "Voor wie",
            items: [
              "Particuliere woningbezitters",
              "Nieuw gekochte woningen",
              "Verouderde badkamers"
            ]
          },
          {
            title: "Waarom DRO",
            items: ["Alles onder één dak", "Heldere communicatie", "Ervaren vakmensen"]
          }
        ]}
        processTitle="Van intake tot oplevering geregeld."
        processText="Wensen, techniek en planning worden vooraf afgestemd."
        situations={[
          {
            title: "Compacte badkamer",
            items: ["Slimme indeling", "Praktische opbergruimte", "Heldere materiaalkeuzes"]
          },
          {
            title: "Luxe afwerking",
            items: ["Inbouwkranen", "Nis en verlichting", "Strak tegelwerk"]
          },
          {
            title: "Nieuwe woning",
            items: ["Vooraf plannen", "Keuzes bundelen", "Snel woonklaar"]
          }
        ]}
        examples={["Techniek voorbereiden", "Tegelwerk en sanitair", "Detailcontrole"]}
        faqs={[
          {
            question: "Hoe begint een badkamerrenovatie?",
            answer: "We bespreken wensen, bekijken de ruimte en stemmen techniek, indeling en materiaalkeuzes af."
          },
          {
            question: "Regelen jullie sloop en afvoer?",
            answer: "Ja. De bestaande badkamer wordt netjes verwijderd en afgevoerd."
          },
          {
            question: "Wie coördineert de verschillende vakmensen?",
            answer: "Wij doen de coördinatie. U heeft één aanspreekpunt."
          },
          {
            question: "Kan ik sanitair zelf kiezen?",
            answer: "Ja. We denken mee en stemmen keuzes technisch af voordat we starten."
          },
          {
            question: "Wordt alles waterdicht gecontroleerd?",
            answer: "Ja. Leidingen, kitwerk en natte zones krijgen extra aandacht."
          },
          {
            question: "Wanneer is de badkamer klaar voor gebruik?",
            answer: "Dat stemmen we vooraf af op basis van scope, materiaalkeuzes en planning."
          }
        ]}
      />
      <Footer />
    </main>
  );
}
