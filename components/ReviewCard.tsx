type ReviewCardProps = {
  name: string;
  quote: string;
};

export default function ReviewCard({ name, quote }: ReviewCardProps) {
  return (
    <figure className="card p-7">
      <div className="text-lg text-brand-orange">★★★★★</div>
      <blockquote className="mt-5 text-base leading-8 text-neutral-700">“{quote}”</blockquote>
      <figcaption className="mt-6 font-bold text-brand-ink">{name}</figcaption>
    </figure>
  );
}
