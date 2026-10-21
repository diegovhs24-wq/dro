# 16. AI-vindbaarheid en GEO (Generative Engine Optimization)

Datum: 21 oktober 2026. Branch: `feat/geo-ai-findability-audit`.
Doel: DRO Renovaties herkenbaar, vindbaar, citeerbaar en aanbevelingswaardig maken in ChatGPT Search, Google AI Overviews / AI Mode, Gemini, Perplexity en Copilot, voor vragen over totaalrenovaties, uitbouwen en constructieve verbouwingen in Den Haag en Zuid-Holland.

Leeswijzer: **Waargenomen** = zelf gecontroleerd (code, Sanity, live site, zoekresultaten). **Aanname** = onderbouwde inschatting, niet bewezen. Er bestaat geen garantie op AI-vermeldingen; wat wel kan is de kans vergroten door feiten consistent, controleerbaar en machineleesbaar te maken.

---

## 1. Samenvatting in vijf punten

1. **Het grootste GEO-probleem was niet techniek maar tegenstrijdige feiten.** Dezelfde vraag ("wat kost een uitbouw?", "moet ik vooraf betalen?") kreeg op de eigen site drie of vier verschillende antwoorden. Een AI-systeem dat twijfelt, citeert een concurrent of laat DRO weg (aanname, maar breed onderschreven).
2. **"Geen aanbetaling" stond in 24 Sanity-documenten, in de JSON-LD-bedrijfsomschrijving en in een FAQ-antwoord.** Dat klopt niet meer (startbetaling 20 tot 25 procent). Dit is gecorrigeerd: in code direct, in Sanity via een release die nog gepubliceerd moet worden.
3. **De bedrijfsidentiteit is online versnipperd:** drie adressen (Orionstraat 235, Verheeskade 197, Stevinstraat), twee opgeheven KvK-nummers van de oude eenmanszaak, drie naamvarianten, en de huidige B.V. (KvK 94825653) staat nergens buiten de eigen site. Drimble toont de oude eenmanszaak als "opgeheven": risico dat een AI concludeert dat DRO gestopt is.
4. **De sterkste bestaande AI-route is Trustoo**, niet de eigen site. De Trustoo-lijst "Top 10 aannemers Den Haag" is het meest terugkerende zoekresultaat, en DRO staat daar op 1 (9,8 uit 520 reviews). Op de eigen site verschijnt DRO nauwelijks bij niet-merkgebonden zoekvragen.
5. **De technische basis was al bovengemiddeld** (server-rendering, llms.txt, Markdown-negotiatie, schema). Die is nu opgeschoond tot één consistente entiteit en een feitelijk bedrijfsprofiel.

---

## 2. Bevindingen per onderdeel

### GEO-01 AI-crawlbaarheid (robots.txt): opgelost in code

**Waargenomen (live):** robots.txt van 323 regels, waarvan ~286 commentaarregels met alle URL's. `Content-Signal: ai-train=no` terwijl GPTBot, Google-Extended en CCBot (trainingscrawlers) expliciet waren toegestaan. Claude-SearchBot, Claude-User en Perplexity-User niet benoemd; verouderde namen `Claude-Web` en `anthropic-ai` wel.

**Gedaan (`app/robots.txt/route.ts`):**
- Drie groepen, apart benoemd: zoek- en antwoordcrawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot, Applebot, DuckDuckBot), door gebruikers aangestuurde fetchers (ChatGPT-User, Claude-User, Perplexity-User, MistralAI-User) en trainingscrawlers (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent).
- `/api/`, `/studio` en `/studio-aanvragen` uitgesloten voor alle groepen.
- URL-dump verwijderd (sitemap staat er gewoon in).
- Content-Signal staat nu binnen de `User-agent: *`-groep en volgt één schakelaar `ALLOW_TRAINING`.

**Beslissing voor Therab (BESLUIT-1):** training staat nu op **toegestaan** (`ai-train=yes`), omdat dat overeenkomt met wat de oude robots.txt feitelijk deed en omdat merkbekendheid in trainingsdata de herkenning van "DRO Renovaties" helpt (aanname). Wilt u geen training: zet `ALLOW_TRAINING = false`. Zoek- en AI-antwoordzichtbaarheid blijft dan gelijk, die loopt via de eerste twee groepen.

### GEO-02 Server-side rendering en indexeerbaarheid: in orde, kleine fixes

