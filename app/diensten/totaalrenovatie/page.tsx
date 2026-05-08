import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Totaalrenovatie woning Den Haag | DRO Renovaties",
  description:
    "Totaalrenovatie van woningen in Den Haag met structuur, planning en begeleiding van A tot Z."
};

export default function TotaalrenovatiePage() {
  return (
    <main>
      <Header />
      <ServicePage
        eyebrow="Totaalrenovatie"
        title="Totaalrenovatie woning Den Haag"
        intro="Complete woningrenovatie met één planning, één aanspreekpunt en vaste uitvoering."
        sections={[
          {
            title: "Werkzaamheden",
            items: [
              "Complete sloop",
              "Nieuwe indeling",
              "Elektra en installaties",
              "Afbouw en afwerking"
            ]
          },
          {
            title: "Voor wie",
            items: ["Nieuwe woningkopers", "Beleggers", "Complete upgrades"]
          },
          {
            title: "Zekerheid in uitvoering",
            items: ["Eén aanspreekpunt", "Strakke fasering", "Heldere keuzes vooraf"]
          }
        ]}
        processTitle="Grip op planning en uitvoering."
        processText="Sloop, techniek en afbouw sluiten logisch op elkaar aan."
        situations={[
          {
            title: "Nieuwe woning",
            items: ["Voor sleuteloverdracht plannen", "Keuzes bundelen", "Sneller intrekken"]
          },
          {
            title: "Complete upgrade",
            items: ["Indeling verbeteren", "Installaties vernieuwen", "Afwerking strak trekken"]
          },
          {
            title: "Zakelijk bezit",
            items: ["Projectmatig uitvoeren", "Overzicht bewaren", "Herhaalbaar opleveren"]
          }
        ]}
        examples={["Sloop en techniek", "Afbouw per fase", "Oplevering per ruimte"]}
        faqs={[
          {
            question: "Hoe houden jullie een totaalrenovatie overzichtelijk?",
            answer: "We faseren het project en stemmen sloop, techniek en afbouw vooraf op elkaar af."
          },
          {
            question: "Kan ik vooraf keuzes maken?",
            answer: "Ja. Juist door keuzes vooraf te bundelen blijft de uitvoering rustiger."
          },
          {
            question: "Werken jullie met vaste teams?",
            answer: "Ja. Dat zorgt voor korte lijnen en controle op kwaliteit."
          },
          {
            question: "Kan dit voor een aangekochte woning?",
            answer: "Ja. We helpen vaak woningkopers die direct goed willen starten."
          },
          {
            question: "Hoe wordt communicatie geregeld?",
            answer: "U heeft één aanspreekpunt dat planning en updates bewaakt."
          },
          {
            question: "Doen jullie ook de afwerking?",
            answer: "Ja. Van voorbereiding tot eindafwerking kan onder één traject vallen."
          }
        ]}
      />
      <Footer />
    </main>
  );
}
