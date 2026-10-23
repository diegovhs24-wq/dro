// Eén centrale bron van geverifieerde bedrijfsfeiten van DRO Renovaties.
//
// Waarom: AI-zoekmachines (ChatGPT Search, Google AI Overviews, Perplexity,
// Gemini, Copilot) citeren wat ze op de site en elders vinden. Als dezelfde
// feiten op tien plekken anders staan (review-aantal, betaalvoorwaarden,
// juridische naam), kiest een model willekeurig of laat het DRO weg. Alles wat
// hieronder staat is door Therab bevestigd; de datum staat bij `verifiedAt`.
//
// Regels voor wijzigen:
// - Alleen feiten die aantoonbaar kloppen (KvK-uittreksel, polis, certificaat,
//   Google-profiel). Geen schattingen.
// - Na wijziging ook `verifiedAt` aanpassen.
// - Velden die nog leeg zijn (postcode, oprichtingsdatum, coordinaten) bewust
//   leeg laten tot ze bevestigd zijn: liever weglaten dan fout.
// - Sanity (siteSettings.organizationSeo) mag aanvullen, maar de juridische
//   naam, KvK, btw-nummer en betaalvoorwaarden komen altijd van hier.

export const BUSINESS = {
  verifiedAt: "2026-10-21",

  name: "DRO Renovaties",
  // Exacte schrijfwijze volgens KvK (zonder koppelteken).
  legalName: "DRO Bouw en Aannemingsbedrijf B.V.",
  alternateNames: ["DRO Bouw en Aannemingsbedrijf", "DRO Bouw"],
  kvkNumber: "94825653",
  vatId: "NL866905030B01",

  slogan: "Van sloop tot sleutel, onder één regie.",

  // Feitelijke, citeerbare omschrijving zonder superlatieven.
  description:
    "DRO Renovaties (DRO Bouw en Aannemingsbedrijf B.V.) is een familiebedrijf uit Den Haag dat totaalrenovaties, uitbouwen en aanbouwen, constructieve verbouwingen zoals het verwijderen van dragende muren, badkamers en hoogwaardige afbouw uitvoert voor particulieren en zakelijke opdrachtgevers in Den Haag, Zuid-Holland en de rest van de Randstad. DRO werkt met vaste vakteams en vaste aanspreekpunten voor planning en techniek, is VCA-gecertificeerd, erkend leerbedrijf (SBB) en VLOK-erkend, en heeft een CAR- en aansprakelijkheidsverzekering.",

  address: {
    streetAddress: "Orionstraat 235",
    addressLocality: "Den Haag",
    // Bron: SBB Stagemarkt-profiel (leerbedrijf). Nog bevestigen met KvK-uittreksel.
    postalCode: "2516 AS",
    addressRegion: "Zuid-Holland",
    addressCountry: "NL",
  },

  phone: {
    display: "085 087 1814",
    e164: "+31850871814",
    href: "tel:+31850871814",
    whatsapp: true,
  },
  email: "info@dro-renovaties.nl",

  team: [
    {name: "Scott Huisman", jobTitle: "Verkoop en advies"},
    {name: "Esra Ozdemir", jobTitle: "Kwaliteit en klantzorg"},
    {name: "Jarek", jobTitle: "Hoofd uitvoering"},
  ],

  credentials: [
    {name: "VLOK-erkend", category: "Erkenning"},
    {name: "VCA-gecertificeerd", category: "Veiligheidscertificaat"},
    {name: "Erkend leerbedrijf (SBB)", category: "Erkenning"},
  ],

  insurance: [
    "CAR-verzekering (Construction All Risk)",
    "Bedrijfsaansprakelijkheidsverzekering",
  ],

  // Betaalvoorwaarden (besluit Therab 22-10-2026, keuze B): geen absolute
  // belofte over wat er bij ondertekening of vooraf betaald wordt. Het schema
  // staat per project in de offerte (AV art. 8.1). Zie PAYMENT_TERMS hieronder.
  paymentTerms:
    "Voor aanvang van de werkzaamheden leggen wij het betalingsschema vast in de offerte. Betalingen worden gekoppeld aan de afgesproken projectfasen. Eventuele startbetalingen en afwijkende afspraken worden vooraf schriftelijk vastgelegd.",

  // Momentopname van het Google-bedrijfsprofiel. Bijwerken met datum; Sanity
  // (organizationSeo.aggregateRatingValue/Count) overschrijft dit als het daar
  // is ingevuld.
  reviews: {
    platform: "Google",
    ratingValue: 4.8,
    reviewCount: 273,
    asOf: "2026-10-17",
  },

  // Kernwerkgebied. Steden met een eigen pagina komen uit Sanity (location).
  coreAreaServed: ["Den Haag", "Haaglanden", "Zuid-Holland", "Randstad"],

  // Waar DRO het sterkst in is, in volgorde van commerciele prioriteit.
  specialisms: [
    "Totaalrenovatie van woningen",
    "Uitbouw en aanbouw",
    "Dragende muur verwijderen en constructieve verbouwingen",
    "Dakopbouw",
    "Badkamerrenovatie",
    "Afbouw van nieuwbouwwoningen",
    "Bouwkundige keuring",
  ],

  // Indicatieve prijzen die al ongewijzigd op de live site staan (FAQ,
  // intake). Badkamer, uitbouw en draagmuur ontbreken bewust tot er één
  // bevestigde bandbreedte is (docs/audit/16, BESLUIT-2 t/m 4).
  priceIndications: [
    {
      service: "Totaalrenovatie",
      range: "€ 1.210 tot € 1.510 per m² incl. btw (€ 1.000 tot € 1.250 excl. btw)",
      note: "Afhankelijk van staat van de woning, installaties, constructieve wijzigingen en afwerkingsniveau.",
    },
    {
      service: "Bouwkundige keuring",
      range: "€ 399 voor het rapport",
      note: "Kosteloos als DRO de renovatie daarna uitvoert.",
    },
    {
      service: "Keuken",
      range: "Altijd maatwerk, geen vaste prijs",
      note: "Prijs na opname en ontwerp.",
    },
  ],

  languages: ["Nederlands", "Engels"],
} as const;