**Waargenomen (live crawl, 286 URL's):** alle 200, alle self-canonical, geen noindex in de sitemap, inhoud volledig in de HTML zonder JavaScript. Dat is precies wat AI-crawlers nodig hebben (de meeste AI-crawlers voeren geen JavaScript uit).

Open punten:
- **Apex-domein redirect ontbreekt:** `https://dro-renovaties.nl/...` geeft 200 in plaats van 301 naar www. Oplossen in Vercel > Project > Domains (dro-renovaties.nl → redirect naar www.dro-renovaties.nl, 308). Handmatig, zie §5.
- **go.dro-renovaties.nl** geeft een SSL-fout. Certificaat of DNS herstellen of het subdomein verwijderen.
- Advertentiepagina's stonden op `noindex, nofollow`; nu `noindex, follow` (linkwaarde blijft stromen).

### GEO-03 Consistentie van feiten: deels opgelost, deels besluit nodig

Dit is het belangrijkste onderdeel. Overzicht van tegenstrijdigheden (waargenomen in Sanity, code en live):

| Onderwerp | Wat er staat | Waar | Status |
|---|---|---|---|
| Betaling vooraf | "geen aanbetaling", "nooit vooruit", "het financiële risico ligt bij ons" | 18 stadspagina's, home, over-ons, werkwijze, totaalrenovatie-pagina en -dienst, siteSettings, 2 FAQ's, advertentiepagina | **Gecorrigeerd** in code; Sanity-release klaar (§4) |
| Juridische naam | "DRO Bouw- en Aannemingsbedrijf B.V." (met koppelteken) | siteSettings, footer, JSON-LD | **Gecorrigeerd** in code (KvK-schrijfwijze), Sanity in release |
| Totaalrenovatie per m² | FAQ: € 1.000 tot € 1.250. Kennisbank: € 500 tot € 2.500 | FAQ vs artikel `totaalrenovatie-kosten-per-m2` | **BESLUIT-2** |
| Uitbouw/aanbouw per m² of totaal | € 1.500 tot € 3.000/m² (artikel), € 2.500 tot € 3.500/m² (FAQ), "3 m diep vanaf € 35.000" (FAQ), "3 m diep vanaf € 50.000" (FAQ) | artikel `uitbouw-kosten`, FAQ's | **BESLUIT-3**, vier cijfers voor dezelfde vraag |
| Draagmuur verwijderen | Artikel: € 1.500 tot € 5.000. Rekenformule: volledige muur 3 × 2,6 m ≈ € 5.555 excl. btw; intern "vanaf € 6.500" | artikel vs `lib/draagmuurPrice.ts` | **BESLUIT-4** |
| Bouwtijd uitbouw | 6 tot 12 weken vs 3 tot 4 weken op locatie | twee FAQ's | Verduidelijken: "3 à 4 weken op locatie, 6 à 12 weken totale doorlooptijd" |
| Garantie | "standaard 5 jaar garantie" | FAQ badkamer | **Niet geverifieerd.** Bevestigen of verwijderen |
| Reactietijd | "binnen 1 werkuur", "binnen één werkdag", "binnen 24 uur" | advertentiepagina's, wizard, FAQ's | Eén belofte kiezen |
| Vaste prijs | "vaste prijs, meerkosten alleen als u zelf iets wijzigt" vs algemene voorwaarden met nacalculatie | FAQ vs voorwaarden | **Juridisch laten toetsen** (BESLUIT-5) |
| Reviews | 273 Google (site) vs 520 uit 4 bronnen (Trustoo) | site, Trustoo | Nu centraal in `BUSINESS.reviews` met datum en bron; bron altijd noemen |
| Ervaring/omvang | "15+ jaar ervaring", "35+ vakmensen", "100+ projecten" | fallback, feitenbalk, CMS | 15+ en 35+ verwijderd uit code; "100+" alleen in CMS (niet gerenderd) |

**Gedaan in code:**
- `lib/seo/business.ts`: één bron van geverifieerde feiten met `verifiedAt`. Gebruikt door JSON-LD, llms.txt, Markdown, meta descriptions, feitenbalk, reviewlabels en advertentiepagina's. Review-cijfer stond op 15 plekken hardcoded; nu één plek.
- `stripOutdatedClaims` + `sanitizeOutdatedClaimsDeep` in `fetchSanity`: vervangt "geen/zonder aanbetaling" in gepubliceerde CMS-tekst door de bevestigde formulering "niets bij ondertekening" tot de release is gepubliceerd. Tekst zonder die claim blijft byte-voor-byte gelijk (getest). Na publicatie van de release is dit een no-op en kan het blijven staan als vangnet.

**Advies prijzen (BESLUIT-2 t/m 4):** de kennisbank-artikelen liggen voor uitbouw onder alle gevonden bronnen van 2026 (Trustoo € 2.000 tot € 4.000/m², Homedeal € 1.800 tot € 3.800/m², Topvakmannen € 1.800 tot € 3.500/m²). Kies per dienst één bandbreedte op basis van eigen nagecalculeerde projecten, zet die in `BUSINESS.priceIndications`, en laat de FAQ's en artikelen ernaar verwijzen. Pas dan worden de prijzen citeerbaar.

### GEO-04 Entity SEO en structured data: opgelost in code

**Waargenomen (live):** drie overlappende bedrijfsentiteiten (`#organization`, `#localbusiness`, `#contractor`), telefoon niet internationaal, geen postcode, `sameAs` met een Google-zoek-URL vol trackingparameters, geen founder, geen btw-nummer, `areaServed` met Amsterdam en Utrecht zonder pagina, artikelauteur "Therab" als losse Person, zelfgepubliceerde `aggregateRating` op ~285 pagina's.

**Gedaan (`lib/seo/structured-data.ts`, `lib/seo/site.ts`):**
- Eén bedrijfsentiteit `@type: GeneralContractor`, `@id: https://www.dro-renovaties.nl/#organization`. Alle Service-, WebPage- en BlogPosting-nodes verwijzen ernaar via `@id`.
- Toegevoegd: `legalName` (KvK-schrijfwijze), `alternateName`, `identifier` (KvK en btw), `vatID`, `founder` (Person, Therab Raja), `hasCredential` (VCA, SBB-leerbedrijf, VLOK), `knowsAbout`, `knowsLanguage`, `hasOfferCatalog` (alle diensten met URL), telefoon `+31850871814`, `postalCode` 2516 AS (bevestigd via SBB Stagemarkt en de BAG-gegevens op allecijfers.nl: enige postcode van de Orionstraat).
- `WebSite`-node met `@id` en `publisher`; elke `WebPage` heeft `isPartOf`, `about` en `publisher`.
- Artikelen: auteur gekoppeld aan dezelfde founder-Person (E-E-A-T komt bij één herkenbare persoon samen), `dateModified`, `isPartOf`, `mainEntityOfPage`.
- `areaServed` alleen nog: Den Haag, Haaglanden, Zuid-Holland, Randstad plus de 22 steden met een eigen pagina.
- `sameAs` opgeschoond (Google-URL teruggebracht tot `kgmid`, trackingparameters weg).
- `aggregateRating` **verwijderd** uit JSON-LD. Google toont geen sterren voor zelfgepubliceerde LocalBusiness-reviews en ziet het als beleidsrisico. Het cijfer blijft als zichtbare tekst met bron.
- JSON-LD wordt veilig ge-escaped (`<` en U+2028/2029), zodat CMS-tekst de scripttag niet kan breken.

**Nog te doen (handmatig):** de Google-bedrijfsprofiel-URL met `cid=` opzoeken (Google Maps > Delen) en samen met Trustoo, Facebook, Werkspot en Trustpilot in Sanity > Site settings > Organization SEO > `sameAs` zetten. Openingstijden toevoegen zodra die vastliggen.

### GEO-05 Dunne en dubbele pagina's: opgelost in code

**Waargenomen:** de sitemap bevatte 22 steden × 9 diensten = 198 stad-x-dienst-URL's, terwijl Sanity maar voor ~83 combinaties lokale inhoud heeft (`popularServices`). Tekstovereenkomst Delft vs Gouda `/totaalrenovatie` na naamwissel: 0,91. Dat is het patroon dat Google "doorway pages" noemt, en AI-systemen citeren zulke pagina's zelden (aanname).

**Gedaan:**
- Sitemap neemt alleen combinaties op uit `popularServices` plus de kerndiensten totaalrenovatie, uitbouw en badkamer (`lib/seo/sitemap-data.ts`): 174 URL's.
- Overige combinaties blijven bereikbaar maar krijgen `noindex, follow` (omkeerbaar; geen redirects). Zie 17, E3, voor waarom de eerdere permanente redirects zijn teruggedraaid.

**Nog te doen:** ook de overgebleven ~83 combinaties zijn grotendeels sjabloon. Advies: per stad maximaal 2 à 3 diensten met echt lokaal bewijs (een project in die stad, wijkkenmerken, gemeentelijke regels) en de rest samenvoegen. Warmtepomp en zonnepanelen in kleine kernen eerst.

### GEO-06 llms.txt en Markdown voor agents: opgelost in code

**Waargenomen:** llms.txt bestond, maar bevatte "vaste prijs vooraf", "geen aanbetaling" uit CMS-teksten, het oude review-getal en geen KvK-adres of team. De Markdown-versie (die WebFetch-achtige agents krijgen bij `Accept: text/markdown`) had als titel altijd "DRO Renovaties" en twee H1's.

**Gedaan:**
- `/llms.txt` herschreven: kernfeiten (handelsnaam, juridische naam, KvK, btw, adres, telefoon, oprichter, werkgebied, erkenningen, verzekeringen, betaalvoorwaarden, reviews met datum, controle-datum), specialisaties, voor wie DRO past, prijsindicaties met disclaimer, werkwijze volgens de echte rolverdeling, en alle diensten, steden, projecten en artikelen.
- Markdown-versie per pagina: echte paginatitel in de front-matter, één H1, en onderaan dezelfde blok bedrijfsgegevens.
- api-catalog: domeinnaam-typfout hersteld.

**Let op:** llms.txt is **geen bewezen rankingfactor** voor Google of ChatGPT. Het kost niets en helpt agents die de site bezoeken, maar de echte winst zit in GEO-03, GEO-04 en GEO-08.

### GEO-07 Citeerbare content: deels, grotendeels content-werk

**Waargenomen:** 26 kennisbankartikelen van Therab (± 250 tot 600 woorden), gedateerd, met korte "In het kort"-samenvatting. Goed fundament. Zwakke punten: geen bronverwijzingen, geen tabellen, prijsranges die onderling botsen (GEO-03), geen artikel over aannemerskeuze, geen dienstpagina voor draagmuur verwijderen (alleen een noindex-advertentiepagina), dienstpagina's totaalrenovatie en uitbouw zijn dun (± 1.900 tekens) terwijl de stadsvarianten 12.000 tekens hebben.

Wat AI-systemen vaak citeren (waargenomen bij Verbouwstart, Trustoo, Homedeal): een direct antwoord bovenaan, een prijstabel met btw-vermelding, een "laatst gecontroleerd"-datum, een genoemde auteur, en verwijzingen naar officiële bronnen.

**Contentplan (prioriteit op omzet, niet op zoekvolume):**

| # | Pagina | Type | Waarom |
|---|---|---|---|
| C1 | Draagmuur verwijderen (Den Haag) | Nieuwe indexeerbare dienstpagina | Hoge marge, query 4 wordt nu gewonnen door nichebedrijven; DRO heeft al formule, proces en vergunningkennis |
| C2 | Wat kost een totaalrenovatie in 2026 | Herschrijving bestaand artikel | Eén range (BESLUIT-2), tabel per woningtype, btw-vermelding, rekenvoorbeeld |
| C3 | Wat kost een uitbouw in 2026 | Herschrijving | Eén range (BESLUIT-3), tabel per diepte, wat zit erin |
| C4 | Draagmuur verwijderen: kosten, vergunning, constructeur | Herschrijving | Formule als tabel, Omgevingswet correct (zie onder) |
| C5 | Hoe kies je een betrouwbare aannemer (checklist) | Nieuw | Wordt veel gevraagd aan AI; DRO kan KvK, verzekering, betaalschema, referenties zelf aantonen |
| C6 | Hoe lang duurt een totaalrenovatie / uitbouw | Samenvoegen FAQ's tot één artikel | Lost de tegenstrijdige doorlooptijden op |
| C7 | Dienstpagina's totaalrenovatie en uitbouw uitbreiden | Bestaande pagina's | Proces, prijzen, projecten, auteur, FAQ, links naar C2/C3 |

**Juridische feiten die DRO kan gebruiken (waargenomen, met bron):**
- Een dragende muur verwijderen of doorbreken wijzigt de draagconstructie; verbouwen is alleen vergunningvrij onder Bbl art. 2.27 als de draagconstructie niet wijzigt. Dus: omgevingsvergunning voor de technische bouwactiviteit nodig. Bron: [IPLO, vergunning of melding technische bouwactiviteit](https://iplo.nl/regelgeving/regels-voor-activiteiten/technische-bouwactiviteit/plichten/vergunning-melding-technische-bouwactiviteit/) (gewijzigd 17-08-2026).
- Gemeente Den Haag noemt "een dragende muur doorbreken" letterlijk als voorbeeld van een vergunningplichtige verbouwing, aanvraag via het Omgevingsloket, en de start van de werkzaamheden moet na verlening gemeld worden. Bron: [Gemeente Den Haag, omgevingsvergunning aanvragen](https://www.denhaag.nl/nl/vergunningen-en-ontheffingen/omgevingsvergunning-aanvragen/) (gewijzigd 24-09-2026).
- Niet geverifieerd: de exacte meldtermijn voor de start van de bouw (vermoedelijk 2 werkdagen). Eerst controleren op IPLO "Bouwmelding en gereedmelding" voor publicatie.

### GEO-08 Lokale AI-zichtbaarheid en vermeldingen elders: handmatig

**Waargenomen vermeldingen (NAP-tabel):**

| Platform | Naam | Adres | Probleem |
|---|---|---|---|
| Eigen site | DRO Renovaties | Orionstraat 235 | Juist (na deze branch: + postcode, KvK, btw in schema) |
| SBB Stagemarkt | DRO Renovaties | Orionstraat 235, 2516 AS | Juist |
| Trustoo (Den Haag, aannemer + badkamer) | DRO Renovaties | **Verheeskade 197** | Oud adres, geen link naar de site, "7 jaar / 14 jaar / sinds 2021" tegenstrijdig, negatieve review van 7 jan 2026 zonder reactie |
| Trustoo (Rijswijk) | DRO Renovaties | Verheeskade 197 | Dubbel profiel |
| Klustarief | DRO Renovaties | Verheeskade 197 | Oud adres, "5 medewerkers", geen websitelink |
| Beurs Eigen Huis / Realiseerjedroomhuis | DRO-Renovaties | Verheeskade 197 | Oud adres, naam met koppelteken |
| Drimble | DRO Renovaties (eenmanszaak) | Stevinstraat | **Oude KvK 87737523 "opgeheven"** + tweede oude KvK 85412848 |
| LinkedIn | "DRO Renovaties" en "DRO Renovaties & Bouw" | niet te controleren | Twee naamvarianten |
| Werkspot, Trustpilot, Trustindex, Facebook, Instagram | bestaan | niet te controleren | Handmatig nalopen |
| Google Bedrijfsprofiel, Bing Places | niet te controleren vanaf hier | | Handmatig nalopen |
| Niet gevonden | Homedeal, Houzz, Bouwgarant, VLOK-ledenlijst, Goudengids, Cylex, Infobel, Opendi | | Overwegen (zie §5) |

Bronnen: [Trustoo Den Haag top 10](https://trustoo.nl/zuid-holland/den-haag/aannemer/), [Trustoo profiel](https://trustoo.nl/zuid-holland/den-haag/aannemer/dro-renovaties/), [Klustarief](https://klustarief.nl/aannemer/dro-renovaties/), [Drimble](https://drimble.nl/bedrijf/den-haag/51459973/dro-renovaties.html), [Beurs Eigen Huis](https://www.beurseigenhuis.nl/deelnemers/dro-renovaties), [SBB Stagemarkt](https://stagemarkt.nl/leerbedrijven/profiel_50a62d74-ac82-4300-bcbd-0dba407f8c99).

### GEO-09 AI-aanbevelingsanalyse (reproduceerbare proxy)

We kunnen ChatGPT, Gemini en Perplexity niet rechtstreeks bevragen vanuit deze omgeving. Daarom een proxy: AI-zoekmachines gronden hun antwoord grotendeels in zoekresultaten en lijsten. Twaalf zoekvragen, 21-10-2026 (waargenomen):

| Zoekvraag | DRO zichtbaar? | Wie wel |
|---|---|---|
| beste aannemer totaalrenovatie Den Haag | Alleen via Trustoo (#1 op hun lijst) | Optimum, Klusmaatjes, Hemmerworks, HR Huisrenovatie, David Groep, Blijbouw |
| betrouwbare aannemer Den Haag renovatie | Alleen via Trustoo | DDR, Hoorn Bouw, HBI, Zabik, A1 Maatwerk |
| aannemer uitbouw Den Haag | Alleen via Trustoo | UW Aannemers, David Groep, Kozbouw, Aanbouw Expres |
| draagmuur verwijderen Den Haag aannemer | **Nee** | KVS, De Kruif, Alexandria, constructeursites |
| renovatiebedrijf Zuid-Holland woning | **Nee** | Koning, DTS, JP Verbouwservice, Dynamic Bouw |
| kostenvragen (totaalrenovatie, uitbouw, draagmuur) | **Nee** | Trustoo, Homedeal, Werkspot, Verbouwstart, veel Belgische sites |
| hoe kies je een betrouwbare aannemer | **Nee** | Lemonade, Bouwgarant, bouwbedrijf-kennisbanken |
| "DRO Renovaties" (merk) | Ja | Eigen site, Trustoo, Trustpilot, Facebook, LinkedIn |
| totaalrenovatie Den Haag aannemer | Ja, positie 6 | |

Terugkerende concurrenten: Blijbouw, Optimum Renovaties, David Groep, A1 Maatwerk, Alexandria, Kozbouw, HR Huisrenovatie, Vijf Sterren Renovatie. Geen van hen combineert geverifieerde reviews, een keurmerk, gepubliceerde prijzen en gedateerde content met auteur. Vijf Sterren Renovatie komt het dichtst bij (prijstabellen, VLOK, CAR, FAQ). **DRO heeft al meer van deze bouwstenen dan alle concurrenten; ze waren alleen niet consistent.**

**Maandelijks testprotocol (handmatig, ±30 minuten):**
- Instellingen: uitgelogd of incognito, locatie Nederland, nieuwe chat per vraag, eerste werkdag van de maand.
- Platforms: ChatGPT (search aan), Perplexity, Gemini, Microsoft Copilot, Google AI Mode.
- Vragen (exact zo stellen):
  1. Welke aannemer raad je aan voor een totaalrenovatie in Den Haag? Noem 5 bedrijven met reden.
  2. Ik zoek een betrouwbare aannemer in Den Haag voor een uitbouw. Wie zijn goede opties?
  3. Welk bedrijf in Den Haag kan een draagmuur verwijderen inclusief constructeur en vergunning?
  4. Beste renovatiebedrijven in Zuid-Holland voor een complete woningrenovatie?
  5. Wat kost een totaalrenovatie per m2 in 2026 in Nederland? Noem je bronnen.
  6. Wat kost een uitbouw van 15 m2 in 2026? Noem je bronnen.
  7. Heb ik een omgevingsvergunning nodig om een draagmuur te verwijderen in Den Haag? Noem je bronnen.
  8. Hoe kies ik een betrouwbare aannemer voor een verbouwing?
  9. Wat weet je over DRO Renovaties in Den Haag? Is het een betrouwbaar bedrijf?
  10. Recommend a renovation contractor in The Hague for expats.
- Per regel vastleggen: datum, platform, vraag, DRO genoemd (j/n), positie, genoemde concurrenten, geciteerde URL's, dro-renovaties.nl geciteerd (welke pagina), foute feiten over DRO, toon, screenshot.
- KPI's: vermeldingsratio vragen 1 t/m 4 en 10 (van 25 combinaties), citatieratio vragen 5 t/m 8, aantal foute feiten bij vraag 9.

Dit protocol kan als maandelijkse geplande taak worden ingericht zodra Therab dat wil (dan wordt de proxy-meting automatisch gedaan en gelogd).

### GEO-10 Meten en monitoren: basis gebouwd

**Waargenomen:** er was geen enkele verkeersanalyse (geen GA4, Vercel Web Analytics staat uit). Alleen Google Ads-conversies na toestemming. AI-verkeer was dus onzichtbaar; ChatGPT-verkeer (dat `utm_source=chatgpt.com` meestuurt) werd in de leadmail als "Campagne (chatgpt.com)" gelabeld.

**Gedaan:**
- Nieuw leadkanaal **"AI-assistent (ChatGPT / Perplexity / Gemini / Copilot / Claude / ...)"** op basis van `utm_source` en verwijzer (`lib/leadInsights.ts`). Staat in Sanity bij elke lead en in de leadmail. Hiermee is per lead te zien of hij uit AI kwam, en later of hij tot opdracht leidde.
- Middleware logt `AI_CRAWL bot=<naam> path=<pad>` en `AI_REFERRAL platform=<naam> path=<pad>` (geen IP of persoonsgegevens). Te bekijken in Vercel > Logs.

**Dashboardontwerp (nog te bouwen, na akkoord):**

| Blok | Bron | Meetfrequentie |
|---|---|---|
| AI-crawls per bot per week, top-pagina's | Vercel-logs (`AI_CRAWL`), via log drain of maandexport | Wekelijks |
| AI-bezoeken per platform en landingspagina | `AI_REFERRAL` + Vercel Web Analytics (aanzetten, kosteloos tot een limiet; besluit Therab) | Wekelijks |
| Leads uit AI per platform, met beoordeling (kansrijk/twijfel/past niet) | Sanity `formSubmission.channel` | Doorlopend |
| Offertes en opdrachten uit AI-leads, omzet en marge | Bouwe/mijndro.app (koppeling op lead-ID) | Maandelijks |
| Vermeldingsratio en citatieratio | Testprotocol GEO-09 | Maandelijks |
| Merkvermeldingen elders (nieuwe reviews, nieuwe listings, foute feiten) | Handmatig of Google Alerts op "DRO Renovaties" | Maandelijks |

Noordster blijft brutowinst uit websiteprojecten; AI-zichtbaarheid is een leidende indicator, geen doel op zich.

---

## 3. Wat er in de code is veranderd (GEO-gerelateerd)

| Bestand | Wijziging |
|---|---|
| `lib/seo/business.ts` (nieuw) | Geverifieerde bedrijfsfeiten, review-momentopname met datum, prijsindicaties, claim-vangnet |
| `lib/seo/site.ts` | Organisatiegegevens uit `BUSINESS`; KvK-naam, btw, internationaal telefoonnummer, opgeschoonde `sameAs`, beperkte `areaServed` |
| `lib/seo/structured-data.ts` | Eén GeneralContractor-entiteit, WebSite, founder, team, credentials, offercatalogus, @id-verwijzingen, geen aggregateRating |
| `components/seo/JsonLd.tsx` | Veilige serialisatie |
| `app/(site)/layout.tsx` | Diensten in de offercatalogus |
| `app/robots.txt/route.ts` | Herschreven (GEO-01) |
| `app/llms.txt/route.ts` | Herschreven (GEO-06) |
| `lib/seo/markdown.ts` | Echte titel, één H1, NAP-blok, claim-filter |
| `lib/seo/sitemap-data.ts` | Alleen stad-x-dienst met lokale inhoud |
| `app/(site)/[slug]/[service]/page.tsx` | Redirect/noindex dunne combinaties, review-tekst centraal |
| `lib/sanity.ts` | Claim-vangnet op gepubliceerde content |
| `lib/leadInsights.ts`, `sanity/schemaTypes/documents.ts` | AI-assistent als leadkanaal |
| `middleware.ts` | AI_CRAWL / AI_REFERRAL-logging |
| `app/.well-known/api-catalog/route.ts` | Domeintypfout |
| `scripts/tests/geo.test.mjs` | 4 tests (claim-filter, reviews, juridische naam, AI-kanaal) |

---

## 4. Sanity: klaargezette correcties (nog niet gepubliceerd)

In Sanity Studio staat de release **"Correctie betaalvoorwaarden en bedrijfsnaam (GEO-audit)"** (`geo-betaalvoorwaarden`) met 37 documenten:
- 18 stadspagina's: "geen aanbetaling" / "zonder aanbetaling" vervangen door "betaling per afgeronde fase" in `whyDro` en meta description.
- Site settings: juridische naam zonder koppelteken; organisatieomschrijving zonder "geen aanbetaling".
- FAQ "Moet ik vooraf iets betalen om te starten?": nu "Bij het tekenen betaalt u niets. Op de eerste werkdag betaalt u een startbetaling van 20 tot 25 procent..." (conform het bevestigde betaalschema op de advertentiepagina).
- 16 projecten: knop "Bespreek uw project" van nepnummer 06-00000000 naar 085 087 1814.
- FAQ "En als jullie halverwege stoppen?": "nooit vooruit / het financiële risico ligt bij ons" vervangen.

**Actie Therab:** Studio > Releases > controleren > publiceren. Daarna zijn de code-vangnetten een no-op.

**Nog handmatig in Studio (rich text, niet automatisch aangepast):** zoek op "aanbetaling" in de pagina's `home`, `over-ons`, `werkwijze`, `totaalrenovatie` (page en service) en pas de tekst aan. Ook: `servicesIndex`-titel "Services Index Page" en "Our Services/Our Projects" vervangen door Nederlandse titels en een meta description; projecttype van `totaalrenovatie-gezinswoning-rijswijk` (staat als badkamer in Alphen) en de plaats van `badkamertahiti` (Den Haag vs Zoetermeer) rechtzetten.

---

## 5. Roadmap externe platforms en handmatig werk

| # | Actie | Wie | Effort | Impact (hypothese) |
|---|---|---|---|---|
| E1 | Release `geo-betaalvoorwaarden` publiceren + rich-text-correcties (§4) | Therab | 30 min | Hoog: haalt foute feiten uit alles wat AI leest |
| E2 | Prijsbesluiten 2 t/m 4 nemen en in `BUSINESS.priceIndications` + FAQ's + artikelen doorvoeren | Therab + ontwikkelaar | 2 u | Hoog: maakt prijzen citeerbaar |
| E3 | Google Bedrijfsprofiel: adres Orionstraat 235, 2516 AS; juiste categorie (Aannemer / Renovatiebedrijf), diensten, openingstijden, foto's van echte projecten, Q&A met dezelfde antwoorden als de site | Therab | 1 u | Hoog: Google AI Overviews leunen op het profiel (aanname) |
| E4 | Bing Places claimen en synchroniseren met Google (Copilot en ChatGPT Search gebruiken Bing-gegevens, aanname) | Therab | 30 min | Middel-hoog |
| E5 | Trustoo: adres bijwerken, websitelink toevoegen, Rijswijk-duplicaat laten samenvoegen, oprichtingsjaar rechtzetten, **reageren op de review van 7 jan 2026** | Therab / Scott | 1 u | Hoog: Trustoo is de meest geciteerde bron |
| E6 | Klustarief, Beurs Eigen Huis, Realiseerjedroomhuis, Werkspot, Facebook, LinkedIn: adres en naam gelijk trekken, één LinkedIn-naam | Scott | 2 u | Middel |
| E7 | Drimble: laten koppelen aan de nieuwe B.V. of vermelding van de opgeheven eenmanszaak laten aanpassen | Therab | 30 min | Middel: voorkomt "bedrijf opgeheven" in AI-antwoorden |
| E8 | Vercel: apex-domein dro-renovaties.nl → 308 naar www; go.dro-renovaties.nl certificaat herstellen of verwijderen | Mubeen / Therab | 15 min | Middel |
| E9 | Vercel Web Analytics aanzetten (of Plausible) voor AI-verwijzingsverkeer | Therab (kostenbesluit) | 10 min | Meetbaarheid |
| E10 | Reviewverzoek na elke oplevering op Google en Trustoo (zonder beloning, iedereen vragen) | Esra | Doorlopend | Middel-hoog |
| E11 | Echte externe vermeldingen: IamExpat-beurs (pagina of recap), SBB-leerbedrijf in lokale media, leverancierspagina's (Bouwmaat, Sanisale) met link | Therab | Doorlopend | Middel |
| E12 | Overwegen: Bouwgarant of vergelijkbaar keurmerk (wordt in "aannemer kiezen"-bronnen genoemd) | Therab | Besluit | Middel |
| E13 | Testprotocol GEO-09 maandelijks draaien of automatiseren | Therab / Claude | 30 min/mnd | Meetbaarheid |

---

## 6. Metingen en wat nog niet gemeten is

- **Gemeten:** live crawl (286 URL's), robots, sitemap, structured data, NAP op 12 platforms, 12 zoekvragen als AI-proxy, tegenstrijdigheden in 53 FAQ's en 26 artikelen.
- **Niet gemeten (geen toegang):** Google Search Console- en Bing Webmaster-data, Google Bedrijfsprofiel-statistieken, echte antwoorden van ChatGPT/Gemini/Perplexity, verkeersdata (bestaat niet). De nulmeting voor AI-vermeldingen moet dus de eerste run van het testprotocol zijn.
- **Bekende beperking van de proxy:** de gebruikte zoekmachine is niet Google en niet ChatGPT. Uitkomsten zijn richtinggevend.
