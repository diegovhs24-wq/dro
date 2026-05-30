import Link from "next/link";
import CTASection from "@/components/CTASection";
import type {ServiceSummary, SiteSettings} from "@/lib/types";

type FooterProps = {
  services: ServiceSummary[];
  siteSettings: SiteSettings;
};

export default function Footer({services, siteSettings}: FooterProps) {
  const footer = siteSettings.footer;

  return (
    <>
      {siteSettings.footerCta && <CTASection {...siteSettings.footerCta} />}
      <footer className="bg-brand-ink text-white">
      <div className="section-shell py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_1.1fr_1fr]">
          <div>
            <Link className="inline-flex items-center" href="/">
              {footer.logo ? (
                <img
                  alt={footer.logoAlt || footer.brandTitle}
                  className="h-10 w-auto object-contain"
                  src={footer.logo}
                />
              ) : (
                <span className="flex items-end gap-1.5 leading-none text-white">
                  <svg className="h-9 w-11 shrink-0 text-brand-orange" fill="none" viewBox="0 0 64 46" aria-hidden="true">
                    <path d="M7 28 32 7l25 21M14 28v13h36V28" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                    <path d="M20 41h38" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
                  </svg>
                  <span className="pb-0.5">
                    <span className="block text-[22px] font-black tracking-[-0.07em]">
                      <span className="text-brand-orange">DRO</span>BOUW
                    </span>
                    <span className="block pl-0.5 text-[6px] font-black uppercase tracking-[0.22em] text-white/60">
                      Bouw & Renovatie
                    </span>
                  </span>
                </span>
              )}
            </Link>
            {footer.brandTitle && (
              <p className="mt-3 text-sm font-bold">{footer.brandTitle}</p>
            )}
            {footer.description && (
              <p className="mt-2 max-w-sm text-xs leading-5 text-white/60">
                {footer.description}
              </p>
            )}
          </div>

          {(footer.contactTitle || footer.contactAddress || footer.contactPhone || footer.contactEmail) && (
            <div>
              {footer.contactTitle && (
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                  {footer.contactTitle}
                </p>
              )}
              <div className="mt-3 grid gap-2 text-xs leading-5 text-white/65">
                {footer.contactAddress && <p>{footer.contactAddress}</p>}
                {footer.contactPhone && (
                  <a className="transition hover:text-brand-orange" href={footer.contactPhoneHref || undefined}>
                    {footer.contactPhone}
                    {footer.contactPhoneNote && (
                      <span className="text-white/40"> {footer.contactPhoneNote}</span>
                    )}
                  </a>
                )}
                {footer.contactEmail && (
                  <a className="transition hover:text-brand-orange" href={footer.contactEmailHref || undefined}>
                    {footer.contactEmail}
                  </a>
                )}
              </div>
            </div>
          )}

          {services.length > 0 && (
            <div>
              {footer.servicesTitle && (
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                  {footer.servicesTitle}
                </p>
              )}
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-white/65">
                {services.map((service) => (
                  <Link className="transition hover:text-brand-orange" href={service.href} key={service.href}>
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {(footer.businessTitle || footer.businessText || footer.businessItems.length > 0) && (
            <div>
              {footer.businessTitle && (
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange">
                  {footer.businessTitle}
                </p>
              )}
              {footer.businessText && (
                <p className="mt-3 text-xs leading-5 text-white/60">{footer.businessText}</p>
              )}
              {footer.businessItems.length > 0 && (
                <div className="mt-3 grid gap-1.5 text-xs text-white/70">
                  {footer.businessItems.map((item) => (
                    <p key={item}>
                      <span className="mr-2 text-brand-orange">✔</span>
                      {item}
                    </p>
                  ))}
                </div>
              )}
              {footer.businessClosing && (
                <p className="mt-3 text-xs font-semibold leading-5 text-white">
                  {footer.businessClosing}
                </p>
              )}
            </div>
          )}
        </div>

        {footer.statement && (
          <div className="mt-6 border-y border-white/10 py-3">
            <p className="text-sm font-bold tracking-tight text-white/90 sm:text-base">
              {footer.statement}
            </p>
          </div>
        )}

        {(footer.copyright || footer.legalLinks.length > 0) && (
          <div className="mt-4 flex flex-col justify-between gap-3 text-xs text-white/40 md:flex-row md:items-center">
            {footer.copyright && <p>{footer.copyright}</p>}
            {footer.legalLinks.length > 0 && (
              <div className="flex flex-wrap gap-5">
                {footer.legalLinks.map((link) => (
                  <Link className="transition hover:text-brand-orange" href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
    </>
  );
}
