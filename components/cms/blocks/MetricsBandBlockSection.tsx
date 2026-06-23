import type {MetricsBandContent} from "@/lib/types";

export default function MetricsBandBlockSection({
  content,
}: {
  content: MetricsBandContent;
}) {
  const stats = Array.isArray(content.stats) ? content.stats : [];

  if (!stats.length) {
    return null;
  }

  return (
    <section className="border-b py-12 border-black/10 bg-[#f7f3ec]/75">
      <div className="section-shell ">
        {content.eyebrow ? <p className="eyebrow py-5">{content.eyebrow}</p> : null}
        <div className={`grid py-6 gap-6 border-t border-black/10 py-6 grid-cols-2 ${stats.length >= 4 ? "xl:grid-cols-4" : stats.length === 3 ? "xl:grid-cols-3" : "xl:grid-cols-2"}`}>
          {stats.map((stat, index) => (
            <div
              key={`${stat.value}-${stat.label}-${index}`}
            >
              <p className="text-[34px] font-bold tracking-[-0.03em] text-brand-ink ">
                {stat.value}
                {stat.suffix ? <span className="ml-1 text-base font-bold text-neutral-500 sm:text-lg">{stat.suffix}</span> : null}
              </p>
              {stat.label ? (
                <p className="mt-2 max-w-[22ch] text-sm font-normal leading-5 text-neutral-500">
                  {stat.label}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
