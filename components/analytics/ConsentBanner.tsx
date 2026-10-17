"use client";

import Link from "next/link";
import {useEffect, useState} from "react";

import {useConsent} from "@/components/analytics/useConsent";
import {GOOGLE_ADS_ID, revokeGoogleConsent, subscribeConsentOpen, writeConsent} from "@/lib/analytics";

const buttonClass =
  "min-h-[48px] flex-1 rounded-md border-2 border-brand-ink bg-white px-5 py-3 text-sm font-bold text-brand-ink transition hover:bg-brand-ink hover:text-white focus:outline-none focus:ring-4 focus:ring-orange-200";

export default function ConsentBanner() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => subscribeConsentOpen(() => setReopened(true)), []);

  // Zonder Ads-ID wordt er niets gemeten, dus valt er ook niets te vragen.
  if (!GOOGLE_ADS_ID) return null;

  const visible = consent === null || reopened;
  if (consent === "unknown" || !visible) return null;

  function choose(choice: "granted" | "denied") {
    if (choice === "denied" && consent === "granted") revokeGoogleConsent();
    writeConsent(choice);
    setReopened(false);
  }

  return (
    <div
      aria-label="Cookie-instellingen"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-black/10 bg-white shadow-[0_-12px_40px_rgba(23,23,23,0.12)]"
      role="dialog"
    >
      <div className="section-shell flex flex-col gap-4 py-4 sm:py-5 lg:flex-row lg:items-center lg:gap-8">
        <div className="max-w-3xl">
          <p className="text-base font-bold text-brand-ink">Cookies en uw privacy</p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            Wij gebruiken alleen noodzakelijke cookies. Met uw toestemming laden wij ook een Google-tag, zodat wij kunnen
            meten of onze advertenties werken. Zonder uw toestemming wordt er geen Google-script geladen. Meer in onze{" "}
            <Link className="font-semibold text-brand-ink underline underline-offset-2 hover:text-brand-orange" href="/privacypolicy">
              privacyverklaring
            </Link>
            {" "}en{" "}
            <Link className="font-semibold text-brand-ink underline underline-offset-2 hover:text-brand-orange" href="/cookie-informatie">
              cookie-informatie
            </Link>
            .
          </p>
        </div>
        <div className="flex w-full gap-3 lg:w-auto lg:min-w-[420px]">
          <button className={buttonClass} onClick={() => choose("granted")} type="button">
            Alles accepteren
          </button>
          <button className={buttonClass} onClick={() => choose("denied")} type="button">
            Alleen noodzakelijk
          </button>
        </div>
      </div>
    </div>
  );
}
