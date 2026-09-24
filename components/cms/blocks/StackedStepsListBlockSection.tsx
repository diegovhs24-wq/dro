import Image from "next/image";

import SketchIcon, {type SketchIconName} from "@/components/SketchIcon";
import type {StackedStepsListBlock} from "@/lib/cms";

function StepCallout({
  title,
  text,
}: {
  title?: string;
  text?: string;
}) {
  if (!title && !text) return null;

  return (
    <div className="mt-5 rounded-[0.85rem] border-l border-l-[6px] border-brand-orange/70 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(17,17,17,0.04)] sm:px-6">
      {title ? (
        <h3 className="text-[15px] font-semibold leading-tight tracking-[-0.03em] text-brand-ink sm:text-[16px]">
          {title}
        </h3>
      ) : null}
      {text ? (
        <p className="mt-2 text-[14px] font-normal leading-[1.75] text-deep-slate sm:text-[15px]">
          {text}
        </p>
      ) : null}
    </div>
  );
}

export default function StackedStepsListBlockSection({
  block,
}: {
  block: StackedStepsListBlock;
}) {
  const items = Array.isArray(block.items) ? block.items : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f3ec]/75 py-12 border-b border-black/5  sm:py-16 sm:pt-12">
      <div className="section-shell ">
        <div className="overflow-hidden    ">
          {items.map((item, index) => {
            const borderClass = index > 0 ? "border-t border-[#eadfce]" : "";

            if (item._type === "stackedStepsMediaItem") {
              return (
                <article className={`px-5 py-7 sm:px-8 sm:py-9 lg:px-10 ${borderClass}`} key={`media-${index}`}>
                  <div className="overflow-hidden rounded-[1.15rem] bg-[#ddd4c3] shadow-[0_8px_22px_rgba(17,17,17,0.04)]">
                    <div className="relative min-h-[260px] sm:min-h-[360px] lg:min-h-[420px]">
                      {item.image ? (
                        <Image alt={item.caption || "Stap"} className="object-cover object-center" fill sizes="(min-width: 1024px) 56vw, 100vw" src={item.image} />
                      ) : null}
                    </div>
                    {item.caption ? (
                      <p className="px-3 py-3 text-[12px] font-normal text-[#6f6b61] sm:px-4">
                        {item.caption}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            }

            return (
              <article
                className={`grid gap-5 px-5 py-7 sm:grid-cols-[3.75rem_1fr] sm:gap-6 sm:px-8 sm:py-9 lg:grid-cols-[4.25rem_minmax(0,46rem)] lg:px-10 ${borderClass}`}
                key={`${item.stepLabel}-${item.title}-${index}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fce7d2]/75 text-brand-orange shadow-[0_8px_20px_rgba(255,106,0,0.08)] ">
                  <SketchIcon
                    name={(item.icon || "checklist") as SketchIconName}
                    className="h-6 w-6 sm:h-7 sm:w-7"
                  />
                </div>

                <div className="max-w-3xl">
                  {item.stepLabel ? (
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-orange leading-5">
                      {item.stepLabel}
                    </p>
                  ) : null}

                  {item.title ? (
                    <h2 className="mt-2 text-[19px] font-bold leading-[1.08] tracking-[-0.045em] text-brand-ink sm:text-[21px]">
                      {item.title}
                    </h2>
                  ) : null}

                  {item.description ? (
                    <p className="mt-3 text-[15px] font-normal leading-[1.9] text-[#425466] sm:text-[17px]">
                      {item.description}
                    </p>
                  ) : null}

                  <StepCallout title={item.callout?.title} text={item.callout?.text} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
