import IntakeWizard from "@/components/IntakeWizard";

export default function LeadForm() {
  return (
    <section className="bg-white py-10 sm:py-12" id="aanvraag">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:items-start">
        <div>
          <p className="eyebrow">Project intake</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-5xl">
            Start uw project intake
          </h1>
          <p className="mt-4 text-base font-semibold leading-7 text-neutral-600">
            Stap voor stap geregeld. Binnen 24 uur duidelijkheid.
          </p>
          <div className="mt-6 rounded-lg bg-brand-soft p-5 text-sm font-bold leading-7 text-brand-ink">
            Eén vraag per keer. Zo blijft de aanvraag rustig en overzichtelijk.
          </div>
        </div>

        <IntakeWizard />
      </div>
    </section>
  );
}
