import Link from "next/link";

import {resolveSmartLink} from "@/lib/smartLink";
import type {ReviewShowcaseBlock} from "@/lib/cms";

function StarRow() {
  return (
    <div className="flex gap-1 text-brand-orange" aria-label="5 star review">
      {Array.from({length: 5}).map((_, index) => (
        <span aria-hidden="true" className="text-[12px] leading-none sm:text-[13px]" key={index}>
          {"\u2605"}
        </span>
      ))}
    </div>
  );
}

export default function ReviewShowcaseBlockSection({block}: {block: ReviewShowcaseBlock}) {
  const reviews = Array.isArray(block.selectedReviews) ? block.selectedReviews : [];
  const cta = resolveSmartLink(block.ctaLink);

  if (!block.title || reviews.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-black/10 bg-[#f7f3ec]/75 py-14 sm:py-16">
      <div className="section-shell">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {(block.sectionNumber || block.eyebrow) ? (
                <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
                  {block.sectionNumber ? <span className="text-brand-orange">{block.sectionNumber}</span> : null}
                  {block.eyebrow ? <span>{block.eyebrow}</span> : null}
                </p>
              ) : null}

              <h2 className="mt-2 max-w-lg text-[28px] font-bold leading-[0.96] tracking-[-0.04em] text-brand-ink sm:text-[34px]">
                {block.title}
              </h2>

              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                {typeof block.ratingValue === "number" ? (
                  <span className="text-[18px] font-bold leading-none tracking-[-0.03em] text-brand-ink sm:text-[20px]">
                    {block.ratingValue.toFixed(1)}
                  </span>
                ) : null}
                <StarRow />
                {block.reviewsSummary ? (
                  <p className="text-[13px] font-normal leading-6 text-neutral-500 ">
                    {block.reviewsSummary}
                  </p>
                ) : null}
              </div>
            </div>

            {block.ctaLabel && block.ctaLink ? (
              <Link
                className="text-[14px] font-semibold text-brand-ink underline decoration-brand-orange underline-offset-4 transition tracking-wide hover:text-brand-orange sm:text-[14px]"
                href={cta.href}
                target={cta.openInNewTab ? "_blank" : undefined}
                rel={cta.openInNewTab ? "noopener noreferrer" : undefined}
              >
                {block.ctaLabel}
              </Link>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <article
                className="flex min-h-[260px] flex-col rounded-[1.1rem] border border-black/10 bg-white px-5 py-5 shadow-sm sm:min-h-[280px] sm:px-6 sm:py-6"
                key={`${review.name}-${review.location}-${index}`}
              >
                <StarRow />
                <blockquote className="mt-4 max-w-[30ch] text-[15px] font-normal leading-[1.95] text-[#24324a] sm:text-[16px]">
                  {review.quote}
                </blockquote>
                <div className="mt-auto pt-8">
                  <div className="border-t border-black/10 pt-5">
                    <p className="text-[15px] font-bold text-brand-ink">{review.name}</p>
                    {review.location ? (
                      <p className="mt-1 text-[13px] font-normal text-muted-slate">
                        {review.location}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
