// Twee conversieroutes, elk met een eigen pagina, intake-instelling en meting:
//
// 1. Grote renovaties (totaalrenovatie, uitbouw, dakopbouw) voor budgetten
//    vanaf € 50.000 tot € 250.000 en meer.
// 2. Constructieve en specialistische werken (draagmuur, doorbraak, stalen
//    ligger, bouwkundige keuring): kortere trajecten met hoge marge.
//
// Regels voor de teksten hieronder:
// - Alleen feiten uit `BUSINESS` (lib/seo/business.ts) of algemeen geldende
//   uitleg. Geen garantie, reactietijd of reviewcijfers van andere platforms:
//   die komen uit Sanity en verschijnen pas als ze daar zijn bevestigd.
// - Geen superlatieven, geen nepschaarste.

import {BUSINESS} from "@/lib/seo/business";
import type {CaseStudyRoute} from "@/lib/caseStudy";

export type ConversionRouteKey = CaseStudyRoute;

export const CONVERSION_ROUTE_LABELS: Record<ConversionRouteKey, string> = {
  "grote-renovatie": "Grote renovatie",
  specialistisch: "Constructief en specialistisch",
};

export const ROUTE_SOURCES: Record<ConversionRouteKey, "route-grote-renovatie" | "route-specialistisch"> = {
  "grote-renovatie": "route-grote-renovatie",
  specialistisch: "route-specialistisch",
};

export function routeFromSource(source: string): ConversionRouteKey | undefined {
  if (source === ROUTE_SOURCES["grote-renovatie"]) return "grote-renovatie";
  if (source === ROUTE_SOURCES.specialistisch) return "specialistisch";
  return undefined;
}

export function isConversionRoute(value: unknown): value is ConversionRouteKey {
  return value === "grote-renovatie" || value === "specialistisch";
}

export type RouteCard = {title: string; text: string; href?: string; linkLabel?: string};
export type RouteFaq = {q: string; a: string};
export type RouteStep = {title: string; text: string};

export type ConversionRouteConfig = {
  key: ConversionRouteKey;
  path: string;
  // Naam in kruimelpad en sitemap.
  crumbLabel: string;
  // Rekenhulp m²-prijs tonen (alleen waar de bevestigde m²-prijs van toepassing is).
  estimator: boolean;
  // Voorkeursproject voor de hero (eindbeeld), zodat pagina's niet dezelfde foto openen.
  heroSlug?: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  primaryCta: string;
  serviceName: string;
  serviceType: string;
  audience: {title: string; intro: string; cards: RouteCard[]};
  scope: {title: string; intro: string; cards: RouteCard[]};
  pricing: {title: string; intro: string; note: string};
  steps: {title: string; intro: string; items: RouteStep[]};
  faq: RouteFaq[];
  projectTypeMatch: RegExp;
  intake: {
    title: string;
    intro: string;
    serviceOrder: string[];
    servicesTitle: string;
    servicesSub: string;
    initialBudget: [number, number];
    largeBudget?: [number, number];
    budgetScaleMax: number;
    budgetStep: number;
  };
  otherRoute: {title: string; text: string; href: string; label: string};
};

const PAYMENT_FAQ: RouteFaq = {
  q: "Hoe werkt de betaling?",
  a: "Bij het ondertekenen van de opdracht betaalt u niets. Op de eerste werkdag volgt een startbetaling van 20 tot 25 procent. Daarna betaalt u per afgeronde fase. Het aantal fases en de bedragen staan in uw offerte, voordat u tekent.",
};

const INSURANCE_TEXT = `${BUSINESS.insurance.join(" en ")}. Schade tijdens de bouw is daarmee verzekerd.`;

export const ROUTE_TRUST = {
  insurance: INSURANCE_TEXT,
  insuranceShort: "CAR- en aansprakelijkheidsverzekering. Schade tijdens de bouw is verzekerd.",
  credentials: BUSINESS.credentials.map((c) => c.name),
  payment: BUSINESS.paymentTerms,
};

