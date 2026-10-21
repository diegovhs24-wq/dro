# 18. Definitieve GO/NO-GO-checklist PR #24 (22-10-2026)

Geen deployment zonder akkoord van Therab.

## A. Checklist met bewijs

| # | Onderdeel | Status | Bewijs |
|---|---|---|---|
| 1 | Remote branch = lokale HEAD | ✅ | Lokaal, `origin/feat/geo-ai-findability-audit` en PR-head waren alle drie `b5047cd`, schone werkmap. Na de wijzigingen van vandaag: `f86b4f6` op alle drie |
| 2 | Stad x dienst-pagina's niet uit de index | ✅ | Preview `f86b4f6`: sitemap 286 URL's (gelijk aan main), 198 combinaties, 0 noindex, 0 niet-200, 198 self-canonicals op `https://www.dro-renovaties.nl/...` |
| 3 | Leads: opslag, mail, herhaling, storingen | ✅ | `npm run test:leads`: 14/14 (normaal, Sanity faalt, token ontbreekt, Sanity hangt, beide falen, mail niet ingesteld, herhaling met/zonder eerdere mail, honeypot, 8 telefoonnotaties, validatie, origin, content-type, rate limit) |
| 4 | Health-check leadketen | ✅ | Preview: `GET /api/health/leads` gaf 200 `{"ok":true,"checks":{"sanityLeads":true,"email":true}}` |
| 5 | Bewaking leads | ✅ ingericht | Geplande taak "DRO leadbewaking" (08:22, 12:22, 17:22, pushmelding). Query getest op dataset `leads`: werkt (195 leads, 0 zonder mail) |
| 6 | Vercel log-alerts | ❌ niet mogelijk vanaf hier | Vercel-API gaf 403/404 voor dit account op project `dro`; alerts moeten in het Vercel-dashboard (stap C3) |
| 7 | Mailassistent blijft leadmails herkennen | ✅ | Markeringen staan nu achter het onderwerp; begin blijft `[Google Ads]` of `[Website]` |
| 8 | Structured data, robots, llms | ✅ | Preview: geen losse @id-verwijzingen, Content-Signal in elke robots-groep, llms.txt zonder "aanbetaling" |
| 9 | Geen nepnummers in knoppen | ✅ | Codevangnet getest; 16 projecten gecorrigeerd in Sanity-release |
| 10 | Typecheck, lint, unit tests | ✅ | 0 fouten; 6/6 GEO-tests |
| 11 | Echte productie-aanvraag | ⏳ na deploy | Protocol in §B |
| 12 | Sanity-release publiceren | ⏳ Therab | Release `geo-betaalvoorwaarden`, 37 documenten |
| 13 | Next.js-kwetsbaarheden | ⏳ PR #25 | Aparte PR, na #24 rebasen (zie §D) |

**Oordeel PR #24: GO**, onder voorwaarde van §B (testaanvraag direct na deploy) en §C3 (Vercel-alert). Rollback: in Vercel de vorige productie-deployment "Promote to Production".

## B. Productie-testprotocol leadproces (± 15 minuten, direct na deploy)

Voorbereiding:
- Spreek met Scott af dat er een testaanvraag komt (onderwerp bevat "TEST").
- Houd Sanity Studio > Aanvragen open.

Stappen:
1. **Health**: open `https://www.dro-renovaties.nl/api/health/leads`. Verwacht: `"ok":true`. Bij 503: niet verder, terugrollen.
2. **Normale aanvraag** via `/contact`: naam "TEST Claude", e-mail van Therab, telefoon `06 12345678`, dienst Totaalrenovatie, geen foto's. Verwacht:
   - bedankscherm;
   - binnen 1 minuut mail met onderwerp dat begint met `[Website]`;
   - in Studio een lead met ID `submission-...` en ingevuld veld "Leadmail verstuurd op".
3. **Aanvraag met 2 foto's** via de advertentiepagina `/totaalrenovatie-den-haag`. Verwacht: onderwerp `[Google Ads]` (kanaal Ads door de landingspagina), foto's binnen ± 10 seconden zichtbaar bij de lead.
4. **Telefoon uit contacten**: plak een nummer vanaf een iPhone-contact. Verwacht: geen foutmelding.
5. **Mailassistent**: controleer bij de volgende run van "DRO mail op orde" dat de testmails het label Sales krijgen en géén concept-antwoord.
6. **Bewaking**: controleer bij de eerstvolgende run van "DRO leadbewaking" dat er géén melding komt (alle testleads hebben `emailedAt`).
7. **Opruimen**: verwijder de testleads in Studio en de testmails.

Niet testen in productie: Sanity- of mailstoringen nabootsen. Die paden zijn gedekt door `npm run test:leads`.

## C. Monitoring

| # | Wat | Status |
|---|---|---|
| C1 | Geplande taak "DRO leadbewaking": leads zonder verstuurde mail, mogelijke spam, stilte langer dan 4 dagen | Ingericht, pushmelding |
| C2 | `/api/health/leads` voor een uptime-monitor (bijv. UptimeRobot, gratis): alarm bij status ≠ 200 | Endpoint klaar; monitor aanmaken vraagt een account (Therab) |
| C3 | Vercel log-alert (dashboard > Observability/Logs > Alert) op `LEAD_LOST`, `LEAD_EMAIL_FAILED`, `LEAD_EMAIL_NOT_CONFIGURED`, `LEAD_REJECTED` (meer dan 3 per uur) | Handmatig door Therab of Mubeen |
| C4 | Wekelijks in Studio filteren op "[mogelijk spam]" | Proces Esra/Scott |

## D. Security-PR #25 (Next 15.5.28 + React 19)

| Onderdeel | Bewijs |
|---|---|
| Compatibiliteit | Peer-eisen gecontroleerd: next-sanity 9.12.3 (next ^14.2 \|\| ^15, react ^19), sanity 3.99, sanity-plugin-media 4.3, styled-components 6, resend 6 (los van React/Next). Nieuwere next-sanity 13 / sanity 6 vereisen Next 16: bewust niet |
| Code | Officiële codemod (8 bestanden), `lib/sanity.ts` handmatig async, revalidate op tekst-routes |
| Build | Vercel-preview `851c47b` geslaagd |
| Regressie | 294 URL's 200; homepage en contact zonder console-errors; wizard reageert op klikken |
| Audit | Alle directe Next-advisories opgelost; Next nog alleen gemeld via ingebouwde PostCSS (build-time) |
| Niet getest | Sanity Studio: preview-domein staat niet in de Sanity-CORS-lijst. Opties: tijdelijk de preview-URL als CORS-origin toevoegen (jouw akkoord nodig), of na deploy direct `/studio` en `/studio-aanvragen` openen met rollback klaar |
| Volgorde | Eerst #24 mergen, dan rebase ik #25 (4 verwachte conflicten, allemaal in bestanden die beide PR's raken) en test ik opnieuw |