// Kerndiensten met de hoogste projectwaarde. Hun stad x dienst-pagina's blijven
// altijd indexeerbaar, ook zonder lokale tekst in Sanity: ze zijn commercieel
// te waardevol om zonder verkeersdata (Search Console) te schrappen.
export const CORE_SERVICE_SLUGS = ["totaalrenovatie", "uitbouw-aanbouw", "badkamer-renovatie"] as const;

export function isIndexableLocationService(serviceSlug: string, popularServiceSlugs: string[] = []) {
  return (
    popularServiceSlugs.includes(serviceSlug) ||
    (CORE_SERVICE_SLUGS as readonly string[]).includes(serviceSlug)
  );
}

export type ReviewSnapshot = {
  platform: string;
  ratingValue: number;
  reviewCount: number;
  asOf: string;
};

// Review-cijfers: Sanity wint als het daar staat, anders de momentopname hier.
export function getReviewSnapshot(override?: {
  aggregateRatingValue?: number;
  aggregateRatingCount?: number;
} | null): ReviewSnapshot {
  return {
    platform: BUSINESS.reviews.platform,
    ratingValue: override?.aggregateRatingValue ?? BUSINESS.reviews.ratingValue,
    reviewCount: override?.aggregateRatingCount ?? BUSINESS.reviews.reviewCount,
    asOf: BUSINESS.reviews.asOf,
  };
}

// "4,8 uit 273 Google-reviews": Nederlandse notatie voor in lopende tekst.
// Vaste formulering betaalvoorwaarden (besluit 22-10-2026). Kort voor feitenbalken.
export const PAYMENT_TERMS = {
  long: "Voor aanvang van de werkzaamheden leggen wij het betalingsschema vast in de offerte. Betalingen worden gekoppeld aan de afgesproken projectfasen. Eventuele startbetalingen en afwijkende afspraken worden vooraf schriftelijk vastgelegd.",
  short: "Per fase, vooraf vastgelegd in de offerte",
} as const;

export function formatReviewSummary(snapshot: ReviewSnapshot = getReviewSnapshot()) {
  const rating = snapshot.ratingValue.toLocaleString("nl-NL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${rating} uit ${snapshot.reviewCount} ${snapshot.platform}-reviews`;
}

// Vangnet voor gepubliceerde CMS-teksten met absolute betaalbeloftes ("geen
// aanbetaling", "nooit vooruit", "niets bij ondertekening"). Die kloppen niet:
// het betaalschema verschilt per project en staat in de offerte (besluit
// 22-10-2026, keuze B). Vervangen in plaats van weghalen, zodat koppen niet leeg
// worden en zinnen grammaticaal blijven. De Sanity-releases corrigeren de bron.
// Bewust smal gehouden: de algemene voorwaarden ("vooruitbetaling of
// zekerheid", art. 8.8) blijven ongemoeid.
const OUTDATED_CLAIMS: Array<[RegExp, string]> = [
  [/\bgeen aanbetaling(?: vooraf)?/gi, "een vooraf vastgelegd betaalschema"],
  [/\bzonder aanbetaling(?: vooraf)?/gi, "met een vooraf vastgelegd betaalschema"],
  [/\b(?:bij (?:ondertekening|het tekenen)(?: van de opdracht)? betaalt u (?:nog )?niets|niets (?:betalen )?bij ondertekening)/gi, "het betaalschema staat vooraf in de offerte"],
  [/,? en (?:u betaalt )?nooit vooruit(?:betalen)?/gi, ", volgens het betaalschema in de offerte"],
  [/\bu betaalt nooit (?:vooruit )?voor werk dat (?:nog )?niet (?:gedaan|af|klaar|uitgevoerd) is/gi, "u betaalt volgens het betaalschema in de offerte, gekoppeld aan de projectfasen"],
];

function matchCase(original: string, replacement: string) {
  return /^[A-Z]/.test(original) ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
}

export function hasOutdatedClaim(text?: string | null): boolean {
  if (!text) return false;
  return OUTDATED_CLAIMS.some(([pattern]) => {
    pattern.lastIndex = 0;
    const hit = pattern.test(text);
    pattern.lastIndex = 0;
    return hit;
  });
}

export function stripOutdatedClaims(text?: string | null): string {
  if (!text) return "";
  if (!hasOutdatedClaim(text)) return text;
  let result = text;
  for (const [pattern, replacement] of OUTDATED_CLAIMS) {
    result = result.replace(pattern, (found) => matchCase(found, replacement));
  }
  return result;
}

// Loopt recursief door CMS-data en corrigeert alleen strings met een verouderde
// claim. Tijdelijk vangnet tot de Sanity-release "geo-betaalvoorwaarden" en de
// handmatige correcties (zie docs/audit/16) zijn gepubliceerd; daarna is dit
// een no-op.
export function sanitizeOutdatedClaimsDeep<T>(value: T): T {
  if (typeof value === "string") {
    return (hasOutdatedClaim(value) ? stripOutdatedClaims(value) : value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeOutdatedClaimsDeep(item)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      out[key] = sanitizeOutdatedClaimsDeep(item);
    }
    return out as T;
  }
  return value;
}
