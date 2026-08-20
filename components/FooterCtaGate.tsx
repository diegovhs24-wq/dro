"use client";

import {usePathname} from "next/navigation";

import CTASection from "@/components/CTASection";
import type {SiteSettings} from "@/lib/types";

// De consumentenbanner ("Wilt u een renovatie met dezelfde duidelijkheid?")
// past niet na de zakelijke slotsectie op /zakelijk, dus die route slaat hem over.
const SUPPRESS_ON = ["/zakelijk"];

export default function FooterCtaGate({cta}: {cta: NonNullable<SiteSettings["footerCta"]>}) {
  const pathname = usePathname();
  if (SUPPRESS_ON.some((path) => pathname === path)) return null;
  return <CTASection {...cta} />;
}
