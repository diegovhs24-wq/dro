import {DRO_TOOLS_CONFIG} from "./toolsConfig";
import type {
  BouwtijdExtraOptie,
  BouwtijdProjectType,
  KlusvolgordeStap,
  Legpatroon,
  ScoreUitkomst,
  SloopChecklistItem,
  TegelFormaat,
  TerugplannerStap,
  VerfBlikmaat,
  VerfOndergrond,
  VerfSoort,
  VloerType,
  WizardUitkomst,
  WizardVraag,
} from "./toolsTypes";

/**
 * Rekenlogica voor de Handige Tools bibliotheek. Alle functies hier zijn
 * "puur": ze krijgen invoer, geven een resultaat terug, en raken nooit de
 * pagina (geen DOM). Alle getallen komen uit toolsConfig.ts.
 *
 * PATROON VOOR EEN NIEUWE TOOL
 * 1. Voeg de configuratie toe aan toolsConfig.ts onder "tools.<id>".
 * 2. Schrijf hier 1 pure functie "bereken<Naam>(input) -> resultaat | RekenFout".
 * 3. Bouw een weergavecomponent in components/tools/views/<Naam>.tsx.
 * 4. Registreer de tool in components/tools/toolRegistry.tsx.
 */

export type RekenFout = {fout: string};

export function isRekenFout(waarde: unknown): waarde is RekenFout {
  return Boolean(waarde) && typeof waarde === "object" && "fout" in (waarde as object);
}

export function vulTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

export function formatNL(getal: number, decimalen = 0): string {
  if (!Number.isFinite(getal)) return "-";
  return getal.toLocaleString("nl-NL", {minimumFractionDigits: decimalen, maximumFractionDigits: decimalen});
}

function rondAfOpHalf(getal: number): number {
  return Math.ceil(getal * 2) / 2;
}

// ---------------------------------------------------------------------------
// K1: Conversietool "Is dit iets voor DRO?"
// ---------------------------------------------------------------------------

export type VoorDroInput = {projectId: string; regioId: string; timingId: string};
export type VoorDroResultaat = {
  titel: string;
  tekst: string;
  toonToolLinks: boolean;
  projectLabel: string;
  regioLabel: string;
  timingLabel: string;
};

/** Eerste regel in config.regels die matcht wint. Daarbuiten weegt zwaarder dan oriënteren, wat weer zwaarder weegt dan de standaard match. */
export function bepaalVoorDroAdvies(input: VoorDroInput): VoorDroResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools["voor-dro"];
  const project = config.project_opties.find((p) => p.id === input.projectId);
  const regio = config.regio_opties.find((r) => r.id === input.regioId);
  const timing = config.timing_opties.find((t) => t.id === input.timingId);
  if (!project) return {fout: "Kies wat je wilt laten doen."};
  if (!regio) return {fout: "Kies waar de woning staat."};
  if (!timing) return {fout: "Kies wanneer je wilt starten."};

  const regel = config.regels.find(
    (r) =>
      (!r.project_ids || r.project_ids.includes(input.projectId)) &&
      (!r.regio_ids || r.regio_ids.includes(input.regioId)) &&
      (!r.timing_ids || r.timing_ids.includes(input.timingId)),
  );
  const uitkomst = config.uitkomsten.find((u) => u.id === (regel?.uitkomst_id ?? config.fallback_uitkomst_id));
  if (!uitkomst) return {fout: "Kon geen advies bepalen."};

  const tekst = uitkomst.tekst.replace("{projecttype}", project.label.toLowerCase()).replace("{regio}", regio.label);

  return {titel: uitkomst.titel, tekst, toonToolLinks: uitkomst.toon_tool_links, projectLabel: project.label, regioLabel: regio.label, timingLabel: timing.label};
}

// ---------------------------------------------------------------------------
// A1: Bouwtijd calculator
// ---------------------------------------------------------------------------

export type BouwtijdInput = {
  projecttypeId: string;
  m2?: number;
  breedte?: number;
  verdiepingen?: number;
  optieIds: string[];
};

export type BouwtijdResultaat = {
  type: BouwtijdProjectType;
  basisDagen: number;
  optieDagen: number;
  totaalDagen: number;
  gekozenOpties: BouwtijdExtraOptie[];
  wekenMin: number;
  wekenMax: number;
};

/**
 * Berekent de geschatte uitvoeringstijd voor een projecttype.
 * "drempel": basis_dagen tot drempel_m2, daarna dagen_per_extra_m2 erboven.
 * "vast": alleen basis_dagen, geen oppervlak.
 * "lineair_met_minimum": dagen_per_m2 keer oppervlak met minimum_dagen als
 * ondergrens, plus extra dagen per verdieping boven de eerste.
 * "breedte_drempel": zoals "drempel" maar op basis van breedte in meters
 * (gebruikt door de dakkapel).
 * De uitkomst in werkdagen wordt gedeeld door werkdagen_per_week en naar
 * boven afgerond tot weken_min. weken_max is dat plus de marge_boven, ook
 * naar boven afgerond.
 */
export function berekenBouwtijd(input: BouwtijdInput): BouwtijdResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.bouwtijd;
  const type = config.projecttypes.find((t) => t.id === input.projecttypeId);
  if (!type) return {fout: "Kies een projecttype."};

  let m2 = 0;
  if (type.vraag_m2) {
    if (!Number.isFinite(input.m2)) return {fout: "Vul een oppervlak in."};
    m2 = input.m2 as number;
    if (typeof type.min_m2 === "number" && m2 < type.min_m2) return {fout: `Het oppervlak moet minimaal ${formatNL(type.min_m2)} m² zijn.`};
    if (typeof type.max_m2 === "number" && m2 > type.max_m2) return {fout: `Het oppervlak moet maximaal ${formatNL(type.max_m2)} m² zijn.`};
  }

  let breedte = 0;
  if (type.vraag_breedte) {
    if (!Number.isFinite(input.breedte)) return {fout: "Vul een breedte in."};
    breedte = input.breedte as number;
    if (typeof type.min_breedte === "number" && breedte < type.min_breedte) return {fout: `De breedte moet minimaal ${formatNL(type.min_breedte)} m zijn.`};
    if (typeof type.max_breedte === "number" && breedte > type.max_breedte) return {fout: `De breedte moet maximaal ${formatNL(type.max_breedte)} m zijn.`};
  }

  let verdiepingen = 1;
  if (type.vraag_verdiepingen) {
    if (!Number.isFinite(input.verdiepingen)) return {fout: "Vul het aantal verdiepingen in."};
    verdiepingen = input.verdiepingen as number;
  }

  let basisDagen = 0;
  if (type.formule_type === "vast") {
    basisDagen = type.basis_dagen ?? 0;
  } else if (type.formule_type === "drempel") {
    const extraM2 = Math.max(0, m2 - (type.drempel_m2 ?? 0));
    basisDagen = (type.basis_dagen ?? 0) + extraM2 * (type.dagen_per_extra_m2 ?? 0);
  } else if (type.formule_type === "breedte_drempel") {
    const extraBreedte = Math.max(0, breedte - (type.drempel_breedte ?? 0));
    basisDagen = (type.basis_dagen ?? 0) + extraBreedte * (type.dagen_per_extra_breedte ?? 0);
  } else if (type.formule_type === "lineair_met_minimum") {
    basisDagen = Math.max(type.minimum_dagen ?? 0, m2 * (type.dagen_per_m2 ?? 0));
    if (type.vraag_verdiepingen) {
      basisDagen += Math.max(0, verdiepingen - 1) * (type.dagen_per_extra_verdieping ?? 0);
    }
  }

  const gekozenOpties = input.optieIds
    .map((id) => config.extra_opties.find((optie) => optie.id === id))
    .filter((optie): optie is BouwtijdExtraOptie => Boolean(optie) && type.opties.includes(optie!.id));
  const optieDagen = gekozenOpties.reduce((totaal, optie) => totaal + optie.extra_dagen, 0);
  const totaalDagen = basisDagen + optieDagen;

  if (!Number.isFinite(totaalDagen) || totaalDagen <= 0) return {fout: "Er kon geen geldige uitvoeringstijd berekend worden."};

  const wekenMin = Math.ceil(totaalDagen / config.werkdagen_per_week);
  const wekenMax = Math.ceil(wekenMin * (1 + config.marge_boven));

  return {type, basisDagen, optieDagen, totaalDagen, gekozenOpties, wekenMin, wekenMax};
}

