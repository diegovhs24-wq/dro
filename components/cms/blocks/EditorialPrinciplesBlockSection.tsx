import type {EditorialPrinciplesContent, PtBlock, PtMarkDef, PtSpan} from "@/lib/types";

function renderSpan(span: PtSpan, markDefs: PtMarkDef[], index: number) {
  const marks = span.marks || [];
  let node: React.ReactNode = span.text;

  if (marks.includes("underline")) node = <u>{node}</u>;
  if (marks.includes("em")) node = <em>{node}</em>;
  if (marks.includes("strong")) node = <strong>{node}</strong>;

  return <span key={`${span._key}-${index}`}>{node}</span>;
}

function RichNarrative({blocks}: {blocks: PtBlock[]}) {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const markDefs = block.markDefs ?? [];

    if (block.listItem === "bullet" || block.listItem === "number") {
      const listType = block.listItem;
      const items: React.ReactNode[] = [];

      while (i < blocks.length && blocks[i].listItem === listType) {
        const listBlock = blocks[i];
        const children = (listBlock.children || []).map((span, index) =>
          renderSpan(span, listBlock.markDefs ?? [], index)
        );
        items.push(<li key={listBlock._key}>{children}</li>);
        i++;
      }

      const Tag = listType === "number" ? "ol" : "ul";
      const listClass =
        listType === "number" ? "list-decimal pl-5 space-y-2" : "list-disc pl-5 space-y-2";
      nodes.push(
        <Tag key={`list-${i}`} className={`text-base font-semibold leading-8 text-neutral-600 ${listClass}`}>
          {items}
        </Tag>
      );
      continue;
    }

    const children = (block.children || []).map((span, index) => renderSpan(span, markDefs, index));

    if (block.style === "lead") {
      nodes.push(
        <p
          key={block._key}
          className="text-[18px] font-semibold leading-[1.45] tracking-[-0.02em] text-rich-ink sm:text-[21px]"
        >
          {children}
        </p>
      );
    } else {
      nodes.push(
        <p key={block._key} className="text-base font-normal leading-8 text-neutral-600">
          {children}
        </p>
      );
    }

    i++;
  }

  return <div className="space-y-6">{nodes}</div>;
}

export default function EditorialPrinciplesBlockSection({
  content,
}: {
  content: EditorialPrinciplesContent;
}) {
  const blocks = Array.isArray(content.content) ? content.content : [];
  const pillars = Array.isArray(content.pillars) ? content.pillars : [];

  return (
    <section className="border-b border-black/10 bg-[#f7f3ec]/75 py-14 sm:py-16">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="max-w-2xl">
            {(content.sectionNumber || content.eyebrow) ? (
              <p className="eyebrow-slate !text-rich-ink flex items-center gap-3">
                {content.sectionNumber ? <span className="text-brand-orange">{content.sectionNumber}</span> : null}
                {content.eyebrow ? <span>{content.eyebrow}</span> : null}
              </p>
            ) : null}

            {content.title ? (
              <h2 className="mt-4 max-w-xl text-[28px] md:text-4xl font-bold leading-[0.98] tracking-[-0.03em] text-rich-ink lg:text-[44px]">
                {content.title}
              </h2>
            ) : null}
          </div>

          {content.sideIntro ? (
            <div className="max-w-2xl pt-1 lg:pt-10">
              <p className="text-base font-normal leading-6 text-neutral-600 ">
                {content.sideIntro}
              </p>
            </div>
          ) : null}
        </div>

        {blocks.length ? (
          <div className="mt-10 max-w-3xl">
            <RichNarrative blocks={blocks} />
          </div>
        ) : null}

        {pillars.length ? (
          <div className="mt-10 grid gap-8 lg:gap-16 border-t border-black/10 pt-8 md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <div key={`${pillar.title}-${index}`}>
                <div className="flex items-center gap-3">
                  <span className="h-0.5 w-4 rounded-full bg-brand-orange" />
                  <h3 className="text-base font-bold tracking-tight text-brand-ink">{pillar.title}</h3>
                </div>
                {pillar.text ? (
                  <p className="mt-3 max-w-sm text-sm font-normal leading-7 text-neutral-500">
                    {pillar.text}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
