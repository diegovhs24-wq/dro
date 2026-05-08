import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Contact renovatiebedrijf Den Haag | DRO Renovaties",
  description:
    "Start uw renovatieaanvraag bij DRO Renovaties en ontvang binnen 24 uur duidelijkheid over mogelijkheden, planning en vervolgstappen."
};

export default function ContactPage() {
  return (
    <main>
      <Header />
      <LeadForm />
      <Footer />
    </main>
  );
}
