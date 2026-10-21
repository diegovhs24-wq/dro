// Vraagdefinities voor de premium intake, 1-op-1 overgenomen uit het
// goedgekeurde klikbare voorbeeld (dro-intake-full.html). Bewust in code i.p.v.
// Sanity: de voorwaardelijke logica (totaalrenovatie-bevestiging die
// terugstuurt naar de dienstkeuze) is te complex voor het generieke
// intakeForm-schema en verandert zelden genoeg om CMS-redigeerbaar te
// hoeven zijn.

// stop: tekst die verschijnt als iemand deze optie kiest (bijvoorbeeld een te
// laag budget); de bezoeker kan daarna bewust toch verder.
export type QuestionOption = string | {l: string; d?: string; back?: boolean; stop?: string};

export type QuestionType = "single" | "multi" | "confirm" | "text" | "address" | "budget" | "summary" | "contact" | "thanks" | "services" | "dims" | "photos" | "calc" | "fit";

// Maatvelden voor vragen van het type "dims". Getallen met komma of punt;
// velden met opt zijn niet verplicht.
export type DimField = {k: string; l: string; unit: string; ph?: string; opt?: boolean};

export type QuestionDef = {
  id: string;
  // Multi-vragen: tip met lampje zodra er iets anders dan "none" is gekozen.
  hint?: string;
  none?: string;
  t: QuestionType;
  q: string;
  s?: string;
  o?: QuestionOption[];
  ph?: string;
  optional?: boolean;
  f?: DimField[];
};

// Tekst bij de knop om maten over te slaan, en wat er dan in de aanvraag komt.
export const DIMS_UNKNOWN = "Nog niet bekend, inmeten bij bezichtiging";

export const SERVICES: string[] = [
  "Badkamer",
  "Keuken",
  "Totaalrenovatie",
  "Aanbouw of opbouw",
  "Dakkapel",
  "Stucwerk",
  "Schilderwerk",
  "Warmtepomp",
  "Airco of klimaat",
  "Kozijnen",
  "Bouwkundige keuring",
  "Draagmuur verwijderen",
  "Iets anders",
];

export const SERVICE_LABEL: Record<string, string> = {
  "Draagmuur verwijderen": "Draagmuur of doorbraak",
  "Aanbouw of opbouw": "Aanbouw, uitbouw of opbouw",
};

export function serviceLabel(service: string): string {
  return SERVICE_LABEL[service] || service;
}

// Innerlijke SVG-paden (viewBox 0 0 24 24), 1-op-1 uit het voorbeeld.
export const SERVICE_ICON: Record<string, string> = {
  "Draagmuur verwijderen": '<path d="M3 21h18M5 21V5h14v16"/><path d="M9 21v-8h6v8M5 10h4M15 10h4"/>',
  Badkamer: '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 4 0"/><path d="M8 19l-1 2M17 19l1 2"/>',
  Keuken: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M8 3v6"/>',
  Totaalrenovatie: '<path d="M3 21h18M5 21V8l7-5 7 5v13"/><path d="M9 21v-5h6v5M9 11h6"/>',
  "Aanbouw of opbouw": '<path d="M3 21V10l9-7 9 7v11"/><path d="M9 21v-6h6v6"/>',
  Dakkapel: '<path d="M3 20h18M4 20v-6l4-3 4 3v6M12 11l4-2 4 2v9"/>',
  Stucwerk: '<path d="M3 7h14v4H3z"/><path d="M17 9h3v4a2 2 0 0 1-2 2h-6v3"/><rect x="10" y="18" width="4" height="4" rx="1"/>',
  Schilderwerk: '<path d="M5 3h11a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8v3"/><rect x="6" y="14" width="4" height="7" rx="1"/>',
  Warmtepomp: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M6 10h.01M6 14h.01M10 10c1 1 3 1 4 0M10 14c1 1 3 1 4 0"/>',
  "Airco of klimaat": '<rect x="3" y="5" width="18" height="8" rx="2"/><path d="M7 17c0 1-1 2-1 2M12 17c0 1-1 2-1 2M17 17c0 1-1 2-1 2"/>',
  Kozijnen: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M4 12h16"/>',
  "Bouwkundige keuring": '<path d="M9 3h6a1 1 0 0 1 1 1v1h2a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2V4a1 1 0 0 1 1-1z"/><path d="M9 13l2 2 4-4"/>',
  "Iets anders": '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
};

