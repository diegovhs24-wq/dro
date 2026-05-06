import Link from "next/link";

type ServiceCardProps = {
  title: string;
  summary: string;
  image: string;
  href: string;
  label?: string;
};

export default function ServiceCard({ title, summary, image, href, label }: ServiceCardProps) {
  return (
    <article className="card overflow-hidden">
      <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="p-6">
        {label ? <p className="mb-3 text-sm font-bold text-brand-orange">{label}</p> : null}
        <h3 className="text-xl font-bold text-brand-ink">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-neutral-600">{summary}</p>
        <Link className="mt-5 inline-flex text-sm font-bold text-brand-orange hover:text-brand-ink" href={href}>
          Bekijk dienst
        </Link>
      </div>
    </article>
  );
}
