# 19. Uitrolplan PR #24, Sanity-release en PR #25

Status 22-10-2026, 01:00. Niets is gedeployed of gepubliceerd. Elke stap hieronder vraagt akkoord van Therab.

## Laatste controle (gedaan)

| Controle | Resultaat |
|---|---|
| PR #25 gerebased op #24 | 4 conflicten opgelost; PR #25 heeft nu #24 als basis (gestapeld). Commit `de2fc40` |
| Breuk door Next 15 gevonden | `request.ip` bestaat niet meer in Next 15; de rate limit gebruikte het. Opgelost in #24 (`fd9d7bd`), werkt op beide versies |
| Tests op de gecombineerde branch | `npm ci` schoon, typecheck en lint 0 fouten, 6/6 GEO-tests, 14/14 lead-scenario's |
| Preview gecombineerd (Next 15 + #24) | Health 200 ok; submit-request 400/415 correct; submit-intake 410; draft enable 401 bij vals geheim; draft disable redirect; Markdown, llms, llms-full, robots, sitemap, api-catalog 200; `/offerte-aanvragen` en `/privacy` redirect; onbekende pagina 404 |
| Formulieren gecombineerd | Intake op `/contact` volledig doorlopen tot de verzendknop (dienst, oppervlakte, woonlagen, casco, bewoning, bouwjaar, adres via PDOK, foto-stap, planning, budget, herkomst, bericht, overzicht, contactgegevens); verzendknop actief, honeypot en privacylink aanwezig. **Niet verzonden** (zou Scott mailen). Advertentiepagina's draagmuur (prijsberekening) en totaalrenovatie laden zonder console-fouten |
| Sanity-release | 37 documenten; geen gepubliceerde wijziging sinds het klaarzetten; geen open concepten op die documenten; geen "geen aanbetaling" of nepnummer meer in de release |
| Leads-dataset | 195 leads, laatste 21-10 12:19; bewakingsquery werkt |
| Sanity Studio | Niet te testen op previews: alleen `www.dro-renovaties.nl`, `dro-renovaties.nl`, `dro-one.vercel.app` en localhost staan in de Sanity-CORS-lijst |

## Uitrolvolgorde

Drie aparte stappen, met minimaal een dag tussen stap 1 en 3, zodat een probleem altijd aan één wijziging te koppelen is.

### Stap 0: voorbereiding (10 min)
1. Back-up: `npx sanity dataset export production` en `npx sanity dataset export leads` (Therab of Mubeen, met Sanity-login). Bewaar beide bestanden buiten de laptop.
2. Noteer in Vercel de huidige productie-deployment (ID en commit `d4d5400`) als rollbackpunt.
3. Laat Scott weten dat er een testaanvraag komt.

### Stap 1: PR #24 mergen en deployen (Next 14, React 18)
1. Merge PR #24 naar `main`; Vercel deployt.
2. Rooktest (5 min):
   - `/api/health/leads` geeft `"ok":true`;
   - homepage, `/totaalrenovatie`, `/den-haag/totaalrenovatie`, `/projecten`, beide advertentiepagina's openen;
   - `/robots.txt`, `/llms.txt`, `/sitemap.xml` (286 URL's) openen.
3. **Studio-test:** `/studio` openen, een pagina openen en sluiten zonder te publiceren; `/studio-aanvragen` openen en de laatste lead bekijken (velden "Leadmail verstuurd op" en "Mogelijk spam" zichtbaar bij nieuwe leads).
4. **Productie-leadtest**: protocol in `18-go-no-go-checklist.md` §B (normale aanvraag, aanvraag met foto's via de advertentiepagina, telefoonnummer uit contacten, controle mail, Studio, `emailedAt`, mailassistent, bewaking, opruimen).
5. Vercel-alert instellen op `LEAD_LOST`, `LEAD_EMAIL_FAILED`, `LEAD_EMAIL_NOT_CONFIGURED`, `LEAD_REJECTED`.

**Rollback stap 1:** Vercel > Deployments > vorige productie-deployment > "Instant Rollback". Geen datamigratie nodig: nieuwe velden (`emailedAt`, `spamSuspect`) zijn optioneel en worden door de oude code genegeerd.

### Stap 2: Sanity-release publiceren (na geslaagde stap 1)
1. Studio > Releases > "Correctie betaalvoorwaarden en bedrijfsnaam (GEO-audit)" > wijzigingen nalopen > publiceren.
2. Controleren: `/den-haag` en twee andere steden tonen "betaling per afgeronde fase"; een projectpagina belt 085 087 1814; FAQ "Moet ik vooraf iets betalen" toont het nieuwe antwoord.
3. Handmatig in Studio: rich-text op home, over-ons, werkwijze en totaalrenovatie (docs/audit/16 §4).

**Rollback stap 2:** Studio > Releases > gepubliceerde release > "Revert"; of per document via de geschiedenis. De code-vangnetten blijven in elk geval werken.

### Stap 3: PR #25 mergen en deployen (Next 15, React 19), minimaal 1 dag na stap 1
1. Merge PR #25 (basis is dan al `main` met #24).
2. Rooktest zoals stap 1.2.
3. **Studio-test, uitgebreid** (React 19 is hier het grootste risico):
   - `/studio` en `/studio-aanvragen` openen, lijst laden, document openen;
   - een concept maken en weggooien;
   - mediabibliotheek openen;
   - Presentation/visuele bewerking openen (voorbeeldmodus moet starten).
4. Productie-leadtest opnieuw (§B, stappen 1, 2 en 7 volstaan).
5. Eén dag de bewaking en Vercel-logs volgen.

**Rollback stap 3:** Vercel "Instant Rollback" naar de deployment van stap 1. Geen data- of schemawijziging in deze stap.

## Beslispunten voor Therab

- Akkoord voor stap 0 t/m 3, elk afzonderlijk.
- Optioneel vóór stap 3: tijdelijk de preview-URL van PR #25 toevoegen aan de Sanity-CORS-lijst, zodat Studio met React 19 al vóór productie getest kan worden. Na de test weer verwijderen.