// ---------------------------------------------------------------------------
// A2: Vergunningcheck (generieke voorwaarde-wizard)
// ---------------------------------------------------------------------------

export type WizardAntwoorden = Record<string, string>;

function vraagIsZichtbaar(vraag: WizardVraag, antwoorden: WizardAntwoorden): boolean {
  return vraag.zichtbaar_als.every(
    (v) => antwoorden[v.vraag_id] !== undefined && v.antwoord_ids.includes(antwoorden[v.vraag_id])
  );
}

export function volgendeVergunningVraag(antwoorden: WizardAntwoorden): WizardVraag | null {
  for (const vraag of DRO_TOOLS_CONFIG.tools.vergunning.vragen) {
    if (antwoorden[vraag.id]) continue;
    if (vraagIsZichtbaar(vraag, antwoorden)) return vraag;
  }
  return null;
}

export function bepaalVergunningUitkomst(antwoorden: WizardAntwoorden): WizardUitkomst | null {
  const config = DRO_TOOLS_CONFIG.tools.vergunning;
  for (const regel of config.regels) {
    const matcht = regel.voorwaarden.every(
      (v) => antwoorden[v.vraag_id] !== undefined && v.antwoord_ids.includes(antwoorden[v.vraag_id])
    );
    if (matcht) return config.uitkomsten.find((u) => u.id === regel.uitkomst_id) || null;
  }
  return null;
}

export function isVveVanToepassing(antwoorden: WizardAntwoorden): boolean {
  const config = DRO_TOOLS_CONFIG.tools.vergunning;
  return antwoorden[config.vve_vraag_id] === config.vve_ja_antwoord_id;
}

// ---------------------------------------------------------------------------
// A3: Renovatie terugplanner
// ---------------------------------------------------------------------------

export type TerugplannerInput = {
  startdatum: string;
  vergunningNodig: boolean;
  maatwerk: boolean;
};

export type TerugplannerResultaatStap = {
  stap: TerugplannerStap;
  datum: Date;
  verstreken: boolean;
};

export type TerugplannerResultaat = {
  stappen: TerugplannerResultaatStap[];
};

/**
 * Rekent vanaf de gewenste startdatum terug: elke stap heeft een aantal
 * weken_voor_start, waarmee de uiterste datum voor die stap wordt berekend.
 * Stappen met een conditie worden alleen getoond als die conditie geldt
 * (bijvoorbeeld alleen de vergunning-stap als een vergunning nodig is).
 */
export function berekenTerugplanner(input: TerugplannerInput): TerugplannerResultaat | RekenFout {
  if (!input.startdatum) return {fout: "Kies een gewenste startdatum."};
  const start = new Date(input.startdatum);
  if (Number.isNaN(start.getTime())) return {fout: "Kies een geldige startdatum."};

  const vandaag = new Date();
  vandaag.setHours(0, 0, 0, 0);

  const stappen = DRO_TOOLS_CONFIG.tools.terugplanner.stappen
    .filter((stap) => {
      if (stap.conditie === "vergunning_nodig") return input.vergunningNodig;
      if (stap.conditie === "maatwerk") return input.maatwerk;
      if (stap.conditie === "geen_maatwerk") return !input.maatwerk;
      return true;
    })
    .map((stap) => {
      const datum = new Date(start);
      datum.setDate(datum.getDate() - stap.weken_voor_start * 7);
      return {stap, datum, verstreken: datum.getTime() < vandaag.getTime()};
    })
    .sort((a, b) => b.stap.weken_voor_start - a.stap.weken_voor_start);

  return {stappen};
}

// ---------------------------------------------------------------------------
// A4: Verbouwen tijdens bewoning check
// ---------------------------------------------------------------------------

export type BewoningInput = {
  ruimteIds: string[];
  tweedeToilet: boolean;
  thuiswerkers: boolean;
  kinderen: boolean;
};

export type BewoningResultaat = {
  score: number;
  titel: string;
  tekst: string;
  adviezen: string[];
};

/**
 * Telt scorepunten op voor elke geselecteerde ruimte, plus extra punten voor
 * een badkamer zonder tweede toilet, thuiswerkers en jonge kinderen. De
 * eerste drempel waarvan max_score de score bereikt of overschrijdt bepaalt
 * de uitkomst.
 */
export function berekenBewoning(input: BewoningInput): BewoningResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.bewoning;
  if (!input.ruimteIds.length) return {fout: "Selecteer minimaal 1 ruimte."};

  const geselecteerdeRuimtes = config.ruimtes.filter((r) => input.ruimteIds.includes(r.id));
  let score = geselecteerdeRuimtes.reduce((totaal, r) => totaal + r.score, 0);

  if (input.ruimteIds.includes(config.badkamer_id) && !input.tweedeToilet) {
    score += config.extra_score_badkamer_zonder_tweede_toilet;
  }
  if (input.thuiswerkers) score += config.thuiswerkers_score;
  if (input.kinderen) score += config.kinderen_score;

  const drempel = config.drempels.find((d) => score <= d.max_score) || config.drempels[config.drempels.length - 1];
  const adviezen = geselecteerdeRuimtes.map((r) => r.advies);

  return {score, titel: drempel.titel, tekst: drempel.tekst, adviezen};
}

// ---------------------------------------------------------------------------
// A5: Bouwgeluid en werktijden check
// ---------------------------------------------------------------------------

export function haalWerktijden(gemeenteId: string) {
  const config = DRO_TOOLS_CONFIG.tools.werktijden;
  return config.gemeenten.find((g) => g.id === gemeenteId) || null;
}

// ---------------------------------------------------------------------------
// B1: Tegel calculator
// ---------------------------------------------------------------------------

export type TegelWand = {lengte: number; hoogte: number; deuren: number; raamM2: number};

