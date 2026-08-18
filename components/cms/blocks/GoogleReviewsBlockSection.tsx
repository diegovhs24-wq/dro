import {getReviews, getSiteSettings} from "@/lib/cms";

type GoogleReviewsBlockSectionProps = {
  limit?: number;
  compact?: boolean;
};

export default async function GoogleReviewsBlockSection({limit = 3}: GoogleReviewsBlockSectionProps) {
  const [reviews, siteSettings] = await Promise.all([getReviews(), getSiteSettings()]);
  const visibleReviews = reviews.slice(0, limit);
  const rating = siteSettings.organizationSeo?.aggregateRatingValue ?? 4.8;
  const reviewCount = siteSettings.organizationSeo?.aggregateRatingCount ?? 273;

  if (!visibleReviews.length) return null;

  return (
    <section className="bg-brand-soft-deep py-24 sm:py-28">
      <div className="section-shell">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8 sm:mb-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">Wat opdrachtgevers zeggen</p>
            <p className="mt-3 text-[14.5px] text-brand-stone">
              <b className="font-semibold text-brand-ink">{rating.toString().replace(".", ",")} uit 5</b> op basis van {reviewCount} onafhankelijke Google-reviews
            </p>
          </div>
          <a className="border-b border-brand-line pb-0.5 text-[14.5px] font-medium text-brand-ink transition hover:border-brand-orange" href="https://www.google.com/search?q=DRO+Renovaties+reviews" rel="noopener noreferrer" target="_blank">
            Alle reviews op Google
          </a>
        </div>

        <div className="grid gap-11 sm:grid-cols-3">
          {visibleReviews.map((review) => (
            <div className="flex flex-col gap-5 border-t border-brand-ink pt-6" key={`${review.name}-${review.location}`}>
              <blockquote className="font-serif text-[19.5px] italic leading-[1.55] text-brand-ink-soft">{review.quote}</blockquote>
              <p className="mt-auto text-[13.5px] text-brand-stone">
                <b className="font-medium not-italic text-brand-ink">{review.name}</b> — {review.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
