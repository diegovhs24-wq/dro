# Fase 2: commerciële transformatie

Branch: `feat/fase-2-commercieel` (gebaseerd op PR #24). Doel: meer gekwalificeerde aanvragen voor projecten van € 50.000 tot € 250.000+, gemeten in opdrachten en brutowinst, niet in klikken.

Uitgangspunt: geen redesign van de buitenkant. Elke wijziging moet een concrete twijfel van een koper van een groot project wegnemen, of de weg naar een goed gesprek korter maken. Niets wordt gepubliceerd zonder bewijs.

## 1. Voor wie we bouwen

| Koper | Waar die bang voor is | Wat die moet zien om te bellen |
|---|---|---|
| Eigenaar die een hele woning laat renoveren (€ 80k tot € 250k) | Uitloop, meerwerk, slechte communicatie, geld kwijt | Vergelijkbaar project met budgetband en duur, wie het aanspreekpunt is, hoe betalen en meerwerk werken |
| Eigenaar die uitbouwt of een draagmuur laat verwijderen (€ 30k tot € 100k) | Constructieve veiligheid, vergunning, schade | Constructeur en vergunning geregeld, stappen, prijsopbouw |
| Koper die een woning nog moet kopen | Budgetzekerheid vóór het bod | Snelle indicatie, bouwkundige keuring € 399 |
| Architect, tekenbureau, vastgoedpartij | Betrouwbare uitvoering, communicatie met hun klant | Partnerpagina, referenties, direct contact met Therab |
| Expat | Taal, vertrouwen, onbekend systeem | Engels, uitleg van het proces |

## 2. Werkpakketten (in volgorde)

| # | Pakket | Wat er concreet verandert | Afhankelijk van | Meting |
|---|---|---|---|---|
| F2-1 | **Casestudy-systeem** | Sanity-velden voor scope, m², doorlooptijd, budgetband, uitdaging, oplossing, voor/na, klantcitaat met toestemmingsvlag. Nieuwe projectpagina-opbouw. Alleen tonen wat is ingevuld en bevestigd | Gegevens per project (zie `01-casestudy-intake.md`) | Bezoek casestudy → aanvraag |
| F2-2 | **Prijs- en betaalverhaal** | Eén bandbreedte per dienst uit `BUSINESS`, "wat zit erin", betaalschema als vertrouwensblok, meerwerkregeling | Prijsbesluiten (BESLUIT-2 t/m 4) | Aandeel leads "past niet" op budget |
| F2-3 | **Intake herzien** | Eerste stap direct onder de hero; budgetschuif per dienst (totaalrenovatie/uitbouw vanaf € 50k); kort terugbelverzoek als tweede pad; architect/partner-pad; labels en focus toegankelijk; stappenmeting | Geen | `form_start`, `form_step_complete`, aandeel "kansrijk" |
| F2-4 | **Risico-architectuur** | Blok "Zo zijn risico's geregeld": CAR- en aansprakelijkheidsverzekering (wat het dekt), opleverprocedure, meerwerk, klachtenregeling, garantie alleen als bevestigd | Bevestiging garantie, polisgegevens | Scrolldiepte en aanvragen op dienstpagina's |
| F2-5 | **Constructief werk** | Indexeerbare dienstpagina "Draagmuur verwijderen en constructieve verbouwingen" met formule-indicatie, vergunningsuitleg (IPLO/Den Haag), stappen, projecten | Prijsbesluit draagmuur | Organisch verkeer, leads draagmuur |
| F2-6 | **Team en identiteit** | Team met juiste rollen en foto's (Esra toevoegen, Scott juiste rol), juridische naam, KvK, btw en adres in de footer | Foto Esra, akkoord rollen | |
| F2-7 | **Homepage-volgorde** | Hero met aanbod voor grote projecten + eerste intakestap, casestudy's direct na de hero, werkwijze, risico-architectuur, reviews met bron; afbouw-iconen eruit | F2-1 t/m F2-4 | Conversie homepage |
| F2-8 | **Meting** | Cookieloze analytics (Vercel Web Analytics of Plausible) met events uit docs/audit/10; leadstatus en contractwaarde terug vanuit Bouwe | Kostenbesluit, Bouwe-koppeling | Kosten per gekwalificeerde lead, omzet per kanaal |
| F2-9 | **Visuele kwaliteit** | Echte projectfoto's in plaats van stockfoto's, twee lettertypen, Comic Sans weg, contrast AA | Foto's | Lighthouse, toegankelijkheid |

## 3. Wat niet gebeurt

- Geen verzonnen of opgepoetste casestudy's, cijfers, reviews of logo's.
- Geen nepschaarste ("nog 2 plekken"), geen afteltimers.
- Geen claims over garantie, reactietijd of vaste prijs zonder bevestiging.
- Geen 22 extra stadspagina's of massacontent.

## 4. Wat ik van Therab nodig heb om F2-1, F2-2 en F2-4 te kunnen bouwen

1. Per project dat als casestudy mag: de gegevens uit `01-casestudy-intake.md`. Begin met 3 projecten boven € 50k.
2. Prijsbesluiten: één bandbreedte voor totaalrenovatie, uitbouw (per m² of per diepte) en draagmuur.
3. Garantie: bestaat er een vaste garantietermijn? Zo ja, welke en waarop.
4. Reactietijd: welke belofte houdt het team echt waar (1 werkuur, dezelfde werkdag, 24 uur)?
5. Trustoo-cijfer dat op de site mag (nu 520 reviews gezien, op de advertentiepagina staat 557).

F2-3 (intake), F2-6 (identiteit, deels) en F2-8 (meting, code-deel) kunnen zonder deze antwoorden starten.
