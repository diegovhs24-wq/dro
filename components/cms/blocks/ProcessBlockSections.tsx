import Link from "next/link";
import {resolveSmartLink} from "@/lib/smartLink";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";
import type {IconTextItem, ProcessPageContent, SmartLink} from "@/lib/types";

function HandUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`absolute -bottom-1 left-0 h-3 w-full text-brand-orange ${className}`}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 160 14"
    >
      <path
        d="M3 9c35-7 83-6 154-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

function FlowLine() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-3 top-7 hidden h-[72%] w-[72px] text-brand-orange/70 lg:block"
      fill="none"
      viewBox="0 0 90 640"
    >
      <path
        d="M57 4C8 59 69 94 26 153C-3 194 68 236 34 290C5 337 67 370 27 429C-6 478 59 518 34 592"
        stroke="currentColor"
        strokeDasharray="8 12"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M30 151l-12 2 7 10M33 291l-12 4 8 9M31 592l-12 2 7 11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function SideArrow() {
  return (
    <svg
      aria-hidden="true"
      className="hidden h-8 w-20 text-brand-ink lg:block"
      fill="none"
      viewBox="0 0 110 46"
    >
      <path
        d="M5 29c23-13 50-16 86-10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
      <path
        d="M82 9l20 12-22 10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function NoteCard({ note }: { note: string }) {
  return (
    <div className="relative mt-5 max-w-[390px] rotate-[-1deg] border-2 border-brand-ink/70 bg-[#fffaf0] px-6 py-5 shadow-[8px_10px_0_rgba(17,17,17,0.06)]">
      <div className="absolute -top-4 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[-2deg] border border-black/20 bg-[#f4ead6]" />
      <div className="grid grid-cols-[48px_1fr] gap-4">
        <div className="grid h-11 w-11 place-items-center text-brand-ink">
          <SketchIcon name="quality" className="h-9 w-9" />
        </div>
        <p className="m-0 font-hand text-xl leading-snug text-brand-ink">
          {note}
        </p>
      </div>
      <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-brand-orange" />
    </div>
  );
}

function MultilineText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  );
}

type ProcessContent = Pick<
  ProcessPageContent,
  | "eyebrow"
  | "titlePrefix"
  | "titleHighlight"
  | "intro"
  | "note"
  | "sideNote"
  | "steps"
> & {
  benefits?: IconTextItem[];
  trustPoints?: IconTextItem[];
};

