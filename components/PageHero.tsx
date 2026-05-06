type PageHeroProps = {
  eyebrow: string;
  title: string;
  text: string;
};

export default function PageHero({ eyebrow, title, text }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-ink py-24 text-white sm:py-28">
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
      <div className="section-shell">
        <div className="max-w-4xl animate-float-in">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/78">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary" href="/contact">
              Plan een vrijblijvend gesprek
            </a>
            <a className="btn-secondary" href="tel:+31600000000">
              Bespreek uw project met ons
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
