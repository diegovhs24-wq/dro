import Link from "next/link";

import {resolveSmartLink} from "@/lib/smartLink";
import type {SplitIntroContent} from "@/lib/types";

function InlineNote({
  prefix,
  linkLabel,
  href,
  openInNewTab,
  suffix,
}: {
  prefix?: string;
  linkLabel?: string;
  href?: string;
  openInNewTab?: boolean;
  suffix?: string;
}) {
  if (!prefix && !linkLabel && !suffix) return null;

  return (
    <p className="text-[15px] font-medium leading-6 text-muted-slate">
      {prefix ? <span>{prefix} </span> : null}
      {linkLabel && href ? (
        <Link
          className="font-semibold text-brand-ink underline decoration-brand-orange underline-offset-4 transition hover:text-brand-orange"
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
        >
          {linkLabel}
        </Link>
      ) : null}
      {suffix ? <span>{linkLabel && href ? ` ${suffix}` : suffix}</span> : null}
    </p>
  );
}

export default function SplitIntroBlockSection({
  content,
}: {
  content: SplitIntroContent;
}) {
  const primary = resolveSmartLink(content.primaryButtonLink);
  const secondary = resolveSmartLink(content.secondaryNoteLink);

  return (
    <section className="bg-[#f7f3ec]/75 border-b border-black/5 pt-10 sm:pt-14">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="max-w-3xl">
            {content.eyebrow ? <p className="eyebrow-slate">{content.eyebrow}</p> : null}

            <h1 className="mt-4 text-4xl font-bold  tracking-[-0.03em] leading-tight  text-brand-ink text-[38px] lg:text-[56px] max-w-[500px">
              {content.titlePrefix ? <span>{content.titlePrefix} </span> : null}
              {content.titleHighlight ? <span className="text-brand-orange">{content.titleHighlight}</span> : null}
              {content.titleSuffix ? <span>{content.titleHighlight ? " " : ""}{content.titleSuffix}</span> : null}
            </h1>

            {content.description ? (
              <p className="mt-6 max-w-2xl text-base font-normal leading-7 text-deep-slate sm:text-lg">
                {content.description}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              {content.primaryButtonLabel ? (
                <Link
                  className="btn-primary "
                  href={primary.href}
                  target={primary.openInNewTab ? "_blank" : undefined}
                  rel={primary.openInNewTab ? "noopener noreferrer" : undefined}
                >
                  {content.primaryButtonLabel}
                </Link>
              ) : null}

              <InlineNote
                prefix={content.secondaryNotePrefix}
                linkLabel={content.secondaryNoteLinkLabel}
                href={secondary.href !== "#" ? secondary.href : undefined}
                openInNewTab={secondary.openInNewTab}
                suffix={content.secondaryNoteSuffix}
              />
            </div>
          </div>

          <div className="lg:justify-self-end lg:pl-4">
            <div className="relative overflow-hidden rounded-[1.25rem] border border-black/10 bg-brand-soft shadow-premium">
              <div
                className="min-h-[320px] bg-cover bg-center sm:min-h-[420px] lg:min-h-[620px] lg:min-w-[460px]"
                style={{backgroundImage: `url(${content.image})`}}
              />
              {content.imageCaption ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
                  <p className="text-xs font-semibold text-white/85 sm:text-sm">{content.imageCaption}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
