"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SUPPRESS_PATHS = new Set(["/contact", "/over-ons", "/werkwijze", "/zakelijk"]);

type Props = {
  whatsappLabel: string;
  whatsappHref: string;
  intakeLabel: string;
  intakeHref: string;
};

export default function FloatingActions({whatsappLabel, whatsappHref, intakeLabel, intakeHref}: Props) {
  const pathname = usePathname();

  if (SUPPRESS_PATHS.has(pathname)) return null;

  return (
    <>
      <a
        aria-label={whatsappLabel}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-base font-bold text-white shadow-2xl transition hover:-translate-y-1"
        href={whatsappHref}
      >
        WA
      </a>
      <Link
        className="fixed bottom-5 left-5 z-50 hidden rounded-md bg-brand-orange px-4 py-2.5 text-xs font-semibold text-white shadow-2xl transition hover:-translate-y-1 sm:inline-flex"
        href={intakeHref}
      >
        {intakeLabel}
      </Link>
    </>
  );
}
