import type {ToolsConfig} from "./toolsTypes";

/**
 * ===========================================================================
 * HANDLEIDING VOOR THERAB
 * ===========================================================================
 *
 * Dit bestand bevat ALLE getallen, formules en teksten van de Handige Tools
 * bibliotheek (29 tools). Je kunt dit aanpassen zonder verstand van
 * programmeren te hebben. De rekenlogica (toolsEngine.ts) en de weergave
 * (de bestanden in components/tools/*.tsx) hoef je nooit aan te raken.
 *
 * SPELREGELS
 * - Laat aanhalingstekens (" ") en komma's precies zoals ze er staan.
 * - Getallen schrijf je met een punt, niet met een komma: 0.20 in plaats van 0,20.
 * - Verwijder geen regels die beginnen met "id:", die koppelen dingen aan elkaar.
 *
 * VOORBEELD 1: een bestaande waarde aanpassen
 * Wil je dat een badkamer standaard 12 werkdagen duurt in plaats van 10?
 * Zoek bij "bouwtijd" > "projecttypes" het blok met id: "badkamer" en
 * verander "basis_dagen: 10," in "basis_dagen: 12,".
 *
 * VOORBEELD 2: een uitkomsttekst aanpassen
 * Zoek de tekst tussen aanhalingstekens (gebruik Ctrl+F / Cmd+F) en typ de
 * nieuwe tekst ertussen. Tekst tussen { en } (bijvoorbeeld {weken_min}) niet
 * weghalen, die wordt automatisch met een echt getal ingevuld.
 *
 * VOORBEELD 3: een optie toevoegen (bijvoorbeeld een tegelformaat)
 * Kopieer een heel blok tussen { en }, plak het erbij, en pas de waardes aan.
 * Nieuwe opties verschijnen automatisch in het formulier.
 *
 * VOORBEELD 4: een tool tijdelijk uitzetten
 * Zoek bij die tool het veld "actief: true," in het "meta" blokje en
 * verander het in "actief: false,". De tool verdwijnt dan uit de bibliotheek
 * (zoeken, filters en directe links werken dan ook niet meer voor die tool).
 *
 * VOORBEELD 5: de volgorde van tools wijzigen
 * Elke tool heeft in zijn "meta" blokje een regel "volgorde: <getal>,". Een
 * lager getal verschijnt eerder in de bibliotheek. Verander het getal om een
 * tool naar voren of naar achteren te verplaatsen.
 *
 * Twijfel je? Verander niets en vraag het na. Een typefout in een getal
 * (komma in plaats van punt, of een aanhalingsteken vergeten) kan de hele
 * pagina laten crashen.
 * ===========================================================================
 */

