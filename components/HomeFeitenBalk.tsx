import {getSiteSettings} from "@/lib/cms";

// TODO: "35+ vakmensen", "VLOK" en "2e generatie familiebedrijf" hebben geen Sanity-bron,
// hardcoded conform het goedgekeurde prototype. Rating/aantal reviews komt wel uit
// siteSettings.organizationSeo (dezelfde bron als de JSON-LD structured data).
export default async function HomeFeitenBalk() {
  const siteSettings = await getSiteSettings();
  const rating = siteSettings.organizationSeo?.aggregateRatingValue ?? 4.8;
  const reviewCount = siteSettings.organizationSeo?.aggregateRatingCount ?? 273;

  const feiten = [
    {v: `${rating.toString().replace(".", ",")} / 5`, k: `${reviewCount} onafhankelijke Google-reviews`},
    {v: "35+", k: "Vakmensen in vaste teams"},
    {v: "VLOK", k: "Erkend en verzekerd"},
    {v: "2e generatie", k: "Familiebedrijf uit Den Haag"},
  ];

  return (
    <div className="border-b border-brand-line bg-brand-soft">
      <div className="section-shell grid grid-cols-2 gap-6 py-8 sm:grid-cols-4 sm:gap-4 sm:py-10">
        {feiten.map((feit) => (
          <div key={feit.k}>
            <div className="text-xl font-semibold tracking-[-0.01em] text-brand-ink sm:text-2xl">{feit.v}</div>
            <div className="mt-1 text-[13px] leading-5 text-brand-stone">{feit.k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