export const GROTE_RENOVATIE: ConversionRouteConfig = {
  key: "grote-renovatie",
  path: "/grote-renovaties",
  crumbLabel: "Grote renovaties",
  estimator: true,
  heroSlug: "amersfoort",
  metaTitle: "Grote renovaties van € 50.000 tot € 250.000+ | DRO Renovaties",
  metaDescription:
    "Totaalrenovatie, uitbouw of dakopbouw in Den Haag en de Randstad. Eén aannemer van sloop tot oplevering, vaste vakteams, niets betalen bij ondertekening. Start uw projectintake.",
  eyebrow: "Totaalrenovatie, uitbouw en dakopbouw",
  title: "Grote renovaties onder één regie",
  intro:
    "Voor woningen waar alles tegelijk moet gebeuren: indeling, installaties, isolatie en afwerking. Van € 50.000 tot € 250.000 en meer. Eén aannemer van sloop tot oplevering, met vaste vakteams en vaste aanspreekpunten voor planning en techniek.",
  primaryCta: "Start uw projectintake",
  serviceName: "Grote renovaties: totaalrenovatie, uitbouw en dakopbouw",
  serviceType: "Totaalrenovatie",
  audience: {
    title: "Voor wie deze route is",
    intro: "Een project van deze omvang vraagt om één partij die het geheel overziet. Herkent u zich in een van deze situaties, dan is deze intake voor u.",
    cards: [
      {
        title: "U heeft net een woning gekocht",
        text: "U wilt de renovatie klaar hebben voordat u erin trekt. Een bouwkundige keuring vooraf geeft budgetzekerheid; het rapport kost € 399 en is kosteloos als wij de renovatie uitvoeren.",
      },
      {
        title: "U wilt meer ruimte zonder te verhuizen",
        text: "Een uitbouw aan de achterkant of een dakopbouw, vaak gecombineerd met een nieuwe indeling van de begane grond.",
      },
      {
        title: "U wilt het in één keer goed doen",
        text: "Installaties, isolatie, keuken, badkamer en afwerking in één traject, met één planning, in plaats van losse partijen die u zelf op elkaar afstemt.",
      },
    ],
  },
  scope: {
    title: "Wat er onder deze route valt",
    intro: "Wij voeren het werk uit met eigen vakteams en vaste partners, zoals constructeurs en architecten, en houden de regie over het geheel.",
    cards: [
      {title: "Totaalrenovatie", text: "Van sloop tot casco tot de laatste afwerking, inclusief installaties.", href: "/totaalrenovatie", linkLabel: "Over totaalrenovatie"},
      {title: "Uitbouw en aanbouw", text: "Extra woonruimte aan de achter- of zijkant, met fundering, constructie en aansluiting op de bestaande woning.", href: "/uitbouw-aanbouw", linkLabel: "Over uitbouw en aanbouw"},
      {title: "Dakopbouw", text: "Een extra verdieping of een volwaardige zolder, met constructieberekening en vergunningstraject.", href: "/projecten/dakopbouw-zoetermeer", linkLabel: "Bekijk een dakopbouw"},
      {title: "Constructieve aanpassingen", text: "Draagmuren eruit, stalen liggers, grotere openingen. Vaak onderdeel van een totaalrenovatie.", href: "/constructieve-werken", linkLabel: "Over constructief werk"},
    ],
  },
  pricing: {
    title: "Wat een grote renovatie kost",
    intro:
      "Voor een totaalrenovatie rekenen we als indicatie € 1.000 tot € 1.250 per m², exclusief btw. Met de rekenhulp ziet u wat dat betekent voor uw woning, inclusief het betaalschema.",
    note: "Indicatie exclusief btw. De staat van de woning, installaties, constructieve wijzigingen en het afwerkingsniveau bepalen waar u uitkomt. Een uitbouw of dakopbouw prijzen we altijd na een opname, omdat fundering en constructie per woning verschillen.",
  },
  steps: {
    title: "Zo verloopt het",
    intro: "Elke stap staat vooraf op papier, voordat u iets tekent.",
    items: [
      {title: "Kennismaking", text: "We bespreken uw plannen, budget en planning telefonisch of via WhatsApp en plannen een bezichtiging."},
      {title: "Bezichtiging en offerte op maat", text: "We komen langs, nemen de woning op en maken een offerte per onderdeel, zodat u ziet waar uw budget naartoe gaat."},
      {title: "Planning en betaalschema", text: "Bij akkoord krijgt u een planning en een betaalschema per fase. Bij ondertekening betaalt u niets."},
      // Klantbeloftes bevestigd door Therab (rolverdeling DRO, oktober 2026).
      {title: "Uitvoering", text: "Onze vaste vakteams voeren het werk uit. Elke week is er één vast meetmoment voor uw vragen, en vragen via de app worden binnen 24 uur opgepakt."},
      {title: "Samen nalopen en opleveren", text: "We lopen het werk met u na voordat we opleveren."},
    ],
  },
  faq: [
    {
      q: "Wat kost een totaalrenovatie per m²?",
      a: "Als indicatie € 1.000 tot € 1.250 per m², exclusief btw. Voor een woning van 120 m² is dat ongeveer € 120.000 tot € 150.000 exclusief btw. De staat van de woning, de installaties en uw afwerkingswensen bepalen waar u uitkomt. Na een bezichtiging krijgt u een offerte op maat.",
    },
    PAYMENT_FAQ,
    {
      q: "Heb ik een vergunning nodig?",
      a: "Voor een renovatie binnen de bestaande woning meestal niet. Bij een uitbouw, dakopbouw, wijzigingen aan de gevel of bij een monument vaak wel. We werken met vaste constructeurs en architecten en zoeken dit voor u uit.",
    },
    {
      q: "Kan ik tijdens de renovatie in de woning blijven?",
      a: "Bij een totaalrenovatie is dat meestal niet praktisch. We bespreken het bij de bezichtiging en stemmen de planning af op uw situatie, bijvoorbeeld op de datum waarop u de sleutel krijgt.",
    },
    {
      q: "Net een woning gekocht: waar begin ik?",
      a: "Met een bouwkundige keuring. Dan weet u wat er aan de woning moet gebeuren voordat u een budget vastlegt. Het rapport kost € 399 en is kosteloos als wij daarna de renovatie uitvoeren.",
    },
    {
      q: "In welke regio werken jullie?",
      a: "Vanuit Den Haag in Haaglanden, de rest van Zuid-Holland en de Randstad. Voor grote projecten kijken we ook verder; vraag het gerust.",
    },
  ],
  projectTypeMatch: /totaal|dakopbouw|aanbouw|uitbouw|opbouw/i,
  intake: {
    title: "Start uw projectintake",
    intro: "In een paar minuten weten wij wat u wilt, waar de woning staat en welk budget u voor ogen heeft. Daarna belt een vaste adviseur u terug.",
    serviceOrder: ["Totaalrenovatie", "Aanbouw of opbouw", "Badkamer", "Keuken", "Draagmuur verwijderen"],
    servicesTitle: "Wat wilt u laten doen?",
    servicesSub: "Kies alles wat bij uw project hoort. We stellen daarna alleen de vragen die erbij horen.",
    initialBudget: [50000, 100000],
    largeBudget: [75000, 150000],
    budgetScaleMax: 250000,
    budgetStep: 10000,
  },
  otherRoute: {
    title: "Alleen een draagmuur of doorbraak?",
    text: "Voor constructief werk zonder volledige renovatie hebben we een kortere intake met direct een prijsindicatie.",
    href: "/constructieve-werken",
    label: "Naar constructieve werken",
  },
};

