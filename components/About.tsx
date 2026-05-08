export default function About() {
  return (
    <section className="bg-brand-ink py-24 text-white" id="over-ons">
      <div className="section-shell grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="min-h-[520px] rounded-lg bg-[url('/dro-renovaties-team.jpg')] bg-cover bg-center shadow-premium" />
        <div>
          <p className="eyebrow">Over ons</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Tweede generatie, moderne aanpak.
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-9 text-white/80">
            <p>
              Mijn naam is Therab. Samen met mijn vader vormen wij de tweede generatie
              binnen DRO Bouwgroep.
            </p>
            <p>
              Met een team van circa 35 vakmensen begeleiden wij dagelijks woningkopers
              van eerste inzicht tot volledige verbouwing.
            </p>
            <p>Wij geloven dat duidelijkheid vooraf het verschil maakt.</p>
          </div>
          <p className="mt-8 border-l-4 border-brand-orange pl-5 text-base font-semibold text-white">
            Met deze toppers bouwen wij elke dag met trots door.
          </p>
        </div>
      </div>
    </section>
  );
}
