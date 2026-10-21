# 17. Pre-productiereview PR #24 (21-10-2026, 23:05 tot 00:30)

Werkwijze: onafhankelijke code-review door een aparte agent die het werk niet had gemaakt, plus eigen controles op Sanity, de live site en de Vercel-preview. Uitgangspunt: eigen eerdere conclusies niet vertrouwen.

## Oordeel: VOORWAARDELIJK GO

De code kan veilig gemerged worden: ze maakt de site op alle gemeten punten veiliger en betrouwbaarder dan `main`, en alle gevonden fouten in de eigen eerdere wijzigingen zijn hersteld en getest. Productieklaar in commerciële zin is de site daarmee nog niet (zie §5). Twee voorwaarden vóór of direct na merge staan in §4.

## 1. Fouten in mijn eigen eerdere werk (gevonden en hersteld)

| # | Ernst | Fout | Herstel |
|---|---|---|---|
| E1 | HOOG | Advertentiepagina totaalrenovatie: de eerste fase is "Tekenen" (0%), mijn wijziging toonde daar "startbetaling, 0% bij aanvang". Inhoudelijk fout op betaald verkeer. | Label "niets bij ondertekening"; zin aangepast naar het bevestigde schema |
| E2 | HOOG | Vangnet "geen aanbetaling" knipte de woorden weg: kop "Geen aanbetaling" werd leeg, "Er is geen aanbetaling nodig" werd "Er is nodig", witregels werden samengevoegd. | Vervangt nu door de bevestigde, ware formulering "niets bij ondertekening"; tekst zonder claim blijft exact gelijk (getest) |
| E3 | HOOG | 116 stad x dienst-pagina's kregen een **permanente** redirect zonder verkeersdata, inclusief kernwaarde-pagina's als `/rotterdam/uitbouw-aanbouw`, `/schiedam`, `/vlaardingen`, `/katwijk/uitbouw-aanbouw`. Doel was bovendien de stadspagina, niet de dienst. | Geen redirects meer. Kerndiensten (totaalrenovatie, uitbouw, badkamer) blijven altijd indexeerbaar; overige 112 combinaties `noindex, follow` (omkeerbaar, pagina blijft bereikbaar). Sitemap 174 URL's |
| E4 | MIDDEL | Betaalvoorwaarden onnauwkeurig: "startbetaling bij aanvang" en in de Sanity-release "factuur een week voor de start". Bevestigd schema is: niets bij tekenen, 20 tot 25% op de eerste werkdag (factuur ± een week vooraf). | Overal gelijkgetrokken, ook in de release |
| E5 | MIDDEL | `employee`-nodes in structured data voor Scott, Esra en Jarek: dienstverband niet geverifieerd (Jarek is uitvoeringspartner). | Verwijderd; alleen de oprichter staat erin |
| E6 | MIDDEL | "VLOK-erkend voor airco en warmtepompen": de reikwijdte was mijn eigen afleiding, niet bevestigd. | Teruggebracht tot "VLOK-erkend" |
| E7 | MIDDEL | Badkamerprijs (€ 8-10k / € 12-15k) in llms.txt botst met de live FAQ (€ 8-12k, luxe vanaf € 15k): nieuwe tegenstrijdigheid. | Uit llms.txt tot er één besluit is |
| E8 | LAAG | `Content-Signal` stond alleen in de `*`-groep; bots met een eigen groep lezen die niet (RFC 9309). | In elke groep |

## 2. Bevindingen onafhankelijke review (lead-route) en status

