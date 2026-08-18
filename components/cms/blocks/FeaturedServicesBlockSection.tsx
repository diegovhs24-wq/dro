import Link from "next/link";
import {getServices} from "@/lib/cms";
import type {FeaturedServicesBlock} from "@/lib/cms";

// Sanity's service-document heeft geen categorieveld, dus de indeling in
// Wonen / Installaties / Afwerking (conform het prototype) is hier hardcoded
// op slug. Nieuwe diensten vallen tot verder onderhoud in geen enkele groep.
const SERVICE_GROUPS: {label: string; slugs: string[]}[] = [
  {label: "Wonen", slugs: ["totaalrenovatie", "badkamer-renovatie", "uitbouw-aanbouw", "afbouw-nieuwbouw"]},
  {label: "Installaties", slugs: ["vloerverwarming", "warmtepomp", "zonnepanelen"]},
  {label: "Afwerking", slugs: ["stuc-schilderwerk", "onderhoud"]},
];

export default async function FeaturedServicesBlockSection({block}: {block: FeaturedServicesBlock}) {
  const services = await getServices();
  const bySlug = new Map(services.map((service) => [service.slug, service]));

  return (
    <section className="border-t border-brand-line py-24 sm:py-28" id="diensten">
      <div className="section-shell grid gap-16 lg:grid-cols-[0.9fr_1.6fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">{block.eyebrow || "Diensten"}</p>
          {block.title ? (
            <h2 className="mt-4 text-[27px] font-semibold leading-[1.18] tracking-[-0.02em] sm:text-[38px]">{block.title}</h2>
          ) : null}
          <p className="mt-4 max-w-[34ch] text-[16.5px] text-brand-stone">
            Van complete renovaties tot de laatste laklaag, uitgevoerd door eigen vaste teams met interne prefabricage en vaste leveranciers.
          </p>
        </div>

        <div className="grid gap-12 sm:grid-cols-3">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.label}>
              <h4 className="border-b border-brand-ink pb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-brand-stone">{group.label}</h4>
              {group.slugs
                .map((slug) => bySlug.get(slug))
                .filter((service): service is NonNullable<typeof service> => Boolean(service))
                .map((service) => (
                  <Link
                    className="block border-b border-brand-line py-3.5 text-base text-brand-ink-soft transition hover:pl-1.5 hover:text-brand-ink"
                    href={service.href}
                    key={service.slug}
                  >
                    {service.title}
                  </Link>
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
