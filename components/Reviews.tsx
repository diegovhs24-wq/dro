const reviews = [
  {
    name: "Sanne uit Utrecht",
    quote: "Binnen een dag wisten we waar we aan toe waren. De planning klopte en de afwerking is prachtig."
  },
  {
    name: "Murat uit Amersfoort",
    quote: "Duidelijke communicatie, nette mensen over de vloer en geen verrassingen achteraf."
  },
  {
    name: "Eva uit Amsterdam",
    quote: "Therab dacht vanaf het begin mee. Onze badkamer voelt nu als een luxe hotelsuite."
  }
];

export default function Reviews() {
  return (
    <section className="bg-white py-24">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Reviews</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Huiseigenaren kiezen voor duidelijkheid.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <figure className="card p-7" key={review.name}>
              <div className="text-lg text-brand-orange">★★★★★</div>
              <blockquote className="mt-5 text-base leading-8 text-neutral-700">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-6 font-bold text-brand-ink">{review.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
