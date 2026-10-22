# Claimregister (22-10-2026, bijgewerkt na de kwaliteitsronde)

Alle commerciële claims in de code en in de gepubliceerde Sanity-content, getoetst aan:
- bevestigde bedrijfsfeiten (`lib/seo/business.ts`);
- de klantbeloftes en rolverdeling zoals Therab ze heeft bevestigd;
- de gepubliceerde algemene voorwaarden (versie augustus 2026).

Doorzocht: 160 Sanity-documenten (18 pagina's, 9 diensten, 22 locaties, 53 FAQ's, 26 blogs, 20 projecten, 5 reviews, overige instellingen) plus alle nieuwe code.

## 1. Strijdig met de eigen algemene voorwaarden (hoogste risico)

| Claim op de site | Wat de AV zeggen | Status |
|---|---|---|
| "3 tot 15 jaar garantie" (12 pagina's), "standaard 5 jaar garantie" (FAQ `669fa316`) | Art. 12.1: 12 maanden op eigen werk, fabrieksgarantie op installaties | Nieuwe pagina's: 12 maanden volgens AV. 12 CMS-pagina's gecorrigeerd in release `claims-garantie-meerwerk`. FAQ `669fa316` in release `claims-opschoning` |
| "Vaste prijs, de prijs in de offerte is de prijs" (home, 11 pagina's, 22 locaties, seo-teksten) | Art. 3.4 en 5: offerte limitatief, meerwerk op nacalculatie | Nieuwe pagina's: eerlijk uitgelegd met verwijzing naar art. 3.4 en 5. Assurance-tegels gecorrigeerd in de release. Locaties, FAQ en seo-teksten in releases `geo-betaalvoorwaarden` en `claims-opschoning` |
| "De slotbetaling volgt alleen als u tevreden bent" (over-ons, FAQ `92e19150`) | Art. 10.2: kleine restpunten zijn geen reden om de slottermijn te onthouden | In release `claims-opschoning` |
| AV art. 8.1: "40% bij aanvang, 50% tijdens, 10% bij oplevering" | Bevestigd schema: niets bij ondertekening, 20 tot 25% eerste werkdag, dan per fase | Open: geldt alleen zonder schema in de offerte. Advies: art. 8.1 gelijktrekken (juridisch laten toetsen) |
| Juridische naam met koppelteken in AV en `siteSettings` | KvK: DRO Bouw en Aannemingsbedrijf B.V. | AV ongewijzigd (voorstel ter goedkeuring in `06` §3.3). siteSettings in release `geo-betaalvoorwaarden`. Footer en structured data gebruiken al de juiste naam uit code |

## 2. Onbevestigd

| Claim | Waar | Status |
|---|---|---|
| "100+ projecten opgeleverd" | home (oud), over-ons | Niet op nieuwe pagina's. Over-ons open |
| "Binnen 24 uur contact / duidelijkheid", "binnen één werkdag" (reactie op nieuwe aanvraag) | intakeformulier, footerbanner, contact, zakelijk, intake-wizard op de bestaande pagina's | Nieuwe pagina's: alleen uit bevestigde claim in Sanity, anders "zo snel mogelijk". Footerbanner verborgen op nieuwe pagina's. Stad- en dienstcomponenten en de wizard: nu "zo snel mogelijk". CMS-teksten in release `claims-opschoning`. Norm kiezen blijft jouw besluit |
| "Binnen 1 werkuur teruggebeld", Trustoo 9,8/557, "Top Pro 2026" | advertentiepagina's | "1 werkuur" verwijderd; Trustoo alleen zichtbaar na bevestiging in `verifiedClaims.trustoo` |
| "Dekking in Noord-Holland, Utrecht, Zeeland, meerdere opstartlocaties" | home (oud) | Niet meer op de homepage |
| "Ruim 35 vaste vakmensen", "10+ jaar", "interne prefabricage" | over-ons, zakelijk | Open |
| Woningwaarde stijgt van € 350.000 naar € 400.000 | FAQ `cc5de94f`, `42c1928f` | In release `claims-opschoning` |
| Reviews die Lauren noemen | review `313123d5`, `926325a0` (over-ons) | Niet uitgelicht op nieuwe pagina's. Over-ons open |

## 3. Onjuist of verouderd

| Claim | Waar | Status |
|---|---|---|
| "Geen aanbetaling" | 14 documenten, 18 locaties | Codefilter vervangt het al bij weergave; release `geo-betaalvoorwaarden` en `claims-garantie-meerwerk` corrigeren de bron |
| Totaalrenovatie "€ 500 tot € 2.500 per m²", badkamer "€ 7.000 tot € 22.000" | 6 blogs, FAQ `b05242f1` | In release `claims-opschoning` (blogs en FAQ). Uitbouwprijzen nog open (`06` §4) |
| € 1.000 tot € 1.250 per m² zonder "excl. btw" | FAQ `90322b19`, `faq-iets-verandert` | In release `claims-opschoning`. Nieuwe pagina's tonen incl. btw als hoofdbedrag |
| Rollen Therab ("Projectleider"), Scott ("Junior accountmanager"), Esra ontbreekt | over-ons | Open |

## 4. Wat de nieuwe pagina's wel zeggen, en waarom dat klopt

| Uitspraak | Bron |
|---|---|
| Niets bij ondertekening, 20 tot 25% eerste werkdag, daarna per fase | BUSINESS, bevestigd door Therab |
| Wekelijks vast meetmoment, appvragen binnen 24 uur opgepakt | Klantbeloftes, bevestigd door Therab |
| Planning en betaalschema bij akkoord, door Therab | Rolverdeling, bevestigd door Therab |
| Meerwerk vooraf gemeld, verrekend op nacalculatie | AV art. 3.4 en 5 |
| 12 maanden garantie op eigen werk | AV art. 12.1 |
| Gezamenlijke oplevering met opleverlijst | AV art. 10.1 en 10.2 |
| € 1.210 tot € 1.510 per m² incl. btw (€ 1.000 tot € 1.250 excl.), keuring € 399 | BUSINESS, btw volgens AV art. 4.1 |
| Draagmuur 1 tot 3 dagen uitvoering, met constructieberekening | Bevestigd door Therab |
| Uitvoering 8 tot 14 weken bij onze projecten | Berekend uit de projectpagina's in Sanity |
| 4,8 uit 273 Google-reviews (stand 17-10-2026) | Google-profiel |
| VCA, SBB, VLOK, CAR en aansprakelijkheid | BUSINESS |

Een test (`npm run test:fase2`) laat de build falen zodra er in de teksten van de nieuwe pagina's een van deze claims staat: "vaste prijs", "geen meerwerk", "geen verrassingen", een garantie in jaren, "100+", reactietijden in werkuren, Trustoo, "geen aanbetaling" of een em-dash.

## 5. Kwaliteitsronde 22-10 (avond)

- **Code:** "vaste prijs" en "geen verrassingen" verwijderd uit:
  - de stad- en dienstcomponenten;
  - TrustSignals;
  - de FAQ op stadspagina's.

  Andere aanpassingen in de code:
  - reactietermijnen in de wizard, de dienstintake en de fallbackcontent: "zo snel mogelijk";
  - vergunningstekst in de tools: "zo nodig verzorgen wij";
  - "Schade gedekt" vervangen door de verzekeringstekst met verwijzing naar art. 13;
  - "eigen ploegen" vervangen door "vaste vakteams".
- **Sanity:** release `claims-opschoning` (33 documenten) toegevoegd. Er is geen overlap met de andere twee releases. De AV zitten in geen enkele release.
- **Nog open:**
  - de betaalbelofte tegenover de praktijk van een aanbetaling (`06` §2.1);
  - de punten in `06` §4.
