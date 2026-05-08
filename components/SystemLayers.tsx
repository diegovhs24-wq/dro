const phases = [
  {
    title: "Kennismaken",
    text: "We luisteren naar uw situatie en kijken wat u nodig heeft."
  },
  {
    title: "Helder plan",
    text: "U krijgt duidelijkheid over aanpak, planning en vervolgstappen."
  },
  {
    title: "Voorbereiding",
    text: "Wij stemmen keuzes, mensen en materialen rustig op elkaar af."
  },
  {
    title: "Uitvoering",
    text: "Onze vakmensen voeren het werk netjes en volgens afspraak uit."
  },
  {
    title: "Oplevering",
    text: "We lopen alles samen door en zorgen dat het klopt."
  }
];

export default function SystemLayers() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="max-w-xl">
          <p className="eyebrow">Werkwijze</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Rustig begeleid van eerste gesprek tot oplevering.
          </h2>
          <p className="mt-5 text-base font-semibold leading-8 text-neutral-600">
            U hoeft niet alles zelf te regelen. Wij houden overzicht en nemen u
            stap voor stap mee.
          </p>
          <a className="btn-primary mt-7" href="/werkwijze">
            Bekijk werkwijze
          </a>
        </div>

        <div className="relative">
          <div className="absolute bottom-4 left-4 top-4 hidden w-px bg-black/10 sm:block" />
          <div className="grid gap-8">
            {phases.map((phase, index) => (
              <div className="relative flex gap-5 sm:pl-12" key={phase.title}>
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white sm:absolute sm:left-0">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-brand-ink">{phase.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-600">
                    {phase.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