export function berekenWandHulptool(wanden: TegelWand[]): number {
  const config = DRO_TOOLS_CONFIG.tools.tegels;
  return wanden.reduce((totaal, wand) => {
    const bruto = (wand.lengte || 0) * (wand.hoogte || 0);
    const netto = Math.max(0, bruto - (wand.deuren || 0) * config.aftrek_per_deur_m2 - (wand.raamM2 || 0));
    return totaal + netto;
  }, 0);
}

export type TegelInput = {
  vloerM2: number;
  wandM2: number;
  formaatId: string;
  legpatroonId: string;
  m2PerDoosHandmatig?: number;
};

export type TegelResultaat = {
  formaat: TegelFormaat;
  legpatroon: Legpatroon;
  snijverlies: number;
  totaalM2: number;
  dozen: number;
  zakkenLijm: number;
  zakkenVoeg: number;
};

/**
 * Snijverlies komt uit het legpatroon, behalve bij mozaiek: dat heeft altijd
 * hetzelfde (lagere) snijverlies. Totaal m2 = (vloer + wand) x (1 +
 * snijverlies). Dozen, zakken lijm en zakken voeg worden op basis van dit
 * totaal berekend en steeds naar boven afgerond.
 */
export function berekenTegels(input: TegelInput): TegelResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.tegels;
  const formaat = config.formaten.find((f) => f.id === input.formaatId);
  const legpatroon = config.legpatronen.find((p) => p.id === input.legpatroonId);
  if (!formaat) return {fout: "Kies een tegelformaat."};
  if (!legpatroon) return {fout: "Kies een legpatroon."};

  const vloer = Number.isFinite(input.vloerM2) ? input.vloerM2 : 0;
  const wand = Number.isFinite(input.wandM2) ? input.wandM2 : 0;
  if (vloer <= 0 && wand <= 0) return {fout: "Vul een vloer- of wandoppervlak in."};

  const snijverlies = formaat.id === config.mozaiek_formaat_id ? config.mozaiek_snijverlies : legpatroon.snijverlies;
  const totaalM2 = (vloer + wand) * (1 + snijverlies);

  let m2PerDoos = formaat.m2_per_doos;
  if (m2PerDoos === null) {
    if (!input.m2PerDoosHandmatig || input.m2PerDoosHandmatig <= 0) return {fout: "Vul het aantal m² per doos in voor dit tegelformaat."};
    m2PerDoos = input.m2PerDoosHandmatig;
  }

  return {
    formaat,
    legpatroon,
    snijverlies,
    totaalM2,
    dozen: Math.ceil(totaalM2 / m2PerDoos),
    zakkenLijm: Math.ceil(totaalM2 / config.m2_per_zak_lijm),
    zakkenVoeg: Math.ceil(totaalM2 / config.m2_per_zak_voeg),
  };
}

// ---------------------------------------------------------------------------
// B2: Verf calculator
// ---------------------------------------------------------------------------

export type VerfInput = {
  verfsoortId: string;
  modus: "direct" | "help";
  m2Direct?: number;
  lengte?: number;
  breedte?: number;
  hoogte?: number;
  aftrekM2?: number;
  plafondMeeschilderen?: boolean;
  ondergrondId?: string;
  lagen?: number;
};

export type VerfResultaat = {
  verfsoort: VerfSoort;
  ondergrond?: VerfOndergrond;
  wandM2: number;
  plafondM2: number;
  totaalM2: number;
  lagen: number;
  liters: number;
  litersVoorstrijk?: number;
  blikkenAdvies: string;
};

function bepaalBlikkenAdvies(benodigdeLiters: number, blikmaten: VerfBlikmaat[]): string {
  if (benodigdeLiters <= 0 || blikmaten.length === 0) return "";
  const sorted = [...blikmaten].sort((a, b) => b.liter - a.liter);
  const kleinsteBlik = Math.min(...blikmaten.map((b) => b.liter));
  const maxPerMaat = Math.max(1, Math.ceil(benodigdeLiters / kleinsteBlik) + 1);

  let beste: {liters: number; aantallen: number[]; totaalBlikken: number} | null = null;

  function zoek(index: number, huidigeLiters: number, aantallen: number[]) {
    if (index === sorted.length) {
      if (huidigeLiters >= benodigdeLiters) {
        const totaalBlikken = aantallen.reduce((a, b) => a + b, 0);
        if (!beste || huidigeLiters < beste.liters || (huidigeLiters === beste.liters && totaalBlikken < beste.totaalBlikken)) {
          beste = {liters: huidigeLiters, aantallen: [...aantallen], totaalBlikken};
        }
      }
      return;
    }
    for (let aantal = 0; aantal <= maxPerMaat; aantal++) {
      aantallen.push(aantal);
      zoek(index + 1, huidigeLiters + aantal * sorted[index].liter, aantallen);
      aantallen.pop();
    }
  }

  zoek(0, 0, []);
  if (!beste) return "";
  const gekozen = beste as {liters: number; aantallen: number[]; totaalBlikken: number};
  return gekozen.aantallen.map((aantal, i) => (aantal > 0 ? `${aantal} x ${sorted[i].label}` : null)).filter(Boolean).join(" + ");
}

/**
 * In "direct" modus vult de gebruiker zelf het aantal m2 in. In "help" modus
 * wordt het wandoppervlak berekend als 2 x (lengte + breedte) x hoogte, min
 * een aftrek voor deuren en ramen. Liters = (m2 x lagen) / dekking, naar
 * boven afgerond op halve liters. Bij nieuw stucwerk komt er losse
 * voorstrijk bovenop (1 laag, dus niet vermenigvuldigd met het aantal lagen).
 */
export function berekenVerf(input: VerfInput): VerfResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.verf;
  const verfsoort = config.verfsoorten.find((v) => v.id === input.verfsoortId);
  if (!verfsoort) return {fout: "Kies een verfsoort."};
  const isMuurverf = verfsoort.id === config.muurverf_verfsoort_id;
  const ondergrond = isMuurverf ? config.ondergronden.find((o) => o.id === input.ondergrondId) : undefined;
  if (isMuurverf && !ondergrond) return {fout: "Kies een ondergrond."};

  let wandM2 = 0;
  let plafondM2 = 0;

  if (input.modus === "direct") {
    if (!Number.isFinite(input.m2Direct) || (input.m2Direct as number) <= 0) return {fout: "Vul het aantal m² in."};
    wandM2 = input.m2Direct as number;
  } else {
    const lengte = input.lengte ?? 0;
    const breedte = input.breedte ?? 0;
    const hoogte = input.hoogte ?? 0;
    if (!(lengte > 0) || !(breedte > 0) || !(hoogte > 0)) return {fout: "Vul lengte, breedte en hoogte in."};
    const aftrek = Number.isFinite(input.aftrekM2) ? (input.aftrekM2 as number) : config.standaard_aftrek_m2;
    wandM2 = Math.max(0, 2 * (lengte + breedte) * hoogte - aftrek);
    if (isMuurverf && input.plafondMeeschilderen) plafondM2 = lengte * breedte;
  }

  const totaalM2 = wandM2 + plafondM2;
  if (totaalM2 <= 0) return {fout: "Er is geen oppervlak om te schilderen."};

  const standaardLagen = ondergrond?.default_lagen ?? verfsoort.default_lagen;
  const lagen = Number.isFinite(input.lagen) ? (input.lagen as number) : standaardLagen;
  const liters = rondAfOpHalf((totaalM2 * lagen) / verfsoort.m2_per_liter_gemiddeld);
  const litersVoorstrijk = isMuurverf && ondergrond?.voorstrijk_nodig ? rondAfOpHalf(totaalM2 / config.voorstrijk_m2_per_liter) : undefined;
  const blikkenAdvies = bepaalBlikkenAdvies(liters, config.blikmaten);

  return {verfsoort, ondergrond, wandM2, plafondM2, totaalM2, lagen, liters, litersVoorstrijk, blikkenAdvies};
}

