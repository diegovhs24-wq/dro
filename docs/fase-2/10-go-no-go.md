# GO/NO-GO: DRO Renovaties website (22-10-2026, 20:15)

**Oordeel: GO voor de code, onder vier voorwaarden die u zelf moet uitvoeren of goedkeuren (P0).** Technisch staat alles klaar. Wat nog openstaat, zijn akkoorden en handelingen buiten de code.

Er is niets gedeployd, niets in Sanity gepubliceerd en niets aan de algemene voorwaarden of aan offertes gewijzigd. Er is geen externe communicatie verstuurd.

Dit document vervangt de uitrolvolgorde in `08-productiechecklist.md` en `docs/audit/19-uitrolplan.md`.

## 1. Stand (feitelijk gecontroleerd)

| Onderdeel | Resultaat |
|---|---|
| Branch-heads op GitHub | main `d4d5400`, #24 `82aa9ba`, #25 `5c14056`, #26 `5098692`. Lokaal gelijk aan GitHub |
| Mergeketen | main ⊂ #24 ⊂ #25 ⊂ #26, lineair. Mergen in die volgorde geeft geen conflicten. #24 en #25 "clean" volgens GitHub |
| Build | Vercel-build van `5098692` geslaagd |
| Tests | 47 geautomatiseerde tests groen (7 GEO, 20 leadketen, 20 fase 2). Typecheck en lint zonder fouten |
| Preview `5098692` | 21 kern-URL's 200 (pagina's, robots, sitemap, llms, llms-full, health); onbekende pagina 404; Markdown-versies (header `Accept: text/markdown`) 200 met de nieuwe betaaltekst; health-check `ok:true` (Sanity-leads en e-mail); sitemap 288 URL's met de nieuwe routes; canonicals correct; advertentiepagina's noindex; juridische naam zonder koppelteken in de structured data; werkgebied alleen bevestigde gebieden |
| Weergave | Homepage op 1000 px en 390 px zonder horizontale overloop. Nieuwe betaaltekst zichtbaar. Routelinks in het menu (desktop en mobiel). Rekenvoorbeeld op de advertentiepagina toont 5 fases (samen 100%), zonder "€ 0 bij tekenen". Intake op /grote-renovaties doorlopen tot de contactstap (11 stappen, niet verzonden) |
| Eerdere controle (preview `38cc1c4`) | 20 projectpagina's, 214 projectafbeeldingen, filters, mobiel menu en alle intakes op routes en advertentiepagina's |
| Betaalbeloftes op de preview | Op geen enkele gecontroleerde pagina meer "niets bij ondertekening", "geen aanbetaling" of "nooit vooruit". Bij CMS-teksten zorgt het codevangnet daarvoor |
| Oude claims op CMS-pagina's | "Vaste prijs" en "jaar garantie" staan nog op werkwijze, over-ons, stadspagina's en in llms-full.txt. **Ze verdwijnen pas als de releases zijn gepubliceerd** (zie P0-1) |

## 2. Wat in deze ronde is opgelost

### Betaalvoorwaarden: keuze B doorgevoerd
- **Overal in de code** de vaste tekst: "Voor aanvang van de werkzaamheden leggen wij het betalingsschema vast in de offerte. Betalingen worden gekoppeld aan de afgesproken projectfasen. Eventuele startbetalingen en afwijkende afspraken worden vooraf schriftelijk vastgelegd."
- **Waar dat geldt:**
  - homepage (hero en FAQ);
  - routepagina's;
  - zes zekerheden;
  - rekenhulp;
  - advertentiepagina's;
  - stad- en dienstcomponenten;
  - intake;
  - structured data;
  - llms.txt;
  - Markdown-versies.
- **Vangnet voor gepubliceerde CMS-teksten:** "geen aanbetaling", "niets bij ondertekening" en "nooit vooruit" worden bij weergave geneutraliseerd. De AV (art. 8.8, "vooruitbetaling") worden aantoonbaar niet geraakt; daar is een test voor.
- **Bevestiging uit de praktijk:**
  - de rolverdeling: Esra stuurt een week voor de start de aanbetalingsfactuur;
  - offerte OF2026-0026: 30% bij de start;
  - betaalschema OF2026-0168: starttermijn van 15%.

### Garantie en verzekering: apart benoemd
- 12 maanden contractueel (AV 12);
- fabrieks- of leveranciersgarantie op producten van derden;
- wettelijke rechten blijven gelden;
- CAR- en aansprakelijkheidsverzekering, "wat gedekt is hangt af van de polis en art. 13".