export const DRO_TOOLS_CONFIG: ToolsConfig = {
  categorieen: [
    {id: "tijd", naam: "Tijd en planning"},
    {id: "materialen", naam: "Materialen berekenen"},
    {id: "techniek", naam: "Techniek en installaties"},
    {id: "woning", naam: "Woning en keuzes"},
    {id: "zakelijk", naam: "Handig en zakelijk"},
  ],

  tools: {
    // =========================================================================
    // A1: BOUWTIJD CALCULATOR
    // =========================================================================
    bouwtijd: {
      meta: {
        naam: "Bouwtijd calculator",
        categorie: "tijd",
        omschrijving_kort: "Bereken hoeveel weken jouw verbouwing ongeveer duurt.",
        uitleg:
          "Bereken je bouwtijd: hoe lang duurt een badkamerrenovatie, een keuken, een uitbouw of een totaalrenovatie ongeveer. Kies je projecttype en eventuele extra werkzaamheden, de tool rekent live mee.",
        trefwoorden: ["bouwtijd berekenen", "hoe lang duurt een badkamerrenovatie", "uitvoeringstijd", "planning"],
        volgorde: 1,
        actief: true,
        gerelateerd: ["vergunning", "terugplanner", "klusvolgorde"],
        whatsapp_tekst: "Hoi, ik heb de bouwtijd calculator ingevuld voor een {projecttype} en wil graag even sparren.",
      },
      projecttypes: [
        {
          id: "badkamer",
          label: "Badkamer",
          formule_type: "drempel",
          vraag_m2: true,
          m2_label: "Oppervlak badkamer (m²)",
          min_m2: 2,
          max_m2: 20,
          default_m2: 6,
          basis_dagen: 10,
          drempel_m2: 6,
          dagen_per_extra_m2: 1,
          opties: ["vloerverwarming", "leidingwerk", "maatwerk"],
        },
        {
          id: "toilet",
          label: "Toilet",
          formule_type: "vast",
          vraag_m2: false,
          basis_dagen: 5,
          opties: ["leidingwerk"],
        },
        {
          id: "keuken",
          label: "Keuken",
          formule_type: "drempel",
          vraag_m2: true,
          m2_label: "Oppervlak keuken (m²)",
          min_m2: 4,
          max_m2: 30,
          default_m2: 10,
          basis_dagen: 8,
          // LET OP AANNAME: geen drempel/opbouw per extra m2 gegeven in de briefing.
          // Deze waardes zijn voorlopig, vergelijkbaar met een badkamer maar minder steil.
          drempel_m2: 6,
          dagen_per_extra_m2: 0.5,
          opties: ["leidingwerk", "constructief"],
        },
        {
          id: "uitbouw",
          label: "Uitbouw",
          formule_type: "drempel",
          vraag_m2: true,
          m2_label: "Oppervlak uitbouw (m²)",
          min_m2: 6,
          max_m2: 60,
          default_m2: 20,
          basis_dagen: 30,
          drempel_m2: 20,
          // "+1 dag per 2 extra m2" = 0.5 dag per m2.
          dagen_per_extra_m2: 0.5,
          opties: [],
          vaste_opmerking: "Constructief werk (het doorbreken van de gevel) zit standaard in de basisdagen van een uitbouw.",
        },
        {
          id: "dakopbouw",
          label: "Dakopbouw",
          formule_type: "drempel",
          vraag_m2: true,
          m2_label: "Oppervlak dakopbouw (m²)",
          min_m2: 15,
          max_m2: 80,
          default_m2: 30,
          basis_dagen: 25,
          drempel_m2: 30,
          // "+1 dag per 3 extra m2" = 0.333 dag per m2.
          dagen_per_extra_m2: 0.333,
          opties: [],
        },
        {
          id: "dakkapel",
          label: "Dakkapel",
          formule_type: "breedte_drempel",
          vraag_m2: false,
          vraag_breedte: true,
          breedte_label: "Breedte dakkapel (m)",
          min_breedte: 1,
          max_breedte: 6,
          default_breedte: 3,
          basis_dagen: 3,
          drempel_breedte: 3,
          dagen_per_extra_breedte: 1,
          opties: [],
        },
        {
          id: "totaalrenovatie",
          label: "Totaalrenovatie",
          formule_type: "lineair_met_minimum",
          vraag_m2: true,
          m2_label: "Woonoppervlak (m²)",
          min_m2: 40,
          max_m2: 300,
          default_m2: 100,
          dagen_per_m2: 1.2,
          minimum_dagen: 40,
          vraag_verdiepingen: true,
          min_verdiepingen: 1,
          max_verdiepingen: 4,
          default_verdiepingen: 2,
          dagen_per_extra_verdieping: 5,
          opties: ["constructief_zwaar", "vloerverwarming_woning"],
        },
      ],
      extra_opties: [
        {id: "vloerverwarming", label: "Vloerverwarming", extra_dagen: 1},
        {id: "leidingwerk", label: "Leidingwerk verplaatsen", extra_dagen: 2},
        {id: "maatwerk", label: "Maatwerk (nissen, speciaal tegelwerk)", extra_dagen: 2},
        {id: "constructief", label: "Constructief werk (muur eruit)", extra_dagen: 2},
        {id: "constructief_zwaar", label: "Constructief werk (dragende muren)", extra_dagen: 5},
        {id: "vloerverwarming_woning", label: "Vloerverwarming hele woning", extra_dagen: 5},
      ],
      marge_boven: 0.2,
      werkdagen_per_week: 5,
      teksten: {
        resultaat_titel: "Geschatte uitvoeringstijd: {weken_min} tot {weken_max} weken",
        opbouw_titel: "Zo is dit opgebouwd",
        voorbereiding_titel: "Reken ook op voorbereidingstijd",
        voorbereiding_tekst:
          "Reken daarnaast op 4 tot 8 weken voorbereiding voor planning, materiaalkeuze en bestellingen. Is een vergunning nodig, dan komt daar 8 tot 14 weken gemeentelijke doorlooptijd bij.",
        disclaimer:
          "Deze inschatting is gebaseerd op gemiddelde projecten van DRO Renovaties. De werkelijke duur hangt af van de staat van de woning en de gekozen materialen.",
      },
    },

    // =========================================================================
    // A2: VERGUNNINGCHECK
    // =========================================================================
    vergunning: {
      meta: {
        naam: "Vergunningcheck",
        categorie: "tijd",
        omschrijving_kort: "Check in een paar vragen of jouw verbouwing vergunningvrij is.",
        uitleg:
          "Vergunning check voor een uitbouw, dakopbouw, dakkapel, interne verbouwing of nieuwe kozijnen. Beantwoord een paar korte vragen en zie direct of je waarschijnlijk vergunningvrij kunt bouwen.",
        trefwoorden: ["vergunning check uitbouw", "vergunningvrij bouwen", "omgevingsvergunning", "dakkapel vergunning"],
        volgorde: 2,
        actief: true,
        gerelateerd: ["bouwtijd", "terugplanner", "sloopchecklist"],
        whatsapp_tekst: "Hoi, ik heb de vergunningcheck ingevuld voor een {projecttype} en wil graag even sparren.",
      },
      vragen: [
        {
          id: "type",
          vraag: "Wat ga je doen?",
          antwoorden: [
            {id: "uitbouw", label: "Uitbouw"},
            {id: "dakopbouw", label: "Dakopbouw"},
            {id: "dakkapel", label: "Dakkapel"},
            {id: "interne_verbouwing", label: "Interne verbouwing"},
            {id: "kozijnen", label: "Kozijnen vervangen"},
          ],
          zichtbaar_als: [],
        },
        {
          id: "monument",
          vraag: "Is de woning een monument of staat hij in een beschermd stads- of dorpsgezicht?",
          antwoorden: [
            {id: "ja", label: "Ja"},
            {id: "nee", label: "Nee"},
            {id: "weet_niet", label: "Weet ik niet"},
          ],
          zichtbaar_als: [],
        },
        {
          id: "uitbouw_diepte",
          vraag: "Hoe diep wordt de uitbouw, gemeten vanaf de oorspronkelijke achtergevel?",
          antwoorden: [
            {id: "tot_4m", label: "Tot en met 4 meter"},
            {id: "meer_dan_4m", label: "Meer dan 4 meter"},
          ],
          zichtbaar_als: [
            {vraag_id: "type", antwoord_ids: ["uitbouw"]},
            {vraag_id: "monument", antwoord_ids: ["nee"]},
          ],
        },
        {
          id: "uitbouw_positie",
          vraag: "Komt de uitbouw aan de achterkant of aan de zij- of voorkant?",
          antwoorden: [
            {id: "achterkant", label: "Achterkant"},
            {id: "zij_voorkant", label: "Zij- of voorkant"},
          ],
          zichtbaar_als: [
            {vraag_id: "type", antwoord_ids: ["uitbouw"]},
            {vraag_id: "monument", antwoord_ids: ["nee"]},
          ],
        },
        {
          id: "dakkapel_positie",
          vraag: "Komt de dakkapel aan de voorkant of achterkant van het dak?",
          antwoorden: [
            {id: "voorkant", label: "Voorkant"},
            {id: "achterkant", label: "Achterkant"},
          ],
          zichtbaar_als: [
            {vraag_id: "type", antwoord_ids: ["dakkapel"]},
            {vraag_id: "monument", antwoord_ids: ["nee"]},
          ],
        },
        {
          id: "constructie",
          vraag: "Worden er dragende muren of constructie gewijzigd?",
          antwoorden: [
            {id: "ja", label: "Ja"},
            {id: "nee", label: "Nee"},
          ],
          zichtbaar_als: [
            {vraag_id: "type", antwoord_ids: ["interne_verbouwing"]},
            {vraag_id: "monument", antwoord_ids: ["nee"]},
          ],
        },
        {
          id: "kozijn_maat",
          vraag: "Blijft de maat en indeling van de gevelopening gelijk?",
          antwoorden: [
            {id: "ja", label: "Ja"},
            {id: "nee", label: "Nee"},
          ],
          zichtbaar_als: [
            {vraag_id: "type", antwoord_ids: ["kozijnen"]},
            {vraag_id: "monument", antwoord_ids: ["nee"]},
          ],
        },
        {
          id: "vve",
          vraag: "Is de woning onderdeel van een VvE?",
          antwoorden: [
            {id: "ja", label: "Ja"},
            {id: "nee", label: "Nee"},
          ],
          zichtbaar_als: [],
        },
      ],
      uitkomsten: [
        {
          id: "monument",
          kleur: "rood",
          titel: "Vergunning nodig",
          tekst:
            "Bij een monument of een pand in een beschermd stads- of dorpsgezicht is vrijwel altijd een vergunning nodig, ook voor werk dat normaal vergunningvrij zou zijn. Vraag daarnaast tijdig monumentenadvies aan, dit kost extra tijd.",
          doorlooptijd: "Reken op 14 weken of meer gemeentelijke doorlooptijd.",
        },
        {
          id: "uitbouw_vrij",
          kleur: "groen",
          titel: "Waarschijnlijk vergunningvrij",
          tekst:
            "Een uitbouw aan de achterkant tot en met 4 meter diepte valt vaak onder vergunningvrij bouwen. Er gelden wel aanvullende voorwaarden, bijvoorbeeld over de hoogte en de afstand tot de erfgrens.",
          doorlooptijd: "Geen vergunning nodig, dus geen gemeentelijke doorlooptijd voor dit onderdeel.",
        },
        {
          id: "uitbouw_vergunning",
          kleur: "rood",
          titel: "Vergunning nodig",
          tekst:
            "Een uitbouw dieper dan 4 meter, of aan de zij- of voorkant, valt buiten de standaardregels voor vergunningvrij bouwen. Hiervoor is een omgevingsvergunning nodig.",
          doorlooptijd: "Reken op 8 weken reguliere gemeentelijke doorlooptijd.",
        },
        {
          id: "dakopbouw",
          kleur: "rood",
          titel: "Vergunning nodig",
          tekst: "Een dakopbouw wijzigt de hoofdvorm van het dak en is daarom vrijwel altijd vergunningplichtig.",
          doorlooptijd: "Reken op 8 weken reguliere gemeentelijke doorlooptijd.",
        },
        {
          id: "dakkapel_achter",
          kleur: "oranje",
          titel: "Hangt af van de details",
          tekst:
            "Een dakkapel aan de achterkant is vaak vergunningvrij, mits hij binnen de standaardmaten blijft (afstand tot de dakrand, hoogte en breedte). Buiten die maten is alsnog een vergunning nodig.",
          doorlooptijd: "Bij vergunningvrij: geen doorlooptijd. Is een vergunning toch nodig, reken dan op 8 weken.",
        },
        {
          id: "dakkapel_voor",
          kleur: "rood",
          titel: "Vergunning nodig",
          tekst: "Een dakkapel aan de voorkant van de woning is vergunningplichtig.",
          doorlooptijd: "Reken op 8 weken reguliere gemeentelijke doorlooptijd.",
        },
        {
          id: "intern_vrij",
          kleur: "groen",
          titel: "Meestal vergunningvrij",
          tekst:
            "Interne verbouwingen zonder wijziging van dragende constructie zijn meestal vergunningvrij. Check bij twijfel altijd het Omgevingsloket, vooral bij oudere woningen.",
          doorlooptijd: "Geen vergunning nodig, dus geen gemeentelijke doorlooptijd voor dit onderdeel.",
        },
        {
          id: "intern_constructief",
          kleur: "oranje",
          titel: "Hangt af van de details",
          tekst:
            "Bij het wijzigen van dragende muren of constructie is een constructieberekening nodig. Afhankelijk van de uitkomst daarvan kan er ook een vergunningplicht ontstaan.",
          doorlooptijd: "Bij vergunningplicht: reken op 8 weken reguliere gemeentelijke doorlooptijd.",
        },
        {
          id: "kozijn_vrij",
          kleur: "groen",
          titel: "Meestal vergunningvrij",
          tekst: "Kozijnen vervangen binnen dezelfde maat en indeling van de gevelopening is meestal vergunningvrij.",
          doorlooptijd: "Geen vergunning nodig, dus geen gemeentelijke doorlooptijd voor dit onderdeel.",
        },
        {
          id: "kozijn_vergunning",
          kleur: "rood",
          titel: "Vergunning nodig",
          tekst:
            "Als de maat of indeling van de gevelopening verandert, is dat een wijziging van het uiterlijk van de woning en is een vergunning nodig.",
          doorlooptijd: "Reken op 8 weken reguliere gemeentelijke doorlooptijd.",
        },
      ],
      regels: [
        {voorwaarden: [{vraag_id: "monument", antwoord_ids: ["ja", "weet_niet"]}], uitkomst_id: "monument"},
        {
          voorwaarden: [
            {vraag_id: "type", antwoord_ids: ["uitbouw"]},
            {vraag_id: "uitbouw_diepte", antwoord_ids: ["tot_4m"]},
            {vraag_id: "uitbouw_positie", antwoord_ids: ["achterkant"]},
          ],
          uitkomst_id: "uitbouw_vrij",
        },
        {voorwaarden: [{vraag_id: "type", antwoord_ids: ["uitbouw"]}], uitkomst_id: "uitbouw_vergunning"},
        {voorwaarden: [{vraag_id: "type", antwoord_ids: ["dakopbouw"]}], uitkomst_id: "dakopbouw"},
        {
          voorwaarden: [
            {vraag_id: "type", antwoord_ids: ["dakkapel"]},
            {vraag_id: "dakkapel_positie", antwoord_ids: ["achterkant"]},
          ],
          uitkomst_id: "dakkapel_achter",
        },
        {voorwaarden: [{vraag_id: "type", antwoord_ids: ["dakkapel"]}], uitkomst_id: "dakkapel_voor"},
        {
          voorwaarden: [
            {vraag_id: "type", antwoord_ids: ["interne_verbouwing"]},
            {vraag_id: "constructie", antwoord_ids: ["nee"]},
          ],
          uitkomst_id: "intern_vrij",
        },
        {voorwaarden: [{vraag_id: "type", antwoord_ids: ["interne_verbouwing"]}], uitkomst_id: "intern_constructief"},
        {
          voorwaarden: [
            {vraag_id: "type", antwoord_ids: ["kozijnen"]},
            {vraag_id: "kozijn_maat", antwoord_ids: ["ja"]},
          ],
          uitkomst_id: "kozijn_vrij",
        },
        {voorwaarden: [{vraag_id: "type", antwoord_ids: ["kozijnen"]}], uitkomst_id: "kozijn_vergunning"},
      ],
      vve_vraag_id: "vve",
      vve_ja_antwoord_id: "ja",
      vve_extra_tekst:
        "Let op, bij een VvE heb je altijd toestemming van de vereniging nodig, los van de gemeente. Vaak via een ledenvergadering, plan dat vroeg in.",
      omgevingsloket_url: "https://omgevingswet.overheid.nl",
      disclaimer:
        "Deze uitkomst is een indicatie op basis van de landelijke regels voor vergunningvrij bouwen. Alleen het Omgevingsloket en jouw gemeente geven uitsluitsel.",
    },

    // =========================================================================
    // A3: RENOVATIE TERUGPLANNER
    // =========================================================================
    terugplanner: {
      meta: {
        naam: "Renovatie terugplanner",
        categorie: "tijd",
        omschrijving_kort: "Reken vanaf je gewenste startdatum terug wanneer je wat moet regelen.",
        uitleg:
          "Werk terug vanaf de datum dat je wilt starten met de verbouwing. Deze tool laat zien wanneer je uiterlijk offertes moet aanvragen, materialen moet bestellen en een vergunning moet indienen.",
        trefwoorden: ["renovatie planning", "wanneer offerte aanvragen", "verbouwing terugplannen"],
        volgorde: 3,
        actief: true,
        gerelateerd: ["bouwtijd", "vergunning", "klusvolgorde"],
        whatsapp_tekst: "Hoi, ik heb de terugplanner ingevuld en wil graag even sparren over de planning.",
      },
      stappen: [
        {id: "offertes", label: "Offertes aanvragen en partner kiezen", weken_voor_start: 6},
        {id: "materiaalkeuzes", label: "Definitieve materiaalkeuzes maken", weken_voor_start: 4},
        {id: "bestellen_standaard", label: "Standaard materialen bestellen", weken_voor_start: 4, conditie: "geen_maatwerk"},
        {id: "bestellen_maatwerk", label: "Maatwerk materialen bestellen (langere levertijd)", weken_voor_start: 10, conditie: "maatwerk"},
        {id: "vergunning_indienen", label: "Vergunning indienen", weken_voor_start: 10, conditie: "vergunning_nodig"},
      ],
      teksten: {
        resultaat_titel: "Zo plan je terug vanaf {startdatum}",
        waarschuwing_verleden: "Deze stap had al gemoeten, plan je start later of schakel snel.",
        disclaimer: "Dit is een vuistregelplanning. Bij spoed of een krappe markt kunnen doorlooptijden langer zijn.",
      },
    },

    // =========================================================================
    // A4: VERBOUWEN TIJDENS BEWONING CHECK
    // =========================================================================
    bewoning: {
      meta: {
        naam: "Verbouwen tijdens bewoning check",
        categorie: "tijd",
        omschrijving_kort: "Check of je tijdens de verbouwing kunt blijven wonen.",
        uitleg:
          "Kun je tijdens de verbouwing gewoon blijven wonen, of is tijdelijk verblijf elders verstandig? Vul in welke ruimtes worden aangepakt en krijg een praktisch advies.",
        trefwoorden: ["verbouwen met bewoning", "blijven wonen tijdens verbouwing", "tijdelijk logeren verbouwing"],
        volgorde: 4,
        actief: true,
        gerelateerd: ["bouwtijd", "klusvolgorde", "sloopchecklist"],
        whatsapp_tekst: "Hoi, ik heb de bewoningscheck ingevuld en wil graag even sparren over de planning.",
      },
      ruimtes: [
        {id: "hele_woning", label: "Hele woning", score: 5, advies: "Bij een verbouwing van de hele woning is tijdelijk elders wonen vrijwel altijd verstandig."},
        {id: "badkamer", label: "Badkamer", score: 2, advies: "Zorg voor een alternatieve douche- of wasmogelijkheid, bijvoorbeeld bij familie of de sportschool."},
        {id: "keuken", label: "Keuken", score: 2, advies: "Richt een noodkeuken in met een kookplaatje en een magnetron."},
        {id: "toilet", label: "Toilet", score: 1, advies: "Zonder tweede toilet is een tijdelijk chemisch toilet of buren-afspraak handig."},
        {id: "woonkamer", label: "Woonkamer", score: 1, advies: "Richt tijdelijk een andere ruimte in als zitplek."},
        {id: "slaapkamers", label: "Slaapkamer(s)", score: 1, advies: "Zorg voor een rustige alternatieve slaapplek tijdens de zwaarste werkzaamheden."},
      ],
      hele_woning_id: "hele_woning",
      badkamer_id: "badkamer",
      // Extra punten als de badkamer wordt aangepakt EN er geen tweede toilet/douche is.
      extra_score_badkamer_zonder_tweede_toilet: 2,
      thuiswerkers_score: 1,
      kinderen_score: 1,
      drempels: [
        {max_score: 2, titel: "Blijven kan prima", tekst: "Met wat organisatie kun je gewoon in de woning blijven wonen tijdens deze verbouwing."},
        {max_score: 4, titel: "Blijven kan, maar het wordt pittig", tekst: "Blijven wonen kan, maar houd rekening met de nodige rompslomp. Plan vooraf goed hoe je de zwaarste dagen doorkomt."},
        {max_score: 99, titel: "Overweeg serieus tijdelijk verblijf elders", tekst: "Met deze combinatie van werkzaamheden is tijdelijk elders wonen, ook voor een korte periode, het overwegen waard."},
      ],
      teksten: {
        resultaat_titel: "{titel}",
      },
    },

    // =========================================================================
    // A5: BOUWGELUID EN WERKTIJDEN CHECK
    // =========================================================================
    werktijden: {
      meta: {
        naam: "Bouwgeluid en werktijden check",
        categorie: "tijd",
        omschrijving_kort: "Check de toegestane werktijden voor bouwwerkzaamheden in jouw gemeente.",
        uitleg:
          "Wanneer mag er geboord en gesloopt worden? Check de indicatieve werktijden per gemeente en voorkom klachten van de buren.",
        trefwoorden: ["werktijden verbouwing", "bouwgeluid regels", "wanneer mag ik boren"],
        volgorde: 5,
        actief: true,
        gerelateerd: ["burenbrief", "bouwtijd"],
        whatsapp_tekst: "Hoi, ik heb de werktijden check bekeken en wil graag even sparren over de planning.",
      },
      gemeenten: [
        {id: "den-haag", label: "Den Haag", werkdagen: "07:00 - 19:00", zaterdag: "08:00 - 17:00", zondag_feestdag: "Niet toegestaan"},
        {id: "rotterdam", label: "Rotterdam", werkdagen: "07:00 - 19:00", zaterdag: "08:00 - 17:00", zondag_feestdag: "Niet toegestaan"},
        {id: "delft", label: "Delft", werkdagen: "07:00 - 19:00", zaterdag: "08:00 - 17:00", zondag_feestdag: "Niet toegestaan"},
        {id: "zoetermeer", label: "Zoetermeer", werkdagen: "07:00 - 19:00", zaterdag: "08:00 - 17:00", zondag_feestdag: "Niet toegestaan"},
        {id: "leiden", label: "Leiden", werkdagen: "07:00 - 19:00", zaterdag: "08:00 - 17:00", zondag_feestdag: "Niet toegestaan"},
        {id: "westland", label: "Westland", werkdagen: "07:00 - 19:00", zaterdag: "08:00 - 17:00", zondag_feestdag: "Niet toegestaan"},
        {id: "rijswijk", label: "Rijswijk", werkdagen: "07:00 - 19:00", zaterdag: "08:00 - 17:00", zondag_feestdag: "Niet toegestaan"},
        {id: "anders", label: "Anders", werkdagen: "", zaterdag: "", zondag_feestdag: "", opmerking: "Check de website van jouw gemeente voor de exacte regels."},
      ],
      landelijke_vuistregel: {werkdagen: "07:00 - 19:00", zaterdag: "08:00 - 17:00", zondag_feestdag: "Niet toegestaan"},
      gemeente_zoek_url: "https://www.rijksoverheid.nl/onderwerpen/gemeenten/vraag-en-antwoord/hoe-vind-ik-de-website-van-mijn-gemeente",
      teksten: {
        melding_tekst: "Aanhoudende overlast buiten deze tijden kun je melden bij de gemeente.",
        buren_tip: "Informeer buren vooraf over de werkzaamheden, dat voorkomt de meeste klachten.",
        disclaimer: "Regels wijzigen per gemeente en per project. Check altijd de actuele regels op de site van jouw gemeente.",
      },
    },

    // =========================================================================
    // B1: TEGEL CALCULATOR
    // =========================================================================
    tegels: {
      meta: {
        naam: "Tegel calculator",
        categorie: "materialen",
        omschrijving_kort: "Reken uit hoeveel dozen tegels, lijm en voeg je nodig hebt.",
        uitleg:
          "Tegels berekenen op basis van je vloer- en wandoppervlak in m2, het tegelformaat en het legpatroon. Je krijgt direct het aantal dozen tegels, zakken lijm en zakken voeg.",
        trefwoorden: ["tegels berekenen m2", "hoeveel tegels nodig", "tegellijm berekenen"],
        volgorde: 6,
        actief: true,
        gerelateerd: ["stucwerk", "egaline", "container"],
        whatsapp_tekst: "Hoi, ik heb de tegel calculator ingevuld en wil graag even sparren over mijn project.",
      },
      formaten: [
        {id: "30x60", label: "30 x 60 cm", m2_per_doos: 1.44, ondervloer_waarschuwing: false},
        {id: "60x60", label: "60 x 60 cm", m2_per_doos: 1.44, ondervloer_waarschuwing: false},
        {id: "60x120", label: "60 x 120 cm", m2_per_doos: 1.44, ondervloer_waarschuwing: true},
        {id: "30x30", label: "30 x 30 cm", m2_per_doos: 1.35, ondervloer_waarschuwing: false},
        {id: "mozaiek", label: "Mozaiek / klein formaat", m2_per_doos: 1.0, ondervloer_waarschuwing: false},
        {id: "anders", label: "Anders (zelf invullen)", m2_per_doos: null, ondervloer_waarschuwing: false},
      ],
      legpatronen: [
        {id: "recht", label: "Recht", snijverlies: 0.1},
        {id: "halfsteens", label: "Halfsteens", snijverlies: 0.12},
        {id: "visgraat", label: "Visgraat", snijverlies: 0.15},
        {id: "diagonaal", label: "Diagonaal", snijverlies: 0.15},
      ],
      mozaiek_snijverlies: 0.08,
      mozaiek_formaat_id: "mozaiek",
      aftrek_per_deur_m2: 1.6,
      m2_per_zak_lijm: 4.5,
      m2_per_zak_voeg: 9,
      max_wanden_hulptool: 6,
      teksten: {
        resultaat_titel: "{dozen} dozen tegels ({totaal_m2} m² inclusief {snijverlies_pct}% snijverlies)",
        lijm_tekst: "{zakken_lijm} zak(ken) tegellijm (25 kg)",
        voeg_tekst: "{zakken_voeg} zak(ken) voegmiddel (5 kg)",
        ondervloer_tekst: "Bij grote vloertegels zoals dit formaat is een vlakke ondervloer cruciaal. Egaliseren is hierbij vaak nodig.",
        tip: "Bestel altijd 1 doos extra uit dezelfde badge. Tegels uit een andere productiebadge kunnen net een andere tint hebben en dat zie je.",
        disclaimer: "Deze hoeveelheden zijn indicatief. Jouw tegelzetter rekent het exact na.",
      },
    },

    // =========================================================================
    // B2: VERF CALCULATOR
    // =========================================================================
    verf: {
      meta: {
        naam: "Verf calculator",
        categorie: "materialen",
        omschrijving_kort: "Bereken hoeveel liter muurverf je nodig hebt voor je kamer.",
        uitleg:
          "Hoeveel verf heb je nodig per m2. Vul je oppervlak direct in, of laat de tool het wandoppervlak van je kamer berekenen op basis van lengte, breedte en hoogte.",
        trefwoorden: ["hoeveel verf per m2", "verf berekenen", "liters verf nodig"],
        volgorde: 7,
        actief: true,
        gerelateerd: ["stucwerk", "behang"],
        whatsapp_tekst: "Hoi, ik heb de verf calculator ingevuld en wil graag even sparren over mijn project.",
      },
      ondergronden: [
        {id: "eerder_geverfd", label: "Al eerder geverfd (lichte kleur)", default_lagen: 2, voorstrijk_nodig: false},
        {id: "nieuw_stucwerk", label: "Nieuw stucwerk", default_lagen: 2, voorstrijk_nodig: true},
        {id: "donkere_kleur", label: "Donkere kleur overschilderen", default_lagen: 3, voorstrijk_nodig: false},
      ],
      blikmaten: [
        {liter: 10, label: "10 liter"},
        {liter: 2.5, label: "2,5 liter"},
        {liter: 1, label: "1 liter"},
      ],
      dekking_m2_per_liter: 8,
      voorstrijk_m2_per_liter: 10,
      standaard_aftrek_m2: 5,
      min_lagen: 1,
      max_lagen: 3,
      teksten: {
        resultaat_titel: "{liters} liter muurverf ({blikken_advies})",
        voorstrijk_titel: "{liters_voorstrijk} liter voorstrijk",
        tip: "Goede kwaliteit muurverf dekt beter en scheelt vaak een hele laag werk. Goedkoop is hier duurkoop.",
        disclaimer: "De dekking verschilt per merk en per ondergrond. Sterk zuigende muren hebben soms meer verf nodig dan hier berekend.",
      },
    },

    // =========================================================================
    // B3: LAMINAAT EN PVC CALCULATOR
    // =========================================================================
    vloer: {
      meta: {
        naam: "Laminaat en PVC calculator",
        categorie: "materialen",
        omschrijving_kort: "Bereken hoeveel pakken laminaat of PVC je nodig hebt.",
        uitleg:
          "Bereken hoeveel pakken laminaat of PVC vloer je nodig hebt, inclusief snijverlies en eventueel een ondervloer.",
        trefwoorden: ["laminaat berekenen", "pvc vloer berekenen", "hoeveel pakken vloer"],
        volgorde: 8,
        actief: true,
        gerelateerd: ["plinten", "egaline"],
        whatsapp_tekst: "Hoi, ik heb de vloer calculator ingevuld en wil graag even sparren over mijn project.",
      },
      types: [
        {id: "laminaat_klik", label: "Laminaat klik", m2_per_pak: 2.22, snijverlies: 0.07},
        {id: "pvc_klik", label: "PVC klik", m2_per_pak: 2.0, snijverlies: 0.07},
        {id: "pvc_lijm", label: "PVC lijm", m2_per_pak: 3.3, snijverlies: 0.07},
        {id: "visgraat_pvc", label: "Visgraat PVC", m2_per_pak: 2.0, snijverlies: 0.12},
      ],
      ondervloer_m2_per_rol: 10,
      teksten: {
        resultaat_titel: "{pakken} pakken ({type_label}), {totaal_m2} m² inclusief snijverlies",
        ondervloer_titel: "{rollen} rol(len) ondervloer",
        tip: "Laat de vloer 48 uur acclimatiseren in de ruimte voor het leggen.",
      },
    },

    // =========================================================================
    // B4: BEHANG CALCULATOR
    // =========================================================================
    behang: {
      meta: {
        naam: "Behang calculator",
        categorie: "materialen",
        omschrijving_kort: "Bereken hoeveel rollen behang je nodig hebt.",
        uitleg: "Bereken hoeveel rollen behang je nodig hebt, inclusief patroonherhaling en snijmarge.",
        trefwoorden: ["behang berekenen", "hoeveel rollen behang"],
        volgorde: 9,
        actief: true,
        gerelateerd: ["verf", "stucwerk"],
        whatsapp_tekst: "Hoi, ik heb de behang calculator ingevuld en wil graag even sparren over mijn project.",
      },
      rolbreedte_default: 0.53,
      rollengte_default: 10.05,
      snijmarge: 0.1,
      verlies_met_patroon: 0.15,
      verlies_zonder_patroon: 0.1,
      teksten: {
        resultaat_titel: "{rollen} rollen behang",
        aanname_tekst: "Berekend op basis van {rolbreedte} m brede rollen van {rollengte} m lang.",
        tip: "Koop alle rollen uit hetzelfde batchnummer.",
      },
    },

    // =========================================================================
    // B5: PLINTEN EN PROFIELEN CALCULATOR
    // =========================================================================
    plinten: {
      meta: {
        naam: "Plinten en profielen calculator",
        categorie: "materialen",
        omschrijving_kort: "Bereken hoeveel plinten je nodig hebt.",
        uitleg: "Bereken hoeveel strekkende meters en losse plinten je nodig hebt op basis van de omtrek van je ruimtes.",
        trefwoorden: ["plinten berekenen", "hoeveel plinten nodig"],
        volgorde: 10,
        actief: true,
        gerelateerd: ["vloer"],
        whatsapp_tekst: "Hoi, ik heb de plinten calculator ingevuld en wil graag even sparren over mijn project.",
      },
      aftrek_per_deur_m: 0.9,
      lengte_per_plint_default: 2.4,
      zaagverlies: 0.05,
      teksten: {
        resultaat_titel: "{meters} strekkende meter, {stuks} plinten van {lengte} m",
        tip: "Neem 1 plint extra voor hoeken en zaagfouten.",
      },
    },

    // =========================================================================
    // B6: KITWERK CALCULATOR
    // =========================================================================
    kit: {
      meta: {
        naam: "Kitwerk calculator",
        categorie: "materialen",
        omschrijving_kort: "Bereken hoeveel kokers sanitairkit je nodig hebt.",
        uitleg: "Bereken hoeveel kokers sanitairkit je nodig hebt voor je badkamer, op basis van de naadbreedte.",
        trefwoorden: ["kit berekenen", "hoeveel kit badkamer", "sanitairkit"],
        volgorde: 11,
        actief: true,
        gerelateerd: ["tegels"],
        whatsapp_tekst: "Hoi, ik heb de kitwerk calculator ingevuld en wil graag even sparren over mijn project.",
      },
      onderdelen: [
        {id: "douche", label: "Omtrek douche", standaard_meters: 4},
        {id: "wastafel", label: "Rondom wastafel", standaard_meters: 1.5},
        {id: "bad", label: "Rondom bad", standaard_meters: 3.5},
        {id: "plint", label: "Vloerplint rondom badkamer", standaard_meters: 8},
      ],
      naadbreedtes: [
        {id: "5mm", label: "5 mm", meters_per_koker: 12},
        {id: "8mm", label: "8 mm", meters_per_koker: 7},
        {id: "10mm", label: "10 mm", meters_per_koker: 5},
      ],
      teksten: {
        resultaat_titel: "{kokers} koker(s) sanitairkit (310 ml)",
        tip: "Gebruik in natte ruimtes altijd schimmelwerende sanitairkit, geen acrylaatkit.",
      },
    },

    // =========================================================================
    // B7: STUCWERK CALCULATOR
    // =========================================================================
    stucwerk: {
      meta: {
        naam: "Stucwerk calculator",
        categorie: "materialen",
        omschrijving_kort: "Bereken hoeveel zakken stucgips je nodig hebt.",
        uitleg: "Bereken hoeveel stucgips je nodig hebt voor wanden en plafonds, en een indicatie van de werktijd.",
        trefwoorden: ["stucwerk berekenen", "stucgips hoeveelheid", "stukadoor m2 per dag"],
        volgorde: 12,
        actief: true,
        gerelateerd: ["verf", "egaline"],
        whatsapp_tekst: "Hoi, ik heb de stucwerk calculator ingevuld en wil graag even sparren over mijn project.",
      },
      afwerkingen: [
        {id: "behangklaar", label: "Behangklaar", kg_per_m2: 0.8},
        {id: "sausklaar", label: "Sausklaar", kg_per_m2: 1.2},
      ],
      factor_slechte_staat: 1.5,
      m2_per_dag_min: 8,
      m2_per_dag_max: 12,
      kg_per_zak: 25,
      teksten: {
        resultaat_titel: "{zakken} zak(ken) stucgips (25 kg) voor {totaal_m2} m²",
        werktijd_titel: "Indicatieve werktijd: {dagen_min} tot {dagen_max} werkdagen",
        tip: "Sausklaar is een gladdere en duurdere afwerking dan behangklaar, kies bewust.",
      },
    },

    // =========================================================================
    // B8: EGALINE CALCULATOR
    // =========================================================================
    egaline: {
      meta: {
        naam: "Egaline calculator",
        categorie: "materialen",
        omschrijving_kort: "Bereken hoeveel zakken egaline je nodig hebt.",
        uitleg: "Bereken hoeveel egaline je nodig hebt om je vloer vlak te maken, op basis van de gewenste laagdikte.",
        trefwoorden: ["egaline berekenen", "vloer egaliseren hoeveelheid"],
        volgorde: 13,
        actief: true,
        gerelateerd: ["vloer", "tegels"],
        whatsapp_tekst: "Hoi, ik heb de egaline calculator ingevuld en wil graag even sparren over mijn project.",
      },
      kg_per_m2_per_mm: 1.7,
      kg_per_zak: 25,
      min_mm: 2,
      max_mm: 10,
      default_mm: 3,
      teksten: {
        resultaat_titel: "{zakken} zak(ken) egaline (25 kg)",
        tip: "Meet de laagdikte op meerdere punten, vloeren zijn zelden overal even scheef.",
      },
    },

    // =========================================================================
    // B9: CONTAINERCALCULATOR
    // =========================================================================
    container: {
      meta: {
        naam: "Containercalculator",
        categorie: "materialen",
        omschrijving_kort: "Bereken welke containermaat je nodig hebt voor je sloopafval.",
        uitleg: "Bereken hoeveel puinvolume je klus oplevert en welke containermaat daarbij past.",
        trefwoorden: ["container berekenen", "welke container sloopafval", "puincontainer maat"],
        volgorde: 14,
        actief: true,
        gerelateerd: ["sloopchecklist", "tegels"],
        whatsapp_tekst: "Hoi, ik heb de containercalculator ingevuld en wil graag even sparren over mijn project.",
      },
      klustypes: [
        {id: "badkamer_strippen", label: "Badkamer strippen", m3_per_m2: 0.25},
        {id: "keuken_eruit", label: "Keuken eruit", m3_per_m2: 0.15},
        {id: "vloeren_eruit", label: "Vloeren eruit", m3_per_m2: 0.08},
        {id: "dak_uitbouw_sloop", label: "Dakopbouw of uitbouw sloop", m3_per_m2: 0.3},
        {id: "hele_woning_strippen", label: "Hele woning strippen", m3_per_m2: 0.2},
      ],
      uitzetfactor: 1.4,
      maten: [
        {m3: 3, label: "3 m³"},
        {m3: 6, label: "6 m³"},
        {m3: 10, label: "10 m³"},
        {m3: 15, label: "15 m³"},
        {m3: 40, label: "40 m³"},
      ],
      teksten: {
        resultaat_titel: "Geschat volume: {volume} m³",
        tip: "Puin (steen) en gemengd afval gescheiden houden scheelt fors in stortkosten.",
      },
    },

    // =========================================================================
    // C1: VLOERVERWARMING CHECK
    // =========================================================================
    vloerverwarming: {
      meta: {
        naam: "Vloerverwarming check",
        categorie: "techniek",
        omschrijving_kort: "Check of vloerverwarming geschikt is voor jouw situatie.",
        uitleg: "Check of vloerverwarming geschikt is als hoofd- of bijverwarming, gegeven je vloertype en de isolatie van je woning.",
        trefwoorden: ["vloerverwarming geschikt", "vloerverwarming hoofdverwarming", "vloerverwarming vermogen"],
        volgorde: 15,
        actief: true,
        gerelateerd: ["verwarming", "isolatie"],
        whatsapp_tekst: "Hoi, ik heb de vloerverwarming check bekeken en wil graag even sparren.",
      },
      isolaties: [
        {id: "goed", label: "Goed geisoleerd (na 2000 of gerenoveerd)", watt_per_m2: 50},
        {id: "matig", label: "Matig geisoleerd (1975 - 2000)", watt_per_m2: 70},
        {id: "slecht", label: "Slecht geisoleerd (voor 1975)", watt_per_m2: 100},
      ],
      vloertypes: [
        {id: "tegels", label: "Tegels", geschiktheid: "ideaal", toelichting: "Tegels geleiden warmte het beste, ideale combinatie met vloerverwarming."},
        {id: "pvc", label: "PVC", geschiktheid: "goed", toelichting: "PVC is goed geschikt, let op een geschikte onderlaag."},
        {id: "laminaat", label: "Laminaat", geschiktheid: "goed", toelichting: "Goed geschikt mits het laminaat expliciet geschikt is voor vloerverwarming."},
        {id: "hout", label: "Massief hout", geschiktheid: "beperkt", toelichting: "Beperkt geschikt vanwege een lagere maximale vloertemperatuur en werking van het hout."},
      ],
      slechte_isolatie_id: "slecht",
      teksten: {
        resultaat_titel: "Indicatief vermogen: {watt_per_m2} W/m², totaal {totaal_watt} W",
        hoofdverwarming_waarschuwing: "Bij een slecht geisoleerde woning volstaat vloerverwarming als hoofdverwarming meestal niet. Isoleren eerst is dan de betere volgorde.",
        tip: "Vloerverwarming en tegels is de beste combinatie voor warmteafgifte.",
      },
    },

    // =========================================================================
    // C2: VENTILATIE BADKAMER CALCULATOR
    // =========================================================================
    ventilatie: {
      meta: {
        naam: "Ventilatie badkamer calculator",
        categorie: "techniek",
        omschrijving_kort: "Bereken de benodigde afzuigcapaciteit voor je badkamer.",
        uitleg: "Bereken hoeveel mechanische afzuiging jouw badkamer minimaal nodig heeft.",
        trefwoorden: ["ventilatie badkamer berekenen", "afzuiging badkamer capaciteit"],
        volgorde: 16,
        actief: true,
        gerelateerd: ["vloerverwarming"],
        whatsapp_tekst: "Hoi, ik heb de ventilatie calculator bekeken en wil graag even sparren.",
      },
      minimum_m3_per_uur: 50,
      ventilatievoud_per_uur: 6,
      standaard_hoogte: 2.6,
      teksten: {
        resultaat_titel: "Benodigde capaciteit: minimaal {m3_per_uur} m³/uur",
        advies_tekst: "Kies mechanische afzuiging met een nadraaistand of vochtsensor, zodat de badkamer ook na het douchen wordt geventileerd.",
        tip: "Een raam is geen vervanging voor mechanische afzuiging in een moderne, goed afgesloten woning.",
      },
    },

    // =========================================================================
    // C3: GROEPENKAST CHECK
    // =========================================================================
    groepenkast: {
      meta: {
        naam: "Groepenkast check",
        categorie: "techniek",
        omschrijving_kort: "Check of je groepenkast genoeg capaciteit heeft.",
        uitleg: "Check welke apparaten een eigen groep of krachtstroom nodig hebben en of je huidige aansluiting genoeg capaciteit biedt.",
        trefwoorden: ["groepenkast verzwaren", "laadpaal eigen groep", "3 fasen nodig"],
        volgorde: 17,
        actief: true,
        gerelateerd: ["verwarming"],
        whatsapp_tekst: "Hoi, ik heb de groepenkast check ingevuld en wil graag even sparren.",
      },
      apparaten: [
        {id: "inductie", label: "Inductie koken", eigen_groep: true, driefase_nodig: false, indicatief_vermogen_kw: 7.4},
        {id: "vloerverwarming_elektrisch", label: "Elektrische vloerverwarming", eigen_groep: true, driefase_nodig: false, indicatief_vermogen_kw: 1.5},
        {id: "laadpaal", label: "Laadpaal", eigen_groep: true, driefase_nodig: true, indicatief_vermogen_kw: 11},
        {id: "warmtepomp", label: "Warmtepomp", eigen_groep: true, driefase_nodig: true, indicatief_vermogen_kw: 3},
        {id: "airco", label: "Airco", eigen_groep: true, driefase_nodig: false, indicatief_vermogen_kw: 1.5},
        {id: "sauna", label: "Sauna / stoomcabine", eigen_groep: true, driefase_nodig: true, indicatief_vermogen_kw: 6},
        {id: "zonnepanelen", label: "Zonnepanelen", eigen_groep: true, driefase_nodig: false, indicatief_vermogen_kw: 0},
        {id: "doorstromer", label: "Doorstromer / boiler", eigen_groep: true, driefase_nodig: false, indicatief_vermogen_kw: 18},
      ],
      aansluitingen: [
        {id: "1x25a", label: "1 x 25A", max_kw: 5.75, is_driefase: false},
        {id: "1x35a", label: "1 x 35A", max_kw: 8.05, is_driefase: false},
        {id: "3x25a", label: "3 x 25A", max_kw: 17.25, is_driefase: true},
        {id: "weet_niet", label: "Weet ik niet", max_kw: 5.75, is_driefase: false},
      ],
      driefase_advies_vermogen_kw: 8,
      teksten: {
        resultaat_titel: "{aantal_groepen} extra groep(en) nodig",
        disclaimer: "Laat de definitieve beoordeling en aanleg altijd door een erkend installateur doen.",
      },
    },

    // =========================================================================
    // C4: VERWARMINGSVERMOGEN CHECK
    // =========================================================================
    verwarming: {
      meta: {
        naam: "Verwarmingsvermogen check",
        categorie: "techniek",
        omschrijving_kort: "Bereken het indicatieve benodigde verwarmingsvermogen.",
        uitleg: "Bereken indicatief hoeveel verwarmingsvermogen jouw woning nodig heeft, en of een warmtepomp of hybride oplossing kansrijk is.",
        trefwoorden: ["verwarmingsvermogen berekenen", "warmtepomp geschikt", "kw verwarming woning"],
        volgorde: 18,
        actief: true,
        gerelateerd: ["isolatie", "groepenkast"],
        whatsapp_tekst: "Hoi, ik heb de verwarmingsvermogen check bekeken en wil graag even sparren.",
      },
      bouwjaren: [
        {id: "voor_1975", label: "Voor 1975", watt_per_m3: 100},
        {id: "1975_1990", label: "1975 - 1990", watt_per_m3: 85},
        {id: "1990_2010", label: "1990 - 2010", watt_per_m3: 70},
        {id: "na_2010", label: "Na 2010 of gerenoveerd", watt_per_m3: 50},
      ],
      standaard_hoogte: 2.6,
      drempel_warmtepomp_kw: 8,
      drempel_hybride_kw: 12,
      teksten: {
        resultaat_titel: "Indicatief benodigd vermogen: {kw} kW",
        disclaimer: "Dit is een vuistregel. Een echte warmteverliesberekening door een installateur is nodig voor een definitieve keuze.",
      },
    },

    // =========================================================================
    // C5: ISOLATIE RC CHECK
    // =========================================================================
    isolatie: {
      meta: {
        naam: "Isolatie Rc check",
        categorie: "techniek",
        omschrijving_kort: "Check hoe jouw isolatiewaarde zich verhoudt tot de norm.",
        uitleg: "Check de geschatte huidige isolatiewaarde (Rc) van dak, gevel of vloer ten opzichte van de nieuwbouwnorm.",
        trefwoorden: ["isolatie rc waarde", "dak isoleren norm", "spouwmuur isolatiewaarde"],
        volgorde: 19,
        actief: true,
        gerelateerd: ["verwarming", "vloerverwarming"],
        whatsapp_tekst: "Hoi, ik heb de isolatie check bekeken en wil graag even sparren.",
      },
      bouwjaren: [
        {id: "voor_1975", label: "Voor 1975"},
        {id: "1975_2000", label: "1975 - 2000"},
        {id: "na_2000", label: "Na 2000"},
        {id: "na_2010", label: "Na 2010 / gerenoveerd"},
      ],
      bouwdelen: [
        {
          id: "dak",
          label: "Dak",
          eis_nieuwbouw_tekst: "Rc 6,3",
          waarden_per_bouwjaar: {voor_1975: 0.5, "1975_2000": 1.3, na_2000: 2.5, na_2010: 6.0},
        },
        {
          id: "gevel",
          label: "Gevel",
          eis_nieuwbouw_tekst: "Rc 4,7",
          waarden_per_bouwjaar: {voor_1975: 0.3, "1975_2000": 1.3, na_2000: 1.3, na_2010: 4.5},
        },
        {
          id: "vloer",
          label: "Vloer",
          eis_nieuwbouw_tekst: "Rc 3,7",
          waarden_per_bouwjaar: {voor_1975: 0.2, "1975_2000": 1.3, na_2000: 2.5, na_2010: 3.5},
        },
      ],
      na_geisoleerd_verbetering: 1.3,
      teksten: {
        resultaat_titel: "Geschatte huidige waarde: Rc {huidige_waarde} (norm: {eis_nieuwbouw_tekst})",
        tip: "Isoleren voor je de verwarming vervangt, anders koop je een te zware installatie.",
      },
    },

    // =========================================================================
    // C6: AFSCHOT DOUCHE CALCULATOR
    // =========================================================================
    afschot: {
      meta: {
        naam: "Afschot douche calculator",
        categorie: "techniek",
        omschrijving_kort: "Bereken het benodigde afschot van je doucheveloer.",
        uitleg: "Bereken hoeveel hoogteverschil (afschot) je doucheveloer nodig heeft om water goed te laten afvoeren.",
        trefwoorden: ["afschot douche berekenen", "doucheveloer helling"],
        volgorde: 20,
        actief: true,
        gerelateerd: ["tegels"],
        whatsapp_tekst: "Hoi, ik heb de afschot calculator ingevuld en wil graag even sparren.",
      },
      mm_per_meter_default: 15,
      teksten: {
        resultaat_titel: "Benodigd hoogteverschil: circa {hoogteverschil} mm",
        tip: "Bij grote tegels op de douchevloer is een draingoot aan de rand makkelijker dan een putje in het midden.",
      },
    },

    // =========================================================================
    // D1: VERBOUWEN OF VERHUIZEN CHECK
    // =========================================================================
    "verbouwen-verhuizen": {
      meta: {
        naam: "Verbouwen of verhuizen check",
        categorie: "woning",
        omschrijving_kort: "Krijg een indicatie of verbouwen of verhuizen beter bij je past.",
        uitleg: "Twijfel je tussen verbouwen en verhuizen? Beantwoord een paar vragen en krijg een persoonlijke indicatie.",
        trefwoorden: ["verbouwen of verhuizen", "uitbreiden of verhuizen woning"],
        volgorde: 21,
        actief: true,
        gerelateerd: ["ruimtewinst", "bouwtijd"],
        whatsapp_tekst: "Hoi, ik heb de verbouwen-of-verhuizen check ingevuld en wil graag even sparren.",
      },
      vragen: [
        {
          id: "probleem",
          vraag: "Wat is het grootste probleem met je huidige woning?",
          antwoorden: [
            {id: "ruimte", label: "Te weinig ruimte", score: 1},
            {id: "verouderd", label: "Verouderde woning", score: 1},
            {id: "indeling", label: "Indeling klopt niet", score: 1},
            {id: "locatie", label: "Locatie bevalt niet", score: 3},
          ],
        },
        {
          id: "buurt",
          vraag: "Ben je tevreden met de buurt?",
          antwoorden: [
            {id: "zeer", label: "Ja, zeer tevreden", score: 0},
            {id: "redelijk", label: "Redelijk tevreden", score: 1},
            {id: "nee", label: "Nee", score: 3},
          ],
        },
        {
          id: "uitbreidingsruimte",
          vraag: "Is er uitbreidingsruimte?",
          antwoorden: [
            {id: "tuin", label: "Tuin voor een uitbouw", score: 0},
            {id: "dak", label: "Plat dak voor een opbouw", score: 0},
            {id: "zolder", label: "Onbenutte zolder", score: 0},
            {id: "geen", label: "Geen van deze", score: 2},
          ],
        },
        {
          id: "woonduur",
          vraag: "Hoe lang wil je er nog wonen?",
          antwoorden: [
            {id: "lang", label: "5 jaar of langer", score: 0},
            {id: "middel", label: "2 tot 5 jaar", score: 1},
            {id: "kort", label: "Korter dan 2 jaar", score: 3},
          ],
        },
        {
          id: "binding",
          vraag: "Heb je emotionele binding met het huis?",
          antwoorden: [
            {id: "ja", label: "Ja", score: 0},
            {id: "neutraal", label: "Neutraal", score: 1},
            {id: "nee", label: "Nee", score: 2},
          ],
        },
      ],
      drempels: [
        {max_score: 3, uitkomst_id: "verbouwen"},
        {max_score: 7, uitkomst_id: "beide"},
        {max_score: 99, uitkomst_id: "verhuizen"},
      ],
      uitkomsten: [
        {
          id: "verbouwen",
          titel: "Verbouwen ligt voor de hand",
          tekst: "Je bent tevreden met de buurt en hebt uitbreidingsruimte. Verbouwen lost je grootste probleem waarschijnlijk goed op.",
        },
        {
          id: "beide",
          titel: "Het kan beide kanten op",
          tekst: "Zowel verbouwen als verhuizen kan een goede oplossing zijn. De uitkomst hangt sterk af van wat voor jou het zwaarst weegt.",
        },
        {
          id: "verhuizen",
          titel: "Verhuizen ligt voor de hand",
          tekst: "De locatie of je binding met het huis wegen zwaar mee. Een verbouwing lost dat niet op, verhuizen ligt dan meer voor de hand.",
        },
      ],
      overwegingen: [
        {vraag_id: "probleem", antwoord_id: "locatie", tekst: "Een verbouwing verandert niets aan de locatie van je woning."},
        {vraag_id: "buurt", antwoord_id: "nee", tekst: "Ontevredenheid over de buurt los je niet op met een verbouwing."},
        {vraag_id: "uitbreidingsruimte", antwoord_id: "geen", tekst: "Zonder uitbreidingsruimte is een grote ruimtewinst lastiger te realiseren."},
        {vraag_id: "woonduur", antwoord_id: "kort", tekst: "Bij een korte resterende woonduur verdien je een investering in verbouwen minder makkelijk terug."},
      ],
      teksten: {
        disclaimer: "Dit is geen financieel advies. Bespreek de cijfers altijd met je hypotheekadviseur.",
      },
    },

    // =========================================================================
    // D2: RUIMTEWINST CALCULATOR
    // =========================================================================
    ruimtewinst: {
      meta: {
        naam: "Ruimtewinst calculator",
        categorie: "woning",
        omschrijving_kort: "Bereken hoeveel extra ruimte een uitbouw of opbouw oplevert.",
        uitleg: "Bereken hoeveel m2 en m3 een uitbouw, dakopbouw, dakkapel of zolderverbouwing oplevert, en wat voor ruimte daarmee mogelijk is.",
        trefwoorden: ["m2 winnen uitbouw", "ruimte erbij dakopbouw", "zolder verbouwen m2"],
        volgorde: 22,
        actief: true,
        gerelateerd: ["verbouwen-verhuizen", "bouwtijd"],
        whatsapp_tekst: "Hoi, ik heb de ruimtewinst calculator ingevuld en wil graag even sparren.",
      },
      types: [
        {id: "uitbouw", label: "Uitbouw", hoogte: 2.6, waarde_effect_min_pct: 5, waarde_effect_max_pct: 10},
        {id: "dakopbouw", label: "Dakopbouw", hoogte: 2.6, waarde_effect_min_pct: 8, waarde_effect_max_pct: 15},
        {id: "dakkapel", label: "Dakkapel", hoogte: 2.3, waarde_effect_min_pct: 2, waarde_effect_max_pct: 4},
        {id: "zolder", label: "Zolder verbouwen", hoogte: 2.3, waarde_effect_min_pct: 3, waarde_effect_max_pct: 7},
      ],
      dakkapel_diepte_zone: 1.5,
      zolder_stahoogte_deel_default_pct: 60,
      nieuwe_ruimte_opties: [
        {min_m2: 15, label: "Master bedroom met eigen badkamer"},
        {min_m2: 6, label: "Volwaardige extra slaapkamer"},
        {min_m2: 3, label: "Ruime werkplek of hobbykamer"},
        {min_m2: 0, label: "Extra bergruimte"},
      ],
      teksten: {
        resultaat_titel: "Circa {m2} m² ({m3} m³) extra ruimte",
        waarde_disclaimer: "Dit percentage is een brede landelijke indicatie en verschilt sterk per woning, buurt en marktomstandigheden. Dit is geen taxatie.",
      },
    },

    // =========================================================================
    // D3: KAMERMATEN CHECK
    // =========================================================================
    kamermaten: {
      meta: {
        naam: "Kamermaten check",
        categorie: "woning",
        omschrijving_kort: "Check of je geplande kamermaten praktisch genoeg zijn.",
        uitleg: "Check of de geplande maten van een slaapkamer, badkamer, toilet of werkplek praktisch genoeg zijn.",
        trefwoorden: ["minimale kamermaat", "badkamer minimale afmeting", "slaapkamer m2"],
        volgorde: 23,
        actief: true,
        gerelateerd: ["ruimtewinst"],
        whatsapp_tekst: "Hoi, ik heb de kamermaten check ingevuld en wil graag even sparren.",
      },
      types: [
        {
          id: "slaapkamer_1p",
          label: "Slaapkamer (1 persoon)",
          min_m2: 6,
          comfort_m2: 9,
          min_breedte: 2.0,
          elementen: ["Eenpersoonsbed circa 1,0 x 2,1 m inclusief loopruimte", "Kast circa 0,6 m diep"],
        },
        {
          id: "slaapkamer_2p",
          label: "Slaapkamer (2 personen)",
          min_m2: 9,
          comfort_m2: 12,
          min_breedte: 2.6,
          elementen: ["Bed 2 personen circa 1,8 x 2,1 m inclusief loopruimte", "Kast circa 0,6 m diep"],
        },
        {
          id: "badkamer",
          label: "Badkamer",
          min_m2: 3.5,
          comfort_m2: 6,
          elementen: ["Douche minimaal 0,9 x 0,9 m, comfortabel 1,2 x 0,9 m", "Wastafel circa 0,6 x 0,5 m", "Toilet circa 0,4 x 0,7 m"],
        },
        {
          id: "toilet",
          label: "Toilet",
          min_m2: 1.08,
          comfort_m2: 1.5,
          min_breedte: 0.9,
          elementen: ["Minimaal 0,9 x 1,2 m vrije ruimte"],
        },
        {
          id: "werkplek",
          label: "Thuiswerkplek",
          min_m2: 4,
          comfort_m2: 6,
          elementen: ["Bureau circa 1,2 x 0,7 m inclusief stoel en loopruimte"],
        },
      ],
      teksten: {
        tip: "Teken de meubels op schaal in voor je muren verplaatst, dat voorkomt dure spijt.",
      },
    },

    // =========================================================================
    // D4: SLOOPCHECKLIST GENERATOR
    // =========================================================================
    sloopchecklist: {
      meta: {
        naam: "Sloopchecklist generator",
        categorie: "woning",
        omschrijving_kort: "Genereer een checklist voor veilig en compleet slopen.",
        uitleg: "Genereer een checklist op maat voor het slopen van je badkamer, keuken, vloeren of een deel van de woning, inclusief een asbestcheck.",
        trefwoorden: ["sloopchecklist", "asbest check bouwjaar", "checklist slopen verbouwing"],
        volgorde: 24,
        actief: true,
        gerelateerd: ["container", "burenbrief", "vergunning"],
        whatsapp_tekst: "Hoi, ik heb de sloopchecklist gegenereerd en wil graag even sparren.",
      },
      projecttypes: [
        {id: "badkamer", label: "Badkamer"},
        {id: "keuken", label: "Keuken"},
        {id: "vloeren", label: "Vloeren"},
        {id: "uitbouw_aanbouw", label: "Uitbouw of aanbouw sloop"},
        {id: "hele_woning", label: "Hele woning strippen"},
      ],
      items: [
        {id: "asbest", tekst: "Laat bij een pand van voor 1994 een asbestinventarisatie uitvoeren door een gecertificeerd bureau voordat de sloop start.", types: [], voorwaarde: "voor_1994", prioriteit: "hoog"},
        {id: "water_gas_elektra", tekst: "Sluit water, gas en elektra veilig af op de juiste plekken voor je begint.", types: ["badkamer", "keuken", "vloeren", "uitbouw_aanbouw", "hele_woning"]},
        {id: "container", tekst: "Regel een container in de juiste maat voor het sloopafval.", types: ["badkamer", "keuken", "vloeren", "uitbouw_aanbouw", "hele_woning"]},
        {id: "buren", tekst: "Informeer de buren vooraf over de sloopwerkzaamheden.", types: ["badkamer", "keuken", "vloeren", "uitbouw_aanbouw", "hele_woning"]},
        {id: "vve_toestemming", tekst: "Vraag toestemming aan de VvE voordat je begint met slopen.", types: [], voorwaarde: "vve"},
        {id: "stofschotten", tekst: "Plaats stofschotten en bepaal looproutes als je tijdens de sloop in de woning blijft wonen.", types: [], voorwaarde: "bewoning"},
        {id: "waardevolle_materialen", tekst: "Haal waardevolle materialen (radiatoren, sanitair) er zorgvuldig uit voordat de grove sloop begint.", types: ["badkamer", "keuken", "hele_woning"]},
        {id: "fotos_leidingen", tekst: "Maak foto's van leidingtraces voor je ze dichtwerkt of verwijdert.", types: ["badkamer", "keuken", "vloeren", "uitbouw_aanbouw", "hele_woning"]},
      ],
      asbest_jaar_grens: 1994,
      teksten: {
        asbest_titel: "Veiligheidspunt: asbest",
        asbest_tekst: "Dit pand is gebouwd voor 1994. Laat altijd eerst een asbestinventarisatie uitvoeren door een gecertificeerd bureau voordat er wordt gesloopt.",
        print_knop_label: "Print of bewaar als PDF",
      },
    },

    // =========================================================================
    // E1: BURENBRIEF GENERATOR
    // =========================================================================
    burenbrief: {
      meta: {
        naam: "Burenbrief generator",
        categorie: "zakelijk",
        omschrijving_kort: "Genereer een nette brief om buren te informeren over je verbouwing.",
        uitleg: "Genereer in een paar stappen een nette brief om je buren te informeren over de verbouwing, inclusief data en contactgegevens.",
        trefwoorden: ["buren informeren verbouwing", "burenbrief voorbeeld", "brief buren renovatie"],
        volgorde: 25,
        actief: true,
        gerelateerd: ["werktijden", "sloopchecklist"],
        whatsapp_tekst: "Hoi, ik heb de burenbrief gegenereerd en wil graag even sparren over de planning.",
      },
      projecttypes: [
        {id: "badkamer", label: "Badkamer"},
        {id: "keuken", label: "Keuken"},
        {id: "uitbouw", label: "Uitbouw"},
        {id: "dakopbouw", label: "Dakopbouw"},
        {id: "totaalrenovatie", label: "Totaalrenovatie"},
      ],
      varianten: [
        {
          id: "zakelijk",
          label: "Kort zakelijk",
          template:
            "Beste buren,\n\nVanaf {startdatum} tot naar verwachting {einddatum} laat ik op {adres} een {projecttype} uitvoeren. Dit kan gepaard gaan met bouwgeluid, met name in de periode {luidruchtige_periode}.\n\nDe aannemer werkt binnen de toegestane werktijden. Mocht u vragen of opmerkingen hebben, dan kunt u contact opnemen via {contact}.\n\nMet vriendelijke groet,\n{naam}",
        },
        {
          id: "persoonlijk",
          label: "Warm persoonlijk",
          template:
            "Beste buren,\n\nOm u niet te laten verrassen: vanaf {startdatum} gaan we bij ons op {adres} aan de slag met een {projecttype}. We verwachten rond {einddatum} klaar te zijn.\n\nHet kan soms wat rumoerig worden, vooral {luidruchtige_periode}. We doen ons best om de overlast te beperken en houden ons aan de toegestane werktijden.\n\nHeeft u vragen, loop gerust langs of neem contact op via {contact}. Alvast bedankt voor uw begrip.\n\nGroetjes,\n{naam}",
        },
      ],
      teksten: {
        privacy_tekst: "Deze brief wordt volledig in je browser gegenereerd. Er wordt niets verstuurd of opgeslagen.",
        kopieer_knop: "Kopieer tekst",
        print_knop: "Print",
        tip: "Een briefje en een keer aanbellen voorkomt 90% van de burenklachten.",
      },
    },

    // =========================================================================
    // E2: VVE ONDERHOUDSCHECK
    // =========================================================================
    "vve-onderhoud": {
      meta: {
        naam: "VvE onderhoudscheck",
        categorie: "zakelijk",
        omschrijving_kort: "Check of het onderhoud van jouw VvE-pand op schema ligt.",
        uitleg: "Vergelijk de laatste onderhoudsmomenten van je pand met de gangbare onderhoudscycli en zie waar actie nodig is.",
        trefwoorden: ["vve onderhoud check", "mjop", "onderhoudscyclus vve pand"],
        volgorde: 26,
        actief: true,
        gerelateerd: ["transformatie"],
        whatsapp_tekst: "Hoi, ik heb de VvE onderhoudscheck ingevuld en wil graag even sparren.",
      },
      items: [
        {id: "schilderwerk", label: "Buitenschilderwerk (hout)", cyclus_jaren_min: 5, cyclus_jaren_max: 7, van_toepassing: {veld: "kozijnen", waarde: "hout"}},
        {id: "plat_dak_inspectie", label: "Plat dak inspectie", cyclus_jaren_min: 2, cyclus_jaren_max: 2, van_toepassing: {veld: "dak_type", waarde: "plat"}},
        {id: "plat_dak_vervanging", label: "Plat dak (bitumen) vervanging", cyclus_jaren_min: 20, cyclus_jaren_max: 25, van_toepassing: {veld: "dak_type", waarde: "plat"}},
        {id: "hellend_dak", label: "Hellend dak (pannen) controle", cyclus_jaren_min: 5, cyclus_jaren_max: 5, van_toepassing: {veld: "dak_type", waarde: "hellend"}},
        {id: "voegwerk", label: "Voegwerk gevel", cyclus_jaren_min: 30, cyclus_jaren_max: 40},
        {id: "kunststof_kozijnen", label: "Kunststof kozijnen reinigen", cyclus_jaren_min: 1, cyclus_jaren_max: 1, van_toepassing: {veld: "kozijnen", waarde: "kunststof"}},
      ],
      teksten: {
        mjop_tekst: "Een meerjarenonderhoudsplan (MJOP) is een verplicht onderdeel van gezond VvE-beheer en helpt onverwachte kosten te voorkomen.",
      },
    },

    // =========================================================================
    // E3: TRANSFORMATIE QUICKSCAN
    // =========================================================================
    transformatie: {
      meta: {
        naam: "Transformatie quickscan",
        categorie: "zakelijk",
        omschrijving_kort: "Quickscan voor het transformeren van bedrijfsruimte naar wonen.",
        uitleg: "Voor ontwikkelaars en beleggers: een quickscan van de stappen en aandachtspunten bij het transformeren van kantoor-, winkel- of bedrijfsruimte naar woningen.",
        trefwoorden: ["kantoor naar wonen transformeren", "transformatie bedrijfsruimte woningen", "transformatie quickscan"],
        volgorde: 27,
        actief: true,
        gerelateerd: ["vve-onderhoud", "vergunning"],
        whatsapp_tekst: "Hoi, ik heb de transformatie quickscan ingevuld en wil graag even sparren met Therab.",
      },
      stappen: [
        {id: "bestemmingsplan", tekst: "Bestemmingsplan check of -wijziging"},
        {id: "omgevingsvergunning", tekst: "Omgevingsvergunning aanvragen"},
        {id: "daglicht", tekst: "Daglichttoetsing per woning"},
        {id: "geluid", tekst: "Geluidsonderzoek, zeker bij een drukke weg"},
        {id: "ventilatie_beng", tekst: "Ventilatie- en MPG/BENG-eisen doorrekenen"},
        {id: "constructief", tekst: "Constructieve toets bij indeling in units"},
        {id: "brandcompartimentering", tekst: "Brandcompartimentering per woning"},
        {id: "nutsaansluitingen", tekst: "Nutsaansluitingen splitsen per woning"},
      ],
      min_woninggrootte_m2: 40,
      verhuurbaar_factor: 0.8,
      doorlooptijd_tekst: "Vergunning en onderzoeken samen duren doorgaans 6 tot 12 maanden.",
      teksten: {},
    },

    // =========================================================================
    // E4: KLUSVOLGORDE PLANNER
    // =========================================================================
    klusvolgorde: {
      meta: {
        naam: "Klusvolgorde planner",
        categorie: "zakelijk",
        omschrijving_kort: "Zet je klussen in de juiste volgorde.",
        uitleg: "Selecteer welke werkzaamheden je gaat doen en krijg ze in de juiste, bewezen volgorde met uitleg waarom.",
        trefwoorden: ["klusvolgorde verbouwing", "volgorde renovatie werkzaamheden"],
        volgorde: 28,
        actief: true,
        gerelateerd: ["bouwtijd", "bewoning"],
        whatsapp_tekst: "Hoi, ik heb de klusvolgorde planner ingevuld en wil graag even sparren.",
      },
      stappen: [
        {id: "slopen", label: "Slopen", volgorde: 1, uitleg: "Eerst ruimte maken voordat er iets nieuws wordt aangebracht."},
        {id: "indeling", label: "Indeling wijzigen", volgorde: 2, uitleg: "Nieuwe wanden plaatsen voordat leidingen en bekabeling worden aangelegd."},
        {id: "leidingwerk", label: "Leidingwerk", volgorde: 3, uitleg: "Water- en afvoerleidingen liggen voordat de vloer en wanden dicht gaan."},
        {id: "elektra", label: "Elektra", volgorde: 4, uitleg: "Bekabeling leggen voor de wanden en vloer worden afgewerkt."},
        {id: "vloerverwarming", label: "Vloerverwarming", volgorde: 5, uitleg: "Vloerverwarming leggen voor de dekvloer wordt gestort."},
        {id: "stucwerk", label: "Stucwerk", volgorde: 6, uitleg: "Wanden en plafonds afwerken voordat er geschilderd of getegeld wordt.", waarschuwing: "Stucwerk altijd voor het schilderwerk, anders beschadig je de verse verf."},
        {id: "dekvloer", label: "Dekvloer", volgorde: 7, uitleg: "De dekvloer moet voldoende drogen voordat er tegelwerk op komt."},
        {id: "tegelwerk", label: "Tegelwerk", volgorde: 8, uitleg: "Tegelen na de dekvloer en het grove stucwerk, voor het schilderwerk."},
        {id: "kozijnen", label: "Kozijnen", volgorde: 9, uitleg: "Kozijnen plaatsen voordat de laatste afwerklagen worden aangebracht."},
        {id: "schilderwerk", label: "Schilderwerk", volgorde: 10, uitleg: "Schilderen na al het stof veroorzakende werk, voor de vloer wordt gelegd.", waarschuwing: "Vloer leggen altijd na het stucwerk en schilderwerk, anders werk je je nieuwe vloer kapot."},
        {id: "vloer_leggen", label: "Vloer leggen", volgorde: 11, uitleg: "De vloer als een van de laatste stappen, om beschadiging te voorkomen."},
        {id: "keuken_plaatsen", label: "Keuken plaatsen", volgorde: 12, uitleg: "De keuken erin na de vloer, voor de laatste sanitaire aansluitingen."},
        {id: "sanitair_plaatsen", label: "Sanitair plaatsen", volgorde: 13, uitleg: "Sanitair plaatsen na het tegelwerk en de vloer."},
        {id: "afmontage", label: "Afmontage", volgorde: 14, uitleg: "Stopcontacten, schakelaars, deurkrukken en laatste details als afsluiting."},
      ],
      teksten: {
        tip: "De volgorde fout doen is de duurste beginnersfout, dubbel werk is zo 20% extra kosten.",
      },
    },

    // =========================================================================
    // E5: VERHUUR KLAAR CHECK
    // =========================================================================
    verhuurklaar: {
      meta: {
        naam: "Verhuur klaar check",
        categorie: "zakelijk",
        omschrijving_kort: "Check of je woning voldoet aan de belangrijkste verhuureisen.",
        uitleg: "Voor verhuurders en beleggers: check of je woning voldoet aan de belangrijkste wettelijke en aanbevolen verhuureisen.",
        trefwoorden: ["woning verhuurklaar maken", "verhuureisen woning", "rookmelder verplicht verhuur"],
        volgorde: 29,
        actief: true,
        gerelateerd: ["vve-onderhoud", "transformatie"],
        whatsapp_tekst: "Hoi, ik heb de verhuur klaar check ingevuld en wil graag even sparren.",
      },
      items: [
        {id: "rookmelders", label: "Rookmelders op elke verdieping", verplicht: true, uitleg: "Verplicht sinds 2022 in alle woningen."},
        {id: "cv_gekeurd", label: "CV-ketel gekeurd in de laatste 2 jaar", verplicht: false, uitleg: "Sterk aanbevolen voor veiligheid en garantie."},
        {id: "elektra_gekeurd", label: "Elektra gekeurd (NEN 3140 of recent)", verplicht: false, uitleg: "Sterk aanbevolen, zeker bij een ouder pand."},
        {id: "energielabel", label: "Energielabel aanwezig en C of beter", verplicht: true, uitleg: "Een geldig energielabel is verplicht bij verhuur."},
        {id: "sloten_skg", label: "Sloten met SKG-keurmerk", verplicht: false, uitleg: "Sterk aanbevolen voor inbraakveiligheid en verzekering."},
        {id: "ventilatie", label: "Ventilatie werkend", verplicht: false, uitleg: "Belangrijk voor een gezond binnenklimaat en om schimmel te voorkomen."},
        {id: "geen_open_geiser", label: "Geen open geiser aanwezig", verplicht: true, uitleg: "Een open geiser is een direct veiligheidspunt vanwege koolmonoxide."},
      ],
      teksten: {
        disclaimer: "Wet- en regelgeving verandert. Dit is een hulpmiddel en geen juridisch advies.",
      },
    },
  },

  algemeen: {
    whatsapp_nummer: "31642461987",
    contact_pad: "/contact",
    cta_titel: "Wil je zeker weten wat er bij jouw project komt kijken?",
    cta_tekst: "Neem vrijblijvend contact op.",
    cta_knop_gesprek: "Plan een gesprek",
    cta_knop_whatsapp: "App Therab direct",
  },
};
