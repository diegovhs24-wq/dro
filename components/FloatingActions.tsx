"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SUPPRESS_PATHS = new Set(["/contact", "/over-ons", "/werkwijze", "/zakelijk"]);

type Props = {
  whatsappLabel: string;
  whatsappHref: string;
  intakeLabel: string;
  intakeHref: string;
};

// Zwevende knoppen mogen geen inhoud bedekken: ze verdwijnen zodra de footer in
// beeld is, en de intakeknop ook zolang er een intakeformulier zichtbaar is
// (dan staat de actie al op het scherm).
function useHidden(pathname: string) {
  const [footerVisible, setFooterVisible] = useState(false);
  const [intakeVisible, setIntakeVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const footer = document.querySelector("footer");
    const intakes = Array.from(document.querySelectorAll(".intake-widget"));
    const visible = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) visible.set(entry.target, entry.isIntersecting);
      setFooterVisible(Boolean(footer && visible.get(footer)));
      setIntakeVisible(intakes.some((el) => visible.get(el)));
    });
    if (footer) observer.observe(footer);
    intakes.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return { footerVisible, intakeVisible };
}

export default function FloatingActions({whatsappLabel, whatsappHref, intakeLabel, intakeHref}: Props) {
  const pathname = usePathname();
  const { footerVisible, intakeVisible } = useHidden(pathname);

  if (SUPPRESS_PATHS.has(pathname)) return null;

  const hide = "pointer-events-none translate-y-3 opacity-0";
  const show = "opacity-100";

  return (
    <>
      <a
        aria-hidden={footerVisible || undefined}
        aria-label={whatsappLabel}
        className={`fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-base font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 ${footerVisible ? hide : show}`}
        href={whatsappHref}
        tabIndex={footerVisible ? -1 : undefined}
      >
        WA
      </a>
      <Link
        aria-hidden={footerVisible || intakeVisible || undefined}
        className={`fixed bottom-5 left-5 z-50 hidden rounded-btn bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white shadow-cta transition duration-300 hover:-translate-y-1 sm:inline-flex ${footerVisible || intakeVisible ? hide : show}`}
        href={intakeHref}
        tabIndex={footerVisible || intakeVisible ? -1 : undefined}
      >
        {intakeLabel}
      </Link>
    </>
  );
}
