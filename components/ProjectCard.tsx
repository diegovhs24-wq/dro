import Link from "next/link";

type ProjectCardProps = {
  title: string;
  text?: string;
  description?: string;
  before: string;
  after: string;
  beforeImage?: string;
  afterImage?: string;
  slug?: string;
};

const defaultBeforeImage =
  "https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?auto=format&fit=crop&w=700&q=70";
const defaultAfterImage =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=70";

export default function ProjectCard({
  title,
  text,
  description,
  before,
  after,
  beforeImage = defaultBeforeImage,
  afterImage = defaultAfterImage,
  slug
}: ProjectCardProps) {
  const content = (
    <article className="card overflow-hidden">
      <div className="grid h-64 grid-cols-2">
        <div
          className="flex items-end bg-cover bg-center p-4"
          style={{ backgroundImage: `url(${beforeImage})` }}
        >
          <span className="rounded bg-black/65 px-3 py-1 text-xs font-semibold text-white">{before}</span>
        </div>
        <div
          className="flex items-end bg-cover bg-center p-4"
          style={{ backgroundImage: `url(${afterImage})` }}
        >
          <span className="rounded bg-brand-orange px-3 py-1 text-xs font-semibold text-white">{after}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-neutral-600">{text ?? description}</p>
        {slug ? (
          <span className="mt-5 inline-flex text-sm font-bold text-brand-orange">
            Bekijk project
          </span>
        ) : null}
      </div>
    </article>
  );

  if (!slug) return content;

  return (
    <Link aria-label={`Bekijk project ${title}`} href={`/projecten/${slug}`}>
      {content}
    </Link>
  );
}