export const QUESTIONS: Record<string, QuestionDef[]> = {
  Badkamer: [
    {id: "bad1", t: "dims", q: "Wat zijn de maten van de badkamer?", s: "Binnenmaten van muur tot muur, in meters. Een rolmaat-schatting is prima.", f: [{k: "l", l: "Lengte", unit: "m", ph: "2,4"}, {k: "b", l: "Breedte", unit: "m", ph: "1,8"}, {k: "h", l: "Plafondhoogte", unit: "m", ph: "2,5", opt: true}]},
    {id: "bad2", t: "single", q: "Inbouwkranen of opbouwkranen?", s: "Inbouwkranen zitten weggewerkt in de wand, opbouwkranen zijn zichtbaar gemonteerd.", o: ["Inbouwkranen", "Opbouwkranen", "Weet ik nog niet"]},
    {id: "bad3", t: "single", q: "Wilt u dat wij alles doen, van sloop tot oplevering?", o: ["Ja, van sloop tot oplevering", "Ik sloop zelf de oude badkamer"]},
    {id: "bad4", t: "single", q: "Wilt u een inloopdouche, een ligbad, of allebei?", o: ["Inloopdouche", "Ligbad", "Allebei"]},
    {id: "bad5", t: "single", q: "Moet het toilet in de badkamer, of blijft dat apart?", o: ["In de badkamer", "Apart", "Weet ik nog niet"]},
    {id: "bad6", t: "single", q: "Wilt u vloerverwarming in de badkamer?", o: ["Ja", "Nee", "Weet ik nog niet"]},
    {id: "bad7", t: "single", q: "Wat voor tegels wilt u?", o: [{l: "Standaardtegels"}, {l: "Mozaïek- of patroontegels", d: "meer legwerk, hogere prijs"}, {l: "Weet ik nog niet"}]},
    {id: "bad8", t: "single", q: "Regelen wij het sanitair en de materialen?", o: ["Ja, graag via DRO", "Ik heb dit al (deels) besteld"]},
  ],
  Keuken: [
    {id: "keu0", t: "dims", q: "Hoe lang wordt de keuken?", s: "Lengte van de keukenwand in meters. Een hoekkeuken of eiland? Vul dan ook het tweede deel in.", f: [{k: "l", l: "Keukenwand", unit: "m", ph: "3,2"}, {k: "l2", l: "Tweede wand of eiland", unit: "m", ph: "1,8", opt: true}]},
    {id: "keu1", t: "single", q: "Heeft u de keuken al uitgezocht of besteld?", o: ["Ja, die is er al", "Nee, graag via DRO leveren"]},
    {id: "keu2", t: "single", q: "Alleen plaatsen, of ook de oude keuken slopen?", o: ["Alleen plaatsen", "Ook slopen en afvoeren"]},
    {id: "keu3", t: "single", q: "Moeten er leidingen worden verplaatst?", s: "Denk aan water, afvoer, gas of elektra.", o: ["Ja", "Nee", "Weet ik nog niet"]},
    {id: "keu4", t: "single", q: "Wilt u een open keuken, waarbij een muur (deels) weg moet?", o: [{l: "Ja", d: "mogelijk een dragende muur"}, {l: "Nee"}, {l: "Weet ik nog niet"}]},
  ],
  Totaalrenovatie: [
    {id: "tot0", t: "confirm", q: "Een totaalrenovatie betekent de hele woning aanpakken", s: "Van vloer tot plafond en alle onderdelen. Weet u zeker dat u dit bedoelt?", o: [{l: "Ja, de hele woning"}, {l: "Nee, alleen bepaalde onderdelen", back: true}]},
    {id: "tot1", t: "dims", q: "Hoeveel woonoppervlakte heeft de woning?", s: "Staat op Funda, in de koopakte of op wozwaardeloket.nl.", f: [{k: "m2", l: "Woonoppervlakte", unit: "m²", ph: "110"}]},
    {id: "tot5", t: "single", q: "Hoeveel woonlagen heeft de woning?", o: ["1 (appartement of gelijkvloers)", "2", "3", "4 of meer"]},
    {id: "tot2", t: "single", q: "Casco (alles eruit tot op de muren) of gedeeltelijk?", o: ["Casco / strippen", "Gedeeltelijk", "Weet ik nog niet"]},
    {id: "tot3", t: "single", q: "Wordt de woning bewoond tijdens de renovatie?", o: ["Bewoond", "Leeg / niet bewoond"]},
    {id: "tot4", t: "single", q: "Wat is het bouwjaar, en is het een monument?", o: ["Voor 1945", "1945 tot 1980", "Na 1980", "Monument of beschermd stadsgezicht", "Weet ik niet"]},
  ],
  "Aanbouw of opbouw": [
    {id: "aan1", t: "single", q: "Wat voor uitbreiding wilt u?", o: ["Uitbouw achter", "Aanbouw aan de zijkant", "Dakopbouw", "Optopping / extra verdieping"]},
    {id: "aan2", t: "dims", q: "Hoe groot wordt de uitbreiding?", s: "Diepte is hoe ver hij uitsteekt vanaf de gevel, breedte langs de gevel. In meters.", f: [{k: "d", l: "Diepte", unit: "m", ph: "3"}, {k: "b", l: "Breedte", unit: "m", ph: "5"}]},
    {id: "aan3", t: "single", q: "Is er al een vergunning aangevraagd?", s: "Wij kunnen het vergunningstraject voor u verzorgen.", o: ["Ja", "Nee", "Weet ik niet"]},
  ],
  Dakkapel: [
    {id: "dak1", t: "single", q: "Om hoeveel dakkapellen gaat het?", o: ["1", "2", "Meer dan 2"]},
    {id: "dak2", t: "single", q: "Een nieuwe dakkapel of een bestaande vervangen?", o: ["Nieuw", "Vervangen", "Weet ik niet"]},
    {id: "dak3", t: "single", q: "Voorkeur voor prefab of maatwerk?", o: [{l: "Prefab", d: "sneller, vaste maten"}, {l: "Op maat"}, {l: "Geen voorkeur"}]},
    {id: "dak4", t: "dims", q: "Hoe breed wordt de dakkapel?", s: "Breedte per dakkapel, in meters.", f: [{k: "b", l: "Breedte", unit: "m", ph: "3,5"}]},
  ],
  Stucwerk: [
    {id: "stu1", t: "single", q: "Wat is de staat van de ondergrond?", o: ["Kaal metselwerk (vanaf steen)", "Bestaand stucwerk overstucen", "Gipsplaat of gipsblokken", "Beschadigd, moet hersteld"]},
    {id: "stu2", t: "single", q: "Gaat het om wanden, plafonds, of allebei?", o: ["Wanden", "Plafonds", "Allebei"]},
    {id: "stu3", t: "dims", q: "Om hoeveel m² stucwerk gaat het?", s: "Wanden: lengte maal hoogte. Plafonds: lengte maal breedte. Een schatting is goed.", f: [{k: "m2", l: "Oppervlakte", unit: "m²", ph: "45"}]},
    {id: "stu4", t: "single", q: "Welke afwerking wilt u?", o: ["Glad (pleister- of spuitwerk)", "Sierpleister of granol", "Weet ik niet"]},
  ],
  Schilderwerk: [
    {id: "sch1", t: "single", q: "Binnen, buiten, of allebei?", o: ["Binnen", "Buiten", "Allebei"]},
    {id: "sch2", t: "multi", q: "Wat moet er geschilderd worden?", o: ["Wanden", "Plafonds", "Kozijnen", "Deuren", "Trap", "Gevel"]},
    {id: "sch3", t: "single", q: "Is er houtrot of achterstallig onderhoud?", s: "Vooral bij buitenschilderwerk belangrijk.", o: ["Ja", "Nee", "Weet ik niet"]},
    {id: "sch4", t: "dims", q: "Om hoeveel m² schilderwerk gaat het ongeveer?", s: "Een schatting is goed. Kozijnen en deuren mag u ook tellen in stuks.", f: [{k: "m2", l: "Oppervlakte", unit: "m²", ph: "60", opt: true}, {k: "n", l: "Kozijnen en deuren", unit: "stuks", ph: "8", opt: true}]},
  ],
  Warmtepomp: [
    {id: "wp1", t: "single", q: "Wat is de afstand tussen binnen- en buitenunit?", s: "Bepalend voor de leidinglengte.", o: ["Tot 5 meter", "5 tot 10 meter", "Meer dan 10 meter", "Weet ik niet"]},
    {id: "wp2", t: "single", q: "Volledige warmtepomp of hybride naast de ketel?", o: ["Volledig", "Hybride", "Weet ik niet"]},
    {id: "wp3", t: "single", q: "Is er vloerverwarming aanwezig of gewenst?", o: ["Aanwezig", "Gewenst", "Nee"]},
    {id: "wp4", t: "dims", q: "Hoeveel woonoppervlakte heeft de woning?", s: "Staat op Funda, in de koopakte of op wozwaardeloket.nl.", f: [{k: "m2", l: "Woonoppervlakte", unit: "m²", ph: "110"}]},
    {id: "wp5", t: "single", q: "Wat is het energielabel van de woning?", s: "Te vinden op ep-online.nl.", o: ["A of beter", "B of C", "D of slechter", "Weet ik niet"]},
  ],
  "Airco of klimaat": [
    {id: "ac1", t: "single", q: "Wat is de afstand tussen binnen- en buitenunit?", o: ["Tot 5 meter", "5 tot 10 meter", "Meer dan 10 meter", "Weet ik niet"]},
    {id: "ac2", t: "single", q: "Hoeveel ruimtes wilt u koelen?", o: ["1 ruimte", "2 ruimtes", "3 of meer"]},
    {id: "ac3", t: "single", q: "Alleen koelen, of ook verwarmen?", o: ["Alleen koelen", "Ook verwarmen", "Weet ik niet"]},
    {id: "ac4", t: "dims", q: "Hoe groot zijn de ruimtes samen?", s: "Bepaalt het vermogen van de airco. Een schatting is goed.", f: [{k: "m2", l: "Oppervlakte", unit: "m²", ph: "35"}]},
  ],
  Kozijnen: [
    {id: "koz1", t: "dims", q: "Om hoeveel kozijnen gaat het?", s: "Tel ramen en deuren apart als het losse kozijnen zijn.", f: [{k: "n", l: "Aantal kozijnen", unit: "stuks", ph: "6"}]},
    {id: "koz2", t: "single", q: "Welk materiaal heeft uw voorkeur?", o: ["Kunststof", "Hout", "Aluminium", "Geen voorkeur"]},
    {id: "koz3", t: "single", q: "Hele kozijnen vervangen of alleen het glas?", o: ["Hele kozijnen", "Alleen glas (bijv. HR++)", "Weet ik niet"]},
  ],
  "Bouwkundige keuring": [
    {id: "keu_a", t: "single", q: "Waarvoor heeft u de keuring nodig?", s: "Het rapport kost €399. Verbouwen wij daarna? Dan is de keuring kosteloos.", o: ["Voor de aankoop van een woning", "Voor een verbouwing", "Algemeen onderhoud / advies"]},
  ],
  "Draagmuur verwijderen": [
    {id: "dm1", t: "single", q: "Wat wilt u laten doen?", o: [{l: "Deuropening maken in een draagmuur"}, {l: "Draagmuur deels weghalen", d: "een doorgang of een bredere opening"}, {l: "Draagmuur helemaal verwijderen", d: "bijvoorbeeld voor een open keuken"}, {l: "Weet ik nog niet"}]},
    {id: "dm2", t: "calc", q: "Bereken uw prijsindicatie", s: "Schuif de maten naar uw situatie. Een schatting is goed, wij meten het daarna precies in."},
    {id: "dm3", t: "fit", q: "Past deze indicatie bij uw budget?", s: "Zo weten we allebei of het zin heeft om een opname in te plannen.", o: [{l: "Ja, dat past"}, {l: "Mijn budget is hoger", d: "er mag meer gebeuren, bijvoorbeeld een keuken of vloer"}, {l: "Nee, mijn budget is lager", stop: "Voor een lager bedrag kunnen wij een draagmuur niet veilig en verantwoord aanpassen. Een draagmuur draagt een deel van uw huis: een constructieberekening, stempelen, de juiste balk en een vergunning zijn geen extra's maar noodzaak. Kan uw budget nog omhoog, of wilt u eerst weten waar het geld precies naartoe gaat? Dan denken we graag mee."}]},
    {id: "dm4", t: "single", q: "Heeft u archief- of bouwtekeningen van de woning?", s: "Geen tekeningen? Wij vragen ze op bij het gemeentearchief of meten zelf in.", o: ["Ja, die heb ik", "Nee", "Kan ik opvragen bij de gemeente", "Weet ik niet"]},
    {id: "dm5", t: "single", q: "Weet u zeker dat de muur dragend is?", s: "Een dragende muur is vaak 17,5 cm of dikker, klinkt massief en loopt door tot het plafond.", o: ["Ja, dat weet ik zeker", "Ik denk het", "Weet ik niet"]},
    {id: "dm6", t: "multi", q: "Zijn er nog andere dingen die u in huis wilt laten doen?", s: "Nu de vakmensen er toch zijn: veel klanten pakken de ruimte rond de doorbraak meteen mee. Dan is het in één keer klaar, met één aanspreekpunt en één keer stof.", o: ["Nieuwe keuken", "Vloer leggen", "Wanden en plafond stucen", "Schilderwerk", "Elektra en verlichting", "Badkamer of toilet", "Kozijnen of deuren", "Aanbouw of uitbouw", "Nee, alleen de doorbraak"], none: "Nee, alleen de doorbraak", hint: "Goed om te weten: als we meerdere werkzaamheden combineren, kunt u korting krijgen. We bouwen dan maar één keer op, voeren één keer af en plannen alles achter elkaar."},
  ],
  "Iets anders": [
    {id: "and1", t: "text", q: "Vertel ons waar u hulp bij zoekt", s: "Omschrijf kort wat u van plan bent.", ph: "Bijvoorbeeld: ik wil advies over de indeling van mijn woning..."},
  ],
};