| ID | Ernst | Bevinding | Status |
|---|---|---|---|
| L1 | HOOG | Eerste poging slaat op en sterft vóór de mail; herhaalde poging krijgt 409 en meldt succes zonder mail en zonder log | **Opgelost**: `emailedAt` op de lead; bij 409 wordt gecontroleerd en zo nodig alsnog gemaild. Getest |
| L2 | HOOG | Telefoonnummers uit iOS-contacten (bidi-tekens), harde spaties en en-dashes werden geweigerd (400) | **Opgelost**: normalisatie + cijfertelling; geldig e-mail of telefoon volstaat. 8 notaties getest |
| L3 | MIDDEL | Afwijzingen niet gelogd; rate limit telde vóór validatie; gedeelde emmer zonder IP | **Opgelost**: `LEAD_REJECTED`, limiet na validatie, geen limiet zonder IP |
| L4 | MIDDEL | Opslaan zonder time-out: hangende Sanity = niets opgeslagen, niets gemaild | **Opgelost**: 8 s, daarna mail met "[NIET OPGESLAGEN]". Getest |
| L5 | MIDDEL | Mail kan na time-out alsnog worden afgebroken | **Beperkt**: mail nu vóór foto's met 12 s; totaal binnen 30 s. `waitUntil` vereist een extra pakket, niet toegevoegd |
| L6 | LAAG | Foto's stil weggelaten bij herkansing | **Opgelost**: aantal in de leadmail |
| L7 | LAAG | Honeypot `new-password` trekt wachtwoordmanagers aan | **Opgelost**: `autocomplete=off`; ingevuld = alleen markering |
| L8 | LAAG | Ads-conversie ook bij spamverdachte en dubbele inzendingen | **Opgelost** |
| P1 | HOOG | Voorbeeldmodus breekt zonder `SANITY_API_READ_TOKEN` | **Opgelost** (503 met melding). Token aanwezig in Preview (gecontroleerd: vals geheim geeft 401) |
| P3 | MIDDEL | Sitemap en paginametadata gebruikten verschillende bronnen | **Opgelost** |
| P4 | LAAG | Middleware logde ook assets en RSC-prefetches | **Opgelost** |
| S1 | LAAG | `containedInPlace: Zuid-Holland` vast ingesteld | **Verwijderd** |

## 3. Nieuw gevonden productieprobleem (bestond al vóór deze PR)

**Op 16 projectpagina's belt de knop "Bespreek uw project met ons" het nepnummer 06-00000000.** Het nummer staat in Sanity zelf (`project.secondaryLink`), niet alleen in de code-fallback; de eerdere fix raakte het dus niet. Nu: codevangnet in `resolveSmartLink` (placeholder wordt nooit meer gebruikt, getest) en correctie in de Sanity-release.

## 4. Voorwaarden voor GO

1. **Eén echte testaanvraag na deploy** (of vooraf op de preview met `LEAD_NOTIFICATION_TO` tijdelijk naar een testadres; de preview schrijft wel naar de echte `leads`-dataset). Controleren: lead in Studio met `emailedAt`, mail ontvangen. Daarna de testlead verwijderen.
2. **Log-alert instellen** in Vercel op `LEAD_LOST`, `LEAD_EMAIL_FAILED`, `LEAD_EMAIL_NOT_CONFIGURED` en `LEAD_REJECTED`. Zonder alert worden de nieuwe logregels door niemand gezien.

Sterk aanbevolen, niet blokkerend: Sanity-release `geo-betaalvoorwaarden` publiceren (37 documenten) en Search Console controleren op verkeer naar de 112 noindex-combinaties (het account diego.vhs24@gmail.com heeft geen toegang tot de property; dat moet via het account van Therab).

## 5. Openstaande risico's

| Risico | Ernst | Toelichting | Actie |
|---|---|---|---|
| Next.js 14 | HOOG | Drie RSC-DoS-advisories en RSC-cachevergiftiging zijn van toepassing en alleen opgelost in Next ≥ 15.5.16. De image-optimizer-, CSP-nonce- en WebSocket-advisories zijn niet van toepassing in deze configuratie. Geldt even zwaar op `main`. | Aparte PR voor Next 15 + React 19, testen op preview |
| Overige npm-advisories | LAAG | Kritiek/hoog in `tar`, `decompress`, `adm-zip`, `vite` via Sanity CLI-tooling: alleen bij build/CLI, niet op het publieke verzoekpad. 47 naar 34 met niet-brekende updates | Mee met de Sanity-upgrade |
| Onbevestigde claims (al live, niet door deze PR) | HOOG | Trustoo 9,8/557 en "Top Pro 2026", "binnen 1 werkuur teruggebeld" (advertentiepagina's), "5 jaar garantie" (FAQ), "vaste prijs, geen verrassingen" naast nacalculatie in de algemene voorwaarden | Bevestigen of verwijderen; voorwaarden juridisch laten toetsen |
| Tegenstrijdige prijzen | HOOG | Uitbouw vier cijfers, totaalrenovatie twee, draagmuur artikel vs formule | Besluit Therab (docs/16, BESLUIT-2 t/m 4) |
| CSP alleen report-only, zonder rapportage-endpoint | LAAG | Beschermt nog niets | Na een week zonder meldingen afdwingen |
| Lead-mail kan na time-out alsnog wegvallen | LAAG | Zie L5; zichtbaar als `LEAD_EMAIL_FAILED` en lege `emailedAt` | Alert (voorwaarde 2) |

## 6. Verificatie

- `npm run typecheck`: 0 fouten. `npm run lint`: 0 fouten.
- `npm test`: 6/6 GEO-tests en 14/14 lead-scenario's (normaal, Sanity faalt, token ontbreekt, beide falen, mail niet geconfigureerd, herhaalde inzending met en zonder eerdere mail, honeypot, 8 telefoonnotaties, validatie, origin/content-type, rate limit, hangende Sanity).
- Vercel-preview `c18132d`: gebouwd. Crawl van 288 URL's (sitemap + alle 198 stad x dienst + advertentiepagina's): allemaal 200, geen redirects, geen noindex in de sitemap, alle noindex als `noindex, follow`, geen zichtbare "geen/zonder aanbetaling", geen nepnummer, geen lege koppen. JSON-LD zonder losse @id-verwijzingen. robots.txt met Content-Signal in elke groep. Voorbeeldmodus: vals geheim geeft 401.
- Niet getest: een echte geslaagde aanvraag (stuurt mail naar Scott), Rich Results Test (preview achter login), PageSpeed.