// ---------------------------------------------------------------------------
// B3: Laminaat en PVC calculator
// ---------------------------------------------------------------------------

export type VloerInput = {
  m2: number;
  typeId: string;
  ondervloerNodig: boolean;
};

export type VloerResultaat = {
  type: VloerType;
  totaalM2: number;
  pakken: number;
  rollenOndervloer?: number;
};

/** Totaal m2 = m2 x (1 + snijverlies van het gekozen type). Pakken = totaal / m2 per pak. Ondervloer in rollen van vaste m2. */
export function berekenVloer(input: VloerInput): VloerResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.vloer;
  const type = config.types.find((t) => t.id === input.typeId);
  if (!type) return {fout: "Kies een vloertype."};
  if (!Number.isFinite(input.m2) || input.m2 <= 0) return {fout: "Vul het aantal m² in."};

  const totaalM2 = input.m2 * (1 + type.snijverlies);
  const pakken = Math.ceil(totaalM2 / type.m2_per_pak);
  const rollenOndervloer = input.ondervloerNodig ? Math.ceil(input.m2 / config.ondervloer_m2_per_rol) : undefined;

  return {type, totaalM2, pakken, rollenOndervloer};
}

// ---------------------------------------------------------------------------
// B4: Behang calculator
// ---------------------------------------------------------------------------

export type BehangInput = {
  modus: "afmeting" | "m2";
  omtrek?: number;
  muurhoogte?: number;
  m2?: number;
  patroonherhalingCm?: number;
  rolbreedte?: number;
  rollengte?: number;
};

export type BehangResultaat = {
  rollen: number;
  rolbreedte: number;
  rollengte: number;
};

/**
 * Bij afmeting-invoer: banen per rol = rollengte / (muurhoogte +
 * patroonherhaling + snijmarge). Banen nodig = omtrek / rolbreedte. Rollen =
 * banen nodig / banen per rol, naar boven. Bij alleen m2: vereenvoudigde
 * formule met een vast verliespercentage (hoger bij patroonherhaling).
 */
export function berekenBehang(input: BehangInput): BehangResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.behang;
  const rolbreedte = input.rolbreedte || config.rolbreedte_default;
  const rollengte = input.rollengte || config.rollengte_default;
  const patroonherhalingCm = input.patroonherhalingCm || 0;

  if (input.modus === "afmeting") {
    if (!Number.isFinite(input.omtrek) || (input.omtrek as number) <= 0) return {fout: "Vul de omtrek van de muren in."};
    if (!Number.isFinite(input.muurhoogte) || (input.muurhoogte as number) <= 0) return {fout: "Vul de muurhoogte in."};
    const banenPerRol = Math.floor(rollengte / ((input.muurhoogte as number) + patroonherhalingCm / 100 + config.snijmarge));
    if (banenPerRol <= 0) return {fout: "Deze combinatie van hoogte en patroon past niet op een rol."};
    const banenNodig = Math.ceil((input.omtrek as number) / rolbreedte);
    return {rollen: Math.ceil(banenNodig / banenPerRol), rolbreedte, rollengte};
  }

  if (!Number.isFinite(input.m2) || (input.m2 as number) <= 0) return {fout: "Vul het aantal m² in."};
  const verlies = patroonherhalingCm > 0 ? config.verlies_met_patroon : config.verlies_zonder_patroon;
  const rollen = Math.ceil(((input.m2 as number) * (1 + verlies)) / (rolbreedte * rollengte));
  return {rollen, rolbreedte, rollengte};
}

// ---------------------------------------------------------------------------
// B5: Plinten en profielen calculator
// ---------------------------------------------------------------------------

export type PlintenInput = {
  omtrekM: number;
  deuren: number;
};

export type PlintenResultaat = {
  meters: number;
  stuks: number;
};

/** Strekkende meters = (omtrek - deuren x aftrek per deur) x (1 + zaagverlies). Stuks = meters / lengte per plint. */
export function berekenPlinten(input: PlintenInput): PlintenResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.plinten;
  if (!Number.isFinite(input.omtrekM) || input.omtrekM <= 0) return {fout: "Vul de omtrek in."};

  const nettoMeters = Math.max(0, input.omtrekM - (input.deuren || 0) * config.aftrek_per_deur_m);
  const meters = nettoMeters * (1 + config.zaagverlies);
  const stuks = Math.ceil(meters / config.lengte_per_plint_default);

  return {meters, stuks};
}

// ---------------------------------------------------------------------------
// B6: Kitwerk calculator
// ---------------------------------------------------------------------------

export type KitInput = {
  onderdeelIds: string[];
  naadbreedteId: string;
};

export type KitResultaat = {
  totaalMeters: number;
  kokers: number;
};

/** Kokers = totale strekkende meters gekozen onderdelen / meters per koker bij de gekozen naadbreedte. */
export function berekenKit(input: KitInput): KitResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.kit;
  const naadbreedte = config.naadbreedtes.find((n) => n.id === input.naadbreedteId);
  if (!naadbreedte) return {fout: "Kies een naadbreedte."};
  if (!input.onderdeelIds.length) return {fout: "Selecteer minimaal 1 onderdeel."};

  const totaalMeters = config.onderdelen
    .filter((o) => input.onderdeelIds.includes(o.id))
    .reduce((totaal, o) => totaal + o.standaard_meters, 0);

  return {totaalMeters, kokers: Math.ceil(totaalMeters / naadbreedte.meters_per_koker)};
}

// ---------------------------------------------------------------------------
// B7: Stucwerk m2 indicatie
// ---------------------------------------------------------------------------

export type StucwerkInput = {
  vloerM2: number;
  aantalRuimtes: number;
  woningtypeId: string;
  plafondsMeenemen: boolean;
  plafondhoogte?: number;
};

export type StucwerkResultaat = {
  wandM2: number;
  plafondM2: number;
  dagenMin: number;
  dagenMax: number;
};

/**
 * Wandoppervlak = vloeroppervlak x factor van het woningtype, plus een
 * correctie voor extra ruimtes boven de drempel (meer ruimtes = meer
 * tussenwanden), min de standaard aftrek voor deur- en raamopeningen.
 * Plafondoppervlak = vloeroppervlak (alleen als plafonds meegenomen worden).
 */
