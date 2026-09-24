import Image from "next/image";

import SketchIcon, {type SketchIconName} from "@/components/SketchIcon";
import type {SplitFeatureListBlock} from "@/lib/cms";

export default function SplitFeatureListBlockSection({
  block,
}: {
  block: SplitFeatureListBlock;
}) {
  const features = Array.isArray(block.features) ? block.features : [];

  if (!block.title || !block.description || !block.image || features.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f3ec]/75 border-b border-black/5 py-14 sm:py-16 lg:py-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[1rem] border border-black/5 bg-[#ddd4c3] shadow-[0_12px_30px_rgba(17,17,17,0.05)]">
            <div className="relative min-h-[340px] sm:min-h-[480px] lg:min-h-[500px]">
              <Image alt={block.title} className="object-cover object-center" fill sizes="(min-width: 1024px) 46vw, 100vw" src={block.image} />
            </div>
            {block.imageCaption ? (
              <p className="px-5 py-4 text-[13px] font-medium text-[#6f6b61] sm:px-6 sm:text-[14px]">
                {block.imageCaption}
              </p>
            ) : null}
          </div>
        </div>

        <div className="max-w-3xl">
          {block.eyebrow ? (
            <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
              <span className="text-brand-orange">+</span>
              <span>{block.eyebrow}</span>
            </p>
          ) : null}

          <h2 className="mt-5 max-w-[20ch] text-[30px] font-bold leading-[0.93] tracking-[-0.05em] text-brand-ink sm:text-[47px]">
            {block.title}
          </h2>

          <p className="mt-6 max-w-[500px] text-[15px] font-normal leading-[1.62] text-deep-slate sm:text-[16px]">
            {block.description}
          </p>

          <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2 lg:mt-12">
            {features.map((feature, index) => (
              <article className="grid grid-cols-[3.2rem_1fr] gap-4" key={`${feature.title}-${index}`}>
                <div className="flex h-[3rem] w-[3rem] items-center justify-center rounded-[0.85rem] bg-[#1f2126] text-white shadow-[0_8px_20px_rgba(17,17,17,0.14)]">
                  <SketchIcon
                    name={(feature.icon || "tools") as SketchIconName}
                    className="h-5 w-5"
                  />
                </div>

                <div>
                  {feature.title ? (
                    <h3 className="text-[1rem] font-semibold leading-[1.15] tracking-[-0.03em] text-brand-ink ">
                      {feature.title}
                    </h3>
                  ) : null}
                  {feature.text ? (
                    <p className="mt-2 text-[15px] font-normal leading-[1.45] text-deep-slate ">
                      {feature.text}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
