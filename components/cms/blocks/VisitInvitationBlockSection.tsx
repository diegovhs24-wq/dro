import Image from "next/image";
import Link from "next/link";

import {resolveSmartLink} from "@/lib/smartLink";
import type {VisitInvitationBlock} from "@/lib/cms";

export default function VisitInvitationBlockSection({
  block,
}: {
  block: VisitInvitationBlock;
}) {
  const primary = resolveSmartLink(block.primaryButtonLink);

  if (!block.title || !block.description) {
    return null;
  }

  return (
    <section className="bg-[#1a1b20] text-white">
      <div className="grid min-h-[540px] lg:grid-cols-[0.52fr_0.48fr]">
        <div className="flex">
          <div className="section-shell flex w-full items-center py-14 sm:py-16 lg:py-20">
            <div className="max-w-2xl">
              {(block.sectionNumber || block.eyebrow) ? (
                <p className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white">
                  {block.sectionNumber ? <span className="text-brand-orange">{block.sectionNumber}</span> : null}
                  {block.eyebrow ? <span>{block.eyebrow}</span> : null}
                </p>
              ) : null}

              <h2 className="mt-5 max-w-lg text-[28px] font-bold leading-[0.95] tracking-[-0.05em] text-white lg:text-[44px]">
                {block.title}
              </h2>

              <p className="mt-7 max-w-[500px] text-[16px] font-normal leading-[1.65] text-[rgb(157,155,148)] ">
                {block.description}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                {block.primaryButtonLabel ? (
                  <Link
                    className="inline-flex min-h-[62px] items-center justify-center rounded-xl bg-white px-7 text-[16px] font-semibold text-red-600 transition hover:-translate-y-0.5 hover:bg-[#f5f1eb]"
                    href={primary.href}
                    target={primary.openInNewTab ? "_blank" : undefined}
                    rel={primary.openInNewTab ? "noopener noreferrer" : undefined}
                  >
                    {block.primaryButtonLabel}
                  </Link>
                ) : null}

                {block.secondaryNote ? (
                  <p className="text-[15px] font-normal leading-7 text-[rgb(157,155,148)]">
                    {block.secondaryNote}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px] bg-[#2a261f]">
          {block.image ? (
            <Image alt={block.title} className="object-cover object-center" fill sizes="(min-width: 1024px) 48vw, 100vw" src={block.image} />
          ) : null}
          {block.imageCaption ? (
            <p className="absolute bottom-5 left-5 text-[13px] font-medium text-[#b7b39f] sm:bottom-6 sm:left-6">
              {block.imageCaption}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
