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
        intro="Een totaalrenovatie vraagt om structuur, planning en ervaring. Zonder goede begeleiding ontstaat snel onrust en vertraging. Wij begeleiden complete renovaties van A tot Z."
        sections={[
          {
            title: "Werkzaamheden",
            items: [
              "Complete sloop",
              "Nieuwe indeling",
              "Elektra vernieuwen",
              "Installaties",
              "Stucwerk en schilderwerk",
              "Vloeren"
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
        processTitle="Grip op keuzes, planning en uitvoering."
        processText="We werken met een helder traject waarin sloop, techniek, afbouw en oplevering logisch op elkaar aansluiten. U houdt één aanspreekpunt en duidelijke voortgang."
      />
      <Footer />
    </main>
  );
}