export function berekenStucwerk(input: StucwerkInput): StucwerkResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.stucwerk;
  const woningtype = config.woningtypes.find((w) => w.id === input.woningtypeId);
  if (!woningtype) return {fout: "Kies een woningtype."};
  if (!Number.isFinite(input.vloerM2) || input.vloerM2 <= 0) return {fout: "Vul het vloeroppervlak in."};
  if (!Number.isFinite(input.aantalRuimtes) || input.aantalRuimtes <= 0) return {fout: "Vul het aantal ruimtes in."};

  const extraRuimtes = Math.max(0, input.aantalRuimtes - config.drempel_aantal_ruimtes);
  const factor = woningtype.wand_factor + extraRuimtes * config.correctie_per_extra_ruimte;
  const wandM2Bruto = input.vloerM2 * factor;
  const wandM2 = Math.round(wandM2Bruto * (1 - config.aftrek_openingen_pct));
  const plafondM2 = input.plafondsMeenemen ? Math.round(input.vloerM2) : 0;

  const totaalM2 = wandM2 + plafondM2;
  const dagenMin = Math.ceil(totaalM2 / config.m2_per_dag_max);
  const dagenMax = Math.ceil(totaalM2 / config.m2_per_dag_min);

  return {wandM2, plafondM2, dagenMin, dagenMax};
}

// ---------------------------------------------------------------------------
// B8: Egaline calculator
// ---------------------------------------------------------------------------

export type EgalineInput = {m2: number; mm: number};
export type EgalineResultaat = {zakken: number; totaalKg: number};

/** Verbruik = m2 x mm laagdikte x kg per m2 per mm. Zakken = totaal kg / kg per zak. */
export function berekenEgaline(input: EgalineInput): EgalineResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.egaline;
  if (!Number.isFinite(input.m2) || input.m2 <= 0) return {fout: "Vul het aantal m² in."};
  if (!Number.isFinite(input.mm) || input.mm <= 0) return {fout: "Vul de laagdikte in."};

  const totaalKg = input.m2 * input.mm * config.kg_per_m2_per_mm;
  return {zakken: Math.ceil(totaalKg / config.kg_per_zak), totaalKg};
}

// ---------------------------------------------------------------------------
// B9: Containercalculator
// ---------------------------------------------------------------------------

export type ContainerInput = {klusTypeId: string; m2: number};
export type ContainerResultaat = {sloopVolume: number; werkafvalVolume: number; volume: number; advies: string};

/**
 * Sloopvolume = m2 x m3 per m2 van het klustype x uitzetfactor (los puin).
 * Daarbovenop komt werkafval tijdens de bouw (verpakkingen, zaagresten,
 * restmateriaal), als vast percentage van het sloopvolume. Het containeradvies
 * kiest de kleinste maat uit de config die past, of het aantal wissels van de
 * grootste maat. De kleinste maat in config.maten is bewust nooit kleiner dan
 * config.minimum_advies_m3, kleine containers zijn in de praktijk altijd te
 * krap zodra het werk eenmaal loopt.
 */
export function berekenContainer(input: ContainerInput): ContainerResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.container;
  const klustype = config.klustypes.find((k) => k.id === input.klusTypeId);
  if (!klustype) return {fout: "Kies een type klus."};
  if (!Number.isFinite(input.m2) || input.m2 <= 0) return {fout: "Vul het aantal m² in."};

  const sloopVolume = input.m2 * klustype.m3_per_m2 * config.uitzetfactor;
  const werkafvalVolume = sloopVolume * config.werkafval_factor;
  const volume = sloopVolume + werkafvalVolume;
  const sortedMaten = [...config.maten].sort((a, b) => a.m3 - b.m3);
  const grootste = sortedMaten[sortedMaten.length - 1];
  const passendeMaat = sortedMaten.find((maat) => maat.m3 >= volume);

  const advies = passendeMaat
    ? `1x ${passendeMaat.label} container`
    : `${Math.ceil(volume / grootste.m3)} wissels van ${grootste.label}`;

  return {sloopVolume, werkafvalVolume, volume, advies};
}

// ---------------------------------------------------------------------------
// C1: Vloerverwarming systeemkeuze
// ---------------------------------------------------------------------------

export type VloerverwarmingInput = {ondervloerId: string; frezenId: string; hoogteId: string; m2: number};
export type VloerverwarmingResultaat = {
  weetNiet: boolean;
  boodschap: string | null;
  systemen: {naam: string; regelsUitleg: string[]; vloertypeAdvies: string}[];
};

/**
 * Kiest het aanlegsysteem via de eerste regel in config.regels die matcht op
 * ondervloer, frezen en hoogte. Bij "weet ik niet" op ondervloer of frezen
 * worden de 2 meest waarschijnlijke systemen getoond in plaats van 1 advies.
 */
export function bepaalVloerverwarmingSysteem(input: VloerverwarmingInput): VloerverwarmingResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.vloerverwarming;
  if (!input.ondervloerId || !input.frezenId || !input.hoogteId) return {fout: "Beantwoord alle vragen."};
  if (!Number.isFinite(input.m2) || input.m2 <= 0) return {fout: "Vul het aantal m² in."};

  if (input.ondervloerId === "weet_niet" || input.frezenId === "weet_niet") {
    const systemen = config.weet_niet_systeem_ids
      .map((id) => config.systemen.find((s) => s.id === id))
      .filter((s): s is (typeof config.systemen)[number] => Boolean(s))
      .map((s) => ({naam: s.naam, regelsUitleg: s.regels_uitleg, vloertypeAdvies: s.vloertype_advies}));
    return {weetNiet: true, boodschap: config.weet_niet_boodschap, systemen};
  }

  const regel = config.regels.find(
    (r) =>
      (!r.ondervloer || r.ondervloer.includes(input.ondervloerId)) &&
      (!r.frezen || r.frezen.includes(input.frezenId)) &&
      (!r.hoogte || r.hoogte.includes(input.hoogteId)),
  );
  const systeemId = regel?.systeem_id ?? config.fallback_systeem_id;
  const systeem = config.systemen.find((s) => s.id === systeemId);
  if (!systeem) return {fout: "Kon geen systeem bepalen."};

  return {
    weetNiet: false,
    boodschap: null,
    systemen: [{naam: systeem.naam, regelsUitleg: systeem.regels_uitleg, vloertypeAdvies: systeem.vloertype_advies}],
  };
}

// ---------------------------------------------------------------------------
// C2: Ventilatie badkamer calculator
// ---------------------------------------------------------------------------

export type VentilatieInput = {m2: number; hoogte?: number};
export type VentilatieResultaat = {m3PerUur: number};

/** Neemt de hoogste van: het bouwbesluit-minimum, of het volume x het ventilatievoud per uur. */
export function berekenVentilatie(input: VentilatieInput): VentilatieResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.ventilatie;
  if (!Number.isFinite(input.m2) || input.m2 <= 0) return {fout: "Vul het aantal m² in."};

  const hoogte = input.hoogte || config.standaard_hoogte;
  const viaVolume = input.m2 * hoogte * config.ventilatievoud_per_uur;

  return {m3PerUur: Math.max(config.minimum_m3_per_uur, viaVolume)};
}

