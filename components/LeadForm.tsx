import IntakeWizard from "@/components/IntakeWizard";
import type {ContactPageContent} from "@/lib/types";

type LeadFormProps = {
  content: ContactPageContent;
};

export default function LeadForm({content}: LeadFormProps) {
  return (
    <section className="bg-white py-10 sm:py-12" id="aanvraag">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:items-start">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-ink sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 text-base font-semibold leading-7 text-neutral-600">
            {content.text}
          </p>
          <div className="mt-6 rounded-lg bg-brand-soft p-5 text-sm font-bold leading-7 text-brand-ink">
            {content.note}
          </div>
        </div>

        <IntakeWizard />
      </div>
    </section>
  );
}
