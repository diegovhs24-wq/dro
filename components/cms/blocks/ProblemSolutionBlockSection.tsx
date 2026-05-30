import Link from "next/link";
import {resolveSmartLink} from "@/lib/smartLink";
import type {ProblemSolutionContent} from "@/lib/types";

type ProblemSolutionBlock = ProblemSolutionContent;

export default function ProblemSolutionBlockSection({ content }: { content: ProblemSolutionBlock }) {
  const bannerLink = resolveSmartLink(content.bannerButtonLink);
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-black/10 bg-brand-soft p-7 transition duration-300 hover:-translate-y-1">
            <p className="eyebrow text-neutral-500">{content.problemEyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{content.problemTitle}</h2>
            <ul className="mt-7 grid gap-4 text-neutral-700">
              {content.problems.map((item) => (
                <li className="flex items-start gap-4" key={item}>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/10 text-sm font-extrabold text-neutral-500">
                    X
                  </span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-brand-orange/20 bg-white p-7 shadow-premium transition duration-300 hover:-translate-y-1">
            <p className="eyebrow">{content.solutionEyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
              {content.solutionTitle}
            </h2>
            <ul className="mt-7 grid gap-4 text-neutral-700">
              {content.solutions.map((item) => (
                <li className="flex items-start gap-4" key={item}>
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-extrabold text-white">
                    ✓
                  </span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 rounded-lg bg-brand-soft p-5 text-base font-bold leading-7 text-brand-ink">
              {content.solutionNote}
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-lg bg-neutral-950 p-6 text-white sm:flex-row sm:items-center">
          <h3 className="text-xl font-bold sm:text-2xl">{content.bannerTitle}</h3>
          <Link
            className="btn-primary shrink-0"
            href={bannerLink.href}
            target={bannerLink.openInNewTab ? "_blank" : undefined}
            rel={bannerLink.openInNewTab ? "noopener noreferrer" : undefined}
          >
            {content.bannerButtonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