export const SPECIALISTISCH: ConversionRouteConfig = {
  key: "specialistisch",
  path: "/constructieve-werken",
  crumbLabel: "Constructieve werken",
  estimator: false,
  metaTitle: "Draagmuur verwijderen en constructieve verbouwingen | DRO Renovaties",
  metaDescription:
    "Dragende muur verwijderen, doorbraak of stalen ligger in Den Haag en omgeving. Met constructieberekening, CAR-verzekerd en direct een prijsindicatie in de intake.",
  eyebrow: "Draagmuur, doorbraak en staalconstructie",
  title: "Draagmuur eruit, berekend en verzekerd",
  intro:
    "Een dragende muur eruit, een brede doorbraak naar de tuin of een stalen ligger voor een open keuken. Werk aan de constructie van uw woning doen we op basis van een constructieberekening, met vaste vakteams en een CAR-verzekering.",
  primaryCta: "Bereken uw prijsindicatie",
  serviceName: "Dragende muur verwijderen en constructieve verbouwingen",
  serviceType: "Constructieve verbouwing",
  audience: {
    title: "Wanneer u deze route kiest",
    intro: "Constructief werk is vaak het begin van een grotere wens: meer licht, een open keuken, een andere indeling.",
    cards: [
      {title: "Een open keuken of woonkamer", text: "De muur tussen keuken en kamer moet eruit, en die blijkt dragend."},
      {title: "Een bredere opening", text: "Een doorgang vergroten of een deuropening maken in een dragende muur."},
      {title: "Zekerheid vóór de aankoop", text: "U wilt weten of een verbouwing constructief kan, voordat u een bod doet. Een bouwkundige keuring kost € 399."},
    ],
  },
  scope: {
    title: "Wat we uitvoeren",
    intro: "Van de eerste opname tot een afgewerkte opening, zonder losse partijen.",
    cards: [
      {title: "Draagmuur verwijderen", text: "Helemaal of deels, met een stalen of houten ligger op basis van de constructieberekening."},
      {title: "Deuropening in een draagmuur", text: "Een nieuwe doorgang met de juiste overspanning en oplegging."},
      {title: "Doorbraak en stalen liggers", text: "Bredere openingen, ook naar een aanbouw of serre."},
      {title: "Bouwkundige keuring", text: "Rapport van de staat van de woning, € 399, kosteloos als wij de renovatie uitvoeren."},
    ],
  },
  pricing: {
    title: "Wat het kost",
    intro:
      "De prijs hangt af van de breedte van de opening, de dikte van de muur, de verdieping en of de ligger brandwerend bekleed moet worden. In de intake hieronder ziet u direct een prijsindicatie op basis van uw maten.",
    note: "De indicatie in de intake is een eerste schatting. Na de opname en de constructieberekening ontvangt u een offerte met een vaste prijs per onderdeel.",
  },
  steps: {
    title: "Zo verloopt het",
    intro: "Constructief werk vraagt om een vaste volgorde. Die slaan we niet over.",
    items: [
      {title: "Opname", text: "We meten de muur en de situatie eromheen in en bekijken waar de krachten naartoe gaan."},
      {title: "Constructieberekening", text: "Een constructeur bepaalt het profiel van de ligger en de opleggingen."},
      {title: "Vergunning of melding", text: "We zoeken uit wat in uw gemeente en voor uw woning nodig is, en regelen de aanvraag voor u."},
      // Doorlooptijd bevestigd door Therab: uitvoering 1 tot 3 dagen.
      {title: "Uitvoering", text: "Tijdelijk ondersteunen, de muur verwijderen, de ligger plaatsen en de opening afwerken. Dit duurt meestal 1 tot 3 dagen."},
      {title: "Oplevering", text: "We lopen het werk met u na voordat we opleveren."},
    ],
  },
  faq: [
    {
      q: "Hoe weet ik of een muur dragend is?",
      a: "Een dragende muur is vaak 17,5 cm of dikker, klinkt massief en loopt door tot het plafond. Zeker weten doet u het pas na een opname, eventueel met de bouwtekeningen uit het gemeentearchief. Die vragen wij voor u op als u ze niet heeft.",
    },
    {
      q: "Heb ik een vergunning nodig om een draagmuur te verwijderen?",
      a: "Dat hangt af van de woning, de gemeente en of het een monument is. Ook als er geen vergunning nodig is, moet de nieuwe constructie veilig zijn; daarom werken we altijd met een constructieberekening. Wij zoeken voor u uit wat er nodig is.",
    },
    {
      q: "Wat kost het verwijderen van een draagmuur?",
      a: "Dat hangt af van de breedte, de dikte van de muur, de verdieping en de afwerking. In de intake op deze pagina ziet u direct een prijsindicatie op basis van uw maten. Na de opname krijgt u een offerte.",
    },
    {
      q: "Hoe lang duurt het verwijderen van een draagmuur?",
      a: "De uitvoering zelf duurt meestal 1 tot 3 dagen. Daarvoor komen de opname, de constructieberekening en zo nodig de vergunning. Die volgorde slaan we niet over.",
    },
    {
      q: "Wat als er tijdens het werk schade ontstaat?",
      a: INSURANCE_TEXT,
    },
    PAYMENT_FAQ,
  ],
  projectTypeMatch: /draagmuur|doorbraak|constructie|staal/i,
  intake: {
    title: "Bereken uw prijsindicatie",
    intro: "Kies wat u wilt laten doen. Bij een draagmuur ziet u na het invullen van de maten direct een indicatie.",
    serviceOrder: ["Draagmuur verwijderen", "Aanbouw of opbouw", "Bouwkundige keuring", "Totaalrenovatie"],
    servicesTitle: "Wat wilt u laten doen?",
    servicesSub: "Kies één of meer onderdelen. Daarna stellen we alleen de vragen die erbij horen.",
    initialBudget: [10000, 30000],
    largeBudget: [50000, 100000],
    budgetScaleMax: 150000,
    budgetStep: 5000,
  },
  otherRoute: {
    title: "Onderdeel van een grotere verbouwing?",
    text: "Gaat de draagmuur eruit als onderdeel van een totaalrenovatie of uitbouw, dan past de route voor grote renovaties beter.",
    href: "/grote-renovaties",
    label: "Naar grote renovaties",
  },
};

