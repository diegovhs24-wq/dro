// De zes onzekerheden van een opdrachtgever bij een groot project, met per
// onderwerp wat DRO aantoonbaar doet. Bronnen:
// - BUSINESS (lib/seo/business.ts): betaling, verzekering, erkenningen, team.
// - Rolverdeling en klantbeloftes zoals door Therab bevestigd (oktober 2026):
//   planning en betaalschema bij akkoord, wekelijks vast meetmoment, appvragen
//   binnen 24 uur opgepakt, Jarek technisch verantwoordelijk.
// - De gepubliceerde algemene voorwaarden (versie augustus 2026, /algemene-voorwaarden),
//   die bij elke offerte worden meegestuurd: art. 3.4 (offerte limitatief),
//   art. 5 (meerwerk op nacalculatie, tijdig gemeld), art. 10 (gezamenlijke
//   opname en opleverlijst), art. 12 (12 maanden garantie op eigen werk).
// - Sanity "Geverifieerde claims": meerwerk, garantie, oplevering. Alleen als
//   die daar zijn bevestigd; anders staat er alleen wat al vaststaat.

import {BUSINESS} from "@/lib/seo/business";
import type {VerifiedClaims} from "@/lib/verifiedClaims";

export type AssuranceTopic = {
  key: "planning" | "communicatie" | "meerwerk" | "kwaliteit" | "betaling" | "oplevering";
  topic: string;
  question: string;
  answer: string;
  proof: string;
};

const credentialList = BUSINESS.credentials.map((c) => c.name.replace("-gecertificeerd", "").replace("-erkend", "")).join(", ");

export function buildAssurances(claims: VerifiedClaims = {}): AssuranceTopic[] {
  return [
    {
      key: "planning",
      topic: "Planning",
      question: "Weet ik vooraf wanneer wat gebeurt?",
      answer: "Bij akkoord krijgt u een planning per fase, op papier, voordat het werk begint.",
      proof: "Opgesteld door Therab Raja, die ook de offerte maakt.",
    },
    {
      key: "communicatie",
      topic: "Communicatie",
      question: "Wie spreek ik, en hoe vaak?",
      answer: "Elke week één vast meetmoment voor uw vragen. Vragen via de app worden binnen 24 uur opgepakt.",
      proof: "Vaste rollen: Therab voor de algemene afstemming, Jarek voor techniek, Esra voor betalingen en kwaliteit.",
    },
    {
      key: "meerwerk",
      topic: "Meerwerk",
      question: "Komen er kosten bij die ik niet zag aankomen?",
      answer:
        claims.extraWork?.text ||
        "In de offerte staat precies wat in de prijs zit. Blijkt er tijdens het werk meer nodig, zoals een verborgen gebrek of een extra wens, dan hoort u dat vooraf, waar mogelijk met de prijs erbij.",
      proof: "Algemene voorwaarden, artikel 3.4 en 5: meerwerk wordt verrekend op nacalculatie, na melding aan u.",
    },
    {
      key: "kwaliteit",
      topic: "Bouwkwaliteit",
      question: "Wie voert het werk uit, en hoe is het gecontroleerd?",
      answer: claims.guarantee
        ? `Vaste vakteams onder één hoofd uitvoering. ${claims.guarantee.text.replace(/\.$/, "")}.`
        : "Vaste vakteams onder één hoofd uitvoering. Op ons eigen werk geldt 12 maanden garantie na oplevering, op installaties en producten de fabrieksgarantie.",
      proof: `${credentialList}. ${BUSINESS.insurance.map((i) => i.replace(/ \(.*\)$/, "")).join(" en ")}.`,
    },
    {
      key: "betaling",
      topic: "Betalingen",
      question: "Betaal ik vooruit voor werk dat er nog niet is?",
      answer: "Bij ondertekening betaalt u niets. Op de eerste werkdag 20 tot 25 procent, daarna per afgeronde fase.",
      proof: "Het betaalschema staat in uw offerte, voordat u tekent.",
    },
    {
      key: "oplevering",
      topic: "Oplevering",
      question: "Hoe weet ik dat alles echt af is?",
      answer:
        claims.delivery?.text ||
        "We lopen het werk samen met u na. Restpunten komen op een opleverlijst en worden daarna door ons hersteld.",
      proof: "Algemene voorwaarden, artikel 10. U betaalt per afgeronde fase, dus ook de laatste termijn hoort bij werk dat af is.",
    },
  ];
}
