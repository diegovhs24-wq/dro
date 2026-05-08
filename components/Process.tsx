const steps = [
  { icon: "01", title: "Aanvraag met foto's", text: "U deelt de situatie, wensen en beelden." },
  { icon: "02", title: "Persoonlijk contact", text: "Een consulent bespreekt wat realistisch is." },
  { icon: "03", title: "Heldere offerte", text: "Planning en scope worden concreet." },
  { icon: "04", title: "Start & oplevering", text: "Onze vakmensen voeren strak en netjes uit." }
];

export default function Process() {
  return (
    <section className="bg-white py-24" id="werkwijze">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">Werkwijze</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Van eerste foto naar duidelijke verbouwroute.
            </h2>
          </div>
          <p className="text-lg leading-8 text-neutral-600">
            Geen losse beloftes, maar een praktisch proces dat snel duidelijk maakt wat kan
            en wanneer we kunnen starten.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {steps.map((step) => (
            <div className="relative rounded-lg border border-black/10 p-6" key={step.title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-brand-orange text-sm font-bold text-white">
                {step.icon}
              </div>
              <h3 className="mt-6 text-lg font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
