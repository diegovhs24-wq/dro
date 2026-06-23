import type {FaqAnswersGridBlock} from "@/lib/cms";

function SectionLabel({
  sectionNumber,
  eyebrow,
}: {
  sectionNumber?: string;
  eyebrow?: string;
}) {
  if (!sectionNumber && !eyebrow) return null;

  return (
    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
      {sectionNumber ? <span className="text-brand-orange">{sectionNumber}</span> : null}
      {eyebrow ? <span>{eyebrow}</span> : null}
    </p>
  );
}

export default function FaqAnswersGridBlockSection({
  block,
}: {
  block: FaqAnswersGridBlock;
}) {
  const faqs = Array.isArray(block.faqs) ? block.faqs : [];

  if (!block.title || !block.intro || faqs.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f3ec]/75 py-16 sm:py-20">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <div className="max-w-3xl">
            <SectionLabel sectionNumber={block.sectionNumber} eyebrow={block.eyebrow} />
            <h2 className="mt-5 max-w-[440px] text-[28px] font-bold leading-[0.95] tracking-[-0.05em] text-brand-ink sm:text-[44px]">
              {block.title}
            </h2>
          </div>

          <div className="max-w-2xl pt-2 lg:pt-20">
            <p className="text-[16px] font-normal leading-[1.7] text-[#425466] ">
              {block.intro}
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-x-14 gap-y-8 md:gap-y-12 lg:grid-cols-2">
          {faqs.map((faq, index) => (
            <article key={`${faq.question}-${index}`}>
              <div className="flex items-start gap-4">
                <span className="pt-1 text-[18px] font-semibold leading-none tracking-[-0.04em] text-brand-orange ">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <div className="max-w-[34rem]">
                  <h3 className="text-[18px] font-semibold leading-[1.15] tracking-[-0.04em] text-brand-ink ">
                    {faq.question}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {faq.answer
                      .split("\n\n")
                      .filter(Boolean)
                      .map((paragraph, paragraphIndex) => (
                        <p
                          className="text-[16px] font-normal leading-[1.75] text-deep-slate"
                          key={paragraphIndex}
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