export function ProcessBlockSection({ content }: { content: ProcessContent }) {
  return (
    <>
      <section className="relative overflow-hidden bg-white py-6 lg:py-7">
        <div className="section-shell relative grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="pt-2">
            <p className="eyebrow">{content.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.04em] text-brand-ink sm:text-6xl lg:text-[64px]">
              {content.titlePrefix}{" "}
              <span className="relative inline-block">
                {content.titleHighlight}
                <HandUnderline />
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-base font-bold leading-7 text-neutral-600">
              <MultilineText text={content.intro} />
            </p>
            <NoteCard note={content.note} />
            <div className="mt-5 flex max-w-xl items-end gap-4">
              <div className="grid h-20 w-24 shrink-0 place-items-center text-brand-ink">
                <SketchIcon name="team" className="h-20 w-20" />
              </div>
              <SideArrow />
              <p className="mb-1 max-w-xs font-hand text-xl leading-snug text-brand-ink">
                {content.sideNote}
              </p>
            </div>
          </div>

          <div className="relative">
            <FlowLine />
            <div className="grid gap-0">
              {(content.steps || []).map((step, index) => (
                <div
                  className="grid items-center gap-3 rounded-none border-b border-black/5 py-1 sm:grid-cols-[100px_1fr] lg:grid-cols-[110px_1.05fr_86px_185px]"
                  key={step.title}
                >
                  <div className="hidden justify-center text-brand-ink sm:flex">
                    <div className="grid h-[86px] w-[86px] place-items-center">
                      <SketchIcon
                        name={step.icon as SketchIconName}
                        className="h-20 w-20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-[44px_1fr] gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-brand-orange font-hand text-2xl leading-none text-brand-orange">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="relative inline-block font-hand text-[32px] font-normal leading-none text-brand-ink">
                        {step.title}
                        <HandUnderline />
                      </h2>
                      <p className="mt-2 max-w-sm font-hand text-lg leading-snug text-brand-ink">
                        {step.text}
                      </p>
                    </div>
                  </div>
                  <SideArrow />
                  <p className="hidden max-w-[185px] font-hand text-lg leading-snug text-brand-ink lg:block">
                    {step.note}
                    <span className="mt-1 block h-1 w-24 rounded-full bg-brand-orange" />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {content.benefits && content.benefits.length > 0 && (
        <div className="section-shell mt-4">
          <div className="mx-auto grid max-w-6xl gap-0 border-2 border-brand-ink/70 bg-white shadow-[8px_10px_0_rgba(17,17,17,0.05)] sm:grid-cols-2 lg:grid-cols-5">
            {content.benefits.map((benefit, index) => (
              <div
                className={`flex items-center gap-3 px-4 py-3 ${index > 0 ? "border-t border-brand-ink/20 sm:border-l sm:border-t-0" : ""}`}
                key={benefit.title}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center text-brand-ink">
                  <SketchIcon
                    name={(benefit.icon || "tools") as SketchIconName}
                    className="h-8 w-8"
                  />
                </span>
                <p className="m-0 font-hand text-lg leading-tight text-brand-ink">
                  {benefit.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {content.trustPoints && content.trustPoints.length > 0 && (
        <section className="bg-white py-4">
          <div className="section-shell">
            <div className="grid gap-5 rounded-lg bg-brand-soft px-6 py-5 sm:grid-cols-3 lg:px-8">
              {content.trustPoints.map((point) => (
                <div className="flex gap-4" key={point.title}>
                  {point.logo ? (
                    <span className="mt-1 flex h-10 w-20 shrink-0 items-center">
                      <img
                        alt={`${point.title} logo`}
                        className="max-h-10 w-auto max-w-full object-contain"
                        src={point.logo}
                      />
                    </span>
                  ) : (
                    <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center text-brand-ink">
                      <SketchIcon
                        name={(point.icon || "quality") as SketchIconName}
                        className="h-8 w-8"
                      />
                    </span>
                  )}
                  <div>
                    <h2 className="text-base font-bold text-brand-ink">{point.title}</h2>
                    <p className="mt-1 text-sm font-medium leading-6 text-neutral-600">{point.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

type ProcessFaqContent = Pick<
  ProcessPageContent,
  "faqEyebrow" | "faqTitle" | "faqIntro" | "faqs"
>;

export function ProcessFaqBlockSection({
  content,
}: {
  content: ProcessFaqContent;
}) {
  return (
    <section className="bg-brand-soft py-10 sm:py-12">
      <div className="section-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{content.faqEyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            {content.faqTitle}
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-neutral-600">
            {content.faqIntro}
          </p>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(content.faqs || []).map((item) => (
            <details
              className="group rounded-lg bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-premium"
              key={item.question}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-bold leading-6 text-brand-ink">
                <span>{item.question}</span>
                <span className="text-brand-orange transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-4 grid gap-3 text-sm font-medium leading-7 text-neutral-600">
                {item.answer.split('\n\n').filter(Boolean).map((line, i) => (
                  <p className="m-0" key={i}>
                    {line}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

type ProcessIntakeBannerContent = {
  intakeBannerTitle?: string;
  intakeBannerText?: string;
  buttonLabel?: string;
  buttonLink?: SmartLink;
};

export function ProcessIntakeBannerBlockSection({
  content,
}: {
  content: ProcessIntakeBannerContent;
}) {
  const btnLink = resolveSmartLink(content.buttonLink);
  return (
    <div className="bg-brand-soft w-full">
      <div className="section-shell py-8 ">
        <div className="rounded-lg bg-neutral-950 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="text-2xl font-bold">{content.intakeBannerTitle}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-white/65">
              {content.intakeBannerText}
            </p>
          </div>
          <Link
            className="btn-primary mt-5 sm:mt-0"
            href={btnLink.href || "/contact"}
            target={btnLink.openInNewTab ? "_blank" : undefined}
            rel={btnLink.openInNewTab ? "noopener noreferrer" : undefined}
          >
            {content.buttonLabel || "Start intake"}
          </Link>
        </div>
      </div>
    </div>
  );
}