// ---------------------------------------------------------------------------
// C3: Groepenkast calculator
// ---------------------------------------------------------------------------

export type GroepenkastInput = {etages: number; apparaatIds: string[]; aansluitingId: string};
export type GroepenkastResultaat = {
  totaalGroepen: number;
  groepenVerlichting: number;
  groepenWcd: number;
  groepenApparaten: number;
  reserveGroepen: number;
  totaalVermogenKw: number;
  driefaseAdvies: boolean;
  netverzwaringAdvies: boolean;
};

/**
 * Totaal aantal groepen = basisgroepen per etage (verlichting + wcd) plus 1
 * groep per geselecteerd zwaar apparaat plus een vaste reservegroep. 3 fasen
 * wordt geadviseerd zodra een apparaat uit de triggerlijst is aangevinkt of
 * het totale vermogen boven de drempel komt.
 */
export function berekenGroepenkast(input: GroepenkastInput): GroepenkastResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.groepenkast;
  const aansluiting = config.aansluitingen.find((a) => a.id === input.aansluitingId);
  if (!aansluiting) return {fout: "Kies je huidige aansluiting."};
  if (!Number.isFinite(input.etages) || input.etages < 1) return {fout: "Vul het aantal etages in."};

  const apparaten = config.apparaten.filter((a) => input.apparaatIds.includes(a.id));
  const groepenVerlichting = input.etages * config.groepen_verlichting_per_etage;
  const groepenWcd = input.etages * config.groepen_wcd_per_etage;
  const groepenApparaten = apparaten.filter((a) => a.eigen_groep).length;
  const reserveGroepen = config.reserve_groepen;
  const totaalGroepen = groepenVerlichting + groepenWcd + groepenApparaten + reserveGroepen;

  const totaalVermogenKw = apparaten.reduce((totaal, a) => totaal + a.indicatief_vermogen_kw, 0);
  const driefaseAdvies = apparaten.some((a) => config.driefase_trigger_apparaat_ids.includes(a.id)) || totaalVermogenKw > config.driefase_advies_vermogen_kw;
  const netverzwaringAdvies = totaalVermogenKw > aansluiting.max_kw || (driefaseAdvies && !aansluiting.is_driefase);

  return {totaalGroepen, groepenVerlichting, groepenWcd, groepenApparaten, reserveGroepen, totaalVermogenKw, driefaseAdvies, netverzwaringAdvies};
}

// ---------------------------------------------------------------------------
// C4: Verwarmingsvermogen check
// ---------------------------------------------------------------------------

export type VerwarmingInput = {m2: number; bouwjaarId: string; hoogte?: number};
export type VerwarmingResultaat = {kw: number; advies: string};

/** Vermogen kW = m2 x hoogte x W/m3 van het bouwjaar / 1000. Advies over warmtepomp, hybride, of eerst isoleren op basis van vaste drempels. */
export function berekenVerwarming(input: VerwarmingInput): VerwarmingResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.verwarming;
  const bouwjaar = config.bouwjaren.find((b) => b.id === input.bouwjaarId);
  if (!bouwjaar) return {fout: "Kies een bouwjaar categorie."};
  if (!Number.isFinite(input.m2) || input.m2 <= 0) return {fout: "Vul het woonoppervlak in."};

  const hoogte = input.hoogte || config.standaard_hoogte;
  const kw = (input.m2 * hoogte * bouwjaar.watt_per_m3) / 1000;

  let advies = "Eerst isoleren, daarna pas een nieuwe installatie kiezen.";
  if (kw < config.drempel_warmtepomp_kw) advies = "Een volledige warmtepomp is kansrijk bij dit vermogen.";
  else if (kw < config.drempel_hybride_kw) advies = "Een hybride oplossing is het overwegen waard.";

  return {kw, advies};
}

// ---------------------------------------------------------------------------
// C5: Radiator vermogen per ruimte
// ---------------------------------------------------------------------------

export type RadiatorInput = {m2: number; ruimtetypeId: string; bouwjaarId: string};
export type RadiatorResultaat = {watt: number; isBadkamer: boolean; ruimtetypeLabel: string};

/** Vermogen W = m2 x W/m2 van het ruimtetype x de bouwjaarfactor. */
export function berekenRadiator(input: RadiatorInput): RadiatorResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.radiator;
  const ruimtetype = config.ruimtetypes.find((r) => r.id === input.ruimtetypeId);
  const bouwjaar = config.bouwjaarfactoren.find((b) => b.id === input.bouwjaarId);
  if (!ruimtetype) return {fout: "Kies een ruimtetype."};
  if (!bouwjaar) return {fout: "Kies een bouwjaar categorie."};
  if (!Number.isFinite(input.m2) || input.m2 <= 0) return {fout: "Vul het oppervlak van de ruimte in."};

  const watt = Math.round(input.m2 * ruimtetype.watt_per_m2 * bouwjaar.factor);

  return {watt, isBadkamer: ruimtetype.id === config.badkamer_ruimtetype_id, ruimtetypeLabel: ruimtetype.label};
}

// ---------------------------------------------------------------------------
// C6: Isolatie Rc check
// ---------------------------------------------------------------------------

export type IsolatieInput = {bouwdeelId: string; bouwjaarId: string; naGeisoleerd: boolean};
export type IsolatieResultaat = {huidigeWaarde: number; eisTekst: string; bouwdeelLabel: string};

/** Geschatte huidige Rc-waarde komt uit een tabel per bouwdeel en bouwjaar, plus een verbetering als er al is nageisoleerd. */
export function berekenIsolatie(input: IsolatieInput): IsolatieResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.isolatie;
  const bouwdeel = config.bouwdelen.find((b) => b.id === input.bouwdeelId);
  const bouwjaar = config.bouwjaren.find((b) => b.id === input.bouwjaarId);
  if (!bouwdeel) return {fout: "Kies een bouwdeel."};
  if (!bouwjaar) return {fout: "Kies een bouwjaar categorie."};

  const basis = bouwdeel.waarden_per_bouwjaar[input.bouwjaarId] ?? 0;
  const huidigeWaarde = basis + (input.naGeisoleerd ? config.na_geisoleerd_verbetering : 0);

  return {huidigeWaarde, eisTekst: bouwdeel.eis_nieuwbouw_tekst, bouwdeelLabel: bouwdeel.label};
}

// ---------------------------------------------------------------------------
// C7: Afschot douche calculator
// ---------------------------------------------------------------------------

export type AfschotInput = {lengteCm: number; type: "goot" | "putje_midden"};
export type AfschotResultaat = {hoogteverschilMm: number};

/** Hoogteverschil = de relevante afstand in meters x mm afschot per meter. Bij een putje in het midden telt maar de helft van de lengte mee. */
export function berekenAfschot(input: AfschotInput): AfschotResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.afschot;
  if (!Number.isFinite(input.lengteCm) || input.lengteCm <= 0) return {fout: "Vul de lengte van de doucheveloer in."};

  const afstandM = input.type === "putje_midden" ? input.lengteCm / 2 / 100 : input.lengteCm / 100;
  return {hoogteverschilMm: afstandM * config.mm_per_meter_default};
}

