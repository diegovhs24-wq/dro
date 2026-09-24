import Image from "next/image";
import Link from "next/link";
import {resolveSmartLink} from "@/lib/smartLink";
import type {FeaturedProjectsBlock} from "@/lib/cms";
import {cmsImageUrl} from "@/lib/sanity";

export default function FeaturedProjectsBlockSection({block}: {block: FeaturedProjectsBlock}) {
  const projects = block.projects ?? [];
  const viewAllLink = resolveSmartLink(block.viewAllLink);

  if (!projects.length) return null;

  return (
    <section className="py-24 sm:py-28" id="projecten">
      <div className="section-shell">
        <div className="mb-16 max-w-[600px] sm:mb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">{block.eyebrow || "Recent werk"}</p>
          {block.title ? (
            <h2 className="mt-4 text-[27px] font-semibold leading-[1.18] tracking-[-0.02em] sm:text-[38px]">{block.title}</h2>
          ) : null}
          <p className="mt-4 text-[16.5px] text-brand-stone">Echte woningen en echte opdrachtgevers, van eerste gesprek tot oplevering.</p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {projects.map((project) => {
            const image = cmsImageUrl(project.afterImage as never) ?? cmsImageUrl(project.beforeImage as never) ?? "";
            const meta = [project.type, project.location].filter(Boolean).join(" · ");
            return (
              <Link className="group" href={`/projecten/${project.slug}`} key={project.slug}>
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft-deep">
                  {image ? (
                    <Image
                      alt={project.description || project.title || ""}
                      className="object-cover object-center saturate-[0.92] transition duration-300 group-hover:saturate-100"
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      src={image}
                    />
                  ) : null}
                </div>
                {meta ? <p className="mb-2.5 mt-5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-brand-stone">{meta}</p> : null}
                <h3 className="font-serif text-[19.5px] italic leading-[1.5] text-brand-ink">{project.description || project.title}</h3>
                <span className="mt-3 inline-block border-b border-brand-line pb-0.5 text-sm font-medium text-brand-ink transition group-hover:border-brand-orange">
                  Lees het verhaal
                </span>
              </Link>
            );
          })}
        </div>

        {block.viewAllLink && block.viewAllLabel ? (
          <div className="mt-16">
            <Link className="border-b border-brand-line pb-0.5 text-[14.5px] font-medium text-brand-ink transition hover:border-brand-orange" href={viewAllLink.href}>
              {block.viewAllLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
