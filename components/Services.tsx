const services = [
  {
    title: "Badkamer renovatie",
    text: "Van sloop tot afwerking: strak tegelwerk, slimme indeling en betrouwbare planning.",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Totaalrenovatie",
    text: "Een compleet traject met een vast aanspreekpunt en duidelijke keuzes vooraf.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Uitbouw / aanbouw",
    text: "Meer leefruimte met bouwkundige precisie, heldere fasering en nette oplevering.",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=80"
  },
  {
    title: "Afbouw nieuwbouw",
    text: "Van casco naar instapklaar, met vakmensen die tempo en kwaliteit combineren.",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80"
  }
];

export default function Services() {
  return (
    <section className="bg-brand-soft py-24" id="diensten">
      <div className="section-shell">
        <div className="max-w-2xl animate-fade-in">
          <p className="eyebrow">Diensten</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-5xl">
            Renovaties met overzicht vanaf dag een.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article className="card overflow-hidden" key={service.title}>
              <div
                className="h-52 bg-cover bg-center"
                style={{ backgroundImage: `url(${service.image})` }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-ink">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">{service.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