Verdwenen uit de code: "volledig verzekerd", "wij regelen de vergunning" en "één prijs voor het hele traject".

### Sanity-releases volledig nagelopen en gecorrigeerd (niet gepubliceerd)
- Aantallen: `geo-betaalvoorwaarden` 37, `claims-garantie-meerwerk` 11, `claims-opschoning` 41 (8 toegevoegd). 89 documenten, elk in precies één release.
- De AV en de privacyverklaring zitten in geen enkele release.
- Geen gepubliceerd document is na het aanmaken van de releases gewijzigd, dus er wordt niets overschreven.
- Inhoud: betaalteksten naar B, garantie, meerwerk op nacalculatie, indicatieve planning, vergunningsaanvraag, verzekering, werkgebied, teamrollen, oude reviewverwijzing, onbevestigde teamclaims.
- Onbevestigde prijzen van uitbouw, aanbouw, vloerverwarming en draagmuur zijn vervangen door "op maat na een opname".

### Overige verbeteringen
- **Casestudy's:** de velden "Uitgangssituatie" en "Eindresultaat" zijn toegevoegd. Daarmee bevat de structuur alles: uitgangssituatie, werkzaamheden, uitdaging, aanpak, materialen, resultaat, geregistreerde doorlooptijd en budget (alleen met toestemming). Er is een invulformulier voor de eerste twee (Jan Muschlaan en Fuutlaan), in `01-casestudy-intake.md`.
- **Menu:** de twee routepagina's staan in het dienstenmenu. Dat zit in de code, dus het hangt niet af van een release. "Totaalrenovatie" in het menu wijst al naar /totaalrenovatie.
- **Leadketen:** nieuwe tests voor:
  - een hangende mailserver (lead blijft bewaard, `LEAD_EMAIL_FAILED` wordt gelogd);
  - internationale nummers;
  - Google Ads-attributie;
  - consent (geen meting zonder toestemming, geen persoonsgegevens in meetdata).

  Bestaande tests dekken al: normale aanvragen, dubbele inzending, spam, Sanity-storing en time-out, ontbrekende configuratie, budget en route.

## 3. P0: blokkerend vóór livegang (uw besluit of handeling)

