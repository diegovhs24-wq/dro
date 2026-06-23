import Link from "next/link";
import type {BlogPostSummary} from "@/lib/types";

function formatDate(date?: string) {
  if (!date) return null;

  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogCard({
  title,
  href,
  excerpt,
  featuredImage,
  publishedAt,
  author,
  categories = [],
  readingTime,
}: BlogPostSummary) {
  const date = formatDate(publishedAt);
  const category = categories[0]?.title;

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      {featuredImage ? (
        <Link
          aria-label={`Lees artikel ${title}`}
          className="block h-56 bg-cover bg-center"
          href={href}
          style={{backgroundImage: `url(${featuredImage})`}}
        />
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-orange">
          {category ? <span>{category}</span> : null}
          {date ? <span className="text-neutral-500">{date}</span> : null}
        </div>
        <h3 className="mt-4 text-xl font-bold leading-tight text-brand-ink">
          <Link className="hover:text-brand-orange" href={href}>
            {title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-neutral-600">{excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4 text-sm">
          <span className="font-semibold text-neutral-600">
            {author?.name ? `Door ${author.name}` : readingTime}
          </span>
          <Link className="font-bold text-brand-orange hover:text-brand-ink" href={href}>
            Lees artikel
          </Link>
        </div>
        {author?.name && readingTime ? (
          <p className="mt-2 text-xs font-semibold text-neutral-500">{readingTime}</p>
        ) : null}
      </div>
    </article>
  );
}
