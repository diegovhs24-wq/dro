"use client";

import Script from "next/script";
import {useEffect} from "react";

import {useConsent} from "@/components/analytics/useConsent";
import {GOOGLE_ADS_ID, trackEvent} from "@/lib/analytics";

// Laadt gtag.js ALLEEN na "Alles accepteren". Tot dat moment staat er geen
// Google-script en gaat er geen verzoek naar googletagmanager.com.
export default function GoogleTag() {
  const consent = useConsent();
  const granted = Boolean(GOOGLE_ADS_ID) && consent === "granted";

  // Eén klik-listener voor belinks en WhatsApp-links, alleen met toestemming.
  useEffect(() => {
    if (!granted) return;

    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackEvent("click_call");
      else if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) trackEvent("click_whatsapp");
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [granted]);

  if (!granted) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
          gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(GOOGLE_ADS_ID)});
        `}
      </Script>
    </>
  );
}
