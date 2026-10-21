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
    "DRO Renovaties (DRO Bouw en Aannemingsbedrijf B.V.) is een familiebedrijf uit Den Haag dat totaalrenovaties, uitbouwen en aanbouwen, constructieve verbouwingen zoals het verwijderen van dragende muren, badkamers en hoogwaardige afbouw uitvoert voor particulieren en zakelijke opdrachtgevers in Den Haag, Zuid-Holland en de rest van de Randstad. DRO werkt met vaste vakteams en vaste aanspreekpunten voor planning en techniek, is VCA-gecertificeerd, erkend leerbedrijf (SBB) en VLOK-erkend voor airco en warmtepompen, en heeft een CAR- en aansprakelijkheidsverzekering.",

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

  founder: {
    name: "Therab Raja",
    jobTitle: "Oprichter en eigenaar",
  },

  team: [
    {name: "Therab Raja", jobTitle: "Oprichter, eerste aanspreekpunt"},
    {name: "Scott Huisman", jobTitle: "Verkoop en advies"},
    {name: "Esra Ozdemir", jobTitle: "Kwaliteit en klantzorg"},
    {name: "Jarek", jobTitle: "Hoofd uitvoering"},
  ],

  credentials: [
    {name: "VLOK-erkend (airco en warmtepompen)", category: "Erkenning"},
    {name: "VCA-gecertificeerd", category: "Veiligheidscertificaat"},
    {name: "Erkend leerbedrijf (SBB)", category: "Erkenning"},
  ],

  insurance: [
    "CAR-verzekering (Construction All Risk)",
    "Bedrijfsaansprakelijkheidsverzekering",
  ],

  // Betaalvoorwaarden. Het oude "geen aanbetaling" klopt NIET meer.
  paymentTerms:
    "Startbetaling van 20 tot 25 procent bij aanvang, daarna betaling per afgeronde fase.",

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

  // Indicatieve prijzen zoals Therab ze aan klanten geeft. Altijd als
  // indicatie tonen, nooit als vaste prijs. Bedragen excl. btw tenzij vermeld.
  priceIndications: [
    {
      service: "Totaalrenovatie",
      range: "€ 1.000 tot € 1.250 per m² (excl. btw)",
      note: "Afhankelijk van staat van de woning, installaties, constructieve wijzigingen en afwerkingsniveau.",
    },
    {
      service: "Badkamerrenovatie",
      range: "€ 8.000 tot € 10.000 als u zelf materialen levert, € 12.000 tot € 15.000 als DRO levert",
      note: "Gemiddelde badkamer; maatwerk en luxe sanitair verhogen de prijs.",
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
export function formatReviewSummary(snapshot: ReviewSnapshot = getReviewSnapshot()) {
  const rating = snapshot.ratingValue.toLocaleString("nl-NL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${rating} uit ${snapshot.reviewCount} ${snapshot.platform}-reviews`;
}

// Teksten uit het CMS die verouderde claims bevatten, worden hiermee
// onschadelijk gemaakt tot de content in Sanity is aangepast. Zie
// docs/audit/16-ai-findability-geo.md (GEO-03).
const OUTDATED_CLAIMS: Array<[RegExp, string]> = [
  [/,?\s*(en\s+)?zonder aanbetaling(?: vooraf)?/gi, ""],
  [/,?\s*(en\s+)?geen aanbetaling(?: vooraf)?/gi, ""],
];

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
  // Tekst zonder verouderde claim blijft byte-voor-byte gelijk.
  if (!hasOutdatedClaim(text)) return text;
  let result = text;
  for (const [pattern, replacement] of OUTDATED_CLAIMS) {
    result = result.replace(pattern, replacement);
  }
  // Opruimen van dubbele leestekens die na het weghalen overblijven.
  return result
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/,\s*\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
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
