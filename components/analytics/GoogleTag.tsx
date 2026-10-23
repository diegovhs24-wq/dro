"use client";

import Script from "next/script";
import {useEffect} from "react";

import {useConsent} from "@/components/analytics/useConsent";
import {GA4_ID, GOOGLE_ADS_ID, trackFunnel} from "@/lib/analytics";

// Laadt gtag.js ALLEEN na "Alles accepteren". Tot dat moment staat er geen
// Google-script en gaat er geen verzoek naar googletagmanager.com.
export default function GoogleTag() {
  const consent = useConsent();
  const tagId = GOOGLE_ADS_ID || GA4_ID;
  const granted = Boolean(tagId) && consent === "granted";

  // Eén klik-listener voor belinks en WhatsApp-links, alleen met toestemming.
  useEffect(() => {
    if (!granted) return;

    function onClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      // Herkomst van de klik (bijv. "hero", "footer") via data-track op de link of een ouder.
      const placement = (anchor.closest("[data-track]") as HTMLElement | null)?.dataset.track;
      if (href.startsWith("tel:")) {
        trackFunnel("click_call", {placement});
      } else if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) {
        trackFunnel("click_whatsapp", {placement});
      } else if (anchor.dataset.cta) {
        trackFunnel("cta_click", {cta: anchor.dataset.cta, placement});
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [granted]);

  if (!granted) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`} strategy="afterInteractive" />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
          gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
          gtag('js', new Date());
          ${GOOGLE_ADS_ID ? `gtag('config', ${JSON.stringify(GOOGLE_ADS_ID)});` : ""}
          ${GA4_ID ? `gtag('config', ${JSON.stringify(GA4_ID)});` : ""}
        `}
      </Script>
    </>
  );
}
