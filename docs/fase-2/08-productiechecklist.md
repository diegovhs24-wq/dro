# Productiechecklist: PR #24, #25, #26 en drie Sanity-releases (22-10-2026)

Er is niets gedeployd of gepubliceerd. Elke stap vraagt akkoord van Therab. Deze checklist vervangt de volgorde in `docs/audit/19-uitrolplan.md` en neemt daaruit de stappen 0 tot en met 3 over.

## A. Blokkerend vóór livegang

| # | Punt | Wie | Status |
|---|---|---|---|
| A1 | Besluit over de betaalbelofte: "Bij ondertekening betaalt u niets" komt overeen met de praktijk (keuze A), of de site wordt aangepast (keuze B). Zie `06` §2.1 | Therab | Open |
| A2 | Akkoord op publicatie van de drie Sanity-releases. Anders blijven oude pagina's "vaste prijs" en "3 tot 15 jaar garantie" tonen | Therab | Open |
| A3 | E-mailhandtekening aanpassen (`06` §2.2), tegelijk met livegang | Therab | Open |
| A4 | Productie-leadtest na elke codedeploy (protocol `docs/audit/18` §B) | Therab of Diego | Na deploy |
| A5 | Back-up van de datasets `production` en `leads` | Iemand met Sanity-login | Open |

**Los van de website, wel urgent:** het mogelijke datalek van 19 oktober. Leg het vast en beoordeel of een melding nodig is (`06` §2.4).

## B. Stand van de code

| Controle | Resultaat |
|---|---|
| PR-stapel | main `d4d5400` ⊂ #24 `82aa9ba` ⊂ #25 `5c14056` ⊂ #26. Elke branch bevat de vorige volledig, dus de merges hebben geen conflicten. GitHub: #24 en #25 "clean", #26 "mergeable" |
| Gesimuleerde merge van main, #24, #25 en #26 | Eén tekstueel conflict (projectdetail, Next 15 params), opgelost in #26. Typecheck, lint en tests groen. Per bestand gecontroleerd dat er niets verloren gaat |
| Tests | `npm test`: 40 tests groen (6 GEO, 17 leadroute, 17 fase 2, waaronder rekenhulp, casestudy-voorwaarden en een claimfilter) |
| Preview `38cc1c4` | 16 kern-URL's 200, 20 projectpagina's 200, 214 projectafbeeldingen zonder fouten. Filters, mobiel menu en intakes tot en met de contactstap op alle routes en advertentiepagina's werken. Op 820 px en 390 px geen horizontale overloop meer |

## C. Uitrolvolgorde

Er zit minimaal één dag tussen de codestappen, zodat een probleem altijd aan één wijziging te koppelen is.

### Stap 0. Voorbereiding (10 min)
1. Back-up: `npx sanity dataset export production` en `npx sanity dataset export leads`. Bewaar beide buiten de laptop.
2. Noteer de huidige productie-deployment in Vercel (commit `d4d5400`) als rollbackpunt.
3. Laat Scott weten dat er testaanvragen komen.

### Stap 1. PR #24 mergen (GEO, Next 14)
- Rooktest:
  - `/api/health/leads` geeft `"ok":true`;
  - homepage, `/projecten` en beide advertentiepagina's openen;
  - `/robots.txt`, `/llms.txt` en `/sitemap.xml` openen.
- Studio-test: `/studio` en `/studio-aanvragen` openen.
- Productie-leadtest (A4).
- Vercel-alerts instellen op `LEAD_LOST`, `LEAD_EMAIL_FAILED`, `LEAD_EMAIL_NOT_CONFIGURED` en `LEAD_REJECTED`.

### Stap 2. Release `geo-betaalvoorwaarden` publiceren (37 documenten)
- Inhoud: siteSettings, 18 locaties, FAQ's en projecten. Betaalvoorwaarden en juridische naam.
- Controle: `/den-haag` toont "betaling per afgeronde fase".

### Stap 3. PR #25 mergen (Next 15, React 19), minimaal een dag na stap 1
- Rooktest zoals bij stap 1.
- Uitgebreide Studio-test, want React 19 is hier het grootste risico:
  - lijst, document, concept maken en weggooien;
  - mediabibliotheek;
  - Presentation.
- Leadtest.

### Stap 4. PR #26 mergen (fase 2), minimaal een dag na stap 3
- **GitHub:** zet de basis van #26 op `main` zodra #25 gemerged is. Dat gebeurt automatisch als de branch `security/next-15` na de merge wordt verwijderd.
- **Het Studio-schema gaat mee met de app:** `verifiedClaims`, `caseStudy` en de nieuwe leadvelden. Er is geen aparte schema-deploy nodig.
- **Rooktest:**
  - `/`, `/totaalrenovatie`, `/grote-renovaties` en `/constructieve-werken`;
  - `/projecten` en `/projecten?type=badkamer`;
  - twee projectpagina's;
  - beide advertentiepagina's.
