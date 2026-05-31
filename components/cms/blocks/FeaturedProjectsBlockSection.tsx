import Link from "next/link";
import {resolveSmartLink} from "@/lib/smartLink";
import ProjectCard from "@/components/ProjectCard";
import type { FeaturedProjectsBlock } from "@/lib/cms";
import { cmsImageUrl } from "@/lib/sanity";

export default function FeaturedProjectsBlockSection({ block }: { block: FeaturedProjectsBlock }) {
  const projects = block.projects ?? [];
  const viewAllLink = resolveSmartLink(block.viewAllLink);

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {block.eyebrow ? <p className="eyebrow">{block.eyebrow}</p> : null}
            {block.title ? (
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                {block.title}
              </h2>
            ) : null}
          </div>
          {block.viewAllLink && block.viewAllLabel ? (
            <Link
              className="text-sm font-bold text-brand-orange transition hover:text-brand-ink"
              href={viewAllLink.href}
              target={viewAllLink.openInNewTab ? "_blank" : undefined}
              rel={viewAllLink.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {block.viewAllLabel}
            </Link>
          ) : null}
        </div>

        {projects.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                after={project.after}
                afterImage={cmsImageUrl(project.afterImage as never) ?? undefined}
                before={project.before}
                beforeImage={cmsImageUrl(project.beforeImage as never) ?? undefined}
                description={project.description}
                key={project.slug}
                slug={project.slug}
                title={project.title}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
