const controlSteps = [
  {
    phase: "Intake",
    layer: "Filtering",
    text: "We beoordelen projecttype, scope en haalbaarheid voordat we capaciteit reserveren."
  },
  {
    phase: "Voorbereiding",
    layer: "Planning",
    text: "Materialen, partners, volgorde en technische keuzes worden vooraf afgestemd."
  },
  {
    phase: "Uitvoering",
    layer: "Teamstructuur",
    text: "Vaste vakmensen, duidelijke aansturing en korte lijnen op locatie."
  },
  {
    phase: "Controle",
    layer: "Kwaliteitsbewaking",
    text: "Tussentijdse checks houden planning, afwerking en afspraken onder controle."
  },
  {
    phase: "Oplevering",
    layer: "Afronding",
    text: "Een verzorgde eindronde met aandacht voor details, communicatie en nazorg."
  }
];

const capacityStats = [
  ["Actieve projecten", "Doorlopende projectstroom"],
  ["Teams in uitvoering", "Vaste uitvoeringsploegen"],
  ["Opschalingsvermogen", "Vaste kern + flexibele schil"],
  ["Werkgebied", "Randstad"]
];

const statusBlocks = [
  {
    title: "In uitvoering",
    text: "Teams op locatie met duidelijke dagplanning."
  },
  {
    title: "In voorbereiding",
    text: "Intakes, materiaalkeuzes en fasering worden vastgelegd."
  },
  {
    title: "Recent afgerond",
    text: "Projecten worden gecontroleerd, schoon opgeleverd en geëvalueerd."
  }
];

const stackItems = [
  "Afbouw",
  "Installaties",
  "Afwerking",
  "Projectcoördinatie"
];

export default function SystemLayers() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-lg border border-black/10 bg-brand-soft p-6 shadow-sm sm:p-8">
            <p className="eyebrow">Onze manier van werken</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
              We werken niet ad-hoc, maar volgens een vaste uitvoeringsstructuur.
            </h2>
            <div className="mt-8 grid gap-3 md:grid-cols-5">
              {controlSteps.map((step, index) => (
                <article
                  className="rounded-lg border border-black/10 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:shadow-premium"
                  key={step.phase}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange text-xs font-extrabold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-orange">
                    {step.layer}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-brand-ink">{step.phase}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{step.text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-lg bg-brand-ink p-6 text-white shadow-premium sm:p-8">
            <p className="eyebrow">Operationele capaciteit</p>
            <div className="mt-6 grid gap-3">
              {capacityStats.map(([label, value]) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                  key={label}
                >
                  <span className="text-sm text-white/60">{label}</span>
                  <span className="text-right text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-lg bg-white/10 p-4 text-sm font-semibold leading-6 text-white/75">
              Wij kunnen binnen korte termijn opschalen wanneer projecten daarom vragen.
            </p>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <p className="eyebrow">Projectstatus</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {statusBlocks.map((status) => (
                <article className="rounded-lg bg-brand-soft p-4" key={status.title}>
                  <span className="inline-flex h-2 w-2 rounded-full bg-brand-orange" />
                  <h3 className="mt-4 text-base font-bold">{status.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{status.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="eyebrow">Onze uitvoeringsstack</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                  Disciplines, teams, planning en coördinatie in één model.
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {stackItems.map((item) => (
                <div
                  className="rounded-lg border border-black/10 bg-brand-soft px-4 py-3 text-sm font-bold text-brand-ink"
                  key={item}
                >
                  <span className="mr-2 text-brand-orange">✔</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-neutral-950 p-6 text-white shadow-premium sm:flex sm:items-center sm:justify-between sm:gap-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Geen losse aannemers. Eén gestructureerde uitvoering.
          </h2>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-white/65 sm:mt-0">
            We werken met opdrachtgevers die waarde hechten aan structuur, kwaliteit
            en een uitvoering die vooraf goed is doordacht.
          </p>
        </div>
      </div>
    </section>
  );
}