export const PLANNING_OPTIONS = ["Zo snel mogelijk", "Binnen 3 maanden", "Over 3 tot 6 maanden", "Ik oriënteer me nog"];

export const FOUND_OPTIONS = [
  "Google of zoekmachine",
  "Via IamExpat of een beurs",
  "Social media (Instagram, Facebook)",
  "Via iemand die ik ken",
  "Langs een project gereden of gelopen",
  "Anders",
];

// Gemeenschappelijke afsluiting, na de dienst-specifieke vragen.
export const COMMON: QuestionDef[] = [
  {id: "loc", t: "address", q: "Waar bevindt de woning zich?", s: "Vul postcode en huisnummer in, wij vullen het adres automatisch aan."},
  {id: "photos", t: "photos", q: "Heeft u foto's van de huidige situatie?", s: "Optioneel, maar met foto's kunnen we vaak al aan de telefoon een goede inschatting geven. Maximaal 6 foto's.", optional: true},
  {id: "plan", t: "single", q: "Wat is uw planning?", o: PLANNING_OPTIONS},
  {id: "budget", t: "budget", q: "Welk budget heeft u in gedachten?", s: "Sleep een minimum en maximum. Zo kunnen wij goed meedenken in wat mogelijk is."},
  {id: "found", t: "single", q: "Hoe heeft u ons gevonden?", o: FOUND_OPTIONS},
  {
    id: "more",
    t: "text",
    q: "Vertel ons wat we nog niet weten",
    s: "Dit is het leuke deel. Uw ideeën, uw must-haves, die ene muur die u het liefst zou doorbreken. Hoe meer u deelt, hoe beter we kunnen meedenken.",
    ph: "Bijvoorbeeld: we hebben net een jaren '30 woning gekocht en willen de keuken openbreken...",
    optional: true,
  },
  {id: "summary", t: "summary", q: "Uw projectoverzicht"},
  {id: "contact", t: "contact", q: "Waar kunnen we u bereiken?", s: "We reageren binnen één werkdag."},
  {id: "thanks", t: "thanks", q: ""},
];

export function findServiceForQuestionId(id: string): string | null {
  for (const service of SERVICES) {
    if ((QUESTIONS[service] || []).some((question) => question.id === id)) return service;
  }
  return null;
}

// Maatantwoord als leesbare tekst, bijvoorbeeld "Lengte 2,4 m · Breedte 1,8 m (≈ 4,3 m²)".
export function parseDim(value: string): number | null {
  const n = Number(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function formatDims(def: QuestionDef, values: Record<string, string>): string {
  const fmt = (n: number) => n.toLocaleString("nl-NL", {maximumFractionDigits: 2});
  const parts = (def.f || [])
    .map((field) => {
      const n = parseDim(values[field.k] || "");
      return n === null ? null : `${field.l} ${fmt(n)} ${field.unit}`;
    })
    .filter(Boolean);
  const l = parseDim(values.l || values.d || "");
  const b = parseDim(values.b || "");
  const area = l !== null && b !== null && (def.f || []).some((f) => f.unit === "m") ? ` (≈ ${fmt(Math.round(l * b * 10) / 10)} m²)` : "";
  return parts.join(" · ") + area;
}
