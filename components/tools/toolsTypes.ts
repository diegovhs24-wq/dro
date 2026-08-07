/**
 * Type-definities voor de Handige Tools bibliotheek. Dit bestand hoef je
 * normaal nooit aan te passen, dit beschrijft alleen de "vorm" van de
 * waardes in toolsConfig.ts zodat een typefout (bijvoorbeeld tekst waar een
 * getal hoort) direct wordt opgemerkt. De uitleg per waarde staat in
 * toolsConfig.ts zelf, niet hier.
 */

export type Categorie = {
  id: string;
  naam: string;
};

/** Registratiegegevens die voor elke tool hetzelfde soort velden hebben. */
export type ToolMeta = {
  naam: string;
  categorie: string;
  omschrijving_kort: string;
  uitleg: string;
  trefwoorden: string[];
  volgorde: number;
  actief: boolean;
  gerelateerd: string[];
  whatsapp_tekst: string;
};

// ---------------------------------------------------------------------------
// Generieke bouwstenen, hergebruikt door meerdere tools
// ---------------------------------------------------------------------------

/** Eén optie in een dropdown of knoppenrij. */
export type KeuzeOptie = {
  id: string;
  label: string;
};

/** Generieke voorwaarde-gestuurde wizard (vraag -> antwoord -> regel -> uitkomst). Gebruikt door vergunningcheck. */
export type WizardVoorwaarde = {
  vraag_id: string;
  antwoord_ids: string[];
};

export type WizardVraag = {
  id: string;
  vraag: string;
  antwoorden: KeuzeOptie[];
  /** Toon deze vraag alleen als eerdere antwoorden aan ALLE voorwaarden voldoen. Leeg = altijd tonen. */
  zichtbaar_als: WizardVoorwaarde[];
};

export type StoplichtKleur = "groen" | "oranje" | "rood";

export type WizardUitkomst = {
  id: string;
  kleur: StoplichtKleur;
  titel: string;
  tekst: string;
  doorlooptijd: string;
};

export type WizardRegel = {
  voorwaarden: WizardVoorwaarde[];
  uitkomst_id: string;
};

/** Generieke gescoorde vragenlijst (elk antwoord telt punten op, drempels bepalen de uitkomst). Gebruikt door verbouwen-of-verhuizen. */
export type ScoreAntwoord = {
  id: string;
  label: string;
  score: number;
};

export type ScoreVraag = {
  id: string;
  vraag: string;
  antwoorden: ScoreAntwoord[];
};

export type ScoreDrempel = {
  /** Bij een totaalscore tot en met dit getal geldt deze uitkomst. Op volgorde van laag naar hoog, eerste match wint. */
  max_score: number;
  uitkomst_id: string;
};

export type ScoreUitkomst = {
  id: string;
  titel: string;
  tekst: string;
};

// ---------------------------------------------------------------------------
// CATEGORIE A: Tijd en planning
// ---------------------------------------------------------------------------

export type BouwtijdExtraOptie = {
  id: string;
  label: string;
  extra_dagen: number;
};

export type BouwtijdFormuleType = "drempel" | "vast" | "lineair_met_minimum" | "breedte_drempel";

export type BouwtijdProjectType = {
  id: string;
  label: string;
  formule_type: BouwtijdFormuleType;
  vraag_m2: boolean;
  m2_label?: string;
  min_m2?: number;
  max_m2?: number;
  default_m2?: number;
  basis_dagen?: number;
  drempel_m2?: number;
  dagen_per_extra_m2?: number;
  dagen_per_m2?: number;
  minimum_dagen?: number;
  vraag_verdiepingen?: boolean;
  min_verdiepingen?: number;
  max_verdiepingen?: number;
  default_verdiepingen?: number;
  dagen_per_extra_verdieping?: number;
  /** Voor "breedte_drempel" (dakkapel): breedte in meters in plaats van m2. */
  vraag_breedte?: boolean;
  breedte_label?: string;
  min_breedte?: number;
  max_breedte?: number;
  default_breedte?: number;
  drempel_breedte?: number;
  dagen_per_extra_breedte?: number;
  opties: string[];
  vaste_opmerking?: string;
};

export type BouwtijdConfig = {
  meta: ToolMeta;
  projecttypes: BouwtijdProjectType[];
  extra_opties: BouwtijdExtraOptie[];
  marge_boven: number;
  werkdagen_per_week: number;
  teksten: {
    resultaat_titel: string;
    opbouw_titel: string;
    voorbereiding_titel: string;
    voorbereiding_tekst: string;
    disclaimer: string;
  };
};

export type VergunningConfig = {
  meta: ToolMeta;
  vragen: WizardVraag[];
  uitkomsten: WizardUitkomst[];
  regels: WizardRegel[];
  vve_vraag_id: string;
  vve_ja_antwoord_id: string;
  vve_extra_tekst: string;
  omgevingsloket_url: string;
  disclaimer: string;
};