// ---------------------------------------------------------------------------
// D1: Verbouwen of verhuizen check (generieke scorewizard)
// ---------------------------------------------------------------------------

export type ScoreAntwoorden = Record<string, string>;

export type VerbouwenVerhuizenResultaat = {
  score: number;
  uitkomst: ScoreUitkomst;
  overwegingen: string[];
};

/** Telt de score van elk gegeven antwoord op. De eerste drempel waarvan max_score de score bereikt of overschrijdt bepaalt de uitkomst. */
export function berekenVerbouwenVerhuizen(antwoorden: ScoreAntwoorden): VerbouwenVerhuizenResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools["verbouwen-verhuizen"];
  if (Object.keys(antwoorden).length < config.vragen.length) return {fout: "Beantwoord alle vragen."};

  let score = 0;
  config.vragen.forEach((vraag) => {
    const antwoord = vraag.antwoorden.find((a) => a.id === antwoorden[vraag.id]);
    if (antwoord) score += antwoord.score;
  });

  const drempel = config.drempels.find((d) => score <= d.max_score) || config.drempels[config.drempels.length - 1];
  const uitkomst = config.uitkomsten.find((u) => u.id === drempel.uitkomst_id);
  if (!uitkomst) return {fout: "Kon geen uitkomst bepalen."};

  const overwegingen = config.overwegingen
    .filter((o) => antwoorden[o.vraag_id] === o.antwoord_id)
    .map((o) => o.tekst);

  return {score, uitkomst, overwegingen};
}

// ---------------------------------------------------------------------------
// D2: Ruimtewinst calculator
// ---------------------------------------------------------------------------

export type RuimtewinstInput = {
  typeId: string;
  breedte?: number;
  diepte?: number;
  m2?: number;
  zolderM2?: number;
  zolderStahoogteDeelPct?: number;
};

export type RuimtewinstResultaat = {
  m2: number;
  m3: number;
  waardeMinPct: number;
  waardeMaxPct: number;
  nieuweRuimteSuggestie: string;
};

/**
 * Nieuwe m2 hangt af van het type: uitbouw = breedte x diepte, dakopbouw en
 * dakkapel gebruiken het ingevoerde m2 (dakkapel: breedte x vaste dieptezone),
 * zolder = huidig zolder-m2 x het deel met stahoogte. Nieuw volume = m2 x
 * hoogte van dat type. Het waarde-effect is altijd een percentage-range, nooit
 * een bedrag.
 */
export function berekenRuimtewinst(input: RuimtewinstInput): RuimtewinstResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.ruimtewinst;
  const type = config.types.find((t) => t.id === input.typeId);
  if (!type) return {fout: "Kies een type."};

  let m2 = 0;
  if (type.id === "uitbouw") {
    if (!Number.isFinite(input.breedte) || !Number.isFinite(input.diepte)) return {fout: "Vul breedte en diepte in."};
    m2 = (input.breedte as number) * (input.diepte as number);
  } else if (type.id === "dakkapel") {
    if (!Number.isFinite(input.breedte)) return {fout: "Vul de breedte in."};
    m2 = (input.breedte as number) * config.dakkapel_diepte_zone;
  } else if (type.id === "zolder") {
    if (!Number.isFinite(input.zolderM2)) return {fout: "Vul het huidige zolderoppervlak in."};
    const deelPct = input.zolderStahoogteDeelPct ?? config.zolder_stahoogte_deel_default_pct;
    m2 = (input.zolderM2 as number) * (deelPct / 100);
  } else {
    if (!Number.isFinite(input.m2)) return {fout: "Vul het oppervlak in."};
    m2 = input.m2 as number;
  }

  if (m2 <= 0) return {fout: "Vul geldige afmetingen in."};

  const m3 = m2 * type.hoogte;
  const nieuweRuimteSuggestie =
    config.nieuwe_ruimte_opties.find((optie) => m2 >= optie.min_m2)?.label ||
    config.nieuwe_ruimte_opties[config.nieuwe_ruimte_opties.length - 1].label;

  return {m2, m3, waardeMinPct: type.waarde_effect_min_pct, waardeMaxPct: type.waarde_effect_max_pct, nieuweRuimteSuggestie};
}

// ---------------------------------------------------------------------------
// D3: Kamermaten check
// ---------------------------------------------------------------------------

export type KamermatenInput = {typeId: string; lengte: number; breedte: number};
export type KamermatenResultaat = {
  status: "voldoet_niet" | "krap" | "comfortabel";
  m2: number;
  elementen: string[];
};

/** Vergelijkt het oppervlak (en waar van toepassing de kortste zijde) met de minimale en comfortabele maten van het gekozen type. */
export function checkKamermaten(input: KamermatenInput): KamermatenResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.kamermaten;
  const type = config.types.find((t) => t.id === input.typeId);
  if (!type) return {fout: "Kies een type ruimte."};
  if (!Number.isFinite(input.lengte) || !Number.isFinite(input.breedte) || input.lengte <= 0 || input.breedte <= 0) {
    return {fout: "Vul lengte en breedte in."};
  }

  const m2 = input.lengte * input.breedte;
  const kortsteZijde = Math.min(input.lengte, input.breedte);
  const voldoetAanBreedte = !type.min_breedte || kortsteZijde >= type.min_breedte;

  let status: KamermatenResultaat["status"] = "voldoet_niet";
  if (m2 >= type.comfort_m2 && voldoetAanBreedte) status = "comfortabel";
  else if (m2 >= type.min_m2 && voldoetAanBreedte) status = "krap";

  return {status, m2, elementen: type.elementen};
}

// ---------------------------------------------------------------------------
// D4: Sloopchecklist generator
// ---------------------------------------------------------------------------

export type SloopChecklistInput = {
  projectTypeId: string;
  bouwjaar: number;
  vve: boolean;
  bewoning: boolean;
};

export type SloopChecklistResultaat = {
  items: SloopChecklistItem[];
  asbestVanToepassing: boolean;
};

/** Filtert de master-checklist op het gekozen projecttype en de gegeven voorwaarden (bouwjaar voor 1994, VvE, bewoning tijdens sloop). */
export function genereerSloopChecklist(input: SloopChecklistInput): SloopChecklistResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.sloopchecklist;
  if (!config.projecttypes.find((t) => t.id === input.projectTypeId)) return {fout: "Kies een projecttype."};
  if (!Number.isFinite(input.bouwjaar) || input.bouwjaar < 1800 || input.bouwjaar > new Date().getFullYear()) {
    return {fout: "Vul een geldig bouwjaar in."};
  }

  const asbestVanToepassing = input.bouwjaar < config.asbest_jaar_grens;

  const items = config.items.filter((item) => {
    if (item.voorwaarde === "voor_1994") return asbestVanToepassing;
    if (item.voorwaarde === "vve") return input.vve;
    if (item.voorwaarde === "bewoning") return input.bewoning;
    return item.types.length === 0 || item.types.includes(input.projectTypeId);
  });

  const gesorteerd = [...items].sort((a, b) => (a.prioriteit === "hoog" ? -1 : 0) - (b.prioriteit === "hoog" ? -1 : 0));

  return {items: gesorteerd, asbestVanToepassing};
}

