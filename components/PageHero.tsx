import Link from "next/link";
import {resolveSmartLink} from "@/lib/smartLink";
import GoogleRatingBadge from "@/components/GoogleRatingBadge";
import type {SmartLink} from "@/lib/types";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  text: string;
  /** Niet meer gebruikt: de hero volgt de huisstijl zonder stockfoto. */
  backgroundImage?: string;
  primaryLabel?: string;
  primaryLink?: SmartLink;
  secondaryLabel?: string;
  secondaryLink?: SmartLink;
};

export default function PageHero({
  eyebrow,
  title,
  text,
  primaryLabel = "Bespreek uw plannen",
  primaryLink,
  secondaryLabel = "Bespreek uw project met ons",
  secondaryLink,
}: PageHeroProps) {
  const primary = resolveSmartLink(primaryLink ?? {linkType: "internal", internalRef: {_type: "page", slug: "contact"}});
  const secondary = resolveSmartLink(secondaryLink ?? {linkType: "external", externalUrl: "tel:+31850871814"});
  return (
    <section className="hero-ref">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow-slate">{eyebrow}</p>
          <h1 className="hero-ref-title mt-5">{title}</h1>
          <p className="hero-ref-text mt-6 max-w-2xl">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              className="btn-primary"
              href={primary.href}
              target={primary.openInNewTab ? "_blank" : undefined}
              rel={primary.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {primaryLabel}
            </Link>
            <Link
              className="btn-outline"
              href={secondary.href}
              target={secondary.openInNewTab ? "_blank" : undefined}
              rel={secondary.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {secondaryLabel}
            </Link>
          </div>
          <div className="mt-6">
            <GoogleRatingBadge compact />
          </div>
        </div>
      </div>
    </section>
  );
}