export type TerugplannerStapConditie = "vergunning_nodig" | "geen_maatwerk" | "maatwerk";

export type TerugplannerStap = {
  id: string;
  label: string;
  /** Aantal weken voor de gewenste startdatum dat deze stap uiterlijk moet gebeuren. */
  weken_voor_start: number;
  conditie?: TerugplannerStapConditie;
};

export type TerugplannerConfig = {
  meta: ToolMeta;
  stappen: TerugplannerStap[];
  teksten: {
    resultaat_titel: string;
    waarschuwing_verleden: string;
    disclaimer: string;
  };
};

export type BewoningRuimte = {
  id: string;
  label: string;
  score: number;
  advies: string;
};

export type BewoningDrempel = {
  max_score: number;
  titel: string;
  tekst: string;
};

export type BewoningConfig = {
  meta: ToolMeta;
  ruimtes: BewoningRuimte[];
  hele_woning_id: string;
  badkamer_id: string;
  extra_score_badkamer_zonder_tweede_toilet: number;
  thuiswerkers_score: number;
  kinderen_score: number;
  drempels: BewoningDrempel[];
  teksten: {
    resultaat_titel: string;
  };
};

export type WerktijdenGemeente = {
  id: string;
  label: string;
  werkdagen: string;
  zaterdag: string;
  zondag_feestdag: string;
  opmerking?: string;
};

export type WerktijdenConfig = {
  meta: ToolMeta;
  gemeenten: WerktijdenGemeente[];
  landelijke_vuistregel: {werkdagen: string; zaterdag: string; zondag_feestdag: string};
  gemeente_zoek_url: string;
  teksten: {
    melding_tekst: string;
    buren_tip: string;
    disclaimer: string;
  };
};

// ---------------------------------------------------------------------------
// CATEGORIE B: Materialen berekenen
// ---------------------------------------------------------------------------

export type TegelFormaat = {
  id: string;
  label: string;
  m2_per_doos: number | null;
  ondervloer_waarschuwing: boolean;
};

export type Legpatroon = {
  id: string;
  label: string;
  snijverlies: number;
};

export type TegelConfig = {
  meta: ToolMeta;
  formaten: TegelFormaat[];
  legpatronen: Legpatroon[];
  mozaiek_snijverlies: number;
  mozaiek_formaat_id: string;
  aftrek_per_deur_m2: number;
  m2_per_zak_lijm: number;
  m2_per_zak_voeg: number;
  max_wanden_hulptool: number;
  teksten: {
    resultaat_titel: string;
    lijm_tekst: string;
    voeg_tekst: string;
    ondervloer_tekst: string;
    tip: string;
    disclaimer: string;
  };
};

export type VerfOndergrond = {
  id: string;
  label: string;
  default_lagen: number;
  voorstrijk_nodig: boolean;
};

export type VerfBlikmaat = {
  liter: number;
  label: string;
};

export type VerfConfig = {
  meta: ToolMeta;
  ondergronden: VerfOndergrond[];
  blikmaten: VerfBlikmaat[];
  dekking_m2_per_liter: number;
  voorstrijk_m2_per_liter: number;
  standaard_aftrek_m2: number;
  min_lagen: number;
  max_lagen: number;
  teksten: {
    resultaat_titel: string;
    voorstrijk_titel: string;
    tip: string;
    disclaimer: string;
  };
};

export type VloerType = {
  id: string;
  label: string;
  m2_per_pak: number;
  snijverlies: number;
};

export type VloerConfig = {
  meta: ToolMeta;
  types: VloerType[];
  ondervloer_m2_per_rol: number;
  teksten: {
    resultaat_titel: string;
    ondervloer_titel: string;
    tip: string;
  };
};

export type BehangConfig = {
  meta: ToolMeta;
  rolbreedte_default: number;
  rollengte_default: number;
  snijmarge: number;
  verlies_met_patroon: number;
  verlies_zonder_patroon: number;
  teksten: {
    resultaat_titel: string;
    aanname_tekst: string;
    tip: string;
  };
};

export type PlintenConfig = {
  meta: ToolMeta;
  aftrek_per_deur_m: number;
  lengte_per_plint_default: number;
  zaagverlies: number;
  teksten: {
    resultaat_titel: string;
    tip: string;
  };
};

export type KitOnderdeel = {
  id: string;
  label: string;
  standaard_meters: number;
};

export type KitNaadbreedte = {
  id: string;
  label: string;
  meters_per_koker: number;
};

export type KitConfig = {
  meta: ToolMeta;
  onderdelen: KitOnderdeel[];
  naadbreedtes: KitNaadbreedte[];
  teksten: {
    resultaat_titel: string;
    tip: string;
  };
};

