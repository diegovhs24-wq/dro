import GoogleRatingBadge from "@/components/GoogleRatingBadge";
import SmartButton from "@/components/SmartButton";
import type { CtaContent } from "@/lib/types";

type CTASectionProps = CtaContent;

export default function CTASection({
  eyebrow,
  title,
  text,
  buttons,
  ratingScore,
  ratingLabel,
}: CTASectionProps) {
  if (!title && !eyebrow && !text && !buttons?.length) return null;

  return (
    <section className="border-b border-white/10 bg-neutral-950 py-8 text-white sm:py-10">
      <div className="section-shell flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          )}
          {text && (
            <p className="mt-3 text-sm leading-6 text-white/65">{text}</p>
          )}
          {(ratingScore !== undefined || ratingLabel) && (
            <div className="mt-5">
              <GoogleRatingBadge compact variant="dark" ratingScore={ratingScore} ratingLabel={ratingLabel} />
            </div>
          )}
        </div>
        {buttons && buttons.length > 0 && (
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <SmartButton buttons={buttons} />
          </div>
        )}
      </div>
    </section>
  );
}
