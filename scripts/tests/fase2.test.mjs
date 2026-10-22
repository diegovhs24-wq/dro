// Eenheidstests fase 2: casestudy-toestemming, geverifieerde claims,
// budgetklasse, meetdata zonder persoonsgegevens en routeteksten.
// Draaien: npm run test:fase2
import assert from "node:assert/strict";
import {test} from "node:test";

const {toPublicCaseStudy, caseStudyFacts} = await import(process.env.F2_CASE);
const {pickVerifiedClaims} = await import(process.env.F2_CLAIMS);
const {budgetTier} = await import(process.env.F2_LEADS);
const {sanitizeFunnelParams} = await import(process.env.F2_ANALYTICS);
const routes = await import(process.env.F2_ROUTES);
const {hasOutdatedClaim} = await import(process.env.F2_BUSINESS);

const fullCase = {
  published: true,
  consentDate: "2026-10-01",
  routes: ["grote-renovatie", "onzin"],
  clientGoal: "Open leefkeuken en alles verduurzaamd.",
  scope: ["Sloop tot casco", "Draagmuur eruit met staal"],
  afterImages: ["https://cdn.sanity.io/a.jpg"],
  areaM2: 140,
  durationWeeks: 14,
  budgetBand: "100-150k",
  budgetBandConsent: false,
  quote: "Top gedaan.",
  quoteConsent: false,
};

test("casestudy zonder vinkje of toestemmingsdatum blijft verborgen", () => {
  assert.equal(toPublicCaseStudy({...fullCase, published: false}), null);
  assert.equal(toPublicCaseStudy({...fullCase, consentDate: undefined}), null);
  assert.equal(toPublicCaseStudy({...fullCase, consentDate: "gisteren"}), null);
  assert.equal(toPublicCaseStudy(null), null);
});

test("casestudy zonder minimale inhoud blijft verborgen", () => {
  assert.equal(toPublicCaseStudy({...fullCase, scope: []}), null);
  assert.equal(toPublicCaseStudy({...fullCase, afterImages: []}), null);
  assert.equal(toPublicCaseStudy({...fullCase, clientGoal: "  "}), null);
});

test("budgetband en citaat alleen met eigen toestemming", () => {
  const hidden = toPublicCaseStudy(fullCase);
  assert.equal(hidden.budgetBand, undefined);
  assert.equal(hidden.quote, undefined);
  assert.deepEqual(hidden.routes, ["grote-renovatie"]);
  const shown = toPublicCaseStudy({...fullCase, budgetBandConsent: true, quoteConsent: true, quoteAuthor: "Familie V."});
  assert.equal(shown.budgetBand, "€ 100.000 tot € 150.000");
  assert.deepEqual(shown.quote, {text: "Top gedaan.", author: "Familie V."});
  const facts = caseStudyFacts(shown, "Den Haag").map((f) => f.label);
  assert.deepEqual(facts, ["Locatie", "Oppervlakte", "Uitvoering", "Budget"]);
});

test("onbekende budgetband of onzinnige getallen worden weggelaten", () => {
  const cs = toPublicCaseStudy({...fullCase, budgetBandConsent: true, budgetBand: "1-miljoen", areaM2: -5, durationWeeks: 9999});
  assert.equal(cs.budgetBand, undefined);
  assert.equal(cs.areaM2, undefined);
  assert.equal(cs.durationWeeks, undefined);
});

test("claims verschijnen alleen bevestigd, met naam en datum", () => {
  assert.deepEqual(pickVerifiedClaims(null), {});
  assert.deepEqual(pickVerifiedClaims({guarantee: {text: "5 jaar garantie", verified: false, verifiedBy: "Therab", verifiedAt: "2026-10-22"}}), {});
  assert.deepEqual(pickVerifiedClaims({guarantee: {text: "5 jaar garantie", verified: true, verifiedAt: "2026-10-22"}}), {});
  assert.deepEqual(pickVerifiedClaims({guarantee: {text: "5 jaar garantie", verified: true, verifiedBy: "Therab"}}), {});
  const ok = pickVerifiedClaims({
    guarantee: {text: "5 jaar garantie", verified: true, verifiedBy: "Therab", verifiedAt: "2026-10-22"},
    trustoo: {score: "9.8", count: 520, asOf: "2026-10-20", url: "javascript:alert(1)", verified: true, verifiedBy: "Therab", verifiedAt: "2026-10-22"},
  });
  assert.equal(ok.guarantee.text, "5 jaar garantie");
  assert.equal(ok.trustoo.score, "9,8");
  assert.equal(ok.trustoo.url, undefined);
  assert.deepEqual(
    pickVerifiedClaims({trustoo: {score: "veel", count: 520, asOf: "2026-10-20", verified: true, verifiedBy: "T", verifiedAt: "2026-10-22"}}),
    {}
  );
});

test("budgetklasse op basis van de bovengrens", () => {
  assert.equal(budgetTier({budgetMax: 20000}).key, "tot-25k");
  assert.equal(budgetTier({budgetMax: 45000}).key, "25k-50k");
  assert.equal(budgetTier({budgetMax: 50000}).key, "50k-100k");
  assert.equal(budgetTier({budgetMax: 150000}).key, "100k-250k");
  assert.equal(budgetTier({budgetMax: 250000}).key, "250k-plus");
  assert.equal(budgetTier({budgetLabel: "Weet ik nog niet", budgetMax: 90000}).key, "onbekend");
  assert.equal(budgetTier({budgetLabel: "Past bij indicatie € 8.950 incl. btw"}).key, "tot-25k");
  assert.equal(budgetTier({}).key, "onbekend");
});

