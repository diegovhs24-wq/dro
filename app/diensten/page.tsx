import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import { services } from "@/components/siteContent";

export const metadata: Metadata = {
  title: "Renovatie diensten Den Haag | DRO Renovaties",
  description:
    "Bekijk de diensten van DRO Renovaties: renovatie, afbouw, installaties, afwerking en onderhoud als onderdeel van een complete aanpak."
};

export default function DienstenPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Diensten"
        title="Complete renovaties met één duidelijk traject."
        text="DRO Renovaties is gespecialiseerd in complete renovaties en begeleidt projecten van eerste idee tot oplevering."
      />
      <section className="bg-brand-soft py-24">
        <div className="section-shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} {...service} />
          ))}
        </div>
      </section>
      <CTASection />
      <Footer />
    </main>
  );
}
