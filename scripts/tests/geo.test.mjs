// Snelle eenheidstests voor GEO-hulpfuncties. Draaien: npm run test:geo
// (compileert de TypeScript-bestanden met esbuild naar een tijdelijke map).
import assert from "node:assert/strict";
import {test} from "node:test";

const {stripOutdatedClaims, formatReviewSummary, getReviewSnapshot, BUSINESS} = await import(process.env.GEO_BUSINESS);
const {deriveChannel, detectAiPlatform} = await import(process.env.GEO_LEADS);

test("absolute betaalbeloftes uit het CMS worden geneutraliseerd (keuze B)", () => {
  assert.equal(stripOutdatedClaims("Geen aanbetaling"), "Een vooraf vastgelegd betaalschema");
  assert.equal(stripOutdatedClaims("Geen aanbetaling vooraf"), "Een vooraf vastgelegd betaalschema");
  assert.equal(stripOutdatedClaims("Vaste vakteams, geen aanbetaling en één vast team"), "Vaste vakteams, een vooraf vastgelegd betaalschema en één vast team");
  assert.equal(
    stripOutdatedClaims("We werken met vaste vakteams en zonder aanbetaling, en hebben"),
    "We werken met vaste vakteams en met een vooraf vastgelegd betaalschema, en hebben"
  );
  assert.equal(stripOutdatedClaims("Bij ondertekening betaalt u niets."), "Het betaalschema staat vooraf in de offerte.");
  assert.equal(stripOutdatedClaims("Niets bij ondertekening"), "Het betaalschema staat vooraf in de offerte");
  assert.equal(stripOutdatedClaims("U betaalt per afgeronde fase en nooit vooruit."), "U betaalt per afgeronde fase, volgens het betaalschema in de offerte.");
  assert.equal(
    stripOutdatedClaims("U betaalt nooit voor werk dat nog niet gedaan is."),
    "U betaalt volgens het betaalschema in de offerte, gekoppeld aan de projectfasen."
  );
  // Tekst zonder claim, inclusief alinea-witregels, blijft exact gelijk.
  const plain = "Eerste alinea.\n\nTweede  alinea.";
  assert.equal(stripOutdatedClaims(plain), plain);
  assert.equal(stripOutdatedClaims("De startbetaling is 20%."), "De startbetaling is 20%.");
  // De algemene voorwaarden (art. 8.8) worden niet geraakt.
  const av = "DRO mag op ieder moment gehele of gedeeltelijke vooruitbetaling of zekerheid verlangen.";
  assert.equal(stripOutdatedClaims(av), av);
});

test("betaalvoorwaarden in bedrijfsprofiel volgen keuze B", () => {
  assert.ok(!/niets bij ondertekening|eerste werkdag|geen aanbetaling|nooit vooruit/i.test(BUSINESS.paymentTerms));
  assert.match(BUSINESS.paymentTerms, /betalingsschema vast in de offerte/);
});

test("review-samenvatting in Nederlandse notatie", () => {
  assert.equal(formatReviewSummary(getReviewSnapshot()), `4,8 uit ${BUSINESS.reviews.reviewCount} Google-reviews`);
  assert.equal(getReviewSnapshot({aggregateRatingValue: 4.9, aggregateRatingCount: 300}).reviewCount, 300);
});

test("juridische naam volgt KvK-schrijfwijze", () => {
  assert.equal(BUSINESS.legalName, "DRO Bouw en Aannemingsbedrijf B.V.");
  assert.ok(!/aanbetaling/i.test(BUSINESS.description));
});

test("AI-verkeer wordt als eigen kanaal herkend", () => {
  assert.equal(detectAiPlatform({utm_source: "chatgpt.com"}), "ChatGPT");
  assert.equal(detectAiPlatform({referrer: "www.perplexity.ai"}), "Perplexity");
  assert.equal(detectAiPlatform({referrer: "gemini.google.com"}), "Gemini");
  assert.equal(detectAiPlatform({referrer: "www.google.com"}), null);
  assert.equal(deriveChannel("contact", {utm_source: "chatgpt.com"}).key, "ai-assistent");
  assert.equal(deriveChannel("contact", {referrer: "www.google.com"}).key, "organisch");
  assert.equal(deriveChannel("contact", {gclid: "x"}).key, "google-ads");
});

const {resolveSmartLink} = await import(process.env.GEO_SMARTLINK);

test("placeholder-telefoonnummers worden nooit live gebruikt", () => {
  assert.equal(resolveSmartLink({linkType: "external", externalUrl: "tel:+31600000000"}).href, "tel:+31850871814");
  assert.equal(resolveSmartLink({linkType: "external", externalUrl: "https://wa.me/31600000000"}).href, "https://wa.me/31850871814");
  assert.equal(resolveSmartLink({linkType: "external", externalUrl: "tel:+31850871814"}).href, "tel:+31850871814");
  assert.equal(resolveSmartLink({linkType: "external", externalUrl: "https://example.com"}).href, "https://example.com");
});

const {isIndexableLocationService} = await import(process.env.GEO_BUSINESS);

test("kerndiensten per stad blijven indexeerbaar", () => {
  assert.equal(isIndexableLocationService("uitbouw-aanbouw", []), true);
  assert.equal(isIndexableLocationService("warmtepomp", []), false);
  assert.equal(isIndexableLocationService("warmtepomp", ["warmtepomp"]), true);
});
