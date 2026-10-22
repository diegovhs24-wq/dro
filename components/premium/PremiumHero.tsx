import Link from "next/link";
import type {ReactNode} from "react";

import {ProjectFigure, WHATSAPP_HREF} from "@/components/premium/blocks";
import {BUSINESS} from "@/lib/seo/business";
import type {ProjectItem} from "@/lib/types";

export type HeroFact = {term: string; detail: ReactNode};

// Hero: links de belofte en de feiten, rechts een echt project met maatlijn.
export default function PremiumHero({
  crumbs,
  title,
  lead,
  primary,
  facts,
  project,
  aside,
}: {
  crumbs?: Array<{name: string; href?: string}>;
  title: string;
  lead: string;
  primary: {label: string; href: string; cta: string};
  facts: HeroFact[];
  project?: ProjectItem;
  aside?: ReactNode;
}) {
  return (
    <section className="pr-kalk">
      <div className="section-shell grid gap-10 pb-14 pt-10 md:pt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pb-20">
        <div className="flex flex-col">
          {crumbs && crumbs.length > 1 && (
            <nav aria-label="Kruimelpad" className="text-[14px] pr-muted">
              {crumbs.map((c, i) => (
                <span key={c.name}>
                  {i > 0 && <span aria-hidden="true"> / </span>}
                  {c.href ? (
                    <Link className="hover:text-[var(--pr-ink)] hover:underline" href={c.href}>
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page">{c.name}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="pr-display mt-6 max-w-[15ch] lg:mt-10">{title}</h1>
          <p className="pr-lead mt-6">{lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" data-track="hero">
            <a className="pr-btn" data-cta={primary.cta} href={primary.href}>
              {primary.label}
            </a>
            <span className="text-[16px]">
              of bel{" "}
              <a className="pr-link pr-num" href={BUSINESS.phone.href}>
                {BUSINESS.phone.display}
              </a>
              <span className="pr-muted">
                , ook via{" "}
                <a className="underline underline-offset-4 hover:text-[var(--pr-ink)]" href={WHATSAPP_HREF} rel="noopener noreferrer" target="_blank">
                  WhatsApp
                </a>
              </span>
            </span>
          </div>

          <dl className="mt-auto grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--pr-line)] pt-6 lg:mt-14 xl:grid-cols-4">
            {facts.map((f) => (
              <div key={f.term}>
                <dt className="text-[14px] pr-muted">{f.term}</dt>
                <dd className="mt-1 text-[15px] font-semibold leading-snug pr-num">{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>{aside || (project ? <ProjectFigure priority project={project} width={1100} /> : null)}</div>
      </div>
    </section>
  );
}
