export default function CTA() {
  return (
    <section className="border-b border-white/10 bg-neutral-950 py-8 text-white sm:py-10">
      <div className="section-shell flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Start vandaag
          </p>
          <h2 className="mt-2 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
            Ontvang binnen 24 uur duidelijkheid over uw verbouwing
          </h2>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <a className="btn-primary" href="#aanvraag">
            Start aanvraag
          </a>
          <a className="btn-secondary" href="tel:+31600000000">
            Bespreek uw project met ons
          </a>
        </div>
      </div>
    </section>
  );
}
