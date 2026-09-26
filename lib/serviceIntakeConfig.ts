// Config-driven vraagdefinities voor de slimme intake. Bewust in code i.p.v.
// Sanity: de voorwaardelijke logica (rietplafond-melding, totaalrenovatie-
// bevestiging, dynamische vervolgvragen) is te complex voor het generieke
// intakeForm-schema en verandert zelden genoeg om CMS-redigeerbaar te hoeven
// zijn.

export type Answers = Record<string, string | string[]>;

export type QuestionField = {
  key: string;
  label: string;
  type: "choice" | "multiChoice" | "text" | "number" | "yesno";
  options?: string[];
  placeholder?: string;
  helpText?: string;
  unit?: string;
  showIf?: (answers: Answers) => boolean;
  note?: (answers: Answers) => string | null;
};

export type QuestionBlock = {
  title: string;
  subtitle?: string;
  fields: QuestionField[];
};

export type ServiceConfirmation = {
  title: string;
  body: string;
  confirmLabel: string;
  declineLabel: string;
};

export type ServiceConfig = {
  key: string;
  label: string;
  confirmation?: ServiceConfirmation;
  blocks: QuestionBlock[];
};

const YES_NO = ["Ja", "Nee"];

export const SERVICES: ServiceConfig[] = [
  {
    key: "badkamer",
    label: "Badkamer",
    blocks: [
      {
        title: "De ruimte",
        fields: [
          {key: "m2", label: "Hoeveel vierkante meter vloeroppervlakte heeft de badkamer ongeveer?", type: "number", unit: "m²"},
          {key: "verdieping", label: "Op welke verdieping ligt de badkamer?", type: "choice", options: ["Begane grond", "Verdieping"], helpText: "Belangrijk voor de afvoer en het leidingwerk."},
          {key: "aantal", label: "Gaat het om één badkamer of meerdere?", type: "choice", options: ["Eén badkamer", "Meerdere badkamers"]},
        ],
      },
      {
        title: "Sloop en installatie",
        fields: [
          {key: "traject", label: "Wilt u dat wij het volledige traject doen, van sloop tot oplevering, of sloopt u de oude badkamer zelf?", type: "choice", options: ["Wij doen alles, van sloop tot oplevering", "Ik sloop de oude badkamer zelf"]},
          {key: "leidingwerk", label: "Wilt u dat wij ook het leidingwerk, de elektra en de ventilatie meenemen?", type: "yesno", options: YES_NO},
          {key: "sanitair", label: "Regelen wij het sanitair en de materialen, of heeft u dit al (deels) besteld of uitgezocht?", type: "choice", options: ["DRO regelt het sanitair en de materialen", "Ik heb het al (deels) besteld of uitgezocht"]},
        ],
      },
      {
        title: "Indeling en afwerking",
        fields: [
          {key: "kranen", label: "Inbouwkranen of opbouwkranen?", type: "choice", options: ["Inbouwkranen", "Opbouwkranen", "Weet ik nog niet"], helpText: "Inbouwkranen zitten weggewerkt in de wand, opbouwkranen zijn zichtbaar gemonteerd op de wand of het bad."},
          {key: "douchebad", label: "Wilt u een inloopdouche, een ligbad, of allebei?", type: "choice", options: ["Inloopdouche", "Ligbad", "Allebei"]},
          {key: "toilet", label: "Moet het toilet in de badkamer, of blijft dat apart?", type: "choice", options: ["Toilet in de badkamer", "Toilet blijft apart"]},
          {key: "vloerverwarming", label: "Wilt u vloerverwarming in de badkamer?", type: "yesno", options: YES_NO},
          {key: "wandtegels", label: "Wandtegels tot aan het plafond of tot halverhoogte?", type: "choice", options: ["Tot aan het plafond", "Tot halverhoogte"]},
          {key: "tegelsoort", label: "Komen er standaardtegels, of mozaïek-, miniatuur- of patroontegels?", type: "choice", options: ["Standaardtegels", "Mozaïek- of miniatuurtegels", "Patroontegels"], helpText: "Mozaïek-, miniatuur- en patroontegels kosten meer legwerk, dat is belangrijk voor de prijs."},
          {key: "tegelsoortM2", label: "Om hoeveel vierkante meter gaat dat ongeveer?", type: "number", unit: "m²", showIf: (a) => a.tegelsoort === "Mozaïek- of miniatuurtegels" || a.tegelsoort === "Patroontegels"},
        ],
      },
    ],
  },
  {
    key: "keuken",
    label: "Keuken",
    blocks: [
      {
        title: "Levering en sloop",
        fields: [
          {key: "levering", label: "Heeft u de keuken al uitgezocht of besteld, of moeten wij die leveren?", type: "choice", options: ["DRO levert de keuken", "Ik heb de keuken al uitgezocht of besteld"]},
          {key: "sloop", label: "Alleen plaatsen, of ook de oude keuken slopen en afvoeren?", type: "choice", options: ["Alleen plaatsen", "Ook slopen en afvoeren"]},
          {key: "vloertegelwerk", label: "Nemen wij ook het vloer- en tegelwerk mee?", type: "yesno", options: YES_NO},
        ],
      },
      {
        title: "Indeling en leidingen",
        fields: [
          {key: "leidingen", label: "Moeten er leidingen worden verplaatst (water, afvoer, gas of elektra)?", type: "yesno", options: YES_NO},
          {key: "openKeuken", label: "Wilt u een open keuken, waarbij eventueel een muur (deels) weg moet?", type: "yesno", options: YES_NO},
          {key: "dragendeMuur", label: "Weet u of dat een dragende muur is?", type: "choice", options: ["Ja, dat is een dragende muur", "Nee, geen dragende muur", "Weet ik niet"], showIf: (a) => a.openKeuken === "Ja"},
          {key: "opstelling", label: "Wat is ongeveer de lengte of opstelling van de keuken?", type: "choice", options: ["Rechte wand", "Hoekopstelling", "Kookeiland", "Anders"]},
        ],
      },
    ],
  },
  {
    key: "totaalrenovatie",
    label: "Totaalrenovatie",
    confirmation: {
      title: "Even checken",
      body: "Een totaalrenovatie betekent dat we de hele woning aanpakken, van vloer tot plafond en alle onderdelen. Weet u zeker dat u dit bedoelt?",
      confirmLabel: "Ja, de hele woning",
      declineLabel: "Nee, alleen bepaalde onderdelen",
    },
    blocks: [
      {
        title: "De woning",
        fields: [
          {key: "m2", label: "Hoeveel woonoppervlakte heeft de woning ongeveer?", type: "number", unit: "m²"},
          {key: "kamers", label: "Hoeveel kamers heeft de woning?", type: "number"},
          {key: "verdiepingen", label: "En hoeveel verdiepingen?", type: "number"},
          {key: "type", label: "Gaat het om een casco- of stripbeurt, waarbij alles eruit gaat tot op de muren, of een gedeeltelijke renovatie?", type: "choice", options: ["Casco- of stripbeurt", "Gedeeltelijke renovatie"]},
        ],
      },
      {
        title: "Onderdelen en planning",
        fields: [
          {
            key: "onderdelen",
            label: "Welke onderdelen moeten sowieso mee?",
            type: "multiChoice",
            options: ["Badkamer", "Keuken", "Toilet", "Vloeren", "Stucwerk", "Schilderwerk", "Elektra", "Loodgieterswerk", "Isolatie of verduurzaming", "Indeling wijzigen of muren verplaatsen"],
          },
          {key: "bewoond", label: "Wordt de woning bewoond tijdens de renovatie, of staat hij leeg?", type: "choice", options: ["Bewoond tijdens de renovatie", "Staat leeg"]},
          {key: "bouwjaar", label: "Wat is het bouwjaar van de woning?", type: "number"},
          {key: "monument", label: "Is het een monument of beschermd stadsgezicht?", type: "choice", options: ["Ja", "Nee", "Weet ik niet"], helpText: "Belangrijk voor de vergunningen."},
        ],
      },
    ],
  },
  {
    key: "aanbouw",
    label: "Aanbouw, uitbouw of opbouw",
    blocks: [
      {
        title: "De uitbreiding",
        fields: [
          {key: "type", label: "Wat voor uitbreiding wilt u?", type: "choice", options: ["Uitbouw achter", "Aanbouw aan de zijkant", "Dakopbouw", "Optopping"]},
          {key: "afmetingen", label: "Wat zijn ongeveer de gewenste afmetingen?", type: "text", placeholder: "Bijvoorbeeld 4 bij 3 meter, of 12 m²"},
          {key: "functie", label: "Wat wordt de functie van de ruimte?", type: "choice", options: ["Extra slaapkamer", "Grotere woonkamer", "Keuken", "Badkamer", "Anders"]},
        ],
      },
      {
        title: "Vergunning en tekeningen",
        fields: [
          {key: "vergunning", label: "Is er al een vergunning aangevraagd, of moeten wij dat regelen?", type: "choice", options: ["Er is al een vergunning aangevraagd", "DRO regelt de vergunning"], helpText: "Wij kunnen het volledige vergunningstraject voor u verzorgen."},
          {key: "tekening", label: "Is er al een constructieberekening of tekening, of moet die nog gemaakt worden?", type: "choice", options: ["Die is er al", "Moet nog gemaakt worden"]},
        ],
      },
    ],
  },
  {
    key: "dakkapel",
    label: "Dakkapel",
    blocks: [
      {
        title: "De dakkapel",
        fields: [
          {key: "aantal", label: "Om hoeveel dakkapellen gaat het?", type: "choice", options: ["1", "2", "3 of meer"]},
          {key: "breedte", label: "Wat is ongeveer de gewenste breedte?", type: "number", unit: "meter"},
          {key: "zijde", label: "Aan de voor- of achterzijde van het dak, of allebei?", type: "choice", options: ["Voorzijde", "Achterzijde", "Allebei"]},
        ],
      },
      {
        title: "Nieuw of vervangen",
        fields: [
          {key: "nieuwOfVervangen", label: "Gaat het om een nieuwe dakkapel of het vervangen van een bestaande?", type: "choice", options: ["Nieuwe dakkapel", "Vervangen van een bestaande"]},
          {key: "uitvoering", label: "Heeft u voorkeur voor prefab of volledig maatwerk?", type: "choice", options: ["Prefab, sneller en vaste maten", "Volledig op maat", "Weet ik nog niet"]},
        ],
      },
    ],
  },
  {
    key: "stucwerk",
    label: "Stucwerk",
    blocks: [
      {
        title: "De ondergrond",
        fields: [
          {
            key: "ondergrond",
            label: "Wat is de staat van de ondergrond?",
            type: "choice",
            options: ["Kaal metselwerk, vanaf de steen", "Bestaand stucwerk dat overgestuukt moet worden", "Gipsplaat of gipsblokken", "Beschadigd of oud stucwerk dat hersteld moet worden"],
          },
          {key: "onderdeel", label: "Gaat het om wanden, plafonds, of allebei?", type: "choice", options: ["Wanden", "Plafonds", "Allebei"]},
          {
            key: "plafondtype",
            label: "Wat voor plafond is het nu?",
            type: "choice",
            options: ["Standaard plafond of gipsplaat", "Rietplafond", "Rietplafond met stuc", "Anders"],
            showIf: (a) => a.onderdeel === "Plafonds" || a.onderdeel === "Allebei",
            note: (a) =>
              a.plafondtype === "Rietplafond" || a.plafondtype === "Rietplafond met stuc"
                ? "Bij rietplafonds adviseren wij meestal een volledig nieuw plafond in plaats van overstucen, omdat het resultaat dan duurzamer en strakker is. We bespreken dit graag met u."
                : null,
          },
        ],
      },
      {
        title: "Oppervlak en afwerking",
        fields: [
          {key: "m2", label: "Om hoeveel vierkante meter gaat het ongeveer?", type: "number", unit: "m²"},
          {key: "afwerking", label: "Welke afwerking wilt u?", type: "choice", options: ["Glad pleister- of spuitwerk", "Sierpleister of granol"]},
          {key: "oplevering", label: "Moet het sausklaar of behangklaar opgeleverd worden?", type: "choice", options: ["Sausklaar", "Behangklaar"]},
        ],
      },
    ],
  },
  {
    key: "schilderwerk",
    label: "Schilderwerk",
    blocks: [
      {
        title: "Binnen of buiten",
        fields: [
          {key: "binnenBuiten", label: "Binnenschilderwerk, buitenschilderwerk, of allebei?", type: "choice", options: ["Binnenschilderwerk", "Buitenschilderwerk", "Allebei"]},
          {key: "onderdelen", label: "Wat moet er geschilderd worden?", type: "multiChoice", options: ["Wanden", "Plafonds", "Kozijnen", "Deuren", "Trap", "Gevel"]},
          {key: "omvang", label: "Om hoeveel ruimtes of ongeveer hoeveel vierkante meter gaat het?", type: "text", placeholder: "Bijvoorbeeld 4 kamers, of 120 m² gevel"},
        ],
      },
      {
        title: "Staat en kleuren",
        fields: [
          {
            key: "houtrot",
            label: "Is er houtrot of achterstallig onderhoud aan de kozijnen?",
            type: "yesno",
            options: YES_NO,
            helpText: "Belangrijk om te weten, want dan is herstel nodig voordat er geschilderd kan worden.",
            showIf: (a) => a.binnenBuiten === "Buitenschilderwerk" || a.binnenBuiten === "Allebei",
          },
          {key: "kleuren", label: "Weet u al welke kleuren u wilt, of denken wij mee?", type: "choice", options: ["Ik weet het al", "DRO denkt graag mee"]},
        ],
      },
    ],
  },
  {
    key: "warmtepomp",
    label: "Warmtepomp",
    blocks: [
      {
        title: "Installatie",
        fields: [
          {key: "afstand", label: "Wat is ongeveer de afstand tussen de binnenunit en de buitenunit?", type: "number", unit: "meter", helpText: "Belangrijk voor de leidinglengte en de installatie."},
          {key: "m2", label: "Hoeveel woonoppervlakte moet verwarmd worden?", type: "number", unit: "m²"},
          {key: "opstelling", label: "Wilt u de bestaande cv-ketel volledig vervangen, of een hybride opstelling naast de ketel?", type: "choice", options: ["Cv-ketel volledig vervangen", "Hybride opstelling naast de ketel"]},
        ],
      },
      {
        title: "Locatie en aansluiting",
        fields: [
          {key: "vloerverwarming", label: "Is er vloerverwarming aanwezig of gewenst?", type: "choice", options: ["Aanwezig", "Gewenst", "Nee"], helpText: "Warmtepompen werken het best op lage temperatuur."},
          {key: "buitenunit", label: "Waar kan de buitenunit komen?", type: "choice", options: ["Tuin", "Plat dak", "Aan de gevel"]},
          {key: "meterkast", label: "Weet u of er ruimte is in de meterkast voor een zwaardere aansluiting?", type: "choice", options: ["Ja", "Nee", "Weet ik niet"]},
        ],
      },
    ],
  },
  {
    key: "airco",
    label: "Airco of klimaat",
    blocks: [
      {
        title: "Installatie",
        fields: [
          {key: "afstand", label: "Wat is ongeveer de afstand tussen de binnenunit en de buitenunit?", type: "number", unit: "meter"},
          {key: "ruimtes", label: "Hoeveel ruimtes wilt u koelen?", type: "number"},
          {key: "opstelling", label: "Één binnenunit (single-split) of meerdere (multi-split)?", type: "choice", options: ["Eén binnenunit (single-split)", "Meerdere binnenunits (multi-split)"]},
        ],
      },
      {
        title: "Locatie en functie",
        fields: [
          {key: "buitenunit", label: "Waar kan de buitenunit komen?", type: "choice", options: ["Tuin", "Plat dak", "Aan de gevel"]},
          {key: "koelenVerwarmen", label: "Alleen koelen, of ook verwarmen?", type: "choice", options: ["Alleen koelen", "Ook verwarmen"], helpText: "Een airco kan in de winter ook bijverwarmen."},
        ],
      },
    ],
  },
  {
    key: "verduurzaming",
    label: "Verduurzaming en isolatie",
    blocks: [
      {
        title: "Wat wilt u verduurzamen?",
        fields: [
          {
            key: "onderdelen",
            label: "Wat wilt u verduurzamen?",
            type: "multiChoice",
            options: ["Dakisolatie", "Vloerisolatie", "Spouwmuurisolatie", "Gevelisolatie", "HR++ glas", "Zonnepanelen"],
          },
        ],
      },
      {
        title: "Details isolatie",
        subtitle: "Nog een paar korte vragen over de isolatie.",
        fields: [
          {key: "isolatieM2", label: "Om hoeveel vierkante meter gaat het ongeveer?", type: "number", unit: "m²", showIf: (a) => Array.isArray(a.onderdelen) && a.onderdelen.some((o) => o.toLowerCase().includes("isolatie") || o === "HR++ glas")},
          {key: "bouwjaar", label: "Wat is het bouwjaar van de woning?", type: "number", showIf: (a) => Array.isArray(a.onderdelen) && a.onderdelen.some((o) => o.toLowerCase().includes("isolatie") || o === "HR++ glas")},
        ],
      },
      {
        title: "Details zonnepanelen",
        subtitle: "Nog een paar korte vragen over de zonnepanelen.",
        fields: [
          {key: "zonnepanelenOmvang", label: "Hoeveel panelen of hoeveel dakoppervlak heeft u ongeveer in gedachten?", type: "text", placeholder: "Bijvoorbeeld 12 panelen, of 30 m² dak", showIf: (a) => Array.isArray(a.onderdelen) && a.onderdelen.includes("Zonnepanelen")},
          {key: "orientatie", label: "Wat is de oriëntatie van het dak?", type: "choice", options: ["Zuid", "Oost", "West", "Meerdere richtingen"], showIf: (a) => Array.isArray(a.onderdelen) && a.onderdelen.includes("Zonnepanelen")},
        ],
      },
      {
        title: "Subsidies",
        fields: [
          {key: "subsidie", label: "Bent u op de hoogte van subsidies zoals de ISDE, of wilt u dat wij daarin meedenken?", type: "choice", options: ["Ik ben op de hoogte", "DRO denkt graag mee"]},
        ],
      },
    ],
  },
  {
    key: "vloeren",
    label: "Vloeren en vloerverwarming",
    blocks: [
      {
        title: "De vloer",
        fields: [
          {key: "m2", label: "Om hoeveel vierkante meter gaat het?", type: "number", unit: "m²"},
          {key: "type", label: "Wat voor vloer wilt u?", type: "choice", options: ["Gietvloer", "Tegels", "PVC", "Hout of parket"]},
          {key: "vloerverwarming", label: "Wilt u vloerverwarming?", type: "choice", options: ["Nee", "Ja, ingefreesd in de bestaande vloer", "Ja, met een nieuwe vloeropbouw"]},
        ],
      },
    ],
  },
  {
    key: "kozijnen",
    label: "Kozijnen",
    blocks: [
      {
        title: "De kozijnen",
        fields: [
          {key: "aantal", label: "Om hoeveel kozijnen gaat het ongeveer?", type: "number"},
          {key: "materiaal", label: "Welk materiaal heeft uw voorkeur?", type: "choice", options: ["Kunststof", "Hout", "Aluminium", "Weet ik nog niet"]},
          {key: "vervangen", label: "Moeten de hele kozijnen vervangen worden, of alleen het glas?", type: "choice", options: ["De hele kozijnen vervangen", "Alleen het glas, bijvoorbeeld naar HR++"]},
          {key: "zijde", label: "Aan de voorzijde, achterzijde of het hele huis?", type: "choice", options: ["Voorzijde", "Achterzijde", "Het hele huis"]},
        ],
      },
    ],
  },
  {
    key: "anders",
    label: "Iets anders",
    blocks: [
      {
        title: "Waar kunnen wij u mee helpen?",
        fields: [
          {key: "omschrijving", label: "Waar zoekt u hulp bij?", type: "text", placeholder: "Omschrijf hier vrij waar u hulp bij zoekt"},
        ],
      },
    ],
  },
];

export const BUDGET_OPTIONS = ["Tot EUR 15.000", "EUR 15.000 tot 30.000", "EUR 30.000 tot 75.000", "EUR 75.000+", "Weet ik nog niet"];

export const TIMELINE_OPTIONS = ["Zo snel mogelijk", "Binnen 3 maanden", "Over 3 tot 6 maanden", "Oriënterend"];

export function getServiceConfig(key: string): ServiceConfig | undefined {
  return SERVICES.find((service) => service.key === key);
}
