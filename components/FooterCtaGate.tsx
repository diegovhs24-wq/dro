"use client";

import {usePathname} from "next/navigation";

import CTASection from "@/components/CTASection";
import type {SiteSettings} from "@/lib/types";

// De consumentenbanner ("Wilt u een renovatie met dezelfde duidelijkheid?")
// past niet na de zakelijke slotsectie op /zakelijk, dus die route slaat hem over.
// De premium pagina's (fase 2b) eindigen met een eigen intake; een tweede banner
// eronder is dubbel en bevat een onbevestigde reactietijd.
const SUPPRESS_ON = ["/zakelijk", "/", "/totaalrenovatie", "/grote-renovaties", "/constructieve-werken", "/projecten"];
const SUPPRESS_PREFIX = ["/projecten/"];

// Bij het vooraf renderen van de homepage (ISR) geeft usePathname op de server
// "/index" terug, in de browser "/". Zonder normalisatie toont de server de banner
// en de browser niet: dat gaf React-fout #418 (hydration mismatch) op de homepage.
function normalizePath(pathname: string | null) {
  if (!pathname || pathname === "/index") return "/";
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
}

export default function FooterCtaGate({cta}: {cta: NonNullable<SiteSettings["footerCta"]>}) {
  const pathname = normalizePath(usePathname());
  if (SUPPRESS_ON.some((path) => pathname === path) || SUPPRESS_PREFIX.some((p) => pathname.startsWith(p))) return null;
  return <CTASection {...cta} />;
}
