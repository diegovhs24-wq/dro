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

export default function FooterCtaGate({cta}: {cta: NonNullable<SiteSettings["footerCta"]>}) {
  const pathname = usePathname();
  if (SUPPRESS_ON.some((path) => pathname === path) || SUPPRESS_PREFIX.some((p) => pathname.startsWith(p))) return null;
  return <CTASection {...cta} />;
}
