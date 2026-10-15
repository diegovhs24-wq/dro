import type {GoogleReview} from "@/lib/googleReviews";

function Stars({rating}: {rating: number}) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div aria-label={`${filled} van 5 sterren`} className="flex gap-0.5 text-[#fbbc05]" role="img">
      {Array.from({length: 5}).map((_, index) => (
        <span aria-hidden="true" className={`text-lg leading-none ${index < filled ? "" : "text-neutral-300"}`} key={index}>
          ★
        </span>
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

// Reviewtekst wordt ongewijzigd getoond en is als Google-review herkenbaar
// gemaakt, met een link naar het profiel (Google-weergaverichtlijnen).
export default function GoogleReviewCards({
  reviews,
  profileUrl,
}: {
  reviews: GoogleReview[];
  profileUrl?: string;
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-brand-soft py-14 sm:py-20" id="reviews">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Google reviews</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
              Wat klanten schrijven.
            </h2>
          </div>
          <p className="text-sm font-semibold text-neutral-500">Reviews van Google, ongewijzigd weergegeven.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure className="flex flex-col rounded-lg border border-black/10 bg-white p-6 shadow-sm" key={review.id}>
              <div className="flex items-center gap-3">
                {review.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                    height={44}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    src={review.photoUrl}
                    width={44}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-orange text-sm font-bold text-white"
                  >
                    {initials(review.authorName)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold text-brand-ink">{review.authorName}</p>
                  {review.relativeTime ? <p className="text-xs font-semibold text-neutral-500">{review.relativeTime}</p> : null}
                </div>
              </div>
              <div className="mt-4">
                <Stars rating={review.rating} />
              </div>
              <blockquote className="mt-3 flex-1 text-[15px] leading-7 text-neutral-700">{review.text}</blockquote>
            </figure>
          ))}
        </div>

        {profileUrl ? (
          <p className="mt-8">
            <a
              className="text-sm font-bold text-brand-orange underline-offset-4 hover:underline"
              href={profileUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Lees alle reviews op Google
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
