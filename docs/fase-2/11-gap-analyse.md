# Gap-analyse: nieuwe DRO-website tegenover maximaal haalbaar (22-10-2026)

**Basis:**
- preview `9fbe4bb` (#26), vergeleken met productie (`www.dro-renovaties.nl`, commit `d4d5400`);
- metingen in de browser op 1280, 820 en 390 px;
- broncode;
- twee premium concurrenten in de regio als ijkpunt (Vijf Sterren Renovatie, Den Haan Renovators).

**Niet gemeten:**
- mobiele velddata (Core Web Vitals);
- Search Console;
- het Google-bedrijfsprofiel;
- conversiecijfers.

Ik heb deze website zelf gebouwd. Juist daarom zijn de scores streng: 10 = aantoonbaar optimaal, 7 = goed maar onbewezen, 5 = matig.

## Scores

| # | Onderdeel | Score | Ten opzichte van productie |
|---|---|---|---|
| 1 | Premium UX/UI en uitstraling | **5,5** | Inhoud en ritme beter, consistentie **slechter** |
| 2 | Conversie en leadkwaliteit | **6,5** | Beter (routes, budgetkwalificatie), onbewezen |
| 3 | Salespsychologie en bezwaren | **7** | Duidelijk beter |
| 4 | Vertrouwen en autoriteit | **5,5** | Eerlijker, maar nog weinig bewijs |
| 5 | SEO en lokale vindbaarheid | **7** | Beter |
| 6 | AI-findability | **7,5** | Duidelijk beter |
| 7 | Google Ads en landingspagina's | **6** | Iets beter, meting zwak |
| 8 | Frontend, backend, security, performance | **8** | Beter |
| 9 | Analytics, CRM-attributie, verkoopmeting | **4** | Gelijk |
| 10 | Mobiel en toegankelijkheid | **6,5** | Iets beter |
| 11 | Concurrentiepositie | **6** | Beter |
| 12 | Portfolio, fotografie, casestudy's | **4,5** | Iets beter |

## Per onderdeel

### 1. Premium UX/UI (5,5)
**Gemeten:** de preview gebruikt vier lettertypefamilies.

| Pagina's | Lettertype | Achtergrond | Hoeken |
|---|---|---|---|
| Over-ons, werkwijze, diensten, stad, kennisbank, zakelijk | Poppins | Warm crème (#F7F3EC, #FBFAF7) | 6 tot 8 px, knop met schaduw |
| Home, routes, portfolio, advertentiepagina totaalrenovatie | Archivo en Hanken Grotesk | Koel kalkgrijs (#EEF0EE) | 4 px, geen schaduw |
| Intake op /contact | Bricolage Grotesque | n.v.t. | n.v.t. |

- **Stijlbreuk:** een bezoeker die van de homepage naar "Over ons" klikt, komt op een andere website. Dat is precies de stijlbreuk die uw referentiescreenshot verbiedt.
- **De referentie** (over-ons, Poppins, warm crème, afgeronde beeldvlakken, oranje knop met zachte schaduw) is de huidige stijl. De nieuwe premiumpagina's wijken er dus van af, niet andersom.
- **Productie is op dit punt beter:** daar is het één stijl.
- **Lettertypen:** door vier families laadt de preview 311 kB aan fonts, tegenover 189 kB op productie.
- **Sterk:** de inhoudelijke opbouw van de nieuwe pagina's (rustig ritme, echte projectfoto's, duidelijke hiërarchie). Die blijft waardevol in de referentiestijl.
- **Kritische noot binnen uw richting:** zware Poppins-koppen met oranje schaduwknoppen ogen eerder vriendelijk-mkb dan architect-premium. Binnen de referentiestijl komt premium uit terughoudendheid: minder oranje, minder schaduw, meer witruimte, grotere beelden.

### 2. Conversie en leadkwaliteit (6,5)
**Sterk:**
- twee routes;
- een budgetschaal tot € 250.000 en meer;
- per route gerichte vragen;
- rekenhulp inclusief btw;
- bellen en WhatsApp op elke pagina;
- intake van 11 stappen die volledig werkt.

**Niet bewezen:**
- **Afhaakpercentage per stap:** niet bekend, en het wordt nu niet gemeten (zie onderdeel 9).
- **Reactiebelofte:** "zo snel mogelijk" is zwakker dan de concurrentie ("binnen 24 uur") en dan de oude advertentiepagina ("binnen 1 werkuur").
- **Afspraak plannen:** er is geen directe agendaplanning voor een opname.

### 3. Salespsychologie (7)
**Sterk:**
- de zes zekerheden beantwoorden de echte angsten bij € 150.000: meerwerk, betalen, planning, oplevering;
- de antwoorden zijn eerlijk en met AV-artikel onderbouwd, wat geloofwaardiger is dan "geen verrassingen";
- de keuring van € 399 wordt verrekend, dat werkt als risico-omkering.

**Zwak:**
- **Garantie:** 12 maanden, terwijl de directe concurrent 24 maanden noemt (plus 5 jaar op leidingwerk en 10 jaar op waterdichting badkamer).
- **Ervaring:** geen "sinds [jaar]" en geen aantal opgeleverde projecten.

### 4. Vertrouwen en autoriteit (5,5)
**Sterk:**
- 4,8 uit 273 Google-reviews, meer dan de concurrent (4,9 uit 139);
- echte teamfoto;
- VCA, SBB en VLOK.

**Zwak:**
- **Casestudy's:** nul gepubliceerd.
- **Reviews:** gaan grotendeels over badkamers.
- **VLOK:** de waarde wordt niet uitgelegd. De concurrent gebruikt VLOK expliciet als "onafhankelijke geschillencommissie en nakomingsgarantie". Controleer of dat voor uw lidmaatschap geldt.
- **Trustoo:** terecht verborgen totdat de score bevestigd is. Daardoor heeft de advertentiepagina wel minder sociaal bewijs.
- **Pers of thought leadership:** geen. Den Haan Renovators heeft dat wel (AD, podcast).

### 5. SEO en lokaal (7)
**Sterk:**
- structured data per paginatype (GeneralContractor, Service, FAQPage, BreadcrumbList, ItemList);
- sitemap met 288 URL's;
- stad-dienstpagina's;
- correcte canonicals;
- advertentiepagina's terecht noindex.

**Zwak (gemeten):**
- **`og:image`:** ontbreekt op home, routes, portfolio, over-ons, stad- en contactpagina. Een link gedeeld via WhatsApp toont dan geen beeld.
- **Metabeschrijvingen** van de nieuwe pagina's zijn 169 tot 209 tekens; Google kapt af rond 155 tot 160.
- **Twee H1's** op de advertentiepagina en op /contact (de intake gebruikt ook een H1).

**Alleen met productiedata te beoordelen:** posities, impressies en de kwaliteit van de stadspagina's (Search Console).

### 6. AI-findability (7,5)
**Sterk:**
- llms.txt;
- Markdown per pagina;
- citeerbare kernfeiten (KvK, adres, werkgebied, prijsindicatie, betaalvoorwaarden);
- consistente juridische naam;
- geen onbevestigde claims meer na de releases.

**Zwak:**
- **Feiten die AI-assistenten vaak noemen** ontbreken: oprichtingsjaar, aantal projecten, gemiddelde doorlooptijd per projecttype.
- **llms-full.txt** neemt CMS-tekst over en is pas schoon na publicatie van de releases.

**Niet te bewijzen zonder meting:** of ChatGPT, Gemini en Perplexity DRO daadwerkelijk noemen. Het kanaal "AI-assistent" wordt per lead wel al vastgelegd.

### 7. Google Ads en landingspagina's (6)
**Sterk:**
- inhoudelijk sterke advertentiepagina's;
- draagmuurcalculator met prijs;
- conversietag actief op productie (gecontroleerd).

**Zwak:**
- **Biedsignaal:** Ads optimaliseert op "formulier verzonden", niet op leadkwaliteit. Een aanvraag van € 5.000 telt even zwaar als een van € 200.000, terwijl budgetklasse en gclid per lead al worden opgeslagen.
- **Stijl:** de totaalrenovatiepagina staat in een derde stijl (Archivo).
- **Conversie zonder Trustoo-badge en zonder harde terugbelbelofte:** onbekend, eerst meten.

### 8. Techniek, security, performance (8)
**Sterk:**
- Next 15 en React 19;
- 47 geautomatiseerde tests;
- de leadketen overleeft storingen van Sanity en van e-mail;
- de health-check;
- security-headers (HSTS, X-Frame-Options, nosniff, Referrer- en Permissions-Policy);
- desktop LCP 0,5 s en CLS 0 (preview; productie 0,4 s).

**Zwak:**
- **Content-Security-Policy:** geen. Laag risico voor deze site.
- **Fontgewicht:** 311 kB door vier lettertypefamilies.
- **Grote versie-upgrades** van de pakketten staan nog open (zonder bereikbare kwetsbaarheid).
- **Mobiele velddata:** onbekend.

### 9. Analytics en verkoopmeting (4)
**Gemeten:** op productie is wel Google Ads actief, maar geen GA4. De funnel-events in de code (`route_view`, `form_step_complete`, `cta_click`) worden daardoor nergens opgeslagen.

Gevolgen:
- u kunt afhaken per stap, routegebruik en CTA-prestaties niet meten;
- er is geen terugkoppeling van "gekwalificeerd", "offerte" en "opdracht" naar Ads;
- er is geen koppeling tussen lead, offerte (mijndro.app) en omzet.

**Wel goed:** per lead staan kanaal, route, budgetklasse, landingspagina en gclid in Sanity. De ruwe data voor verkoopmeting bestaat dus al.

### 10. Mobiel en toegankelijkheid (6,5)
**Gemeten:**
- geen horizontale overloop op 390 en 820 px;
- alle afbeeldingen hebben een alt-tekst;
- filterknoppen zijn minimaal 44 px.

**Zwak:**
- **Contrast:** de oranje knop (#D95B16) met witte tekst haalt een contrast van **3,9:1**. WCAG AA vraagt 4,5:1 voor tekst van normale grootte. Dat geldt voor de hele site, ook op productie.
- **Zwevende knoppen:** "Start intake" en WhatsApp vallen op mobiel over content.
- **H1:** twee H1's (zie onderdeel 5).
- **Intake op mobiel:** 11 stappen. De lengte is te verdedigen voor kwalificatie, maar dat is nog niet bewezen.

### 11. Concurrentiepositie (6)

| | DRO (nieuw) | Vijf Sterren Renovatie | Den Haan Renovators |
|---|---|---|---|
| Reviews | 4,8 uit 273 | 4,9 uit 139 | Geen zichtbaar |
| Prijsindicatie | € 1.210 tot € 1.510 per m² incl. btw, rekenhulp | € 120.000 tot € 160.000 per 100 m² incl. btw, rekenhulp | Geen |
| Garantie | 12 maanden | 24 maanden (+5 jaar leidingen, 10 jaar waterdichting) | Niet genoemd |
| Planning | Indicatief, 8 tot 14 weken bij projecten | "100 m² in ±100 dagen", met voorbehoud | Niet genoemd |
| Bewijs | 20 projecten, 0 casestudy's | Voor/na-slider | 6 uitgewerkte projecten, pers |
| Positionering | Totaal plus constructief, twee routes | Complete verbouwing | Historische panden |

**DRO wint op:**
- aantal reviews;
- procestransparantie;
- de constructieve niche;
- de leadkwalificatie;
- techniek en AI-vindbaarheid.

**DRO verliest op:**
- garantietermijn;
- uitgewerkt projectbewijs;
- ervaringsanker ("sinds").

### 12. Portfolio en casestudy's (4,5)
**Sterk:**
- 20 projecten;
- een filter dat werkt;
- de casestudy-structuur is volledig klaar en verschijnt pas met toestemming.

**Zwak:**
- **Casestudy's:** 0 gepubliceerd.
- **Verhouding:** 10 van de 20 projecten zijn badkamers.
- **Doorlooptijd:** ontbreekt bij Jan Muschlaan, het heldproject van de grote route.
- **Voorfoto's:** weinig.
- **Data:** slug "rijswijk" is een badkamer in Alphen; Amersfoort ligt buiten het werkgebied.
- **Budgetbanden:** nergens. Juist die overtuigen een klant van € 150.000.

## Indeling

**Aantoonbaar goed ingericht:**
- claims en juridische consistentie (na de releases);
- leadketen en foutafhandeling;
- structured data;
- llms.txt en Markdown;
- sitemap en canonicals;
- security-headers;
- desktop-performance;
- geen overloop op mobiel;
- alt-teksten.

**Technisch gereed, nog niet bewezen:**
- de tweedeling in routes;
- budgetkwalificatie;
- de intake van 11 stappen;
- rekenhulp;
- de zes zekerheden;
- het casestudy-systeem;
- reviews over grote projecten;
- de B-betaaltekst als vertrouwensargument.

**Aantoonbaar te verbeteren:**
- de stijlbreuk (vier fonts, twee kleur- en hoekensystemen);
- GA4 ontbreekt;
- geen kwaliteitssignaal naar Ads;
- `og:image`;
- metalengte;
- twee H1's;
- CTA-contrast;
- zwevende knoppen op mobiel;
- 0 casestudy's;
- portfoliodata;
- garantie en ervaringsanker tegenover de concurrent.

**Alleen met productiedata te beoordelen:**
- conversieratio per route en per advertentiepagina;
- afhaken per intakestap;
- verdeling naar budgetklasse;
- kosten per gekwalificeerde lead;
- mobiele Core Web Vitals;
- Search Console-posities;
- vermeldingen door AI-assistenten;
- het effect van de reactiebelofte.

## De tien grootste kansen, op verwacht commercieel rendement

| # | Kans | Waarom | Moeite |
|---|---|---|---|
| 1 | **GA4 aanzetten** (`NEXT_PUBLIC_GA4_ID`, consent zit er al in) | Zonder GA4 meet u na livegang niets van de funnel. Alle andere optimalisatie is dan gissen | 15 minuten (eigenschap aanmaken en ID in Vercel) |
| 2 | **Eén design system volgens de referentie.** De premium-laag (`.pr`) omzetten naar Poppins, warm crème, afgeronde beeldvlakken en de bestaande knopstijl. Intake en advertentiepagina erin meenemen; één set tokens in de code | Haalt de stijlbreuk weg, scheelt circa 120 kB aan fonts en past bij uw eis | Ongeveer 1 werkdag. Geconcentreerd in `globals.css`, `fonts.ts`, het intakecomponent en één advertentiepagina |
| 3 | **Twee casestudy's** (Jan Muschlaan, Fuutlaan) met budgetband, doorlooptijd en voor/na | Het sterkste bewijs voor de doelgroep van € 150.000 en meer. Het systeem staat klaar | Uw input en de toestemming van de klant |
| 4 | **Kwaliteitssignaal naar Google Ads.** Conversiewaarde per budgetklasse meesturen, later offline conversies (gclid) voor gekwalificeerde leads en opdrachten | Ads gaat zoeken naar aanvragen van € 100.000 en meer in plaats van naar elke aanvraag | Klein in code (waarde bij de conversie). Offline import is een middelgroot vervolg |
| 5 | **Bevestigde reactienorm** op routes en advertentiepagina's (bijvoorbeeld "binnen één werkdag"), eventueel met directe agendaplanning voor de opname | Snelheid is bij aannemers een van de sterkste conversiefactoren. De concurrent belooft 24 uur | Een besluit plus één veld in Sanity |
| 6 | **Garantie en ervaring als vertrouwensanker.** Besluiten over 12 of 24 maanden (AV), VLOK-voordelen uitleggen als ze gelden, "sinds [jaar]" | Dicht het gat met de directe concurrent | Een bedrijfsbesluit, daarna tekst |
| 7 | **Portfolio cureren:** grote projecten voorop, doorlooptijd invullen, data corrigeren, voor/na-paren | Het portfolio bepaalt of iemand een intake start | Een halve dag in Studio |
| 8 | **Reviews over grote projecten** actief verzamelen; Trustoo bevestigen of definitief weglaten | Het sociaal bewijs gaat nu vooral over badkamers | Een procesafspraak |
| 9 | **`og:image`, metabeschrijvingen tot 160 tekens, één H1** | Betere deelbaarheid (WhatsApp) en betere klikratio in Google | Klein |
| 10 | **CTA-contrast en zwevende knoppen op mobiel.** Oranje iets donkerder binnen dezelfde kleurbeleving; knoppen laten wijken bij de footer en de intake | Toegankelijkheid en minder verkeerde tikken | Klein (onderdeel van #2) |

## Conclusie

**Moet vóór livegang (naast de bekende akkoorden voor merges, releases, back-ups en de productie-leadtest):**
1. **Besluit over de stijlbreuk.** Volgens uw eigen eis (één design system, stijl van de screenshot) is de huidige preview niet live-klaar. Er zijn twee opties:
   - (a) eerst kans 2 uitvoeren, ongeveer 1 werkdag; kansen 9 en 10 kunnen daarin mee;
   - (b) bewust live gaan met de tijdelijke stijlbreuk, en kans 2 direct daarna uitvoeren.

   Ik adviseer (a). Het is een wijziging op tokenniveau en voorkomt dat de eerste meetperiode op een inconsistente site plaatsvindt.
2. **GA4-ID instellen** (kans 1). Anders begint de meetperiode zonder funnelgegevens.

**Kan direct na livegang:** kansen 3 tot en met 8 (casestudy's, Ads-waarde, reactienorm, garantie en ervaring, portfolio, reviews).

**Eerst meten (4 tot 6 weken na livegang):**
- afhaken per intakestap: is 11 stappen te lang?;
- conversie per route en advertentiepagina tegenover de periode ervoor;
- aandeel leads van € 50.000 en meer, en kosten per gekwalificeerde lead;
- het effect van de reactiebelofte en het ontbreken van Trustoo;
- mobiele Core Web Vitals (velddata);
- Search Console;
- het aantal leads via AI-assistenten.

Pas daarna wordt duidelijk welke tekstuele of structurele aanpassing de meeste opbrengst heeft.

## Bronnen
- [Vijf Sterren Renovatie](https://www.vijfsterrenrenovatie.nl/)
- [Den Haan Renovators](https://www.denhaanrenovators.nl/)
