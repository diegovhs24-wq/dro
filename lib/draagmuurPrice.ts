// Prijsindicatie voor een doorbraak in een draagmuur (formulier en landingspagina).
// Interne bedragen zijn EXCLUSIEF btw (zo rekent DRO); de bezoeker ziet altijd
// een bandbreedte INCLUSIEF btw. Ijkpunten van Therab (okt. 2026):
//   - deuropening incl. latei: ongeveer € 1.500 (intern, niet los op de site)
//   - draagmuur vervangen (volledig): vanaf € 6.500
// Pas deze getallen hier aan; formulier en pagina rekenen er allebei mee.

export type DraagmuurKind = "deur" | "deels" | "volledig";
export type DraagmuurFloor = "begane grond" | "verdieping" | "appartement";

export type DraagmuurInput = {
  kind: DraagmuurKind;
  width: number; // breedte opening in meters
  thickness: number; // muurdikte in centimeters
  height: number; // plafondhoogte in meters
  floor: DraagmuurFloor;
  finished: boolean; // afgewerkt (stuc, schilderklaar) of casco
  fireWrap: boolean; // brandveilig inpakken tijdens slijp- en laswerk
};

export const DRAAGMUUR_DOOR_EX = 1500;
export const DRAAGMUUR_FULL_FROM_EX = 6500;
const PARTIAL_MAX_EX = 4800; // doorgang tot 2,5 m
const FULL_PER_EXTRA_M = 900; // per meter boven 3,5 m
const FINISH_BASE_EX = 350;
const FINISH_PER_M_EX = 180;
const FIRE_WRAP_EX = 195;
const VAT = 1.21;

export const DRAAGMUUR_DEFAULT_WIDTH: Record<DraagmuurKind, number> = {deur: 1, deels: 2.2, volledig: 4};

export function draagmuurPriceEx(input: DraagmuurInput): number {
  const w = Math.max(0.5, input.width);
  let base: number;
  if (input.kind === "volledig" || w > 2.5) {
    base = DRAAGMUUR_FULL_FROM_EX + Math.max(0, w - 3.5) * FULL_PER_EXTRA_M;
  } else if (w <= 1.2) {
    base = DRAAGMUUR_DOOR_EX;
  } else {
    base = DRAAGMUUR_DOOR_EX + ((w - 1.2) / 1.3) * (PARTIAL_MAX_EX - DRAAGMUUR_DOOR_EX);
  }

  const t = input.thickness;
  base *= t <= 12 ? 0.9 : t <= 24 ? 1 : t <= 32 ? 1.12 : 1.25;
  if (input.height > 2.8) base *= 1.08;
  if (input.floor === "verdieping") base *= 1.15;
  if (input.floor === "appartement") base *= 1.2;

  let total = base;
  if (input.finished) total += FINISH_BASE_EX + FINISH_PER_M_EX * w;
  if (input.fireWrap) total += FIRE_WRAP_EX;
  return total;
}

const round50 = (n: number) => Math.round(n / 50) * 50;

// Bandbreedte incl. btw: de situatie ter plekke (leidingen, kolommen, asbest)
// kan de prijs nog beïnvloeden.
export function draagmuurRange(input: DraagmuurInput): {low: number; high: number} {
  const incl = draagmuurPriceEx(input) * VAT;
  return {low: round50(incl * 0.9), high: round50(incl * 1.15)};
}

export const DRAAGMUUR_FULL_FROM_INCL = Math.round(DRAAGMUUR_FULL_FROM_EX * VAT);

export function formatEuro(n: number): string {
  return `€ ${n.toLocaleString("nl-NL")}`;
}
