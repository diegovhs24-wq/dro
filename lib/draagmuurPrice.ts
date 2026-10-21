// Prijsindicatie draagmuur verwijderen, formule van Therab (21 okt. 2026):
//
//   P (excl. btw) = ((B x H x 225) + 575 + (B x 675) + 750 + 450) x C
//
//   B = breedte doorbraak (m), H = hoogte doorbraak (m)
//   225 per m2  slopen en afvoeren (incl. container)
//   575         tijdelijke ondersteuning / stempelen
//   675 per m1  stalen ligger leveren en monteren
//   750         constructieberekening (incl. vergunningsaanvraag)
//   450         basisafwerking (vervalt bij casco)
//   C           complexiteitsfactor 1,00 / 1,25 / 1,50
//   + 450       brandwerend bekleden van de ligger (bv. Promatect), los
//               opgeteld, buiten de complexiteitsfactor. Standaard doet DRO dit.
//   - 500       bekleedt de klant of zijn eigen aannemer de ligger zelf, dan
//               gaat er 500 af van de DRO-prijs (Therab, 21 okt. 2026)
//
// De bezoeker ziet het bedrag inclusief 21% btw. Bij brede doorbraken of zware
// belasting rekent de constructeur de staalconstructie apart (zie WIDE_FROM_M).

export type DraagmuurKind = "deur" | "deels" | "volledig";
export type DraagmuurFloor = "begane grond" | "verdieping" | "appartement";

export type DraagmuurInput = {
  kind: DraagmuurKind;
  width: number; // B, breedte doorbraak in meters
  height: number; // H, hoogte doorbraak in meters
  thickness: number; // muurdikte in centimeters (telt mee in de complexiteit)
  floor: DraagmuurFloor;
  finished: boolean; // basisafwerking ja (afgewerkt) of nee (casco)
  fireWrap: boolean; // true: DRO bekleedt de ligger brandwerend; false: klant of eigen aannemer (- selfCladdingDiscount)
};

export const PRICE = {
  demolitionPerM2: 225,
  shoring: 575,
  steelPerM: 675,
  engineering: 750,
  finishing: 450,
  fireCladding: 450,
  selfCladdingDiscount: 500,
  vat: 1.21,
} as const;

export const WIDE_FROM_M = 5;

export const DRAAGMUUR_DEFAULTS: Record<DraagmuurKind, {width: number; height: number}> = {
  deur: {width: 1, height: 2.3},
  deels: {width: 2, height: 2.6},
  volledig: {width: 3, height: 2.6},
};

// Complexiteit: 1,00 standaard; 1,25 bij één verzwarende factor; 1,50 bij twee
// of meer. Factoren: niet op de begane grond (verdieping of appartement), een
// muur dikker dan 24 cm, een doorbraak breder dan 4 m.
export function complexityOf(input: DraagmuurInput): {factor: 1 | 1.25 | 1.5; reasons: string[]} {
  const reasons: string[] = [];
  if (input.floor === "verdieping") reasons.push("op de verdieping");
  if (input.floor === "appartement") reasons.push("in een appartement");
  if (input.thickness > 24) reasons.push("muur dikker dan 24 cm");
  if (input.width > 4) reasons.push("breder dan 4 m");
  const factor = reasons.length === 0 ? 1 : reasons.length === 1 ? 1.25 : 1.5;
  return {factor, reasons};
}

export type DraagmuurBreakdown = {
  demolition: number;
  shoring: number;
  steel: number;
  engineering: number;
  finishing: number;
  fireCladding: number;
  selfCladdingDiscount: number; // 0 of 500 (bekleding door klant of eigen aannemer)
  factor: 1 | 1.25 | 1.5;
  reasons: string[];
  totalEx: number;
  totalIncl: number;
  wide: boolean;
};

export function draagmuurBreakdown(input: DraagmuurInput): DraagmuurBreakdown {
  const B = Math.max(0.5, input.width);
  const H = Math.max(1.5, input.height);
  const demolition = B * H * PRICE.demolitionPerM2;
  const steel = B * PRICE.steelPerM;
  const finishing = input.finished ? PRICE.finishing : 0;
  const {factor, reasons} = complexityOf(input);
  const fireCladding = PRICE.fireCladding;
  const selfCladdingDiscount = input.fireWrap ? 0 : PRICE.selfCladdingDiscount;
  const totalEx =
    (demolition + PRICE.shoring + steel + PRICE.engineering + finishing) * factor + fireCladding - selfCladdingDiscount;
  return {
    demolition,
    shoring: PRICE.shoring,
    steel,
    engineering: PRICE.engineering,
    finishing,
    fireCladding,
    selfCladdingDiscount,
    factor,
    reasons,
    totalEx: Math.round(totalEx),
    totalIncl: Math.round(totalEx * PRICE.vat),
    wide: B >= WIDE_FROM_M,
  };
}

// Rekenvoorbeeld: 3 m breed x 2,60 m hoog, standaard, met afwerking en met
// brandwerende bekleding door DRO (6.005 excl. / 7.266 incl. btw).
export const EXAMPLE_INPUT: DraagmuurInput = {
  kind: "volledig",
  width: 3,
  height: 2.6,
  thickness: 22,
  floor: "begane grond",
  finished: true,
  fireWrap: true,
};

export function formatEuro(n: number): string {
  return `€ ${Math.round(n).toLocaleString("nl-NL")}`;
}
