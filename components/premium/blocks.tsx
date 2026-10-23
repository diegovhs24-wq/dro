/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type {ReactNode} from "react";

import SmartIntakeWizard, {type SmartIntakeProps} from "@/components/SmartIntakeWizard";
import type {AssuranceTopic} from "@/lib/assurances";
import {cleanTitle, projectCover} from "@/lib/projectCategories";
import {BUSINESS} from "@/lib/seo/business";
import type {ProjectItem, ReviewItem} from "@/lib/types";
import {sizedImage} from "@/components/premium/ProjectTile";

export {default as ProjectTile, sizedImage} from "@/components/premium/ProjectTile";

// Bouwstenen van het premium paginasysteem. Klassen staan in globals.css (.pr-*).

export const WHATSAPP_HREF = `https://wa.me/${BUSINESS.phone.e164.replace("+", "")}`;

export function Measure({children, className = ""}: {children: ReactNode; className?: string}) {
  return <p className={`pr-measure ${className}`}>{children}</p>;
}

export function SectionHead({id, title, intro, children}: {id: string; title: string; intro?: string; children?: ReactNode}) {
  return (
    <div className="pr-split-head">
      <h2 className="pr-h2" id={id}>
        {title}
      </h2>
      {intro && <p className="mt-4 max-w-[44ch] pr-muted">{intro}</p>}
      {children}
    </div>
  );
}

export function ProjectFigure({
  project,
  priority = false,
  className = "",
  aspect = "aspect-[4/5]",
  width = 1200,
}: {
  project: ProjectItem;
  priority?: boolean;
  className?: string;
  aspect?: string;
  width?: number;
}) {
  const src = sizedImage(projectCover(project), width);
  if (!src) return null;
  const label = [cleanTitle(project.type), cleanTitle(project.location)].filter(Boolean).join(", ");
  return (
    <figure className={className}>
      <Measure className="mb-3">{label}</Measure>
      <Link className="group block overflow-hidden rounded-img bg-[var(--pr-kalk)] shadow-img" data-cta="project_figure" href={`/projecten/${project.slug}`}>
        <img
          alt={label}
          className={`${aspect} w-full object-cover transition duration-500 group-hover:scale-[1.015]`}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
          src={src}
        />
      </Link>
    </figure>
  );
}

