// Snelle eenheidstests voor GEO-hulpfuncties. Draaien: npm run test:geo
// (compileert de TypeScript-bestanden met esbuild naar een tijdelijke map).
import assert from "node:assert/strict";
import {test} from "node:test";

const {stripOutdatedClaims, formatReviewSummary, getReviewSnapshot, BUSINESS} = await import(process.env.GEO_BUSINESS);
const {deriveChannel, detectAiPlatform} = await import(process.env.GEO_LEADS);

test("verwijdert 'geen aanbetaling' zonder de zin te breken", () => {
  assert.equal(
    stripOutdatedClaims("We werken met vaste vakteams, een vaste prijs en zonder aanbetaling, en hebben een beoordeling van 4,8 uit 273 reviews."),
    "We werken met vaste vakteams, een vaste prijs, en hebben een beoordeling van 4,8 uit 273 reviews."
  );
  assert.equal(
    stripOutdatedClaims("Een vaste prijs vooraf, geen aanbetaling en 4,8 uit 273 reviews."),
    "Een vaste prijs vooraf en 4,8 uit 273 reviews."
  );
  assert.equal(stripOutdatedClaims("Vaste prijs, geen aanbetaling."), "Vaste prijs.");
  assert.equal(stripOutdatedClaims("Niets aan de hand."), "Niets aan de hand.");
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
