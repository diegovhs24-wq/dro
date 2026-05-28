import GoogleRatingBadge from "@/components/GoogleRatingBadge";
import SketchIcon from "@/components/SketchIcon";
import type {ReviewItem} from "@/lib/types";

type GoogleReviewsProps = {
  reviews: ReviewItem[];
  compact?: boolean;
  limit?: number;
  title?: string;
  text?: string;
};

export default function GoogleReviews({
  reviews,
  compact = false,
  limit = 4,
  title = "273+ recensies",
  text = "Klanten waarderen vooral onze duidelijke communicatie, nette uitvoering en vaste aanspreekpunt.",
}: GoogleReviewsProps) {
  const visibleReviews = reviews.slice(0, limit);

  return (
    <section className={compact ? "bg-white py-10" : "bg-white py-14 sm:py-16"}>
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Google reviews</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <GoogleRatingBadge compact />
              <h2 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                {title}
              </h2>
            </div>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-neutral-600">
            {text}
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleReviews.map((review) => (
            <figure
              className="rounded-lg border border-black/10 bg-brand-soft p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-premium"
              key={`${review.name}-${review.location}`}
            >
              <div className="flex items-center gap-3">
                <img
                  alt={`${review.name} Google review`}
                  className="h-11 w-11 rounded-full object-cover"
                  src={review.image}
                />
                <figcaption>
                  <p className="font-bold text-brand-ink">{review.name}</p>
                  <p className="text-xs font-semibold text-neutral-500">
                    {review.location}
                  </p>
                </figcaption>
              </div>
              <div className="mt-4 flex gap-1 text-brand-orange" aria-label="5 sterren">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SketchIcon key={index} name="quality" className="h-4 w-4" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm font-semibold leading-6 text-neutral-700">
                “{review.quote}”
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
