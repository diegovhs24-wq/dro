"use client";

import {GOOGLE_ADS_ID, openConsentSettings} from "@/lib/analytics";

// Link in de footer om de cookiekeuze opnieuw te openen. Zonder Ads-ID is er
// niets te kiezen, dus dan verschijnt de link niet.
export default function CookieSettingsLink({className}: {className?: string}) {
  if (!GOOGLE_ADS_ID) return null;

  return (
    <button className={className} onClick={openConsentSettings} type="button">
      Cookie-instellingen
    </button>
  );
}