export type StucwerkAfwerking = {
  id: string;
  label: string;
  kg_per_m2: number;
};

export type StucwerkConfig = {
  meta: ToolMeta;
  afwerkingen: StucwerkAfwerking[];
  factor_slechte_staat: number;
  m2_per_dag_min: number;
  m2_per_dag_max: number;
  kg_per_zak: number;
  teksten: {
    resultaat_titel: string;
    werktijd_titel: string;
    tip: string;
  };
};

export type EgalineConfig = {
  meta: ToolMeta;
  kg_per_m2_per_mm: number;
  kg_per_zak: number;
  min_mm: number;
  max_mm: number;
  default_mm: number;
  teksten: {
    resultaat_titel: string;
    tip: string;
  };
};

export type ContainerKlusType = {
  id: string;
  label: string;
  m3_per_m2: number;
};

export type ContainerMaat = {
  m3: number;
  label: string;
};

export type ContainerConfig = {
  meta: ToolMeta;
  klustypes: ContainerKlusType[];
  uitzetfactor: number;
  maten: ContainerMaat[];
  teksten: {
    resultaat_titel: string;
    tip: string;
  };
};

// ---------------------------------------------------------------------------
// CATEGORIE C: Techniek en installaties
// ---------------------------------------------------------------------------

export type VloerverwarmingIsolatie = {
  id: string;
  label: string;
  watt_per_m2: number;
};

export type VloerverwarmingVloertype = {
  id: string;
  label: string;
  geschiktheid: "ideaal" | "goed" | "beperkt";
  toelichting: string;
};

export type VloerverwarmingConfig = {
  meta: ToolMeta;
  isolaties: VloerverwarmingIsolatie[];
  vloertypes: VloerverwarmingVloertype[];
  slechte_isolatie_id: string;
  teksten: {
    resultaat_titel: string;
    hoofdverwarming_waarschuwing: string;
    tip: string;
  };
};

export type VentilatieConfig = {
  meta: ToolMeta;
  minimum_m3_per_uur: number;
  ventilatievoud_per_uur: number;
  standaard_hoogte: number;
  teksten: {
    resultaat_titel: string;
    advies_tekst: string;
    tip: string;
  };
};

export type GroepenkastApparaat = {
  id: string;
  label: string;
  eigen_groep: boolean;
  driefase_nodig: boolean;
  indicatief_vermogen_kw: number;
};

export type GroepenkastAansluiting = {
  id: string;
  label: string;
  max_kw: number;
  is_driefase: boolean;
};

export type GroepenkastConfig = {
  meta: ToolMeta;
  apparaten: GroepenkastApparaat[];
  aansluitingen: GroepenkastAansluiting[];
  driefase_advies_vermogen_kw: number;
  teksten: {
    resultaat_titel: string;
    disclaimer: string;
  };
};

export type VerwarmingBouwjaar = {
  id: string;
  label: string;
  watt_per_m3: number;
};

export type VerwarmingConfig = {
  meta: ToolMeta;
  bouwjaren: VerwarmingBouwjaar[];
  standaard_hoogte: number;
  drempel_warmtepomp_kw: number;
  drempel_hybride_kw: number;
  teksten: {
    resultaat_titel: string;
    disclaimer: string;
  };
};

export type IsolatieBouwjaar = {
  id: string;
  label: string;
};

export type IsolatieBouwdeel = {
  id: string;
  label: string;
  eis_nieuwbouw_tekst: string;
  waarden_per_bouwjaar: Record<string, number>;
};

export type IsolatieConfig = {
  meta: ToolMeta;
  bouwjaren: IsolatieBouwjaar[];
  bouwdelen: IsolatieBouwdeel[];
  na_geisoleerd_verbetering: number;
  teksten: {
    resultaat_titel: string;
    tip: string;
  };
};

export type AfschotConfig = {
  meta: ToolMeta;
  mm_per_meter_default: number;
  teksten: {
    resultaat_titel: string;
    tip: string;
  };
};

// ---------------------------------------------------------------------------
// CATEGORIE D: Woning en keuzes
// ---------------------------------------------------------------------------

export type VerbouwenVerhuizenOverweging = {
  vraag_id: string;
  antwoord_id: string;
  tekst: string;
};

export type VerbouwenVerhuizenConfig = {
  meta: ToolMeta;
  vragen: ScoreVraag[];
  drempels: ScoreDrempel[];
  uitkomsten: ScoreUitkomst[];
  overwegingen: VerbouwenVerhuizenOverweging[];
  teksten: {
    disclaimer: string;
  };
};

export type RuimtewinstType = {
  id: string;
  label: string;
  hoogte: number;
  waarde_effect_min_pct: number;
  waarde_effect_max_pct: number;
};

export type RuimtewinstNieuweRuimteOptie = {
  min_m2: number;
  label: string;
};

