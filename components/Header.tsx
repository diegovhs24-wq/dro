"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, {passive: true});
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-white/95 transition-all duration-300 ${
          scrolled
            ? "border-black/10 shadow-[0_10px_28px_rgba(15,15,15,0.06)]"
            : "border-black/5 shadow-[0_4px_16px_rgba(15,15,15,0.03)]"
        }`}
      >
        <div className="section-shell flex h-[68px] items-center justify-between gap-8 transition-all duration-300">
          <Logo logo={siteSettings.headerLogo} />

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center gap-9 md:flex xl:gap-12" aria-label="Hoofdmenu">
            {siteSettings.headerMenu.map((item) =>
              item.type === "megaMenu" ? (
                <MegaMenuItem key={item.label} item={item} pathname={pathname} />
              ) : (
                <LinkMenuItem key={item.label} item={item} pathname={pathname} />
              )
            )}
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <SmartButton buttons={siteSettings.headerButtons} />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-md text-brand-ink transition hover:bg-neutral-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileMenu
        id="mobile-menu"
        open={mobileOpen}
        items={siteSettings.headerMenu}
        buttons={siteSettings.headerButtons}
        pathname={pathname}
        onClose={() => setMobileOpen(false)}
      />
    </>
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

type MobileMenuProps = {
  id: string;
  open: boolean;
  items: HeaderMenuItem[];
  buttons: SiteSettings["headerButtons"];
  pathname: string;
  onClose: () => void;
};

function MobileMenu({id, open, items, buttons, pathname, onClose}: MobileMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Navigatiemenu"
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(340px,100vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-black/10 px-5">
          <Logo />
          <button
            type="button"
            aria-label="Menu sluiten"
            className="flex h-9 w-9 items-center justify-center rounded-md text-brand-ink transition hover:bg-neutral-100"
            onClick={onClose}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobiel menu">
          <ul className="grid gap-1">
            {items.map((item) => (
              <li key={item.label}>
                {item.type === "megaMenu" ? (
                  <MobileMegaItem item={item} pathname={pathname} />
                ) : (
                  <MobileLinkItem item={item} pathname={pathname} />
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA buttons pinned to bottom */}
        {buttons && buttons.length > 0 && (
          <div className="shrink-0 border-t border-black/10 px-4 py-4">
            <div className="flex flex-col gap-2">
              <SmartButton buttons={buttons} className="justify-center" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function MobileLinkItem({item, pathname}: {item: Extract<HeaderMenuItem, {type: "link"}>; pathname: string}) {
  const {href, openInNewTab} = resolveSmartLink(item.link);
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      className={`flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition ${
        isActive
          ? "bg-brand-soft text-brand-ink"
          : "text-neutral-700 hover:bg-neutral-100 hover:text-brand-ink"
      }`}
    >
      {item.label}
    </Link>
  );
}

function MobileMegaItem({item, pathname}: {item: Extract<HeaderMenuItem, {type: "megaMenu"}>; pathname: string}) {
  const isActive = item.columns.some((col) =>
    col.links.some(({link}) => {
      const {href} = resolveSmartLink(link);
      return pathname === href || pathname.startsWith(href + "/");
    })
  );
  const [expanded, setExpanded] = useState(isActive);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition ${
          isActive
            ? "bg-brand-soft text-brand-ink"
            : "text-neutral-700 hover:bg-neutral-100 hover:text-brand-ink"
        }`}
        onClick={() => setExpanded((v) => !v)}
      >
        {item.label}
        <svg
          className={`h-4 w-4 shrink-0 text-brand-orange transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: expanded ? (contentRef.current?.scrollHeight ?? 1000) : 0,
        }}
      >
        <div className="ml-2 mt-1 grid gap-4 border-l-2 border-black/10 pl-4 pb-2">
          {item.columns.map((col) => (
            <div key={col.title}>
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                {col.title}
              </p>
              <div className="grid gap-0.5">
                {col.links.map(({label, link}) => {
                  const {href, openInNewTab} = resolveSmartLink(link);
                  const isLinkActive = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <Link
                      key={`${label}-${href}`}
                      href={href}
                      target={openInNewTab ? "_blank" : undefined}
                      rel={openInNewTab ? "noopener noreferrer" : undefined}
                      className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                        isLinkActive
                          ? "text-brand-orange"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-brand-orange"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
