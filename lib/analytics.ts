// Cookietoestemming en Google Ads-metingen. Consent mode "basic": zolang er
// geen toestemming is, wordt er geen enkel Google-script geladen. Alles hier
// doet niets zonder toestemming of zonder Ads-ID.

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
export const GOOGLE_ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "";

export type ConsentChoice = "granted" | "denied";

const STORAGE_KEY = "dro-cookie-consent";
const CHANGE_EVENT = "dro-consent-change";
const OPEN_EVENT = "dro-consent-open";

// Valt terug op geheugen als localStorage geblokkeerd is (privémodus), zodat
// de keuze in elk geval voor deze sessie geldt.
let memoryChoice: ConsentChoice | null = null;

type GtagFn = (...args: unknown[]) => void;
type GtagWindow = Window & {dataLayer?: unknown[]; gtag?: GtagFn};

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    // localStorage onbereikbaar: gebruik het geheugen.
  }
  return memoryChoice;
}

export function writeConsent(choice: ConsentChoice) {
  memoryChoice = choice;
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Keuze blijft alleen in het geheugen bewaard.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function subscribeConsentOpen(callback: () => void) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}

// Standaard gtag-snippet: zet dataLayer en gtag neer als die nog niet bestaan,
// zodat een gebeurtenis ook meteen na het laden van de pagina niet verloren gaat.
function ensureGtag(): GtagFn {
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    w.gtag = function gtag() {
      // gtag.js verwacht het arguments-object, geen array.
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
  }
  return w.gtag;
}

function canTrack(): boolean {
  return Boolean(GOOGLE_ADS_ID) && typeof window !== "undefined" && readConsent() === "granted";
}

// Na "Alleen noodzakelijk" nadat eerder was geaccepteerd: toestemming
// intrekken en de Google-cookies opruimen (best effort, het script zelf is dan
// al geladen tot de volgende paginaweergave).
export function revokeGoogleConsent() {
  const w = window as GtagWindow;
  if (w.gtag) {
    w.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    if (name.startsWith("_ga") || name.startsWith("_gcl") || name === "_gid") {
      const host = window.location.hostname;
      const bare = host.replace(/^www\./, "");
      [host, `.${bare}`].forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      });
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

// Conversie voor een geslaagde aanvraag. Doet niets zonder toestemming, zonder
// Ads-ID of zonder conversielabel. De aanroeper bewaakt "één keer per aanvraag".
export function trackLead() {
  if (!canTrack() || !GOOGLE_ADS_LEAD_LABEL) return;
  ensureGtag()("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
    value: 1,
    currency: "EUR",
  });
}

export function trackEvent(name: string) {
  if (!canTrack()) return;
  ensureGtag()("event", name);
}
