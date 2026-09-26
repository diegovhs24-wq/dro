// Vraagdefinities voor de premium intake, 1-op-1 overgenomen uit het
// goedgekeurde klikbare voorbeeld (dro-intake-full.html). Bewust in code i.p.v.
// Sanity: de voorwaardelijke logica (totaalrenovatie-bevestiging die
// terugstuurt naar de dienstkeuze) is te complex voor het generieke
// intakeForm-schema en verandert zelden genoeg om CMS-redigeerbaar te
// hoeven zijn.

export type QuestionOption = string | {l: string; d?: string; back?: boolean};

export type QuestionType = "single" | "multi" | "confirm" | "text" | "address" | "budget" | "summary" | "contact" | "thanks" | "services";

export type QuestionDef = {
  id: string;
  t: QuestionType;
  q: string;
  s?: string;
  o?: QuestionOption[];
  ph?: string;
  optional?: boolean;
};

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
  "Iets anders",
];

export const SERVICE_LABEL: Record<string, string> = {
  "Aanbouw of opbouw": "Aanbouw, uitbouw of opbouw",
};

export function serviceLabel(service: string): string {
  return SERVICE_LABEL[service] || service;
}

// Innerlijke SVG-paden (viewBox 0 0 24 24), 1-op-1 uit het voorbeeld.
export const SERVICE_ICON: Record<string, string> = {
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
    {id: "bad1", t: "single", q: "Hoeveel m² is de badkamer ongeveer?", o: ["Tot 4 m²", "4 tot 6 m²", "6 tot 9 m²", "Meer dan 9 m²", "Weet ik nog niet"]},
    {id: "bad2", t: "single", q: "Inbouwkranen of opbouwkranen?", s: "Inbouwkranen zitten weggewerkt in de wand, opbouwkranen zijn zichtbaar gemonteerd.", o: ["Inbouwkranen", "Opbouwkranen", "Weet ik nog niet"]},
    {id: "bad3", t: "single", q: "Wilt u dat wij alles doen, van sloop tot oplevering?", o: ["Ja, van sloop tot oplevering", "Ik sloop zelf de oude badkamer"]},
    {id: "bad4", t: "single", q: "Wilt u een inloopdouche, een ligbad, of allebei?", o: ["Inloopdouche", "Ligbad", "Allebei"]},
    {id: "bad5", t: "single", q: "Moet het toilet in de badkamer, of blijft dat apart?", o: ["In de badkamer", "Apart", "Weet ik nog niet"]},
    {id: "bad6", t: "single", q: "Wilt u vloerverwarming in de badkamer?", o: ["Ja", "Nee", "Weet ik nog niet"]},
    {id: "bad7", t: "single", q: "Wat voor tegels wilt u?", o: [{l: "Standaardtegels"}, {l: "Mozaïek- of patroontegels", d: "meer legwerk, hogere prijs"}, {l: "Weet ik nog niet"}]},
    {id: "bad8", t: "single", q: "Regelen wij het sanitair en de materialen?", o: ["Ja, graag via DRO", "Ik heb dit al (deels) besteld"]},
  ],
  Keuken: [
    {id: "keu1", t: "single", q: "Heeft u de keuken al uitgezocht of besteld?", o: ["Ja, die is er al", "Nee, graag via DRO leveren"]},
    {id: "keu2", t: "single", q: "Alleen plaatsen, of ook de oude keuken slopen?", o: ["Alleen plaatsen", "Ook slopen en afvoeren"]},
    {id: "keu3", t: "single", q: "Moeten er leidingen worden verplaatst?", s: "Denk aan water, afvoer, gas of elektra.", o: ["Ja", "Nee", "Weet ik nog niet"]},
    {id: "keu4", t: "single", q: "Wilt u een open keuken, waarbij een muur (deels) weg moet?", o: [{l: "Ja", d: "mogelijk een dragende muur"}, {l: "Nee"}, {l: "Weet ik nog niet"}]},
  ],
  Totaalrenovatie: [
    {id: "tot0", t: "confirm", q: "Een totaalrenovatie betekent de hele woning aanpakken", s: "Van vloer tot plafond en alle onderdelen. Weet u zeker dat u dit bedoelt?", o: [{l: "Ja, de hele woning"}, {l: "Nee, alleen bepaalde onderdelen", back: true}]},
    {id: "tot1", t: "single", q: "Hoeveel woonoppervlakte heeft de woning ongeveer?", o: ["Tot 80 m²", "80 tot 120 m²", "120 tot 180 m²", "Meer dan 180 m²", "Weet ik nog niet"]},
    {id: "tot2", t: "single", q: "Casco (alles eruit tot op de muren) of gedeeltelijk?", o: ["Casco / strippen", "Gedeeltelijk", "Weet ik nog niet"]},
    {id: "tot3", t: "single", q: "Wordt de woning bewoond tijdens de renovatie?", o: ["Bewoond", "Leeg / niet bewoond"]},
    {id: "tot4", t: "single", q: "Wat is het bouwjaar, en is het een monument?", o: ["Voor 1945", "1945 tot 1980", "Na 1980", "Monument of beschermd stadsgezicht", "Weet ik niet"]},
  ],
  "Aanbouw of opbouw": [
    {id: "aan1", t: "single", q: "Wat voor uitbreiding wilt u?", o: ["Uitbouw achter", "Aanbouw aan de zijkant", "Dakopbouw", "Optopping / extra verdieping"]},
    {id: "aan2", t: "single", q: "Weet u ongeveer de gewenste afmeting?", o: ["Tot 10 m²", "10 tot 20 m²", "Meer dan 20 m²", "Weet ik nog niet"]},
    {id: "aan3", t: "single", q: "Is er al een vergunning aangevraagd?", s: "Wij kunnen het vergunningstraject voor u verzorgen.", o: ["Ja", "Nee", "Weet ik niet"]},
  ],
  Dakkapel: [
    {id: "dak1", t: "single", q: "Om hoeveel dakkapellen gaat het?", o: ["1", "2", "Meer dan 2"]},
    {id: "dak2", t: "single", q: "Een nieuwe dakkapel of een bestaande vervangen?", o: ["Nieuw", "Vervangen", "Weet ik niet"]},
    {id: "dak3", t: "single", q: "Voorkeur voor prefab of maatwerk?", o: [{l: "Prefab", d: "sneller, vaste maten"}, {l: "Op maat"}, {l: "Geen voorkeur"}]},
  ],
  Stucwerk: [
    {id: "stu1", t: "single", q: "Wat is de staat van de ondergrond?", o: ["Kaal metselwerk (vanaf steen)", "Bestaand stucwerk overstucen", "Gipsplaat of gipsblokken", "Beschadigd, moet hersteld"]},
    {id: "stu2", t: "single", q: "Gaat het om wanden, plafonds, of allebei?", o: ["Wanden", "Plafonds", "Allebei"]},
    {id: "stu3", t: "single", q: "Om hoeveel m² gaat het ongeveer?", o: ["Tot 25 m²", "25 tot 60 m²", "Meer dan 60 m²", "Weet ik niet"]},
    {id: "stu4", t: "single", q: "Welke afwerking wilt u?", o: ["Glad (pleister- of spuitwerk)", "Sierpleister of granol", "Weet ik niet"]},
  ],
  Schilderwerk: [
    {id: "sch1", t: "single", q: "Binnen, buiten, of allebei?", o: ["Binnen", "Buiten", "Allebei"]},
    {id: "sch2", t: "multi", q: "Wat moet er geschilderd worden?", o: ["Wanden", "Plafonds", "Kozijnen", "Deuren", "Trap", "Gevel"]},
    {id: "sch3", t: "single", q: "Is er houtrot of achterstallig onderhoud?", s: "Vooral bij buitenschilderwerk belangrijk.", o: ["Ja", "Nee", "Weet ik niet"]},
  ],
  Warmtepomp: [
    {id: "wp1", t: "single", q: "Wat is de afstand tussen binnen- en buitenunit?", s: "Bepalend voor de leidinglengte.", o: ["Tot 5 meter", "5 tot 10 meter", "Meer dan 10 meter", "Weet ik niet"]},
    {id: "wp2", t: "single", q: "Volledige warmtepomp of hybride naast de ketel?", o: ["Volledig", "Hybride", "Weet ik niet"]},
    {id: "wp3", t: "single", q: "Is er vloerverwarming aanwezig of gewenst?", o: ["Aanwezig", "Gewenst", "Nee"]},
  ],
  "Airco of klimaat": [
    {id: "ac1", t: "single", q: "Wat is de afstand tussen binnen- en buitenunit?", o: ["Tot 5 meter", "5 tot 10 meter", "Meer dan 10 meter", "Weet ik niet"]},
    {id: "ac2", t: "single", q: "Hoeveel ruimtes wilt u koelen?", o: ["1 ruimte", "2 ruimtes", "3 of meer"]},
    {id: "ac3", t: "single", q: "Alleen koelen, of ook verwarmen?", o: ["Alleen koelen", "Ook verwarmen", "Weet ik niet"]},
  ],
  Kozijnen: [
    {id: "koz1", t: "single", q: "Om hoeveel kozijnen gaat het ongeveer?", o: ["1 tot 3", "4 tot 8", "Meer dan 8", "Weet ik niet"]},
    {id: "koz2", t: "single", q: "Welk materiaal heeft uw voorkeur?", o: ["Kunststof", "Hout", "Aluminium", "Geen voorkeur"]},
    {id: "koz3", t: "single", q: "Hele kozijnen vervangen of alleen het glas?", o: ["Hele kozijnen", "Alleen glas (bijv. HR++)", "Weet ik niet"]},
  ],
  "Bouwkundige keuring": [
    {id: "keu_a", t: "single", q: "Waarvoor heeft u de keuring nodig?", s: "Het rapport kost €399. Verbouwen wij daarna? Dan is de keuring kosteloos.", o: ["Voor de aankoop van een woning", "Voor een verbouwing", "Algemeen onderhoud / advies"]},
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
