# Fase 2b: visueel voorstel (22-10-2026)

Geldt voor: homepage, `/totaalrenovatie`, `/grote-renovaties`, `/constructieve-werken`, `/projecten` en `/projecten/[slug]`.

## 1. Idee: het werk als bestek

Een opdrachtgever met € 150.000 koopt geen sfeer, maar zekerheid. Een bouwbedrijf laat die zekerheid zien zoals een bestek of bouwtekening: gemeten, genummerd, met een duidelijke volgorde. Daarom:

- **Geen luxe-esthetiek.** Geen goud, geen donkere filmische hero's, geen marmer, geen cursieve accentwoorden.
- **Maatvoering als vormtaal.** Eén terugkerend detail: een dunne maatlijn met eindstreepjes, zoals op een tekening. Die zet bij foto's de plaats en het projecttype neer, en in de rekenhulp de bandbreedte. Verder geen decoratie.
- **Echte projecten zijn de beelden.** Alleen foto's uit Sanity-projecten, met bijschrift en link naar het project. Geen stockfoto's.
- **Elke sectie neemt een twijfel weg.** Planning, communicatie, meerwerk, bouwkwaliteit, betalingen en oplevering hebben ieder een vaste plek, met het bewijs erbij.

## 2. Tokens

| Rol | Waarde | Gebruik |
|---|---|---|
| Inkt | `#1C1F23` | Tekst, lijnen met nadruk |
| Leisteen | `#26313A` | Intakeblok, één donker vlak per pagina |
| Kalk | `#EEF0EE` | Afwisselende secties (koel, niet crème) |
| Lijn | `#D9DDDA` | Scheidingslijnen, tabelranden |
| Steen | `#5B6368` | Secundaire tekst |
| Signaal | `#D95B16` | Alleen voor acties en de maatlijn |

Typografie (zelf gehost, geen afhankelijkheid van Google Fonts bij de build):

- **Archivo**, breedte 112 tot 125%, gewicht 600 tot 700: koppen. Breed en stevig, zoals letters op bouwtekeningen en bouwborden.
- **Hanken Grotesk**, 400 tot 600: lopende tekst en interface, hetzelfde lettertype als de intake, zodat formulier en pagina één geheel zijn.
- Schaal (afgerond): 14 / 16 / 18 / 22 / 28 / 40 / 64. Regellengte maximaal 66 tekens. Cijfers altijd tabelcijfers.

## 3. Compositie

Twaalfkoloms raster, alles links uitgelijnd. Koppen in de linker vier kolommen, inhoud rechts in acht kolommen. Op mobiel één kolom met dezelfde volgorde.

### Homepage

```
┌──────────────────────────────────────────────────────────────┐
│ kop (Archivo, breed)            │  projectfoto (staand)      │
│ "Renovaties en verbouwingen     │  |—— Totaalrenovatie,  ——| │
│  van € 50.000 tot € 250.000+"   │      Den Haag              │
│ korte belofte + 2 knoppen       │                            │
│ feitenregel: Google 4,8 · VCA … │                            │
├──────────────────────────────────────────────────────────────┤
│ TWEE ROUTES (twee brede panelen naast elkaar, geen kaartjes) │
│ Grote renovatie            │ Constructief werk               │
│ wat, bandbreedte, knop     │ wat, doorlooptijd, knop         │
├──────────────────────────────────────────────────────────────┤
│ ZES ZEKERHEDEN (tabel: onderwerp | wat u krijgt | bewijs)    │
├──────────────────────────────────────────────────────────────┤
│ PROJECTEN: één groot project + twee kleinere, met feiten     │
├──────────────────────────────────────────────────────────────┤
│ MENSEN: vier namen en rollen, wie u wanneer spreekt          │
├──────────────────────────────────────────────────────────────┤
│ REVIEWS: Google-score met datum + echte reviews (bestaand)   │
├──────────────────────────────────────────────────────────────┤
│ FAQ │ INTAKE (leisteen)                                      │
└──────────────────────────────────────────────────────────────┘
```

### Totaalrenovatie en grote renovaties

Hero met foto en maatlijn, dan de verantwoorde rekenhulp, wat de prijs bepaalt, fases met doorlooptijd uit echte projecten, zes zekerheden, projecten, FAQ en intake. Totaalrenovatie is de inhoudelijke pagina (kosten, duur, fases); grote renovaties is de route voor gecombineerde projecten (uitbouw, dakopbouw). Ze verwijzen naar elkaar.

### Portfolio

- **Index:** filter op type (alle, grote renovaties, constructief, badkamers, overig) via de URL, zodat elke filter deelbaar en indexeerbaar blijft. Vrijgegeven casestudy's bovenaan op volle breedte, daarna een rustig raster met foto, plaats, type en duur.
- **Detail:** grote foto, feitenbalk (plaats, type, duur en, als vrijgegeven, m², budgetband), verhaal, wat er is gedaan, foto's, voor en na, en een knop naar de passende route. Zodra een casestudy in Sanity is vrijgegeven, verschijnen doel, uitdaging, oplossing en citaat automatisch.

## 4. Rekenhulp: verantwoord

- Toont alleen een **bandbreedte**, afgerond op € 5.000, met erbij "indicatie, geen offerte".
- Ernaast staat **wat de prijs hoger of lager maakt** (staat van de woning, installaties, constructie, afwerking, keuken en badkamers, bewoond of leeg), zonder verzonnen percentages.
- Het betaalschema staat er in **percentages**, niet in bedragen.
- De knop heet "Bespreek uw woning", niet "Ontvang uw offerte".

## 5. Zes zekerheden: wat er wel en niet staat

| Onderwerp | Wat er staat (bevestigd) | Wat pas verschijnt na bevestiging in Sanity |
|---|---|---|
| Planning | Planning en betaalschema vooraf op papier, bij akkoord | |
| Communicatie | Wekelijks vast meetmoment, appvragen binnen 24 uur opgepakt, vaste rollen (Therab, Scott, Esra, Jarek) | |
| Meerwerk | Offerte per onderdeel, zodat u ziet wat erin zit | Meerwerkregeling (bijv. "altijd eerst schriftelijk akkoord") |
| Bouwkwaliteit | Vaste vakteams, hoofd uitvoering, VCA, SBB, VLOK, CAR | Garantietermijn |
| Betalingen | Niets bij ondertekening, 20 tot 25% eerste werkdag, daarna per fase | |
| Oplevering | Samen nalopen voor oplevering | Opleverprocedure en nazorg in detail |

## 6. Wat eruit gaat (claimcontrole)

Op de huidige homepage staan claims die nergens bevestigd zijn: "Vaste prijs, de prijs in de offerte is de prijs", "3 tot 15 jaar garantie", "100+ projecten", "binnen 24 uur duidelijkheid", "dekking in Noord-Holland, Utrecht en Zeeland dankzij meerdere opstartlocaties" en "geen aanbetaling". De nieuwe homepage gebruikt ze niet. Correcties voor de CMS-teksten die elders blijven staan, komen in een aparte Sanity-release, die pas live gaat na akkoord.