## 7. Is de site commercieel beter geworden?

Eerlijk antwoord: **vooral minder risico, nog niet meer omzet.**

Wat aantoonbaar commerciële waarde heeft: leads gaan niet meer stil verloren (dat was het grootste geldlek), nepnummers en onware betaalclaims verdwijnen, en AI-leads worden voor het eerst meetbaar. Dat beschermt omzet.

Wat niet is veranderd: de homepage, de dienstpagina's, het intakeformulier, het aanbod en het bewijs zien er voor een bezoeker van € 150k hetzelfde uit als gisteren. De GEO-wijzigingen (structured data, llms.txt, robots) zijn randvoorwaarden; ze leveren pas iets op als de inhoud en de externe vermeldingen (Trustoo, Google, Bing) kloppen. Effect op AI-vermeldingen is niet gemeten en niet gegarandeerd.

## 8. Wat ontbreekt voor premium positionering (€ 50.000 tot € 250.000+)

In volgorde van verwachte impact:

1. **Bewijs van vergelijkbaar werk.** 6 tot 10 casestudy's met scope, m², doorlooptijd, budgetband, voor/na-foto's en een klantcitaat met toestemming. Nu: type, plaats en duur.
2. **Eén consistent prijsverhaal** per dienst met bandbreedte, wat erin zit en wat niet, en het bevestigde betaalschema als vertrouwensargument ("niets bij tekenen, 20 tot 25% op de eerste werkdag, daarna per fase").
3. **Risico-architectuur op de site:** wat CAR dekt, garantie (alleen als die bestaat), klachtenregeling, opleverprocedure, meerwerkregeling. Dit is wat een klant van € 150k echt wil weten.
4. **Een dienstpagina voor constructief werk** (draagmuur, doorbraken, staal, dakopbouw) met de juiste vergunningsinformatie. Dit is waar DRO onderscheidend en winstgevend is.
5. **Wie doet wat:** Therab (bezichtiging, offerte), Scott (planning), Jarek (techniek), Esra (kwaliteit, betalingen), met foto's. Esra ontbreekt nu, Scott staat met de verkeerde rol.
6. **Intake afgestemd op grote projecten:** eerste stap direct onder de hero, budget vanaf € 50k voor totaalrenovatie en uitbouw, apart pad voor architecten en vastgoedpartners.
7. **Juridische identiteit zichtbaar:** juridische naam, KvK, btw en adres in de footer van elke pagina.
8. **Visuele kwaliteit:** echte projectfotografie in plaats van stockfoto's, minder lettertypen, geen Comic Sans in het fallback-font.
9. **De meetketen sluiten:** analytics aan, leadstatus en contractwaarde terug vanuit Bouwe, zodat zichtbaar wordt welk kanaal projecten van € 50k+ oplevert.
10. **Reputatie buiten de site:** Trustoo-adres en -reactie, Google- en Bing-profiel gelijk, reviewverzoek na elke oplevering.