test("meetdata bevat nooit persoonsgegevens", () => {
  const clean = sanitizeFunnelParams({
    route: "grote-renovatie",
    email: "a@b.nl",
    phone: "0612345678",
    note: "bel 0612345678",
    cta: "hero_intake",
    lead_id: "submission-abc",
    step_index: 3,
  });
  assert.deepEqual(clean, {route: "grote-renovatie", cta: "hero_intake", lead_id: "submission-abc", step_index: 3});
});

test("routeteksten bevatten geen verouderde of onbevestigde claims", () => {
  const banned = /garantie|binnen \d+ werkuur|binnen 1 uur|trustoo|top pro|nummer 1|beste|goedkoopst|vaste prijs vooraf|geen aanbetaling/i;
  for (const route of routes.CONVERSION_ROUTES) {
    const text = JSON.stringify(route, (k, v) => (v instanceof RegExp ? undefined : v));
    assert.ok(!hasOutdatedClaim(text), `${route.key}: verouderde betaalclaim`);
    assert.ok(!banned.test(text), `${route.key}: onbevestigde claim: ${text.match(banned)?.[0]}`);
    assert.ok(!/—/.test(text), `${route.key}: em-dash`);
    assert.ok(route.faq.length >= 4);
  }
});

test("prijsrekenvoorbeeld volgt de bevestigde m²-prijs", () => {
  assert.deepEqual(routes.renovationEstimate(120), {min: 120000, max: 150000});
  assert.equal(routes.durationInWeeks("14 weken"), 14);
  assert.equal(routes.durationInWeeks("3 maanden "), 13);
  assert.equal(routes.durationInWeeks("2.5 weken"), 2.5);
  assert.equal(routes.durationInWeeks("3 dagen"), undefined);
  assert.equal(routes.routeFromSource("route-specialistisch"), "specialistisch");
  assert.equal(routes.routeFromSource("lp-draagmuur"), undefined);
});

const {buildAssurances} = await import(process.env.F2_ASSURANCES);
const cats = await import(process.env.F2_CATS);
const home = await import(process.env.F2_HOME);

const BANNED = /garantie|vaste prijs|100\+|\bbeste\b|nummer 1|binnen \d+ werkuur|binnen 1 uur|trustoo|geen aanbetaling|opstartlocaties|—/i;

test("zes zekerheden: alle onderwerpen, zonder onbevestigde claims", () => {
  const items = buildAssurances({});
  assert.deepEqual(items.map((i) => i.key), ["planning", "communicatie", "meerwerk", "kwaliteit", "betaling", "oplevering"]);
  const text = JSON.stringify(items);
  assert.ok(!BANNED.test(text), `onbevestigd: ${text.match(BANNED)?.[0]}`);
  assert.match(text, /binnen 24 uur opgepakt/);
  assert.match(text, /niets/i);
});

test("zekerheden gebruiken bevestigde claims uit Sanity als ze er zijn", () => {
  const items = buildAssurances({extraWork: {text: "Meerwerk pas na schriftelijk akkoord."}, guarantee: {text: "5 jaar garantie op constructief werk"}, delivery: {text: "Samen nalopen, punten binnen 2 weken opgelost."}});
  const byKey = Object.fromEntries(items.map((i) => [i.key, i]));
  assert.equal(byKey.meerwerk.answer, "Meerwerk pas na schriftelijk akkoord.");
  assert.match(byKey.kwaliteit.answer, /5 jaar garantie op constructief werk\.$/);
  assert.equal(byKey.oplevering.answer, "Samen nalopen, punten binnen 2 weken opgelost.");
});

test("homepage- en totaalrenovatieteksten bevatten geen onbevestigde claims", () => {
  const text = JSON.stringify({d: home.HOME_DESCRIPTION, f: home.HOME_FAQ, t: home.HOME_TITLE}) +
    JSON.stringify(routes.TOTAALRENOVATIE, (k, v) => (v instanceof RegExp ? undefined : v));
  assert.ok(!BANNED.test(text), `onbevestigd: ${text.match(BANNED)?.[0]}`);
});

test("projectindeling op type, ook met rommelige invoer", () => {
  assert.equal(cats.projectCategory({type: "Totaalrenovatie "}), "groot");
  assert.equal(cats.projectCategory({type: "Totaalrenovatie & dakopbouw"}), "groot");
  assert.equal(cats.projectCategory({type: "Aanbouw "}), "groot");
  assert.equal(cats.projectCategory({type: "Badkamer- en toiletrenovatie"}), "badkamer");
  assert.equal(cats.projectCategory({type: "Draagmuur verwijderen"}), "constructief");
  assert.equal(cats.projectCategory({type: "Vloerverwarming"}), "overig");
  assert.equal(cats.uniqueProjects([{slug: "a"}, {slug: "b"}, {slug: "a"}]).length, 2);
  const sorted = cats.sortForPortfolio([
    {slug: "bad", type: "Badkamer", images: []},
    {slug: "tot", type: "Totaalrenovatie", images: []},
    {slug: "cs", type: "Badkamer", images: [], caseStudy: {afterImages: ["x"]}},
  ]);
  assert.deepEqual(sorted.map((p) => p.slug), ["cs", "tot", "bad"]);
  assert.equal(cats.cleanTitle("Van der Sluijsplantsoen , Den Haag "), "Van der Sluijsplantsoen, Den Haag");
});
