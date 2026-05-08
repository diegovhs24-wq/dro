"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { services } from "@/components/siteContent";

const navItems = [
  { label: "Over ons", href: "/over-ons" },
  { label: "Werkwijze", href: "/werkwijze" },
  { label: "Projecten", href: "/projecten" },
  { label: "Zakelijk", href: "/zakelijk" }
];

const serviceGroups = [
  {
    title: "Renovatie",
    slugs: ["badkamer-renovatie", "totaalrenovatie", "uitbouw-aanbouw", "afbouw-nieuwbouw"]
  },
  {
    title: "Installaties & Duurzaam",
    slugs: ["vloerverwarming", "warmtepomp", "zonnepanelen"]
  },
  {
    title: "Afwerking & Onderhoud",
    slugs: ["stuc-schilderwerk", "onderhoud"]
  }
].map((group) => ({
  ...group,
  items: services.filter((service) => group.slugs.includes(service.slug))
}));

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const servicesActive = pathname === "/diensten" || pathname.startsWith("/diensten/");

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 12);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 transition-all duration-300 ${
        scrolled
          ? "border-black/10 shadow-[0_10px_28px_rgba(15,15,15,0.06)]"
          : "border-black/5 shadow-[0_4px_16px_rgba(15,15,15,0.03)]"
      }`}
    >
      <div
        className="section-shell flex h-[68px] items-center justify-between gap-8 transition-all duration-300"
      >
        <Link className="flex w-[170px] shrink-0 items-center" href="/" aria-label="DRO Renovaties home">
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
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-9 md:flex xl:gap-12" aria-label="Hoofdmenu">
          <div className="group">
            <button
              className={`relative flex h-[68px] items-center text-[13px] font-medium transition hover:text-brand-ink ${
                servicesActive ? "text-brand-ink" : "text-neutral-600"
              }`}
              type="button"
            >
              <span
                className={`relative after:absolute after:-bottom-3 after:left-0 after:h-0.5 after:bg-brand-orange after:transition-all group-hover:after:w-full ${
                  servicesActive ? "after:w-full" : "after:w-0"
                }`}
              >
                Diensten
              </span>
              <span className="ml-2 text-brand-orange">+</span>
            </button>

            <div
              className="pointer-events-none fixed left-1/2 z-50 w-[min(1180px,calc(100vw-40px))] -translate-x-1/2 translate-y-3 rounded-lg border border-black/10 bg-white opacity-0 shadow-[0_30px_90px_rgba(15,15,15,0.16)] transition duration-200 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
              style={{ top: 68 }}
            >
              <div className="grid grid-cols-3 gap-7 p-7 xl:grid-cols-[1fr_1fr_1fr_320px]">
                {serviceGroups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                      {group.title}
                    </p>
                    <div className="grid gap-1">
                      {group.items.map((service) => (
                        <Link
                          className="group/link flex items-center justify-between rounded-md px-3 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-brand-orange"
                          href={service.href}
                          key={service.href}
                        >
                          <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-brand-orange after:transition-all group-hover/link:after:w-full">
                            {service.title}
                          </span>
                          <span className="text-xs opacity-0 transition group-hover/link:translate-x-1 group-hover/link:opacity-100">
                            -&gt;
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="relative hidden min-h-[260px] overflow-hidden rounded-lg bg-neutral-950 xl:block">
                  <img
                    alt="DRO Renovaties team"
                    className="h-full w-full object-cover"
                    src="/dro-renovaties-team.jpg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">DRO Renovaties</p>
                    <p className="mt-3 text-2xl font-bold leading-tight">Uw project, volledig geregeld.</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-black/10 px-7 py-4 text-sm font-medium text-neutral-500">
                We begeleiden uw verbouwing van A tot Z.
              </div>
            </div>
          </div>

          {navItems.map((item) => (
            <Link
              className={`relative text-[13px] font-medium transition after:absolute after:-bottom-3 after:left-0 after:h-0.5 after:bg-brand-orange after:transition-all hover:text-brand-ink hover:after:w-full ${
                pathname === item.href ? "text-brand-ink after:w-full" : "text-neutral-600 after:w-0"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          className="hidden min-h-10 items-center rounded-lg bg-brand-orange px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(255,106,0,0.20)] transition hover:-translate-y-0.5 hover:bg-brand-orange/90 sm:inline-flex"
          href="/contact"
        >
          Start intake
        </Link>
      </div>
    </header>
  );
}
