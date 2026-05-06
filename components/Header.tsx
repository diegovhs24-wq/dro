"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { services } from "@/components/siteContent";

const navItems = [
  { label: "Werkwijze", href: "/werkwijze" },
  { label: "Zakelijk", href: "/zakelijk" },
  { label: "Projecten", href: "/projecten" },
  { label: "Over ons", href: "/over-ons" }
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

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 12);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? "border-black/10 bg-white shadow-[0_18px_45px_rgba(15,15,15,0.08)]"
          : "border-black/5 bg-white/90"
      }`}
    >
      <div
        className={`section-shell flex items-center justify-between gap-8 transition-all duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link className="flex shrink-0 items-center" href="/" aria-label="DRO Renovaties home">
          <img
            alt="DRO Bouw en aannemingsbedrijf"
            className={`w-auto object-contain transition-all duration-300 ${
              scrolled ? "h-16" : "h-20"
            }`}
            src="/drobouwlogo.png"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex xl:gap-10" aria-label="Hoofdmenu">
          <div className="group">
            <button
              className={`relative flex items-center text-sm font-semibold text-neutral-700 transition hover:text-brand-orange ${
                scrolled ? "h-16" : "h-20"
              }`}
              type="button"
            >
              <span className="relative after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-orange after:transition-all group-hover:after:w-full">
                Diensten
              </span>
              <span className="ml-2 text-brand-orange">+</span>
            </button>

            <div
              className="pointer-events-none fixed left-1/2 z-50 w-[min(1180px,calc(100vw-40px))] -translate-x-1/2 translate-y-3 rounded-lg border border-black/10 bg-white opacity-0 shadow-[0_30px_90px_rgba(15,15,15,0.16)] transition duration-200 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100"
              style={{ top: scrolled ? 64 : 80 }}
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
              className="relative text-sm font-semibold text-neutral-700 transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-brand-orange after:transition-all hover:text-brand-orange hover:after:w-full"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          className="hidden rounded-md bg-brand-orange px-5 py-3 text-sm font-bold text-white shadow-[0_16px_35px_rgba(255,106,0,0.22)] transition hover:-translate-y-0.5 hover:bg-brand-orange/90 sm:inline-flex"
          href="/contact"
        >
          Start intake
        </Link>
      </div>
    </header>
  );
}
