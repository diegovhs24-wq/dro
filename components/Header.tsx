"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { HeaderMenuItem, SmartLink, SiteSettings } from "@/lib/types";
import SmartButton from "@/components/SmartButton";

type HeaderProps = {
  siteSettings: SiteSettings;
};

function resolveSmartLink(link: SmartLink | undefined): {href: string; openInNewTab: boolean} {
  if (!link) return {href: "#", openInNewTab: false};

  if (link.linkType === "internal") {
    const ref = link.internalRef;
    if (!ref?.slug) return {href: "#", openInNewTab: false};
    let href = "/";
    if (ref._type === "page") href = ref.slug === "home" ? "/" : `/${ref.slug}`;
    else if (ref._type === "service") href = `/diensten/${ref.slug}`;
    else if (ref._type === "project") href = `/projecten/${ref.slug}`;
    return {href, openInNewTab: false};
  }

  return {
    href: link.externalUrl || "#",
    openInNewTab: link.openInNewTab ?? false,
  };
}

export default function Header({siteSettings}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, {passive: true});
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 transition-all duration-300 ${
        scrolled
          ? "border-black/10 shadow-[0_10px_28px_rgba(15,15,15,0.06)]"
          : "border-black/5 shadow-[0_4px_16px_rgba(15,15,15,0.03)]"
      }`}
    >
      <div className="section-shell flex h-[68px] items-center justify-between gap-8 transition-all duration-300">
        <Logo logo={siteSettings.headerLogo} />

        <nav className="hidden flex-1 items-center justify-center gap-9 md:flex xl:gap-12" aria-label="Hoofdmenu">
          {siteSettings.headerMenu.map((item) =>
            item.type === "megaMenu" ? (
              <MegaMenuItem key={item.label} item={item} pathname={pathname} />
            ) : (
              <LinkMenuItem key={item.label} item={item} pathname={pathname} />
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <SmartButton buttons={siteSettings.headerButtons} />
        </div>
      </div>
    </header>
  );
}

function Logo({logo}: {logo?: string}) {
  return (
    <Link className="flex w-[170px] shrink-0 items-center" href="/" aria-label="DRO Renovaties home">
      {logo ? (
        <img src={logo} alt="DRO Renovaties" className="h-10 w-auto object-contain" />
      ) : (
        <span className="flex items-end gap-1.5 leading-none text-brand-ink">
          <svg className="h-10 w-12 shrink-0 text-brand-orange" fill="none" viewBox="0 0 64 46" aria-hidden="true">
            <path
              d="M7 28 32 7l25 21M14 28v13h36V28"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <path d="M20 41h38" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
          </svg>
          <span className="pb-0.5">
            <span className="block text-[25px] font-black tracking-[-0.07em]">
              <span className="text-brand-orange">DRO</span>BOUW
            </span>
            <span className="block pl-0.5 text-[7px] font-black uppercase tracking-[0.22em] text-neutral-700">
              Bouw & Renovatie
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}

function LinkMenuItem({item, pathname}: {item: Extract<HeaderMenuItem, {type: "link"}>; pathname: string}) {
  const {href, openInNewTab} = resolveSmartLink(item.link);
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      className={`relative text-[13px] font-medium transition after:absolute after:-bottom-3 after:left-0 after:h-0.5 after:bg-brand-orange after:transition-all hover:text-brand-ink hover:after:w-full ${
        isActive ? "text-brand-ink after:w-full" : "text-neutral-600 after:w-0"
      }`}
    >
      {item.label}
    </Link>
  );
}

function MegaMenuItem({item, pathname}: {item: Extract<HeaderMenuItem, {type: "megaMenu"}>; pathname: string}) {
  const isActive = item.columns.some((col) =>
    col.links.some(({link}) => {
      const {href} = resolveSmartLink(link);
      return pathname === href || pathname.startsWith(href + "/");
    })
  );

  return (
    <div className="group">
      <button
        type="button"
        className={`relative flex h-[68px] items-center gap-2 text-[13px] font-medium transition hover:text-brand-ink ${
          isActive ? "text-brand-ink" : "text-neutral-600"
        }`}
      >
        <span
          className={`relative after:absolute after:-bottom-3 after:left-0 after:h-0.5 after:bg-brand-orange after:transition-all group-hover:after:w-full ${
            isActive ? "after:w-full" : "after:w-0"
          }`}
        >
          {item.label}
        </span>
        <span className="text-brand-orange">+</span>
      </button>

      <div
        className="pointer-events-none fixed left-1/2 z-50 w-[min(1180px,calc(100vw-40px))] -translate-x-1/2 translate-y-3 rounded-lg border border-black/10 bg-white opacity-0 shadow-[0_30px_90px_rgba(15,15,15,0.16)] transition duration-200 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
        style={{top: 68}}
      >
        <div
          className={`grid gap-7 p-7 ${
            item.promo?.image
              ? "grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_320px]"
              : "grid-cols-3"
          }`}
        >
          {item.columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                {col.title}
              </p>
              <div className="grid gap-1">
                {col.links.map(({label, link}) => {
                  const {href, openInNewTab} = resolveSmartLink(link);
                  return (
                    <Link
                      key={`${label}-${href}`}
                      href={href}
                      target={openInNewTab ? "_blank" : undefined}
                      rel={openInNewTab ? "noopener noreferrer" : undefined}
                      className="group/link flex items-center justify-between rounded-md px-3 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-brand-orange"
                    >
                      <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-orange after:transition-all group-hover/link:after:w-full">
                        {label}
                      </span>
                      <span className="text-xs opacity-0 transition group-hover/link:translate-x-1 group-hover/link:opacity-100">
                        -&gt;
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {item.promo?.image && (
            <div className="relative hidden min-h-[260px] overflow-hidden rounded-lg bg-neutral-950 xl:block">
              <img
                alt={item.promo.eyebrow || item.label}
                className="h-full w-full object-cover"
                src={item.promo.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {item.promo.eyebrow && (
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">
                    {item.promo.eyebrow}
                  </p>
                )}
                {item.promo.title && (
                  <p className="mt-3 text-2xl font-bold leading-tight">{item.promo.title}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {item.promo?.footerText && (
          <div className="border-t border-black/10 px-7 py-4 text-sm font-medium text-neutral-500">
            {item.promo.footerText}
          </div>
        )}
      </div>
    </div>
  );
}
