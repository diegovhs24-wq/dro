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
// Ads-ID of zonder conversielabel. De aanroeper bewaakt "één keer per aanvraag";
// het aanvraagnummer als transaction_id laat Google dubbele tellingen negeren.
export function trackLead(leadId?: string) {
  if (!canTrack() || !GOOGLE_ADS_LEAD_LABEL) return;
  ensureGtag()("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
    value: 1,
    currency: "EUR",
    ...(leadId && /^[\w-]{6,80}$/.test(leadId) ? {transaction_id: leadId} : {}),
  });
}

export function trackEvent(name: string) {
  if (!canTrack()) return;
  ensureGtag()("event", name);
}

// Optioneel GA4-meet-ID. Leeg = alleen Google Ads (zoals nu).
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";

export type FunnelEventName =
  | "route_view"
  | "cta_click"
  | "form_start"
  | "form_step_complete"
  | "form_submit_success"
  | "form_submit_error"
  | "click_call"
  | "click_whatsapp";

export type FunnelParams = Record<string, string | number | boolean | undefined>;

// Nooit persoonsgegevens in meetdata: alleen korte, technische waarden.
const BLOCKED_PARAM = /(name|naam|email|mail|phone|telefoon|tel|address|adres|postcode|huisnummer|message|bericht)/i;

export function sanitizeFunnelParams(params: FunnelParams = {}): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || BLOCKED_PARAM.test(key)) continue;
    if (typeof value === "string") {
      // Ook waarden die op een e-mailadres of telefoonnummer lijken, weglaten.
      if (/@/.test(value) || /\d{6,}/.test(value.replace(/[\s-]/g, ""))) continue;
      out[key] = value.slice(0, 100);
    } else {
      out[key] = value;
    }
  }
  return out;
}

// Funnelmeting. Doet niets zonder cookietoestemming. Zet de gebeurtenis in de
// dataLayer (voor GA4 of Tag Manager) en, als gtag actief is, direct als event.
export function trackFunnel(name: FunnelEventName, params?: FunnelParams) {
  if (typeof window === "undefined" || readConsent() !== "granted") return;
  const clean = sanitizeFunnelParams({page_path: window.location.pathname, ...params});
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({event: name, ...clean});
  if (GOOGLE_ADS_ID || GA4_ID) ensureGtag()("event", name, clean);
}