// ---------------------------------------------------------------------------
// E1: Burenbrief generator
// ---------------------------------------------------------------------------

export type BurenbriefInput = {
  naam: string;
  adres: string;
  projectTypeId: string;
  startdatum: string;
  einddatum: string;
  luidruchtigePeriode: string;
  contact: string;
  variantId: string;
};

export type BurenbriefResultaat = {tekst: string};

function formatteerDatumNL(iso: string): string {
  if (!iso) return "";
  const datum = new Date(iso);
  if (Number.isNaN(datum.getTime())) return iso;
  return datum.toLocaleDateString("nl-NL", {day: "numeric", month: "long", year: "numeric"});
}

/** Vult de gekozen briefvariant (template met placeholders) met de ingevulde gegevens. Alles blijft client-side. */
export function genereerBurenbrief(input: BurenbriefInput): BurenbriefResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.burenbrief;
  const variant = config.varianten.find((v) => v.id === input.variantId);
  if (!variant) return {fout: "Kies een briefvariant."};
  const projecttype = config.projecttypes.find((t) => t.id === input.projectTypeId);
  if (!input.naam || !input.adres || !projecttype || !input.startdatum) return {fout: "Vul naam, adres, projecttype en startdatum in."};

  const tekst = vulTemplate(variant.template, {
    naam: input.naam,
    adres: input.adres,
    projecttype: projecttype.label.toLowerCase(),
    startdatum: formatteerDatumNL(input.startdatum),
    einddatum: input.einddatum ? formatteerDatumNL(input.einddatum) : "de geplande einddatum",
    luidruchtige_periode: input.luidruchtigePeriode || "de eerste weken",
    contact: input.contact || input.naam,
  });

  return {tekst};
}

// ---------------------------------------------------------------------------
// E2: VvE onderhoudscheck
// ---------------------------------------------------------------------------

export type VveOnderhoudInput = {
  bouwjaar: number;
  laatsteSchilderwerk?: number;
  laatsteDakonderhoud?: number;
  dakType: "plat" | "hellend";
  kozijnen: "hout" | "kunststof" | "aluminium";
};

export type VveOnderhoudStatus = "op_schema" | "aandacht" | "achterstallig";

export type VveOnderhoudResultaatItem = {
  item: string;
  status: VveOnderhoudStatus;
  cyclusTekst: string;
};

export type VveOnderhoudResultaat = {items: VveOnderhoudResultaatItem[]};

/** Vergelijkt "jaren geleden" met de gangbare onderhoudscyclus van elk van toepassing zijnd onderdeel. "Weet niet" wordt als aandachtspunt gemarkeerd. */
export function checkVveOnderhoud(input: VveOnderhoudInput): VveOnderhoudResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools["vve-onderhoud"];
  const huidigJaar = new Date().getFullYear();

  const relevanteItems = config.items.filter((item) => {
    if (!item.van_toepassing) return true;
    if (item.van_toepassing.veld === "dak_type") return input.dakType === item.van_toepassing.waarde;
    if (item.van_toepassing.veld === "kozijnen") return input.kozijnen === item.van_toepassing.waarde;
    return true;
  });

  const jarenGeledenPerItem = (itemId: string): number | undefined => {
    if (itemId === "schilderwerk") return input.laatsteSchilderwerk ? huidigJaar - input.laatsteSchilderwerk : undefined;
    if (itemId.startsWith("plat_dak") || itemId === "hellend_dak") return input.laatsteDakonderhoud ? huidigJaar - input.laatsteDakonderhoud : undefined;
    return undefined;
  };

  const items: VveOnderhoudResultaatItem[] = relevanteItems.map((item) => {
    const jarenGeleden = jarenGeledenPerItem(item.id);
    let status: VveOnderhoudStatus = "aandacht";
    if (jarenGeleden === undefined) status = "aandacht";
    else if (jarenGeleden > item.cyclus_jaren_max) status = "achterstallig";
    else if (jarenGeleden >= item.cyclus_jaren_min) status = "aandacht";
    else status = "op_schema";

    return {
      item: item.label,
      status,
      cyclusTekst: `Gangbare cyclus: ${item.cyclus_jaren_min} tot ${item.cyclus_jaren_max} jaar.`,
    };
  });

  return {items};
}

// ---------------------------------------------------------------------------
// E3: Transformatie quickscan
// ---------------------------------------------------------------------------

export type TransformatieInput = {m2Bvo: number; aantalWoningen: number};
export type TransformatieResultaat = {gemiddeldeWoninggrootte: number; onderMinimum: boolean};

/** Gemiddelde woninggrootte = m2 BVO x verhuurbare factor / aantal beoogde woningen. Waarschuwt onder de minimale woninggrootte. */
export function berekenTransformatie(input: TransformatieInput): TransformatieResultaat | RekenFout {
  const config = DRO_TOOLS_CONFIG.tools.transformatie;
  if (!Number.isFinite(input.m2Bvo) || input.m2Bvo <= 0) return {fout: "Vul het aantal m² BVO in."};
  if (!Number.isFinite(input.aantalWoningen) || input.aantalWoningen <= 0) return {fout: "Vul het aantal beoogde woningen in."};

  const gemiddeldeWoninggrootte = (input.m2Bvo * config.verhuurbaar_factor) / input.aantalWoningen;

  return {gemiddeldeWoninggrootte, onderMinimum: gemiddeldeWoninggrootte < config.min_woninggrootte_m2};
}

// ---------------------------------------------------------------------------
// E4: Klusvolgorde planner
// ---------------------------------------------------------------------------

export function berekenKlusvolgorde(geselecteerdeIds: string[]): KlusvolgordeStap[] {
  return DRO_TOOLS_CONFIG.tools.klusvolgorde.stappen
    .filter((stap) => geselecteerdeIds.includes(stap.id))
    .sort((a, b) => a.volgorde - b.volgorde);
}

// ---------------------------------------------------------------------------
// E5: Verhuur klaar check
// ---------------------------------------------------------------------------

export type VerhuurResultaat = {
  status: "klaar" | "bijna" | "niet_klaar";
  ontbrekend: Array<{label: string; verplicht: boolean; uitleg: string}>;
};

export function checkVerhuurKlaar(aangevinktIds: string[]): VerhuurResultaat {
  const config = DRO_TOOLS_CONFIG.tools.verhuurklaar;
  const ontbrekend = config.items
    .filter((item) => !aangevinktIds.includes(item.id))
    .sort((a, b) => (a.verplicht === b.verplicht ? 0 : a.verplicht ? -1 : 1))
    .map((item) => ({label: item.label, verplicht: item.verplicht, uitleg: item.uitleg}));

  const ontbrekendVerplicht = ontbrekend.some((item) => item.verplicht);
  const status: VerhuurResultaat["status"] = ontbrekend.length === 0 ? "klaar" : ontbrekendVerplicht ? "niet_klaar" : "bijna";

  return {status, ontbrekend};
}
