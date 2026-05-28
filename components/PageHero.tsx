import GoogleRatingBadge from "@/components/GoogleRatingBadge";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  text: string;
  backgroundImage?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export default function PageHero({
  eyebrow,
  title,
  text,
  backgroundImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85",
  primaryLabel = "Start intake",
  primaryHref = "/contact",
  secondaryLabel = "Bespreek uw project met ons",
  secondaryHref = "tel:+31600000000"
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-ink py-14 text-white sm:py-16">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
      <div className="section-shell">
        <div className="max-w-3xl animate-float-in">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{text}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary" href={primaryHref}>
              {primaryLabel}
            </a>
            <a className="btn-secondary" href={secondaryHref}>
              {secondaryLabel}
            </a>
          </div>
          <div className="mt-6">
            <GoogleRatingBadge compact variant="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
