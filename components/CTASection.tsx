type CTASectionProps = {
  title?: string;
  text?: string;
};

export default function CTASection({
  title = "Ontvang binnen 24 uur duidelijkheid over uw verbouwing",
  text = "Bespreek uw project met ons en krijg een helder beeld van mogelijkheden, planning en vervolgstappen."
}: CTASectionProps) {
  return (
    <section className="border-b border-white/10 bg-neutral-950 py-8 text-white sm:py-10">
      <div className="section-shell flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
            Start vandaag
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/65">{text}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <a className="btn-primary" href="/contact">
            Plan een vrijblijvend gesprek
          </a>
          <a className="btn-secondary" href="tel:+31600000000">
            Bespreek uw project met ons
          </a>
        </div>
      </div>
    </section>
  );
}
