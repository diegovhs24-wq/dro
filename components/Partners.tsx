import { partnerLogos } from "@/components/siteContent";

export default function Partners() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Partners</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Vaste partners voor materiaal, sanitair en keukens.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-neutral-600">
            Wij werken met herkenbare leveranciers zodat keuzes, levertijden en kwaliteit beter te controleren zijn.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {partnerLogos.map((partner) => (
            <div
              className="flex min-h-28 items-center justify-center rounded-lg border border-black/10 bg-brand-soft p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium"
              key={partner.name}
            >
              {"image" in partner ? (
                <img alt={`${partner.name} logo`} className="max-h-16 w-auto max-w-full object-contain" src={partner.image} />
              ) : (
                <div className={`rounded-md px-5 py-3 text-xl font-extrabold tracking-tight ${partner.accent}`}>
                  {partner.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
