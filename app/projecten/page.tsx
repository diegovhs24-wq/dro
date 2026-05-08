import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/components/projectData";

export const metadata: Metadata = {
  title: "Renovatie projecten | DRO Renovaties",
  description:
    "Bekijk renovatie projecten van DRO Renovaties met voor en na voorbeelden van badkamers, totaalrenovaties, uitbouwen en afbouw."
};

export default function ProjectenPage() {
  return (
    <main>
      <Header />
      <PageHero
        eyebrow="Projecten"
        title="Renovatieprojecten met zichtbaar resultaat."
        text="Bekijk hoe structuur, vakmanschap en duidelijke keuzes leiden tot renovaties die rust en kwaliteit uitstralen."
      />
      <section className="bg-brand-soft py-14 sm:py-16">
        <div className="section-shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      </section>
      <CTASection />
      <Footer />
    </main>
  );
}
