import CTASection from "@/components/CTASection";
import GoogleReviews from "@/components/GoogleReviews";
import PageHero from "@/components/PageHero";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";
import type {FaqItem, ReviewItem} from "@/lib/types";

type ServiceBlock = {
  title: string;
  items: string[];
};

type ServicePageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: ServiceBlock[];
  processTitle: string;
  processText: string;
  situations?: ServiceBlock[];
  examples?: string[];
  faqs?: FaqItem[];
  reviews?: ReviewItem[];
};

const defaultFaqs = [
  {
    question: "Hoe starten jullie?",
    answer: "We beginnen met een korte intake en bekijken wat technisch en praktisch nodig is."
  },
  {
    question: "Krijg ik één aanspreekpunt?",
    answer: "Ja. U heeft één vast aanspreekpunt voor planning, keuzes en vragen."
  },
  {
    question: "Werken jullie met vaste mensen?",
    answer: "Ja. We werken met vaste teams en partners die op elkaar zijn ingespeeld."
  },
  {
    question: "Hoe blijft de planning duidelijk?",
    answer: "We leggen de volgorde vooraf vast en stemmen materialen en vakmensen op elkaar af."
  },
  {
    question: "Wat als er iets verandert?",
    answer: "Dan bespreken we dit vooraf. Geen aanpassingen zonder duidelijke afstemming."
  },
  {
    question: "Hoe leveren jullie op?",
    answer: "We lopen het werk samen door en ronden pas af als alles netjes klopt."
  }
];

const exampleIcons: SketchIconName[] = ["planning", "tools", "checklist"];
const situationIcons: SketchIconName[] = ["materials", "location", "finish"];

export default function ServicePage({
  eyebrow,
  title,
  intro,
  sections,
  processTitle,
  processText,
  situations,
  examples = ["Voorbereiding", "Uitvoering", "Oplevering"],
  faqs = defaultFaqs,
  reviews
}: ServicePageProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={intro} />

      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Aanpak</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              {processTitle}
            </h2>
            <p className="mt-5 text-base font-semibold leading-7 text-neutral-600">
              {processText}
            </p>
            <div className="mt-7 rounded-lg bg-brand-soft p-5 text-sm font-bold leading-7 text-brand-ink">
              <div className="flex items-center gap-4">
                <SketchIcon name="handshake" className="h-10 w-10 shrink-0 text-brand-ink" />
                <span>Eén aanspreekpunt. Heldere keuzes. Nette oplevering.</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {sections.slice(0, 2).map((section) => (
              <article className="rounded-lg border border-black/10 bg-white p-6 shadow-sm" key={section.title}>
                <SketchIcon name="checklist" className="mb-4 h-10 w-10 text-brand-ink" />
                <h2 className="text-xl font-bold text-brand-ink">{section.title}</h2>
                <ul className="mt-5 grid gap-3 text-sm font-semibold leading-6 text-neutral-700">
                  {section.items.slice(0, 4).map((item) => (
                    <li className="flex gap-3" key={item}>
                      <span className="text-brand-orange">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {situations ? (
        <section className="bg-brand-soft py-14 sm:py-16">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="eyebrow">Wanneer gebruiken we wat?</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
                Duidelijke keuzes voor uw situatie.
              </h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {situations.map((situation, index) => (
                <article className="rounded-lg bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium" key={situation.title}>
                  <SketchIcon
                    name={situationIcons[index % situationIcons.length]}
                    className="mb-4 h-11 w-11 text-brand-ink"
                  />
                  <h3 className="text-xl font-bold text-brand-ink">{situation.title}</h3>
                  <ul className="mt-4 grid gap-2 text-sm font-semibold leading-6 text-neutral-600">
                    {situation.items.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Voorbeelden</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
                Zo blijft het overzichtelijk.
              </h2>
            </div>
            <a className="text-sm font-bold text-brand-orange hover:text-brand-ink" href="/projecten">
              Bekijk projecten
            </a>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {examples.map((example, index) => (
              <div className="group min-h-[180px] overflow-hidden rounded-lg bg-neutral-950 p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-premium" key={example}>
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-white/10 text-white">
                  <SketchIcon
                    name={exampleIcons[index % exampleIcons.length]}
                    className="h-9 w-9"
                  />
                </div>
                <h3 className="mt-8 text-xl font-bold">{example}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/65">
                  Kort afgestemd, strak uitgevoerd en netjes gecontroleerd.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-14 sm:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">
              Veelgestelde vragen.
            </h2>
          </div>
          <div className="grid gap-3">
            {faqs.slice(0, 6).map((faq, index) => (
              <details className="rounded-lg bg-white p-5 shadow-sm transition hover:shadow-premium" key={faq.question} open={index === 0}>
                <summary className="cursor-pointer list-none font-bold text-brand-ink">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600">
                  {Array.isArray(faq.answer) ? faq.answer.join(" ") : faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {reviews?.length ? <GoogleReviews compact limit={4} reviews={reviews} /> : null}
      <CTASection />
    </>
  );
}