export function AssuranceTable({items, id = "zekerheden", title, intro}: {items: AssuranceTopic[]; id?: string; title: string; intro?: string}) {
  return (
    <section aria-labelledby={id} className="pr-section">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[4.5rem]">
          <h2 className="pr-h2" id={id}>
            {title}
          </h2>
          {intro && <p className="pr-lead self-end">{intro}</p>}
        </div>
        <dl className="mt-10 border-b border-[var(--pr-line)]">
          {items.map((item) => (
            <div
              className="grid gap-2 border-t border-[var(--pr-line)] py-6 md:grid-cols-[minmax(0,3fr)_minmax(0,5fr)_minmax(0,4fr)] md:gap-8"
              key={item.key}
            >
              <dt>
                <span className="pr-h3 block">{item.topic}</span>
                <span className="mt-1 block text-[15px] pr-muted">{item.question}</span>
              </dt>
              <dd className="text-[17px] font-medium leading-[1.55]">{item.answer}</dd>
              <dd className="text-[15px] leading-[1.55] pr-muted">{item.proof}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[15px] pr-muted">
          Deze afspraken staan ook in onze{" "}
          <Link className="pr-link" href="/algemene-voorwaarden">
            algemene voorwaarden
          </Link>
          , die we bij elke offerte meesturen.
        </p>
      </div>
    </section>
  );
}

export function TeamList({intro}: {intro?: string}) {
  return (
    <section aria-labelledby="team" className="pr-section pr-kalk">
      <div className="section-shell pr-split">
        <SectionHead
          id="team"
          intro={intro || `${BUSINESS.legalName} is een familiebedrijf uit Den Haag. Dit zijn de mensen die u spreekt, en waarover.`}
          title="Met wie u te maken heeft"
        />
        <div>
        <figure className="mb-8">
          <img
            alt="Het team van DRO Renovaties in bedrijfskleding"
            className="aspect-[16/8] w-full rounded-img object-cover object-[center_40%] shadow-img"
            decoding="async"
            loading="lazy"
            src="/landing/team-dro.jpg"
          />
          <figcaption className="mt-2 text-[14px] pr-muted">Het team van DRO Renovaties</figcaption>
        </figure>
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {BUSINESS.team.map((member) => (
            <li className="border-t-2 border-[var(--pr-ink)] py-5" key={member.name}>
              <p className="pr-h3">{member.name}</p>
              <p className="pr-muted">{member.jobTitle}</p>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}

export function FaqList({items, id = "vragen", title = "Veelgestelde vragen"}: {items: Array<{q: string; a: string}>; id?: string; title?: string}) {
  return (
    <section aria-labelledby={id} className="pr-section">
      <div className="section-shell pr-split">
        <SectionHead id={id} title={title} />
        <div className="border-b border-[var(--pr-line)]">
          {items.map((item) => (
            <details className="group border-t border-[var(--pr-line)] py-5" key={item.q}>
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-[18px] font-semibold leading-snug">
                {item.q}
                <span aria-hidden="true" className="mt-0.5 text-[24px] font-light leading-none text-[var(--pr-signal)] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[64ch] pr-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// Echte Google-reviews uit Sanity, ingekort tot de eerste zinnen. Volledige tekst blijft in de bron.
export function excerpt(text: string, max = 260): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
  return `${(end > 80 ? cut.slice(0, end + 1) : cut.slice(0, cut.lastIndexOf(" "))).trim()} …`;
}

export function ReviewQuotes({reviews, summary, asOf}: {reviews: ReviewItem[]; summary: string; asOf: string}) {
  if (!reviews.length) return null;
  return (
    <section aria-labelledby="reviews" className="pr-section">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[4.5rem]">
          <div>
            <h2 className="pr-h2" id="reviews">
              Wat opdrachtgevers schrijven
            </h2>
            <p className="mt-4 pr-num">
              <span className="font-semibold">{summary}</span>
              <span className="block text-[15px] pr-muted">Stand {asOf}</span>
            </p>
          </div>
          <div className="grid border-b border-[var(--pr-line)]">
            {reviews.map((review) => (
              <figure className="border-t border-[var(--pr-line)] py-6" key={review.name}>
                <blockquote className="max-w-[66ch] text-[18px] leading-[1.6]">&ldquo;{excerpt(review.quote, 300)}&rdquo;</blockquote>
                <figcaption className="mt-4 text-[15px] pr-muted">
                  {review.name}, Google-review{review.location ? ` (${review.location})` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function IntakeBlock({
  title,
  intro,
  wizard,
}: {
  title: string;
  intro: string;
  wizard: SmartIntakeProps;
}) {
  return (
    <section aria-labelledby="intake-titel" className="pr-section pr-dark scroll-mt-20" id="intake">
      {/* Mobiel: kop, dan direct het formulier, dan de uitleg. Desktop: uitleg links, formulier rechts. */}
      <div className="section-shell grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8">
        <div>
          <h2 className="pr-h2" id="intake-titel">
            {title}
          </h2>
          <p className="mt-4 max-w-[46ch] text-white/80">{intro}</p>
        </div>
        <div className="text-[var(--pr-ink)] lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <SmartIntakeWizard
            headingLevel="h2"
            thanksLinks={[
              {href: "/projecten", label: "Bekijk onze projecten"},
              {href: "/werkwijze", label: "Onze werkwijze"},
              {href: "/over-ons", label: "Over DRO Renovaties"},
            ]}
            {...wizard}
          />
        </div>
        <div>
          <ol className="grid gap-4 text-[16px] text-white/85">
            <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2">
              <span className="pr-num font-semibold text-white">1.</span>
              U beantwoordt een paar vragen over uw woning, planning en budget.
            </li>
            <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2">
              <span className="pr-num font-semibold text-white">2.</span>
              Scott Huisman belt u om uw plannen door te nemen.
            </li>
            <li className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2">
              <span className="pr-num font-semibold text-white">3.</span>
              Bij een groter project komt Therab Raja langs voor een bezichtiging en maakt de offerte.
            </li>
          </ol>
          <p className="mt-8 text-[15px] text-white/70">
            Liever direct contact?{" "}
            <a className="font-semibold text-white underline underline-offset-4" data-track="intake_side" href={BUSINESS.phone.href}>
              {BUSINESS.phone.display}
            </a>
            , ook via{" "}
            <a className="font-semibold text-white underline underline-offset-4" data-track="intake_side" href={WHATSAPP_HREF} rel="noopener noreferrer" target="_blank">
              WhatsApp
            </a>
            . Hoe we met uw gegevens omgaan, staat in de{" "}
            <Link className="underline underline-offset-4 hover:text-white" href="/privacypolicy">
              privacyverklaring
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