| # | Wat | Waarom blokkerend |
|---|---|---|
| **P0-1** | **Akkoord op publicatie van de drie releases, direct na de merge van #24** (zie 5, stap 4) | Zonder publicatie spreken werkwijze, over-ons, stads- en dienstpagina's de nieuwe pagina's en de AV tegen ("vaste prijs", "3 tot 15 jaar garantie") |
| **P0-2** | **Akkoord op de uitrol** (merges #24, #25, #26 volgens 5) | Deploy alleen met uw toestemming |
| **P0-3** | **Na elke deploy een echte productieaanvraag** (protocol `docs/audit/18` §B) en back-ups vooraf | Een geslaagde test vervangt geen echte lead door de echte keten (mail naar Scott, Studio, `emailedAt`) |
| **P0-4** | **E-mailhandtekening aanpassen** (tekst in `09-offertecontrole.md` §4), uiterlijk op de dag van livegang | De handtekening belooft "Vaste prijs, geen aanbetaling". Dat spreekt de website en uw eigen facturen tegen |

**Buiten de website, urgent:**
- **Offerte OF2026-0026 (Boode):** corrigeer vóór vrijdag 23-10 om 13:00 de lijst "Niet inbegrepen", die posten in dezelfde offerte uitsluit (`09` O1).
- **Datalekregister** voor het incident van 19-10: afweging vastleggen, de termijn verliep vanavond rond 21:33 (`datalekregister-2026-10-19.md`).

## 4. Beslissingen die alleen u kunt nemen

1. **Prijzen die nog in blogs en FAQ's staan.**
   - Afbouw nieuwbouw € 15.000 tot € 50.000 (FAQ `46706e99`) en dakopbouw € 20.000 tot € 60.000 (blog `6e04ee50`): bevestigen, of laten vervangen door "op maat".
   - Laten nalezen: de omgerekende incl.-btw-rekenvoorbeelden in de totaalrenovatieblogs.
2. **Teamteksten op over-ons** (in de release): de rollen van Therab en Scott nalezen. Krijgt Esra een profiel (foto en tekst van u)?
3. **Project Tahiti:** de locatie staat in de release op Zoetermeer, omdat titel en verhaal dat zeggen. Klopt dat?
4. **Reactienorm voor nieuwe aanvragen.** Uw offerte noemt "binnen 2 werkdagen", de website zegt "zo snel mogelijk". Kiest u een norm die altijd haalbaar is, dan zet ik die als bevestigde claim in Sanity en tonen alle pagina's hem.
5. **Trustoo-score op de advertentiepagina's:** bevestigen met datum en link, of definitief weglaten. Nu is hij verborgen.

## 5. Uitrolchecklist (afhankelijkheden geverifieerd)

**Verificatie:**
- De releases bevatten geen links naar de nieuwe routes en geen velden die alleen #26 kent. Ze kunnen daarom direct na #24 live; zo verdwijnen de oude claims al op dag 1.
- Tussen #24 en #26 staat in llms.txt en de structured data nog de oude code-tekst "niets bij ondertekening". Productie zegt nu "geen aanbetaling"; dat is dus geen achteruitgang, maar laat de periode tussen #24 en #26 kort zijn (1 tot 2 werkdagen).

| Stap | Wat | Controle | Rollback |
|---|---|---|---|
| 1. Back-ups | `npx sanity dataset export production` en `... leads`. Noteer productie-deployment `d4d5400` in Vercel | Beide bestanden buiten de laptop bewaard | n.v.t. |
| 2. Laatste controle | Preview `5098692` en releases nog actief; vlak voor publicatie in Studio kijken of er sinds 22-10 gepubliceerde wijzigingen zijn op releasedocumenten | Releaselijst: 3 × "active" | n.v.t. |
| 3. Merge #24 (dag 1) | Merge naar main; Vercel deployt | `/api/health/leads` geeft `ok:true`; home, /projecten, beide advertentiepagina's, robots, sitemap en llms openen | Vercel > Deployments > vorige > Instant Rollback |
| 4. Releases publiceren (dag 1) | Studio > Releases: `geo-betaalvoorwaarden`, `claims-garantie-meerwerk`, `claims-opschoning`. De volgorde maakt niet uit: geen overlap | /den-haag, /werkwijze en /over-ons zonder "vaste prijs" en "jaar garantie"; FAQ betaling toont de B-tekst | Studio > Releases > release > Revert. Het codevangnet blijft werken |
| 5. Productie-leadtest (dag 1) | Echte aanvraag via /contact en via een advertentiepagina met foto (`docs/audit/18` §B) | Mail bij Scott; lead in Studio met `emailedAt`; health ok | Bij falen: rollback stap 3 en telefoon als terugval |
| 6. Merge #25 (dag 2) | Next 15 en React 19 | Rooktest zoals bij stap 3 | Rollback naar de deployment van stap 3 |
| 7. Studio-controle (dag 2) | /studio en /studio-aanvragen: lijst, document openen, concept maken en weggooien, media, Presentation | Alles opent zonder fouten | Rollback naar stap 3. Content blijft intact |
| 8. Merge #26 (dag 2 of 3) | Basis van #26 eerst op main zetten (gebeurt vanzelf als `security/next-15` na de merge wordt verwijderd) | Rooktest: /, /totaalrenovatie, /grote-renovaties, /constructieve-werken, /projecten?type=badkamer, 2 projectpagina's, beide advertentiepagina's. Leadtest via /grote-renovaties (`conversionRoute` en `budgetTier` gevuld) | Instant Rollback; of alleen `app/(site)/page.tsx` terugzetten (homepage) of `app/(site)/totaalrenovatie` verwijderen |
| 9. Overige releases | Niets meer: alle releases staan sinds stap 4 live. Nieuwe velden (`verifiedClaims`, casestudy) gaan met #26 mee in het Studio-schema; een aparte schema-deploy is niet nodig | In Studio zijn de tabbladen "Casestudy" en "Bevestigde claims" zichtbaar | n.v.t. |
| 10. Visuele en commerciële controle | Desktop, tablet en mobiel: homepage, routes, portfolio, advertentiepagina's. Menu, filters, afbeeldingen, intake tot de contactstap | Geen overloop, geen kapotte afbeeldingen, geen oude claims | Per onderdeel, zie stap 8 |
| 11. Monitoring | Vercel-logalerts op `LEAD_LOST`, `LEAD_EMAIL_FAILED`, `LEAD_EMAIL_NOT_CONFIGURED` en `LEAD_REJECTED` (handmatig in Vercel). Geplande taak "DRO leadbewaking" en `/api/health/leads`. Google Ads-conversie met toestemming testen in Tag Assistant | Alert-test: één keer een logregel forceren of de alert in Vercel previewen | n.v.t. |
| 12. Rollback | Code: Instant Rollback (binnen een minuut, geen datamigratie, nieuwe velden zijn optioneel). Content: release terugdraaien in Studio. Getest: alle nieuwe velden zijn optioneel en worden door oudere code genegeerd | Rollbackpunt `d4d5400` genoteerd | n.v.t. |

## 6. P1: kort na livegang

- **Offertesjabloon mijndro.app** (`09` §3):
  - consumententotaal incl. btw;
  - 10% stelpostopslag;
  - "indicatief" in plaats van "maximaal";
  - betaaltermijn gelijk aan de AV;
  - wie de vergunning aanvraagt;
  - de garantietermijn.
- **AV-voorstellen ter juridische toets:**
  - art. 7.1 (vergunningsaanvraag door DRO);
  - de juridische naam zonder koppelteken.

  Het eerdere voorstel voor art. 8.1 vervalt met keuze B: het schema staat in de offerte, en de standaard van art. 8.1 geldt alleen als dat ontbreekt.
- **Eerste twee casestudy's** invullen, met toestemming.
- **Reviews over grote projecten** actief vragen na oplevering.
- **Slugs met onjuiste inhoud** (`totaalrenovatie-gezinswoning-rijswijk` is een badkamer in Alphen) wijzigen, met een redirect.
- **Lege index-documenten** waar de knoppen "Alle diensten" en "Alle projecten" op de oude homepage naar wijzen. Na #26 niet meer zichtbaar op de homepage.

## 7. P2: verdere optimalisatie

- **Afhankelijkheden.** 40 meldingen bij npm audit, waarvan 1 kritiek. Geen ervan is via een bezoekersverzoek te misbruiken: ze zitten in de Sanity CLI (uitpakken van archieven bij import of deploy), in buildtools (Tailwind 3, ESLint, PostCSS tijdens de build) en in Studio-onderdelen.
  - **Advies:** gepland upgraden naar Sanity 6, Tailwind 4 en Next 16. Dat zijn grote versiesprongen, dus niet vóór livegang.
  - **Ernst:** laag tot middel. Het risico zit bij ontwikkelaarsmachines en de buildomgeving, niet bij bezoekers.
- **GA4** naast Google Ads (`NEXT_PUBLIC_GA4_ID`), en na vier weken het aandeel leads van € 50.000 en meer vergelijken.
- **Marktprijzen in blogs** (isolatie, kozijnen, dakkapel, warmtepomp) periodiek nalopen.
- **Dubbele noindex-pagina's** (over-ons3, werkwijze3) laten doorverwijzen.
- **llms-full.txt:** neemt CMS-teksten over. Na de releases opnieuw controleren op em-dashes en oude claims.

## 8. Gewijzigde bestanden in deze ronde (`27da6ca..5098692`)

**Code:**
- `lib/seo/business.ts`: betaaltekst B, `PAYMENT_TERMS`, vangnet voor CMS-teksten.
- `lib/seo/site.ts`: werkgebied in de structured data alleen bevestigd.
- `lib/assurances.ts`: zekerheden betaling en garantie.
- `lib/conversionRoutes.ts`: route-FAQ, metabeschrijving, stappen.
- `lib/caseStudy.ts`, `lib/cms.ts`, `sanity/schemaTypes/documents.ts`, `components/casestudy/CaseStudy.tsx`: casestudy-velden; menu-routelinks.
- `components/premium/HomePage.tsx`, `components/premium/homeContent.ts`, `components/routes/ConversionRoutePage.tsx`, `components/routes/RenovationEstimator.tsx`.
- `app/(lp)/totaalrenovatie-den-haag/page.tsx`, `app/(lp)/draagmuur-verwijderen-den-haag/page.tsx`, `app/llms.txt/route.ts`.
- `components/LocationPage.tsx`, `components/LocationServicePage.tsx`, `components/LocationDetailRoute.tsx`, `components/TrustSignals.tsx`, `components/SmartIntakeWizard.tsx`, `components/tools/toolsConfig.ts`.

**Tests:**
- `scripts/tests/fase2.test.mjs`: o.a. een scan van de publieke broncode op verboden beloftes;
- `scripts/tests/geo.test.mjs`;
- `scripts/tests/lead-route.test.mjs`;
- `scripts/tests/mocks/leadEmail.mjs`.

**Documenten:**
- `docs/fase-2/01-casestudy-intake.md`;
- `docs/fase-2/09-offertecontrole.md`;
- `docs/fase-2/10-go-no-go.md`.

**Buiten de repository:**
- `datalekregister-2026-10-19.md` (concept, alleen voor u);
- 8 Sanity-documenten toegevoegd aan release `claims-opschoning`;
- 89 release-versies gecorrigeerd. Er is niets gepubliceerd.
