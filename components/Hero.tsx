export default function Hero() {
  return (
    <section className="relative isolate min-h-[82vh] overflow-hidden bg-brand-ink">
      <div className="absolute inset-0 -z-10 bg-[url('/dro-renovaties-team.jpg')] bg-cover bg-center lg:bg-[center_38%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
      <div className="section-shell flex min-h-[82vh] items-center py-16">
        <div className="max-w-2xl animate-float-in text-white">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
            Actief in Zuid-Holland en omgeving
          </p>
          <h1 className="text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
            Uw verbouwing strak geregeld, van eerste intake tot oplevering.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/82 sm:text-lg">
            Binnen 24 uur krijgt u helder inzicht in de mogelijkheden, planning en vervolgstappen.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary" href="/contact">
              Start intake
            </a>
            <a className="btn-secondary" href="tel:+31600000000">
              Bespreek uw project met ons
            </a>
          </div>
          <div className="mt-10 flex max-w-2xl flex-col gap-3 border-t border-white/18 pt-6 text-sm font-semibold text-white/86 sm:flex-row sm:flex-wrap">
            <div className="rounded-md border border-white/15 bg-white/[0.07] px-3.5 py-2 backdrop-blur">
              ⭐ 4.8+ reviews
            </div>
            <div className="rounded-md border border-white/15 bg-white/[0.07] px-3.5 py-2 backdrop-blur">
              ✔ Heldere afspraken vooraf
            </div>
            <div className="rounded-md border border-white/15 bg-white/[0.07] px-3.5 py-2 backdrop-blur">
              ✔ Snelle start mogelijk
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
