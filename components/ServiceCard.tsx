import Link from "next/link";
import SketchIcon, { type SketchIconName } from "@/components/SketchIcon";

type ServiceCardProps = {
  title: string;
  summary: string;
  image: string;
  href: string;
  icon?: SketchIconName | string;
  label?: string;
};

export default function ServiceCard({ title, summary, image, href, icon, label }: ServiceCardProps) {
  return (
    <article className="card overflow-hidden">
      <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
        {icon ? (
          <div className="absolute bottom-4 left-4 grid h-16 w-16 place-items-center rounded-lg border border-white/70 bg-white/92 text-brand-ink shadow-lg backdrop-blur">
            <SketchIcon name={icon as SketchIconName} className="h-10 w-10" />
          </div>
        ) : null}
      </div>
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
