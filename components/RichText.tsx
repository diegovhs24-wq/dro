import type React from "react";
import type {PtBlock, RichTextContent} from "@/lib/types";

type RichTextProps = {
  blocks: RichTextContent;
  className?: string;
};

function isPtBlock(value: RichTextContent[number]): value is PtBlock {
  return Boolean(value) && typeof value === "object" && "_type" in value && value._type === "block";
}

function renderSpan(
  span: NonNullable<PtBlock["children"]>[number],
  markDefs: NonNullable<PtBlock["markDefs"]>,
  index: number,
) {
  const marks = span.marks || [];
  let node: React.ReactNode = span.text;

  if (marks.includes("underline")) node = <u>{node}</u>;
  if (marks.includes("em")) node = <em>{node}</em>;
  if (marks.includes("strong")) node = <strong>{node}</strong>;

  marks.forEach((markKey) => {
    const def = markDefs.find((item) => item._key === markKey);
    if (def?._type === "link" && def.href) {
      const isExternal = def.href.startsWith("http");
      node = (
        <a
          className="font-bold text-brand-orange underline underline-offset-4 hover:text-brand-ink"
          href={def.href}
          rel={isExternal ? "noopener noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          {node}
        </a>
      );
    }
  });

  return <span key={index}>{node}</span>;
}

export default function RichText({blocks, className}: RichTextProps) {
  const nodes: React.ReactNode[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];

    if (typeof block === "string") {
      nodes.push(
        <figure className="my-10 overflow-hidden rounded-lg" key={`image-${index}`}>
          <img alt="" className="h-auto w-full object-cover" src={block} />
        </figure>,
      );
      index++;
      continue;
    }

    if (!isPtBlock(block)) {
      index++;
      continue;
    }

    if (block.listItem === "bullet" || block.listItem === "number") {
      const listType = block.listItem;
      const listItems: React.ReactNode[] = [];

      while (index < blocks.length) {
        const current = blocks[index];
        if (!isPtBlock(current) || current.listItem !== listType) break;
        listItems.push(
          <li key={current._key}>
            {(current.children || []).map((span, spanIndex) =>
              renderSpan(span, current.markDefs || [], spanIndex),
            )}
          </li>,
        );
        index++;
      }

      const ListTag = listType === "number" ? "ol" : "ul";
      nodes.push(
        <ListTag
          className={listType === "number" ? "list-decimal space-y-2 pl-6" : "list-disc space-y-2 pl-6"}
          key={`list-${index}`}
        >
          {listItems}
        </ListTag>,
      );
      continue;
    }

    const children = (block.children || []).map((span, spanIndex) =>
      renderSpan(span, block.markDefs || [], spanIndex),
    );

    if (block.style === "h2") {
      nodes.push(
        <h2 className="pt-5 text-3xl font-extrabold leading-tight text-brand-ink" key={block._key}>
          {children}
        </h2>,
      );
    } else if (block.style === "h3") {
      nodes.push(
        <h3 className="pt-4 text-2xl font-bold leading-tight text-brand-ink" key={block._key}>
          {children}
        </h3>,
      );
    } else if (block.style === "h4") {
      nodes.push(
        <h4 className="pt-3 text-xl font-bold leading-tight text-brand-ink" key={block._key}>
          {children}
        </h4>,
      );
    } else if (block.style === "blockquote") {
      nodes.push(
        <blockquote
          className="border-l-4 border-brand-orange bg-brand-soft px-6 py-5 text-xl font-bold leading-8 text-brand-ink"
          key={block._key}
        >
          {children}
        </blockquote>,
      );
    } else {
      nodes.push(<p key={block._key}>{children}</p>);
    }

    index++;
  }

  return (
    <div className={className || "space-y-6 text-lg leading-9 text-neutral-700"}>
      {nodes}
    </div>
  );
}
