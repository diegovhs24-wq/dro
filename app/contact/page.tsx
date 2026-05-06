import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact renovatiebedrijf Den Haag | DRO Renovaties",
  description:
    "Start uw renovatieaanvraag bij DRO Renovaties en ontvang binnen 24 uur duidelijkheid over mogelijkheden, planning en vervolgstappen."
};

export default function ContactPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Contact"
        title="Start uw renovatieaanvraag."
        text="Vertel ons wat u wilt verbouwen. Wij nemen contact op met een eerste inschatting en duidelijke vervolgstap."
      />
      <LeadForm />
      <Footer />
    </main>
  );
}
