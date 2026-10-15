import {formatRating} from "@/lib/googleReviews";

export default function StatsBand({rating, total}: {rating: number; total: number}) {
  const stats = [
    {value: formatRating(rating), label: "gemiddelde beoordeling"},
    {value: String(total), label: "reviews op Google"},
    {value: "5+", label: "jaar ervaring"},
    {value: "Vaste prijs", label: "zonder aanbetaling"},
  ];

  return (
    <section className="bg-brand-ink py-10 text-white sm:py-12">
      <div className="section-shell grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold leading-none tracking-tight sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-white/65">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
