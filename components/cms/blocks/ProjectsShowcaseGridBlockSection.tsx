import Image from "next/image";
import Link from "next/link";

import type {ProjectsShowcaseGridBlock} from "@/lib/cms";

function SectionLabel({
  sectionNumber,
  eyebrow,
}: {
  sectionNumber?: string;
  eyebrow?: string;
}) {
  if (!sectionNumber && !eyebrow) return null;

  return (
    <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
      {sectionNumber ? <span className="text-brand-orange">{sectionNumber}</span> : null}
      {eyebrow ? <span>{eyebrow}</span> : null}
    </p>
  );
}

export default function ProjectsShowcaseGridBlockSection({
  block,
}: {
  block: ProjectsShowcaseGridBlock;
}) {
  const projects = Array.isArray(block.projects) ? block.projects : [];

  if (!block.title || !block.intro || projects.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f3ec]/75 py-16 sm:py-20">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-20">
          <div className="max-w-3xl">
            <SectionLabel sectionNumber={block.sectionNumber} eyebrow={block.eyebrow} />
            <h2 className="mt-5 max-w-[440px] text-[28px] font-bold leading-[0.93] tracking-[-0.05em] text-brand-ink lg:text-[44px]">
              {block.title}
            </h2>
          </div>

          <div className="max-w-2xl pt-2 lg:pt-[5.6rem]">
            <p className="text-[16px] font-normal leading-[1.68] text-deep-slate">
              {block.intro}
            </p>
          </div>
        </div>

        <div className="mt-11 grid gap-7 lg:grid-cols-3">
          {projects.map((project, index) => {
            const image = project.afterImage || project.beforeImage;
            const mediaLabel = `Foto voor/na: ${project.type || project.title}`;
            const firstMeta = project.duration
              ? {label: "Duur", value: project.duration}
              : project.type
                ? {label: "Type", value: project.type}
                : null;
            const secondMeta = project.duration
              ? project.type
                ? {label: "Type", value: project.type}
                : project.location
                  ? {label: "", value: project.location}
                  : null
              : project.location
                ? {label: "", value: project.location}
                : null;
            const card = (
              <article className="overflow-hidden rounded-[1.45rem] border border-black/10 bg-white shadow-[0_10px_28px_rgba(17,17,17,0.05)]">
                <div className="relative min-h-[310px] overflow-hidden bg-[#ddd4c3] sm:min-h-[410px] lg:min-h-[320px] xl:min-h-[350px]">
                  {image ? (
                    <Image alt={mediaLabel} className="object-cover object-center" fill sizes="(min-width: 1024px) 33vw, 100vw" src={image} />
                  ) : null}
                  {mediaLabel ? (
                    <p className="absolute bottom-5 left-5 text-[12px] font-medium text-[rgb(124,118,106)] sm:bottom-6 sm:left-6 ">
                      {mediaLabel}
                    </p>
                  ) : null}
                </div>


                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  {project.title ? (
                    <h3 className="text-[18px] font-bold leading-[1.06] tracking-[-0.045em] text-brand-ink ">
                      {project.title}
                    </h3>
                  ) : null}

                  {(firstMeta || secondMeta) ? (
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-normal leading-7 text-[#697586] sm:text-[16px]">
                      {firstMeta ? (
                        <p>
                          {firstMeta.label ? <span>{firstMeta.label} </span> : null}
                          <span className="font-semibold text-brand-ink">{firstMeta.value}</span>
                        </p>
                      ) : null}
                      {secondMeta ? (
                        <p>
                          {secondMeta.label ? <span>{secondMeta.label} </span> : null}
                          <span className={secondMeta.label ? "font-bold text-brand-ink" : ""}>{secondMeta.value}</span>
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </article>
            );

            return project.slug ? (
              <Link
                aria-label={`Bekijk project ${project.title || index + 1}`}
                className="block transition duration-300 hover:-translate-y-1"
                href={`/projecten/${project.slug}`}
                key={`${project.slug}-${index}`}
              >
                {card}
              </Link>
            ) : (
              <div key={`${project.title}-${index}`}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
