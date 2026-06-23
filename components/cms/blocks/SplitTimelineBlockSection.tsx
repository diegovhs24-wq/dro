import type {SplitTimelineBlock} from "@/lib/cms";

function SectionLabel({
  sectionNumber,
  eyebrow,
}: {
  sectionNumber?: string;
  eyebrow?: string;
}) {
  if (!sectionNumber && !eyebrow) return null;

  return (
    <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
      {sectionNumber ? <span className="text-brand-orange">{sectionNumber}</span> : null}
      {eyebrow ? <span>{eyebrow}</span> : null}
    </p>
  );
}

export default function SplitTimelineBlockSection({
  block,
}: {
  block: SplitTimelineBlock;
}) {
  const milestones = Array.isArray(block.milestones) ? block.milestones : [];
  const assurancePoints = Array.isArray(block.assurancePoints) ? block.assurancePoints : [];

  if (!block.title || !block.description || milestones.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-black/10 bg-[#f7f3ec]/75 py-16 sm:py-20">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="max-w-2xl">
            <SectionLabel sectionNumber={block.sectionNumber} eyebrow={block.eyebrow} />

            <h2 className="mt-5 max-w-xl text-[28px] font-bold leading-[0.95] tracking-[-0.05em] text-brand-ink lg:text-[44px]">
              {block.title}
            </h2>

            <p className="mt-7 max-w-[500px] text-[16px] font-normal leading-[1.7] text-deep-slate">
              {block.description}
            </p>

            {block.highlightLabel ? (
              <div className="mt-9 inline-flex rounded-full bg-[#f3e7d8] px-5 py-3">
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[rgb(207,93,8)] ">
                  {block.highlightLabel}
                </p>
              </div>
            ) : null}
          </div>

          <div className="pt-1 sm:pt-2 lg:pt-0">
            <div className="relative pl-10">
              <div className="absolute bottom-4 left-[10px] top-4 w-px bg-[#e3c8af]" />
              <div className="space-y-8 sm:space-y-9">
                {milestones.map((milestone, index) => (
                  <article className="relative" key={`${milestone.title}-${index}`}>
                    <span className="absolute left-[-38px] top-1.5 h-[18px] w-[18px] rounded-full bg-brand-orange ring-8 ring-[#f7f3ec]" />
                    {milestone.eyebrow ? (
                      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-orange ">
                        {milestone.eyebrow}
                      </p>
                    ) : null}
                    {milestone.title ? (
                      <h3 className="mt-2 text-[17px] font-bold leading-[1.05] tracking-[-0.04em] text-brand-ink ">
                        {milestone.title}
                      </h3>
                    ) : null}
                    {milestone.text ? (
                      <p className="mt-2 max-w-[34ch] text-[15px] font-normal leading-[1.65] text-muted-slate ">
                        {milestone.text}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {assurancePoints.length ? (
          <div className="mt-12 border-t border-black/10 pt-10 sm:mt-14 sm:pt-12">
            <div className="grid gap-8 grid-cols-2 xl:grid-cols-4 xl:gap-10">
              {assurancePoints.map((item, index) => (
                <article key={`${item.title}-${index}`}>
                  {item.title ? (
                    <h3 className="text-[16px] font-semibold leading-[1.05] tracking-[-0.04em] text-brand-ink ">
                      {item.title}
                    </h3>
                  ) : null}
                  {item.text ? (
                    <p className="mt-4 max-w-[22ch] text-[15px] font-normal leading-[1.8] text-muted-slate ">
                      {item.text}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
