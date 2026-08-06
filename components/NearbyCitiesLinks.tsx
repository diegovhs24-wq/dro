import Link from "next/link";
import type { NearbyLocation } from "@/lib/types";

type NearbyCitiesLinksProps = {
  cities: NearbyLocation[];
  serviceSlug?: string;
  title?: string;
};

export default function NearbyCitiesLinks({
  cities,
  serviceSlug,
  title = "Ook actief in de omgeving",
}: NearbyCitiesLinksProps) {
  if (!cities.length) return null;

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="section-shell">
        <p className="eyebrow">Werkgebied</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">{title}</h2>
        <div className="mt-7 flex flex-wrap gap-3">
          {cities.map((city) => (
            <Link
              className="rounded-full border border-black/10 bg-brand-soft px-5 py-2.5 text-sm font-bold text-brand-ink transition hover:border-brand-orange hover:text-brand-orange"
              href={serviceSlug ? `/${city.slug}/${serviceSlug}` : `/${city.slug}`}
              key={city.slug}
            >
              {city.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