- **Leadtest via `/grote-renovaties`.** Controleer in Studio dat `conversionRoute` en `budgetTier` zijn ingevuld.
- **Daarna de releases publiceren:**
  - `claims-garantie-meerwerk` (11 documenten, waaronder `home` en de dienstpagina's);
  - `claims-opschoning` (33 documenten: FAQ's, blogs, over-ons, werkwijze, contact, zakelijk, intakeformulier en 4 locaties).
- **Onderlinge afhankelijkheid van de releases:** er is geen overlap. De drie releases raken elk andere documenten (gecontroleerd op 22-10). De volgorde tussen de releases maakt dus niet uit; ze komen wel ná de code. Wordt een van deze documenten intussen in Studio gepubliceerd, dan overschrijft de release die wijziging. Kijk daarom vlak voor het publiceren in Studio of er sinds 22-10 gepubliceerde wijzigingen op die documenten zijn.
- **Titel en omschrijving van `claims-garantie-meerwerk`** noemen nog de AV-correctie. Die zit er niet meer in; de AV blijven ongewijzigd.
- **Na publicatie controleren:**
  - homepage-FAQ en werkwijze tonen geen "vaste prijs" en geen "jaar garantie" meer;
  - het intakeformulier noemt geen "binnen 24 uur".

### Stap 5. Na livegang (eerste week)
- `verifiedClaims` in Sanity invullen voor wat bevestigd is:
  - `responseTime`;
  - eventueel `trustoo`, met datum en link.

  Zonder deze invulling tonen de pagina's "zo snel mogelijk" en geen Trustoo-badge. Dat is bewust zo.
- Menu-items in siteSettings (header) toevoegen:
  - Totaalrenovatie;
  - Grote renovaties;
  - Constructief werk.
- Eerste twee casestudy's met toestemming invullen in Sanity (`caseStudy` en `consentDate`). Ze verschijnen dan automatisch. Budgetband en quote alleen tonen met aparte toestemming.

## D. Tracking

- **Consent mode "basic":** zonder toestemming laadt er geen enkel Google-script. Test daarom altijd met en zonder toestemming.
- **Omgevingsvariabelen:**
  - `NEXT_PUBLIC_GA4_ID` (optioneel);
  - `NEXT_PUBLIC_GOOGLE_ADS_ID` en `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL` (advertentieconversie).

  Controleer in Vercel dat ze in Production staan. Een wijziging vraagt een nieuwe deploy.
- **Funnel-events in de `dataLayer`:**
  - `route_view`;
  - `cta_click` (met `data-cta`);
  - `form_start`, `form_step_complete`, `form_submit_success`, `form_submit_error`;
  - `click_call`, `click_whatsapp`.

  Ze bevatten geen persoonsgegevens; parameters worden gefilterd.
- **Controle na stap 4:**
  1. Geef toestemming in de cookiebanner.
  2. Doorloop de intake.
  3. Zie in GA4 DebugView of Tag Assistant `form_submit_success` met de parameter `route`.
  4. Zie in Google Ads de leadconversie.
- **Leadkwaliteit meten:** `conversionRoute` en `budgetTier` staan per lead in de leads-dataset. Vergelijk na vier weken het aandeel leads van € 50.000 en meer met de vier weken vóór livegang.

## E. Leadbewaking

| Wat | Hoe | Wanneer |
|---|---|---|
| Configuratie leadketen | `/api/health/leads` geeft 200 met `ok:true` (Sanity-leads en e-mail). 503 betekent dat er iets misgaat | Na elke deploy, en via de geplande taak "DRO leadbewaking" |
| Leads komen binnen | Laatste lead in de leads-dataset jonger dan 24 uur op werkdagen | Geplande taak "DRO leadbewaking" |
| Fouten | Vercel-logalerts op `LEAD_LOST`, `LEAD_EMAIL_FAILED`, `LEAD_EMAIL_NOT_CONFIGURED` en `LEAD_REJECTED` | Instellen bij stap 1 (handmatig in Vercel) |
| Mail aangekomen | Het veld `emailedAt` is gevuld op een nieuwe lead in Studio | Bij elke leadtest |

## F. Rollback

| Wat | Hoe | Gevolg |
|---|---|---|
| Code (elke stap) | Vercel > Deployments > vorige productie-deployment > Instant Rollback | Binnen een minuut terug. Er is geen datamigratie: nieuwe velden zijn optioneel |
| Alleen de nieuwe homepage | `app/(site)/page.tsx` terugzetten naar de CMS-versie (één bestand) en deployen | De CMS-homepage komt terug, met de oude claims als de releases nog niet zijn gepubliceerd |
| Alleen `/totaalrenovatie` | Map `app/(site)/totaalrenovatie` verwijderen | De CMS-dienstpagina neemt het weer over |
| Een Sanity-release | Studio > Releases > gepubliceerde release > Revert, of per document via de geschiedenis | De codevangnetten (filter op "geen aanbetaling") blijven werken |
| Studio werkt niet na #25 | Rollback naar de deployment van stap 1 of 2 | Content blijft intact. Studio werkt weer op React 18 |

## G. Na livegang (niet blokkerend)

- AV-wijzigingen uit `06` §3, na juridische toets.
- Offertesjabloon in mijndro.app:
  - incl. btw voor consumenten;
  - stelpostregel;
  - indicatieve opleverweek;
  - wie de vergunning aanvraagt.
- Prijzen voor uitbouw, aanbouw en vloerverwarming in FAQ's en blogs gelijktrekken (`06` §4).
- Over-ons:
  - profiel van Esra;
  - Lauren-reviews niet meer tonen;
  - teamclaims bevestigen.
- Projectdata corrigeren (`badkamertahiti`, slug `totaalrenovatie-gezinswoning-rijswijk`).
- `areaServed` beperken tot het echte werkgebied.
- Dubbele pagina's met noindex (`over-ons3`, `werkwijze3`) laten doorverwijzen.
- Reviews over grote projecten actief verzamelen.
