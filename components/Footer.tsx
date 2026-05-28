import type {ServiceSummary, SiteSettings} from "@/lib/types";
import {fallbackServices} from "@/lib/cms-fallback";

type FooterProps = {
  services: ServiceSummary[];
  siteSettings: SiteSettings;
};

export default function Footer({services, siteSettings}: FooterProps) {
  const footer = siteSettings.footer;
  const resolvedServices = services.length ? services : fallbackServices;

  return (
    <footer className="bg-brand-ink text-white">
      <div className="section-shell py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_1.1fr_1fr]">
          <div>
            <a className="inline-flex items-center" href="/">
              <img
                alt={footer.logoAlt}
                className="h-10 w-auto object-contain"
                src={footer.logo}
              />
            </a>
            <p className="mt-3 text-sm font-bold">{footer.brandTitle}</p>
            <p className="mt-2 max-w-sm text-xs leading-5 text-white/60">
              {footer.description}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              {footer.contactTitle}
            </p>
            <div className="mt-3 grid gap-2 text-xs leading-5 text-white/65">
              <p>{footer.contactAddress}</p>
              <a className="transition hover:text-brand-orange" href={footer.contactPhoneHref}>
                {footer.contactPhone} <span className="text-white/40">{footer.contactPhoneNote}</span>
              </a>
              <a className="transition hover:text-brand-orange" href={footer.contactEmailHref}>
                {footer.contactEmail}
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              {footer.servicesTitle}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-white/65">
              {resolvedServices.map((service) => (
                <a className="transition hover:text-brand-orange" href={service.href} key={service.href}>
                  {service.title}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
              {footer.businessTitle}
            </p>
            <p className="mt-3 text-xs leading-5 text-white/60">
              {footer.businessText}
            </p>
            <div className="mt-3 grid gap-1.5 text-xs text-white/70">
              {footer.businessItems.map((item) => (
                <p key={item}>
                  <span className="mr-2 text-brand-orange">✔</span>
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-white">
              {footer.businessClosing}
            </p>
          </div>
        </div>

        <div className="mt-6 border-y border-white/10 py-3">
          <p className="text-sm font-bold tracking-tight text-white/90 sm:text-base">
            {footer.statement}
          </p>
        </div>

        <div className="mt-4 flex flex-col justify-between gap-3 text-xs text-white/40 md:flex-row md:items-center">
          <p>{footer.copyright}</p>
          <div className="flex flex-wrap gap-5">
            {footer.legalLinks.map((link) => (
              <a className="transition hover:text-brand-orange" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
