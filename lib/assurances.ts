// De zes onzekerheden van een opdrachtgever bij een groot project, met per
// onderwerp wat DRO aantoonbaar doet. Bronnen:
// - BUSINESS (lib/seo/business.ts): betaling, verzekering, erkenningen, team.
// - Rolverdeling en klantbeloftes zoals door Therab bevestigd (oktober 2026):
//   planning en betaalschema bij akkoord, wekelijks vast meetmoment, appvragen
//   binnen 24 uur opgepakt, Jarek technisch verantwoordelijk.
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
      answer: claims.extraWork?.text || "Uw offerte is per onderdeel uitgesplitst, zodat u vooraf ziet wat erin zit en wat niet.",
      proof: claims.extraWork ? "Staat zo in elke opdracht." : "Twijfelt u over een post, vraag het bij de bezichtiging; dan staat het antwoord in de offerte.",
    },
    {
      key: "kwaliteit",
      topic: "Bouwkwaliteit",
      question: "Wie voert het werk uit, en hoe is het gecontroleerd?",
      answer: claims.guarantee
        ? `Vaste vakteams onder één hoofd uitvoering. ${claims.guarantee.text.replace(/\.$/, "")}.`
        : "Vaste vakteams onder één hoofd uitvoering, die ook het technische aanspreekpunt voor u is.",
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
      answer: claims.delivery?.text || "Voor de oplevering lopen we het werk samen met u na.",
      proof: "U betaalt per afgeronde fase, dus ook de laatste termijn hoort bij werk dat af is.",
    },
  ];
}