export type RuimtewinstConfig = {
  meta: ToolMeta;
  types: RuimtewinstType[];
  dakkapel_diepte_zone: number;
  zolder_stahoogte_deel_default_pct: number;
  nieuwe_ruimte_opties: RuimtewinstNieuweRuimteOptie[];
  teksten: {
    resultaat_titel: string;
    waarde_disclaimer: string;
  };
};

export type KamermaatType = {
  id: string;
  label: string;
  min_m2: number;
  comfort_m2: number;
  min_breedte?: number;
  elementen: string[];
};

export type KamermatenConfig = {
  meta: ToolMeta;
  types: KamermaatType[];
  teksten: {
    tip: string;
  };
};

export type SloopChecklistItem = {
  id: string;
  tekst: string;
  types: string[];
  voorwaarde?: "voor_1994" | "vve" | "bewoning";
  prioriteit?: "hoog";
};

export type SloopChecklistConfig = {
  meta: ToolMeta;
  projecttypes: KeuzeOptie[];
  items: SloopChecklistItem[];
  asbest_jaar_grens: number;
  teksten: {
    asbest_titel: string;
    asbest_tekst: string;
    print_knop_label: string;
  };
};

// ---------------------------------------------------------------------------
// CATEGORIE E: Handig en zakelijk
// ---------------------------------------------------------------------------

export type BurenbriefVariant = {
  id: string;
  label: string;
  template: string;
};

export type BurenbriefConfig = {
  meta: ToolMeta;
  projecttypes: KeuzeOptie[];
  varianten: BurenbriefVariant[];
  teksten: {
    privacy_tekst: string;
    kopieer_knop: string;
    print_knop: string;
    tip: string;
  };
};

export type VveOnderhoudItem = {
  id: string;
  label: string;
  cyclus_jaren_min: number;
  cyclus_jaren_max: number;
  van_toepassing?: {veld: "dak_type" | "kozijnen"; waarde: string};
};

export type VveOnderhoudConfig = {
  meta: ToolMeta;
  items: VveOnderhoudItem[];
  teksten: {
    mjop_tekst: string;
  };
};

export type TransformatieStap = {
  id: string;
  tekst: string;
};

export type TransformatieConfig = {
  meta: ToolMeta;
  stappen: TransformatieStap[];
  min_woninggrootte_m2: number;
  verhuurbaar_factor: number;
  doorlooptijd_tekst: string;
  teksten: Record<string, never>;
};

export type KlusvolgordeStap = {
  id: string;
  label: string;
  volgorde: number;
  uitleg: string;
  waarschuwing?: string;
};

export type KlusvolgordeConfig = {
  meta: ToolMeta;
  stappen: KlusvolgordeStap[];
  teksten: {
    tip: string;
  };
};

export type VerhuurItem = {
  id: string;
  label: string;
  verplicht: boolean;
  uitleg: string;
};

export type VerhuurConfig = {
  meta: ToolMeta;
  items: VerhuurItem[];
  teksten: {
    disclaimer: string;
  };
};

// ---------------------------------------------------------------------------
// Alles samen
// ---------------------------------------------------------------------------

export type ToolsRegistry = {
  bouwtijd: BouwtijdConfig;
  vergunning: VergunningConfig;
  terugplanner: TerugplannerConfig;
  bewoning: BewoningConfig;
  werktijden: WerktijdenConfig;
  tegels: TegelConfig;
  verf: VerfConfig;
  vloer: VloerConfig;
  behang: BehangConfig;
  plinten: PlintenConfig;
  kit: KitConfig;
  stucwerk: StucwerkConfig;
  egaline: EgalineConfig;
  container: ContainerConfig;
  vloerverwarming: VloerverwarmingConfig;
  ventilatie: VentilatieConfig;
  groepenkast: GroepenkastConfig;
  verwarming: VerwarmingConfig;
  isolatie: IsolatieConfig;
  afschot: AfschotConfig;
  "verbouwen-verhuizen": VerbouwenVerhuizenConfig;
  ruimtewinst: RuimtewinstConfig;
  kamermaten: KamermatenConfig;
  sloopchecklist: SloopChecklistConfig;
  burenbrief: BurenbriefConfig;
  "vve-onderhoud": VveOnderhoudConfig;
  transformatie: TransformatieConfig;
  klusvolgorde: KlusvolgordeConfig;
  verhuurklaar: VerhuurConfig;
};

export type ToolId = keyof ToolsRegistry;

export type ToolsConfig = {
  categorieen: Categorie[];
  tools: ToolsRegistry;
  algemeen: {
    whatsapp_nummer: string;
    contact_pad: string;
    cta_titel: string;
    cta_tekst: string;
    cta_knop_gesprek: string;
    cta_knop_whatsapp: string;
  };
};
