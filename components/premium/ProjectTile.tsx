/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import {caseStudyFacts} from "@/lib/caseStudy";
import {cleanTitle, projectCover} from "@/lib/projectCategories";
import type {ProjectItem} from "@/lib/types";

export function sizedImage(url: unknown, width: number): string | undefined {
  // CMS-afbeeldingen zonder bestand komen soms als object door; die slaan we over.
  if (typeof url !== "string" || !url) return undefined;
  if (!url.includes("cdn.sanity.io")) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("w", String(width));
    u.searchParams.set("auto", "format");
    u.searchParams.set("q", "72");
    u.searchParams.set("fit", "max");
    return u.toString();
  } catch {
    return url;
  }
}

export default function ProjectTile({project, width = 900}: {project: ProjectItem; width?: number}) {
  const src = sizedImage(projectCover(project), width);
  const facts = project.caseStudy ? caseStudyFacts(project.caseStudy).filter((f) => f.label !== "Locatie").slice(0, 2) : [];
  return (
    <article className="group relative">
      <div className="overflow-hidden rounded-[4px] bg-[var(--pr-kalk)]">
        {src && (
          <img
            alt={`${cleanTitle(project.type)}, ${cleanTitle(project.location)}`}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.015]"
            decoding="async"
            loading="lazy"
            src={src}
          />
        )}
      </div>
      <h3 className="pr-h3 mt-4">
        <Link className="after:absolute after:inset-0 hover:underline" data-cta="project_open" href={`/projecten/${project.slug}`}>
          {cleanTitle(project.title)}
        </Link>
      </h3>
      <p className="mt-1 text-[15px] pr-muted pr-num">
        {[cleanTitle(project.type), project.duration ? cleanTitle(project.duration) : "", ...facts.map((f) => f.value)].filter(Boolean).join(", ")}
      </p>
      {project.caseStudy && <p className="mt-2 text-[14px] font-semibold text-[var(--pr-signal-dark)]">Uitgewerkte casestudy</p>}
    </article>
  );
}

