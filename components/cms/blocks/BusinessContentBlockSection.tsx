import type {BusinessPageContent} from "@/lib/types";

type BusinessContent = Pick<
  BusinessPageContent,
  "positionEyebrow" | "positionTitle" | "positionText" | "positionBanner" | "capacity" | "cards"
>;

export default function BusinessContentBlockSection({ content }: { content: BusinessContent }) {
  return (
    <>
      <section className="bg-white py-14 sm:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">{content.positionEyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink">{content.positionTitle}</h2>
            <p className="mt-5 text-base font-semibold leading-7 text-neutral-600">{content.positionText}</p>
            <div className="mt-7 rounded-lg bg-neutral-950 p-6 text-white shadow-premium">
              <p className="text-2xl font-bold leading-tight">{content.positionBanner}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(content.capacity || []).map((item) => (
              <div className="rounded-lg bg-brand-soft p-5 text-sm font-bold text-brand-ink" key={item}>
                <span className="text-brand-orange">✔</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-14 sm:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-2">
          {(content.cards || []).map((card) => (
            <div className="rounded-lg bg-white p-6 shadow-sm" key={card.title}>
              <p className="eyebrow">{card.eyebrow}</p>
              <h2 className="mt-3 text-2xl font-bold text-brand-ink">{card.title}</h2>
              <div className="mt-6 grid gap-3">
                {card.items.map((item) => (
                  <p className="text-sm font-semibold text-neutral-700" key={item}>
                    <span className="mr-2 text-brand-orange">✔</span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
