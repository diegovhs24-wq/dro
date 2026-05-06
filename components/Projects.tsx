import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/components/projectData";

export default function Projects() {
  return (
    <section className="bg-brand-soft py-24" id="projecten">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Projecten</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Werk dat rust en vertrouwen uitstraalt.
            </h2>
          </div>
          <a className="text-sm font-bold text-brand-orange hover:text-brand-ink" href="/projecten">
            Bekijk alle projecten
          </a>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
