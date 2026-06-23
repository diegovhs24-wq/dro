import type {CenteredActionBannerBlock} from "@/lib/cms";
import {resolveSmartLink} from "@/lib/smartLink";

export default function CenteredActionBannerBlockSection({
  block,
}: {
  block: CenteredActionBannerBlock;
}) {
  const primary = resolveSmartLink(block.primaryButtonLink);
  const secondary = resolveSmartLink(block.secondaryButtonLink);

  if (!block.title || !block.primaryButtonLabel || !block.secondaryButtonLabel) {
    return null;
  }

  return (
    <section className="border-t  border-black/10 bg-[#f7f3ec]/75 py-16 sm:py-20">
      <div className="section-shell">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="max-w-[350px] lg:max-w-[480px] text-[28px] font-bold leading-[0.93] tracking-[-0.05em] text-brand-ink sm:text-[44px]">
            {block.title}
          </h2>

          <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row sm:flex-wrap">
            <a
              className="inline-flex min-h-[64px] items-center justify-center rounded-[0.7rem] bg-brand-orange px-8 text-[16px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#d95f0f] sm:min-w-[272px]"
              href={primary.href}
              target={primary.openInNewTab ? "_blank" : undefined}
              rel={primary.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {block.primaryButtonLabel}
            </a>

            <a
              className="inline-flex min-h-[64px] items-center justify-center rounded-[0.7rem] border border-brand-ink/70 bg-transparent px-8 text-[16px] font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:bg-white/40 sm:min-w-[344px]"
              href={secondary.href}
              target={secondary.openInNewTab ? "_blank" : undefined}
              rel={secondary.openInNewTab ? "noopener noreferrer" : undefined}
            >
              {block.secondaryButtonLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
