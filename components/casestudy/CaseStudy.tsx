/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import {caseStudyFacts, type PublicCaseStudy} from "@/lib/caseStudy";

// Herbruikbare casestudy-onderdelen. Ze tonen uitsluitend wat in
// `toPublicCaseStudy` door de toestemmingscontrole is gekomen; lege velden
// verdwijnen, er staat nergens een placeholdertekst op de site.

export function CaseStudyFacts({caseStudy, location}: {caseStudy: PublicCaseStudy; location?: string}) {
  const facts = caseStudyFacts(caseStudy, location);
  if (!facts.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-lp-line py-5 sm:grid-cols-3 lg:grid-cols-5">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className="text-[13px] text-lp-muted">{fact.label}</dt>
          <dd className="mt-0.5 text-[16px] font-semibold leading-snug">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseStudyCard({
  caseStudy,
  title,
  href,
  location,
}: {
  caseStudy: PublicCaseStudy;
  title: string;
  href: string;
  location?: string;
}) {
  const facts = caseStudyFacts(caseStudy, location).filter((f) => f.label !== "Locatie").slice(0, 3);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-lp-line bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-lp-plaster">
        <img
          alt={`Na de verbouwing: ${title}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
          decoding="async"
          loading="lazy"
          src={caseStudy.afterImages[0]}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[19px] font-bold leading-snug">
          <Link className="after:absolute after:inset-0 focus-visible:outline-none" data-cta="casestudy_open" href={href}>
            {title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-lp-muted">{caseStudy.clientGoal}</p>
        {facts.length > 0 && (
          <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-lp-line pt-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[12px] text-lp-muted">{fact.label}</dt>
                <dd className="text-[14px] font-semibold leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}

// Volledige casestudy op de projectpagina.
export function CaseStudyDetail({caseStudy, location}: {caseStudy: PublicCaseStudy; location?: string}) {
  const pairs = caseStudy.beforeImages
    .slice(0, caseStudy.afterImages.length)
    .map((before, i) => ({before, after: caseStudy.afterImages[i]}));
  const extraAfter = caseStudy.afterImages.slice(pairs.length);

  return (
    <section aria-labelledby="casestudy-titel" className="text-lp-ink">
      <h2 className="text-[26px] font-bold tracking-[-0.01em] sm:text-[32px]" id="casestudy-titel">
        Het project in detail
      </h2>
      <div className="mt-6">
        <CaseStudyFacts caseStudy={caseStudy} location={location} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          {caseStudy.startingSituation && (
            <>
              <h3 className="text-[19px] font-bold">De uitgangssituatie</h3>
              <p className="mb-8 mt-3 max-w-[62ch] text-[17px] leading-[1.7]">{caseStudy.startingSituation}</p>
            </>
          )}
          <h3 className="text-[19px] font-bold">Wat de opdrachtgever wilde</h3>
          <p className="mt-3 max-w-[62ch] text-[17px] leading-[1.7]">{caseStudy.clientGoal}</p>
          {caseStudy.challenge && (
            <>
              <h3 className="mt-8 text-[19px] font-bold">De grootste uitdaging</h3>
              <p className="mt-3 max-w-[62ch] text-[17px] leading-[1.7]">{caseStudy.challenge}</p>
            </>
          )}
          {caseStudy.solution && (
            <>
              <h3 className="mt-8 text-[19px] font-bold">Hoe we het hebben opgelost</h3>
              <p className="mt-3 max-w-[62ch] text-[17px] leading-[1.7]">{caseStudy.solution}</p>
            </>
          )}
          {caseStudy.result && (
            <>
              <h3 className="mt-8 text-[19px] font-bold">Het resultaat</h3>
              <p className="mt-3 max-w-[62ch] text-[17px] leading-[1.7]">{caseStudy.result}</p>
            </>
          )}
        </div>
        <div>
          <h3 className="text-[19px] font-bold">Wat er is gedaan</h3>
          <ul className="mt-3 grid gap-2 text-[16px] leading-relaxed">
            {caseStudy.scope.map((item) => (
              <li className="grid grid-cols-[18px_minmax(0,1fr)] gap-2" key={item}>
                <span aria-hidden="true" className="mt-[0.6em] h-[2px] w-3 bg-lp-orange" />
                {item}
              </li>
            ))}
          </ul>
          {caseStudy.details.length > 0 && (
            <>
              <h3 className="mt-8 text-[19px] font-bold">Materialen en details</h3>
              <ul className="mt-3 grid gap-2 text-[16px] leading-relaxed text-lp-muted">
                {caseStudy.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {caseStudy.projectLead && <p className="mt-8 text-[15px] text-lp-muted">Uitvoering onder leiding van {caseStudy.projectLead}.</p>}
        </div>
      </div>

      {caseStudy.quote && (
        <figure className="mt-12 border-l-[3px] border-lp-orange pl-6">
          <blockquote className="max-w-[60ch] text-[21px] font-medium leading-[1.55]">&ldquo;{caseStudy.quote.text}&rdquo;</blockquote>
          {caseStudy.quote.author && <figcaption className="mt-3 text-[15px] text-lp-muted">{caseStudy.quote.author}</figcaption>}
        </figure>
      )}

      {(pairs.length > 0 || extraAfter.length > 0) && (
        <div className="mt-12 grid gap-6">
          {pairs.map((pair, i) => (
            <div className="grid gap-3 sm:grid-cols-2" key={pair.after}>
              <figure>
                <img alt={`Voor de verbouwing, foto ${i + 1}`} className="aspect-[4/3] w-full rounded-img object-cover" decoding="async" loading="lazy" src={pair.before} />
                <figcaption className="mt-1.5 text-[13px] text-lp-muted">Voor</figcaption>
              </figure>
              <figure>
                <img alt={`Na de verbouwing, foto ${i + 1}`} className="aspect-[4/3] w-full rounded-img object-cover" decoding="async" loading="lazy" src={pair.after} />
                <figcaption className="mt-1.5 text-[13px] text-lp-muted">Na</figcaption>
              </figure>
            </div>
          ))}
          {extraAfter.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {extraAfter.map((src, i) => (
                <img alt={`Resultaat, foto ${pairs.length + i + 1}`} className="aspect-[4/3] w-full rounded-img object-cover" decoding="async" key={src} loading="lazy" src={src} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
