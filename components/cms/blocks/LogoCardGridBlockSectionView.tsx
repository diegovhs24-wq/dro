import type {LogoCardGridBlock} from "@/lib/cms";

function Eyebrow({eyebrow}: {eyebrow?: string}) {
  if (!eyebrow) return null;

  return (
    <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
      <span>{eyebrow}</span>
    </p>
  );
}

export default function LogoCardGridBlockSectionView({
  block,
}: {
  block: LogoCardGridBlock;
}) {
  const partners = Array.isArray(block.partners) ? block.partners : [];

  if (!block.title || !block.text || partners.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden border-y border-black/5 bg-[#f7f3ec]/75 py-16 sm:py-20">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="max-w-4xl">
            <Eyebrow eyebrow={block.eyebrow} />
            <h2 className="mt-5 max-w-[450px] text-[28px] font-bold leading-[1.2] tracking-[-0.05em] text-brand-ink sm:text-[44px]">
              {block.title}
            </h2>
          </div>

          <div className="max-w-3xl pt-1 lg:pt-[5.6rem]">
            <p className="text-[16px] font-normal leading-[1.62] text-muted-slate ">
              {block.text}
            </p>
          </div>
        </div>

        <div className="mt-11 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {partners.map((partner, index) => (
            <article
              className="flex min-h-[162px] flex-col items-center justify-center rounded-[0.8rem] border border-black/10 bg-white px-6 py-8 text-center shadow-[0_10px_28px_rgba(17,17,17,0.04)]"
              key={`${partner.name}-${index}`}
            >
              

              <p
                className={
                  
                    "text-[15px] md:text-[17px] font-bold leading-[1.05] tracking-[-0.04em] text-brand-ink "
                }
              >
                {partner.name}
              </p>

              {partner.category ? (
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-deep-slate ">
                  {partner.category}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
