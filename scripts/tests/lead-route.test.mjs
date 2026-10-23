// Integratietest van /api/submit-request met nagebootste Sanity en mail.
// Draaien: npm run test:leads
import assert from "node:assert/strict";
import {test, beforeEach} from "node:test";

const {createRequire} = await import("node:module");
const {POST} = createRequire(import.meta.url)(process.env.LEAD_ROUTE);

const base = {
  name: "Test Klant",
  email: "test@example.com",
  phone: "06 12345678",
  services: ["Totaalrenovatie"],
  source: "smart-intake",
};

let ipCounter = 0;
function req(body, headers = {}) {
  ipCounter += 1;
  const r = new Request("https://www.dro-renovaties.nl/api/submit-request", {
    method: "POST",
    headers: {"content-type": "application/json", origin: "https://www.dro-renovaties.nl", "x-forwarded-for": `10.0.0.${ipCounter % 250}`, ...headers},
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return r;
}

beforeEach(() => {
  globalThis.__LEADS_MODE = "ok";
  globalThis.__EMAIL_MODE = "ok";
  globalThis.__LEADS_STORE.clear();
  globalThis.__EMAIL_SENT.length = 0;
});

test("normale lead: opgeslagen, gemaild, emailedAt gezet", async () => {
  const res = await POST(req({...base, submissionId: "aaaaaaaa-1"}));
  assert.equal(res.status, 201);
  const doc = globalThis.__LEADS_STORE.get("submission-aaaaaaaa-1");
  assert.ok(doc, "lead opgeslagen");
  assert.ok(doc.emailedAt, "emailedAt gezet");
  assert.equal(globalThis.__EMAIL_SENT.length, 1);
});

test("Sanity faalt: mail met waarschuwing, bezoeker krijgt succes", async () => {
  globalThis.__LEADS_MODE = "create-fails";
  const res = await POST(req({...base, submissionId: "bbbbbbbb-1"}));
  assert.equal(res.status, 201);
  assert.equal(globalThis.__EMAIL_SENT[0].notSavedWarning, true);
});

test("token ontbreekt: mail met waarschuwing", async () => {
  globalThis.__LEADS_MODE = "no-token";
  const res = await POST(req({...base, submissionId: "cccccccc-1"}));
  assert.equal(res.status, 201);
  assert.equal(globalThis.__EMAIL_SENT[0].notSavedWarning, true);
});

test("opslaan én mailen falen: 500 (bezoeker ziet foutmelding met telefoonnummer)", async () => {
  globalThis.__LEADS_MODE = "create-fails";
  globalThis.__EMAIL_MODE = "throws";
  const res = await POST(req({...base, submissionId: "dddddddd-1"}));
  assert.equal(res.status, 500);
});

test("mail niet geconfigureerd: lead staat wel in Sanity, zonder emailedAt", async () => {
  globalThis.__EMAIL_MODE = "not-configured";
  const res = await POST(req({...base, submissionId: "eeeeeeee-1"}));
  assert.equal(res.status, 201);
  const doc = globalThis.__LEADS_STORE.get("submission-eeeeeeee-1");
  assert.ok(doc && !doc.emailedAt);
});

test("herhaalde inzending na mislukte mail: mail wordt alsnog verstuurd (L1)", async () => {
  globalThis.__EMAIL_MODE = "throws";
  await POST(req({...base, submissionId: "ffffffff-1"}));
  assert.equal(globalThis.__EMAIL_SENT.length, 0);
  globalThis.__EMAIL_MODE = "ok";
  const res = await POST(req({...base, submissionId: "ffffffff-1"}));
  assert.equal(res.status, 201);
  assert.equal(globalThis.__EMAIL_SENT.length, 1, "mail alsnog verstuurd");
  assert.equal((await res.json()).duplicate, true);
});

test("herhaalde inzending na geslaagde mail: geen tweede mail", async () => {
  await POST(req({...base, submissionId: "gggggggg-1"}));
  await POST(req({...base, submissionId: "gggggggg-1"}));
  assert.equal(globalThis.__EMAIL_SENT.length, 1);
});

test("honeypot ingevuld: opgeslagen met spamvlag én gemaild met markering", async () => {
  const res = await POST(req({...base, hp_x7: "Bedrijf BV", submissionId: "hhhhhhhh-1"}));
  assert.equal(res.status, 201);
  assert.equal(globalThis.__LEADS_STORE.get("submission-hhhhhhhh-1").spamSuspect, true);
  assert.equal(globalThis.__EMAIL_SENT[0].spamSuspect, true);
  assert.equal((await res.json()).spamSuspect, true);
});

test("Nederlandse telefoonnotaties worden geaccepteerd (L2)", async () => {
  for (const phone of ["06 12345678", "+31 6 1234 5678", "0031612345678", "06-12345678", "06 12345678", "‪+31 6 12345678‬", "06–1234–5678", "06 1234 5678 (na 17u)"]) {
    const res = await POST(req({...base, phone}));
    assert.equal(res.status, 201, `geweigerd: ${JSON.stringify(phone)}`);
  }
});

test("afwijkend telefoonnummer met geldig e-mailadres wordt niet geweigerd", async () => {
  const res = await POST(req({...base, phone: "bel mij"}));
  assert.equal(res.status, 201);
});

test("zonder naam, dienst of enig contactgegeven: 400", async () => {
  assert.equal((await POST(req({...base, name: ""}))).status, 400);
  assert.equal((await POST(req({...base, services: []}))).status, 400);
  assert.equal((await POST(req({...base, email: "x", phone: "12"}))).status, 400);
});

test("vreemde origin 403, 'null' origin toegestaan, verkeerd content-type 415", async () => {
  assert.equal((await POST(req(base, {origin: "https://evil.example"}))).status, 403);
  assert.equal((await POST(req(base, {origin: "null"}))).status, 201);
  assert.equal((await POST(req("x", {"content-type": "text/plain"}))).status, 415);
});

test("rate limit: 7e geldige aanvraag van hetzelfde IP binnen 10 min krijgt 429", async () => {
  const statuses = [];
  for (let i = 0; i < 7; i++) statuses.push((await POST(req({...base}, {"x-forwarded-for": "192.168.9.9"}))).status);
  assert.deepEqual(statuses.slice(0, 6), [201, 201, 201, 201, 201, 201]);
  assert.equal(statuses[6], 429);
});

test("Sanity hangt: na 8 s toch mail en succes", {timeout: 20_000}, async () => {
  globalThis.__LEADS_MODE = "create-hangs";
  const t0 = Date.now();
  const res = await POST(req({...base, submissionId: "iiiiiiii-1"}));
  assert.equal(res.status, 201);
  assert.equal(globalThis.__EMAIL_SENT[0].notSavedWarning, true);
  assert.ok(Date.now() - t0 < 10_000);
});

test("route grote renovatie: route, budgetklasse en verzendpagina op lead en in mail", async () => {
  const res = await POST(
    req({
      ...base,
      submissionId: "route-groot-1",
      source: "route-grote-renovatie",
      conversionRoute: "grote-renovatie",
      services: ["Badkamer"],
      budgetMin: 150000,
      budgetMax: 250000,
      budgetLabel: "€150k – €250k+",
      attribution: {landingPage: "/grote-renovaties", submitPage: "/grote-renovaties"},
    })
  );
  assert.equal(res.status, 201);
  const doc = globalThis.__LEADS_STORE.get("submission-route-groot-1");
  assert.equal(doc.source, "route-grote-renovatie");
  assert.equal(doc.conversionRoute, "grote-renovatie");
  assert.equal(doc.budgetTier, "250k-plus");
  assert.equal(doc.attribution.submitPage, "/grote-renovaties");
  const mail = globalThis.__EMAIL_SENT[0];
  assert.equal(mail.conversionRouteLabel, "Grote renovatie");
  assert.equal(mail.budgetTierLabel, "€ 250.000 of meer");
  assert.equal(mail.formTitle, "Intake grote renovaties");
  // Op deze route geldt de budgetcheck vanaf € 50.000, ook als alleen een badkamer is gekozen.
  assert.ok(mail.assessment.checks.some((c) => c.label === "Budget" && c.ok === true));
  // Onderwerp blijft herkenbaar voor de mailassistent: geen kanaalwijziging naar Ads.
  assert.notEqual(mail.channel.key, "google-ads");
});

test("onbekende route of bron wordt genegeerd", async () => {
  const res = await POST(req({...base, submissionId: "route-x-1", source: "hack", conversionRoute: "<script>"}));
  assert.equal(res.status, 201);
  const doc = globalThis.__LEADS_STORE.get("submission-route-x-1");
  assert.equal(doc.source, "smart-intake");
  assert.equal(doc.conversionRoute, undefined);
});

test("route constructief afgeleid uit de bron", async () => {
  await POST(req({...base, submissionId: "route-c-1", source: "route-specialistisch", services: ["Draagmuur verwijderen"], budgetLabel: "Weet ik nog niet"}));
  const doc = globalThis.__LEADS_STORE.get("submission-route-c-1");
  assert.equal(doc.conversionRoute, "specialistisch");
  assert.equal(doc.budgetTier, "onbekend");
});

test("internationale telefoonnotaties worden geaccepteerd", async () => {
  for (const phone of ["+32 470 12 34 56", "0049 30 1234567", "+44 7700 900123", "+1 (415) 555-0100", "+90 532 123 45 67"]) {
    const res = await POST(req({...base, phone}));
    assert.equal(res.status, 201, `geweigerd: ${phone}`);
  }
});

test("mailserver hangt: lead staat in Sanity, bezoeker krijgt succes, fout herkenbaar gelogd", {timeout: 25_000}, async () => {
  globalThis.__EMAIL_MODE = "hangs";
  const logged = [];
  const orig = console.error;
  console.error = (...args) => logged.push(args.join(" "));
  try {
    const t0 = Date.now();
    const res = await POST(req({...base, submissionId: "mailhang-1"}));
    assert.equal(res.status, 201);
    assert.ok(Date.now() - t0 < 15_000, "binnen de time-out afgerond");
    const doc = globalThis.__LEADS_STORE.get("submission-mailhang-1");
    assert.ok(doc, "lead opgeslagen");
    assert.ok(!doc.emailedAt, "geen emailedAt zonder verstuurde mail");
    assert.ok(logged.some((l) => l.includes("LEAD_EMAIL_FAILED")), "LEAD_EMAIL_FAILED in de logs");
  } finally {
    console.error = orig;
  }
});

test("advertentieattributie: gclid en utm komen als kanaal op de lead en in de mail", async () => {
  const res = await POST(
    req({
      ...base,
      submissionId: "ads-attr-1",
      source: "lp-totaalrenovatie",
      attribution: {gclid: "Cj0KCQ-test", utm_source: "google", utm_medium: "cpc", utm_campaign: "totaalrenovatie-den-haag", landingPage: "/totaalrenovatie-den-haag"},
    })
  );
  assert.equal(res.status, 201);
  const doc = globalThis.__LEADS_STORE.get("submission-ads-attr-1");
  assert.match(String(doc.channel), /google ads/i);
  assert.equal(doc.attribution?.utm_campaign, "totaalrenovatie-den-haag");
  assert.match(JSON.stringify(globalThis.__EMAIL_SENT[0].channel), /google/i);
});
