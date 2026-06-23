import type {DarkAssuranceGridBlock} from "@/lib/cms";

export default function DarkAssuranceGridBlockSection({
  block,
}: {
  block: DarkAssuranceGridBlock;
}) {
  const items = Array.isArray(block.items) ? block.items : [];

  if (!block.title || items.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f3ec]/75 border-y border-black/5 py-16 sm:py-20">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[1.4rem] bg-[#1b1c22] px-7 py-10 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="">
            <div className="max-w-2xl">
              {block.eyebrow ? (
                <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white">
                  <span className="text-brand-orange">↳</span>
                  <span>{block.eyebrow}</span>
                </p>
              ) : null}

              <h2 className="mt-5 max-w-[400px] text-[26px] font-bold leading-[0.93] tracking-[-0.05em] text-white sm:text-[36px]">
                {block.title}
              </h2>
            </div>

            <div className=" mt-9 grid gap-x-10 gap-y-4 grid-cols-2 lg:grid-cols-4">
              {items.map((item, index) => (
                <article key={`${item.title}-${index}`}>
                  {item.title ? (
                    <h3 className="text-[1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white ">
                      {item.title}
                    </h3>
                  ) : null}

                  {item.text ? (
                    <p className="mt-3 max-w-[26ch] text-[15px] font-normal leading-[1.7] text-[rgb(157,155,148)] ">
                      {item.text}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