// Inhoudelijke dienstpagina totaalrenovatie: zelfde opbouw, eigen zoekintentie
// (kosten, duur, fases). Leads tellen mee in de route "grote renovatie".
export const TOTAALRENOVATIE: ConversionRouteConfig = {
  key: "grote-renovatie",
  path: "/totaalrenovatie",
  crumbLabel: "Totaalrenovatie",
  estimator: true,
  heroSlug: "essehout-zoetermeer",
  metaTitle: "Totaalrenovatie woning: kosten, duur en aanpak | DRO Renovaties",
  metaDescription:
    "Wat kost een totaalrenovatie, hoe lang duurt het en hoe verloopt het? Indicatie € 1.000 tot € 1.250 per m² excl. btw, fases en betaalschema. Familiebedrijf uit Den Haag.",
  eyebrow: "Totaalrenovatie",
  title: "Totaalrenovatie van uw woning",
  intro:
    "Uw woning in één traject vernieuwd: sloop, installaties, indeling, keuken, badkamer en afwerking. Met één planning, één betaalschema en vaste aanspreekpunten van bezichtiging tot oplevering.",
  primaryCta: "Bespreek uw renovatie",
  serviceName: "Totaalrenovatie van woningen",
  serviceType: "Totaalrenovatie",
  audience: {
    title: "Wanneer een totaalrenovatie past",
    intro: "Een totaalrenovatie is meer dan losse klussen bij elkaar: alles wordt in de juiste volgorde gedaan, zodat niets twee keer hoeft.",
    cards: [
      {title: "Net gekocht", text: "U wilt de woning klaar hebben voordat u erin trekt. Begin met een bouwkundige keuring: € 399 voor het rapport, kosteloos als wij de renovatie uitvoeren."},
      {title: "Verouderd van binnen", text: "Leidingen, elektra, keuken en badkamer zijn aan vervanging toe. Dan is het logisch om de indeling in hetzelfde traject aan te pakken."},
      {title: "Zakelijk bezit", text: "Voor beleggers en vastgoedpartijen: projectmatig uitvoeren, met dezelfde vaste aanspreekpunten."},
    ],
  },
  scope: {
    title: "Wat erin zit",
    intro: "Wij voeren het werk uit met eigen vakteams en vaste partners, zoals constructeurs en architecten.",
    cards: [
      {title: "Sloop en voorbereiding", text: "Vloeren, keuken, badkamer en niet-dragende wanden eruit, afvoer geregeld."},
      {title: "Installaties", text: "Leidingwerk, elektra en technische installaties vernieuwd waar nodig."},
      {title: "Constructie en indeling", text: "Wanden, kozijnen, isolatie en zo nodig een draagmuur eruit.", href: "/constructieve-werken", linkLabel: "Over constructief werk"},
      {title: "Afbouw en afwerking", text: "Stucwerk, tegelwerk, plafonds, schilderwerk, vloeren, keuken en badkamer."},
    ],
  },
  pricing: {
    title: "Wat kost een totaalrenovatie?",
    intro: "Als indicatie € 1.000 tot € 1.250 per m², exclusief btw. Met de rekenhulp ziet u de bandbreedte voor uw woning, en ernaast wat de prijs hoger of lager maakt.",
    note: "De rekenhulp is een indicatie. Uw prijs volgt na een bezichtiging, uitgesplitst per onderdeel.",
  },
  steps: {
    title: "Zo verloopt een totaalrenovatie",
    intro: "Elke fase bouwt voort op de vorige. Daarom staat de volgorde vooraf vast, net als het betaalschema.",
    items: [
      {title: "Sloop en voorbereiding", text: "Oude onderdelen eruit en afgevoerd, zodat de basis zichtbaar is."},
      {title: "Installaties", text: "Leidingwerk, elektra en technische installaties, voordat er wordt dichtgemaakt."},
      {title: "Constructie en indeling", text: "Wanden, kozijnen, isolatie en eventuele constructieve aanpassingen."},
      {title: "Afbouw", text: "Stucwerk, tegelwerk, plafonds, schilderwerk en vloeren."},
      {title: "Keuken, badkamer en oplevering", text: "Plaatsen en afwerken, daarna lopen we het werk samen met u na."},
    ],
  },
  faq: [
    {
      q: "Wat kost een totaalrenovatie per m²?",
      a: "Als indicatie € 1.000 tot € 1.250 per m², exclusief btw. Voor een woning van 100 m² is dat ongeveer € 100.000 tot € 125.000 exclusief btw. De staat van de woning, installaties, constructieve wijzigingen en het afwerkingsniveau bepalen waar u uitkomt.",
    },
    {
      q: "Hoe lang duurt een totaalrenovatie?",
      a: "Dat hangt af van de grootte en staat van de woning en van de werkzaamheden. Voor de uitvoering komt er voorbereidingstijd bij voor tekeningen, eventuele vergunningen en levertijden van bijvoorbeeld keuken en kozijnen. Na de bezichtiging krijgt u een planning per fase.",
    },
    PAYMENT_FAQ,
    {
      q: "Kan ik tijdens de renovatie in de woning blijven?",
      a: "Bij een volledige totaalrenovatie is dat meestal niet praktisch: badkamer, keuken en installaties zijn tijdelijk buiten gebruik. Soms kan het in fases. We bespreken het bij de bezichtiging.",
    },
    {
      q: "Heb ik een vergunning nodig?",
      a: "Voor een renovatie binnen de bestaande woning meestal niet. Bij wijzigingen aan de constructie, de gevel of bij een monument soms wel. We werken met vaste constructeurs en architecten en zoeken dit voor u uit.",
    },
    {
      q: "Net een woning gekocht: waar begin ik?",
      a: "Met een bouwkundige keuring. Het rapport kost € 399 en is kosteloos als wij daarna de renovatie uitvoeren.",
    },
  ],
  projectTypeMatch: /totaal/i,
  intake: {
    title: "Bespreek uw renovatie",
    intro: "Een paar vragen over uw woning, planning en budget. Daarna belt een vaste adviseur u terug.",
    serviceOrder: ["Totaalrenovatie", "Aanbouw of opbouw", "Badkamer", "Keuken", "Draagmuur verwijderen"],
    servicesTitle: "Wat wilt u laten doen?",
    servicesSub: "Kies alles wat bij uw project hoort.",
    initialBudget: [75000, 150000],
    largeBudget: [75000, 150000],
    budgetScaleMax: 250000,
    budgetStep: 5000,
  },
  otherRoute: {
    title: "Ook uitbouwen of een dakopbouw?",
    text: "Combineert u de renovatie met extra ruimte, dan helpt de route voor grote renovaties u verder.",
    href: "/grote-renovaties",
    label: "Naar grote renovaties",
  },
};

export const CONVERSION_ROUTES: ConversionRouteConfig[] = [GROTE_RENOVATIE, SPECIALISTISCH];

// Rekenvoorbeelden voor de prijstabel (excl. btw), uit de bevestigde m²-prijs.
export const RENOVATION_PRICE_PER_M2 = {min: 1000, max: 1250} as const;
export const RENOVATION_EXAMPLE_SIZES = [80, 120, 160, 200] as const;

export function renovationEstimate(m2: number): {min: number; max: number} {
  return {min: m2 * RENOVATION_PRICE_PER_M2.min, max: m2 * RENOVATION_PRICE_PER_M2.max};
}

// "8 weken", "3 maanden ", "2.5 weken" → weken. Onbekend formaat → undefined.
export function durationInWeeks(duration: string): number | undefined {
  const m = (duration || "").trim().toLowerCase().match(/^(\d+(?:[.,]\d+)?)\s*(week|weken|maand|maanden)$/);
  if (!m) return undefined;
  const n = Number(m[1].replace(",", "."));
  return m[2].startsWith("maand") ? Math.round(n * 4.33) : n;
}
