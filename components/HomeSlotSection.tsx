import SmartIntakeWizard from "@/components/SmartIntakeWizard";
import type {IntakeFormConfig} from "@/lib/types";

type HomeSlotSectionProps = {
  // Niet meer gebruikt door de nieuwe SmartIntakeWizard (die is code-driven,
  // niet CMS-driven), maar de prop blijft bestaan zodat CmsPageView niets
  // hoeft te wijzigen aan hoe dit component wordt aangeroepen.
  intakeForm?: IntakeFormConfig | null;
};

// Afwijking van het prototype: daar staat hier alleen een CTA-knop (statisch
// mockup). In productie moet het intakeformulier hier daadwerkelijk bereikbaar
// zijn, dus de echte wizard staat in de rechterkolom in plaats van een
// knoppenrij.
export default function HomeSlotSection(_props: HomeSlotSectionProps) {
  return (
    <section className="border-t border-brand-line py-24 sm:py-28" id="start">
      <div className="section-shell grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange">Kennismaken</p>
          <h2 className="mt-4 max-w-[16ch] text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[42px]">
            Vertel ons over uw plannen. <em className="font-serif font-medium not-italic italic">Wij vertellen eerlijk wat we ervan vinden.</em>
          </h2>
          <p className="mt-5 max-w-[30em] text-[16.5px] text-brand-stone">
            Een kennismaking is vrijblijvend en verplicht u tot niets. Binnen een werkdag hoort u of uw project bij ons past en wat een logische volgende stap is.
          </p>
          <div className="mt-8 grid gap-2 text-[14.5px] text-brand-stone">
            <span>
              Of bel of WhatsApp{" "}
              <a className="font-medium text-brand-ink" href="tel:+31850871814">
                085 087 1814
              </a>
            </span>
            <span>Op afspraak: Orionstraat 235, Den Haag</span>
          </div>
        </div>

        <div className="rounded border border-brand-line bg-brand-soft p-5 sm:p-6">
          <SmartIntakeWizard embedded />
        </div>
      </div>
    </section>
  );
}
