// Herkomst van een aanvraag (welke campagne, welk zoekwoord), zodat later per
// zoekwoord te zien is welke aanvragen tot een getekende offerte leidden.
//
// Privacy: de klik-ID's van Google (gclid, gbraid, wbraid) zijn advertentie-
// identificatoren. Die worden alleen meegestuurd als de bezoeker cookies heeft
// geaccepteerd. Campagnegegevens (utm_*) zeggen niets over de persoon en gaan
// altijd mee.

import {readConsent} from "@/lib/analytics";

const STORAGE_KEY = "dro-attribution";
const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const MAX_LENGTH = 200;

export type Attribution = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landingPage?: string;
  referrer?: string;
  variant?: string;
  firstSeenAt?: string;
};

let memory: Attribution | null = null;

function clean(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().slice(0, MAX_LENGTH);
  return trimmed || undefined;
}

// Alleen de domeinnaam van een externe verwijzer (bijv. "www.google.com"), nooit
// het volledige adres: daar kunnen zoektermen of persoonsgegevens in staan.
function externalReferrerHost(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const host = new URL(document.referrer).hostname;
    if (!host || host === window.location.hostname) return undefined;
    return host.slice(0, MAX_LENGTH);
  } catch {
    return undefined;
  }
}

function load(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    // sessionStorage niet beschikbaar: geheugen gebruiken.
  }
  return memory;
}

function save(value: Attribution) {
  memory = value;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Alleen in geheugen.
  }
}

// Leest de URL-parameters bij binnenkomst. Een nieuwe advertentieklik (nieuwe
// gclid of utm_campaign) overschrijft een eerdere herkomst binnen dezelfde sessie.
export function captureAttribution(variant?: string) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};

  for (const key of [...CLICK_ID_KEYS, ...UTM_KEYS]) {
    const value = clean(params.get(key));
    if (value) fresh[key] = value;
  }

  const existing = load();
  const isNewVisit = Object.keys(fresh).length > 0 || !existing;
  if (!isNewVisit) return;

  save({
    ...fresh,
    landingPage: window.location.pathname,
    referrer: externalReferrerHost(),
    variant: clean(variant ?? null),
    firstSeenAt: new Date().toISOString(),
  });
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const stored = load() || {};
  if (readConsent() === "granted") return stored;

  const withoutClickIds: Attribution = {...stored};
  for (const key of CLICK_ID_KEYS) delete withoutClickIds[key];
  return withoutClickIds;
}

export function isPaidSearch(attribution: Attribution): boolean {
  return (
    Boolean(attribution.gclid || attribution.gbraid || attribution.wbraid) ||
    (attribution.utm_source === "google" && attribution.utm_medium === "cpc")
  );
}
