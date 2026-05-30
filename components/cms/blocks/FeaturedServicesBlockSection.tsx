import ServiceCard from "@/components/ServiceCard";
import type { FeaturedServicesBlock } from "@/lib/cms";
import { cmsImageUrl } from "@/lib/sanity";

export default function FeaturedServicesBlockSection({ block }: { block: FeaturedServicesBlock }) {
  const services = block.services ?? [];

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
          {block.viewAllHref && block.viewAllLabel ? (
            <a
              className="text-sm font-bold text-brand-orange transition hover:text-brand-ink"
              href={block.viewAllHref}
            >
              {block.viewAllLabel}
            </a>
          ) : null}
        </div>

        {services.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                href={service.href}
                icon={service.icon}
                image={cmsImageUrl(service.image as never) ?? ""}
                key={service.slug}
                label={service.label}
                summary={service.summary}
                title={service.title}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
