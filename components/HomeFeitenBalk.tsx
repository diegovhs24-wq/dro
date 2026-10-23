import {getSiteSettings} from "@/lib/cms";
import {getReviewSnapshot} from "@/lib/seo/business";

// Feitenbalk: alleen geverifieerde feiten (lib/seo/business.ts). "35+ vakmensen"
// is verwijderd tot er een bron voor is; "VLOK" is vervangen door VCA plus
// verzekering, omdat VLOK een airco/warmtepomp-erkenning is en hier als
// algemene bouwerkenning gelezen werd (zie docs/audit/04).
export default async function HomeFeitenBalk() {
  const siteSettings = await getSiteSettings();
  const reviews = getReviewSnapshot(siteSettings.organizationSeo);
  const rating = reviews.ratingValue;
  const reviewCount = reviews.reviewCount;

  const feiten = [
    {v: `${rating.toString().replace(".", ",")} / 5`, k: `${reviewCount} Google-reviews`},
    {v: "SBB", k: "Erkend leerbedrijf"},
    {v: "VCA", k: "Gecertificeerd, CAR-verzekerd"},
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
