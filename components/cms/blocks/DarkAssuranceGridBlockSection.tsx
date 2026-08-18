import Link from "next/link";

import {resolveSmartLink} from "@/lib/smartLink";
import type {DarkAssuranceGridBlock} from "@/lib/cms";

export default function DarkAssuranceGridBlockSection({
  block,
}: {
  block: DarkAssuranceGridBlock;
}) {
  const items = Array.isArray(block.items) ? block.items : [];

  if (!block.title || items.length === 0) {
    return null;
  }

  const footerLink = block.footerButtonLabel && block.footerButtonLink ? resolveSmartLink(block.footerButtonLink) : null;

  return (
    <section className="bg-brand-ink py-24 text-brand-soft sm:py-28">
      <div className="section-shell">
        <div className="grid gap-10 border-b border-white/20 pb-16 sm:grid-cols-2 sm:gap-16">
          <div>
            {block.eyebrow ? <p className="text-sm font-medium text-white/45">{block.eyebrow}</p> : null}
            <h2 className="mt-4 max-w-[16ch] text-[28px] font-semibold leading-[1.18] tracking-[-0.02em] sm:text-[40px]">
              {block.title.split(/(\*[^*]+\*)/).map((part, index) =>
                part.startsWith("*") && part.endsWith("*") ? (
                  <em className="font-serif font-medium not-italic italic" key={index}>
                    {part.slice(1, -1)}
                  </em>
                ) : (
                  <span key={index}>{part}</span>
                ),
              )}
            </h2>
          </div>
          {block.intro ? <p className="self-end text-base leading-7 text-white/62 sm:text-[16.5px]">{block.intro}</p> : null}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
          {items.map((item, index) => (
            <article className="border-t border-white/20 pt-6" key={`${item.title}-${index}`}>
              {item.title ? <h3 className="text-[17px] font-semibold">{item.title}</h3> : null}
              {item.text ? <p className="mt-2.5 text-[14.5px] leading-6 text-white/60">{item.text}</p> : null}
            </article>
          ))}
        </div>

        {block.footerNote || footerLink ? (
          <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-white/20 pt-7">
            {block.footerNote ? <span className="font-serif text-[17px] italic text-white/65">{block.footerNote}</span> : <span />}
            {footerLink && block.footerButtonLabel ? (
              <Link
                className="rounded border border-white/50 px-7 py-3.5 text-[15px] font-medium text-white transition hover:bg-white hover:text-brand-ink"
                href={footerLink.href}
                target={footerLink.openInNewTab ? "_blank" : undefined}
              >
                {block.footerButtonLabel}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
