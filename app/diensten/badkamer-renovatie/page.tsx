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
        intro="Een badkamer renovatie is meer dan alleen tegels en sanitair. U wilt vooraf duidelijkheid over planning, uitvoering en het eindresultaat. Bij DRO Renovaties zorgen wij voor een complete en professionele aanpak, zonder verrassingen achteraf."
        sections={[
          {
            title: "Wat wij volledig verzorgen",
            items: [
              "Sloopwerk en afvoer",
              "Aanpassen van waterleidingen en afvoer",
              "Elektra en verlichting",
              "Tegelwerk voor vloer en wanden",
              "Installatie sanitair",
              "Kit- en afwerking"
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
        processTitle="Van intake tot oplevering gestructureerd geregeld."
        processText="We brengen wensen, technische aandachtspunten, materiaalkeuzes en planning vooraf in kaart. Daardoor weet u precies hoe het traject verloopt voordat we starten."
      />
      <Footer />
    </main>
  );
}
