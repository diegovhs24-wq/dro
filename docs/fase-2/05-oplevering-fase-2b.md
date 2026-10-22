# Fase 2b: oplevering premium ontwerp (22-10-2026)

Branch `feat/fase-2-commercieel` (PR #26, gestapeld op #24). Geen productie-deployment.

## Wat er is veranderd

| Pagina | Voorheen | Nu |
|---|---|---|
| `/` | CMS-blokken met onbevestigde claims (vaste prijs, 3 tot 15 jaar garantie, 100+, dekking NL-breed) | Homepage in code. Bevat: hero met echt project en controleerbare feiten, twee routes naast elkaar, zes zekerheden, eindbeelden van projecten, team, echte Google-reviews, FAQ en intake |
| `/totaalrenovatie` | Dunne CMS-dienstpagina | Inhoudelijke pagina over kosten, duur en fases, met de verantwoorde rekenhulp, zekerheden, projecten en intake |
| `/grote-renovaties`, `/constructieve-werken` | Fase 2a-opmaak | Zelfde systeem. Constructief heeft een schematische doorsnede (ligger en opleggingen) in plaats van een stockfoto |
| `/projecten` | CMS-raster | Filter per type via `?type=`, alle projecten in de HTML. Casestudy's verschijnen bovenaan zodra ze in Sanity zijn vrijgegeven. Eindbeelden eerst, bouwfoto's later |
| `/projecten/[slug]` | Generiek sjabloon, leeg "Duur"-vak | Casestudy-presentatie: feitenbalk, verhaal, uitgevoerd werk, foto's, voor en na, vergelijkbare projecten en de juiste vervolgstap per type |

## Ontwerpsysteem

- **Kleuren:** kalk `#EEF0EE`, leisteen `#26313A`, inkt `#1C1F23`, steen `#5B6368`. Oranje `#D95B16` alleen voor acties en de maatlijn.
- **Letters:** Archivo (breed) voor koppen, Hanken Grotesk voor tekst. Zelf gehost, OFL.
- **Raster:** links uitgelijnd, kop links (4/12) en inhoud rechts (8/12). Op mobiel komt het formulier direct onder de kop.
- **Eén terugkerend detail:** een maatlijn zoals op een bouwtekening. Geen animaties behalve een lichte hover op foto's (uit bij "reduced motion").

## Salespsychologie: zes zekerheden

Planning, communicatie, meerwerk, bouwkwaliteit, betalingen en oplevering. Elk onderwerp staat met antwoord en bewijs, gebaseerd op:
- bevestigde feiten;
- de klantbeloftes;
- de gepubliceerde algemene voorwaarden (art. 3.4, 5, 10 en 12).

Meerwerk wordt eerlijk uitgelegd: in de offerte staat wat in de prijs zit, meerwerk wordt vooraf gemeld en verrekend op nacalculatie. Bij een groot project neemt dat meer twijfel weg dan "geen verrassingen".

## Rekenhulp

- Toont een bandbreedte, afgerond op € 5.000, en zegt nadrukkelijk "Dit is een indicatie, geen offerte".
- Ernaast staan zes factoren die de prijs hoger of lager maken, zonder verzonnen percentages.
- Betaalschema in percentages. Uitbouw en dakopbouw zitten er bewust niet in.

## Intake

- Reactietijd alleen uit een bevestigde claim in Sanity, anders "zo snel mogelijk".
- **Bug opgelost:** na de draagmuur-prijscheck volgde een tweede budgetschuif met "€4.135k". Gold ook al voor de bestaande algemene intake.
- **Getest tot en met de contactstap (niet verzonden):**
  - homepage, op desktop en mobiel;
  - totaalrenovatie, grote renovaties en constructieve werken;
  - beide advertentiepagina's, ongewijzigd.

## Claimcontrole

Zie `04-claimregister.md`. Nieuwe Sanity-release `claims-garantie-meerwerk` (12 documenten, niet gepubliceerd):
- 11 pagina's: "vaste prijs" wordt "heldere offerte", "3 tot 15 jaar garantie" wordt "12 maanden garantie" volgens de AV, en "geen aanbetaling" wordt "niets bij ondertekening".
- De AV zijn niet gewijzigd. De eerdere correctie van de juridische naam is uit de release gehaald en staat nu als voorstel in `06-tegenstrijdigheden.md` §3.3.

## Tests

`npm test`: 40 tests (6 GEO, 17 leadroute, 17 fase 2). Een test blokkeert onbevestigde claims in de teksten van de nieuwe pagina's. Typecheck en lint zonder fouten. Vercel-preview gebouwd en in de browser gecontroleerd op 1440 px en 390 px.

## Terugdraaien

- **Homepage:** `app/(site)/page.tsx` terugzetten naar de CMS-versie (één bestand).
- **Totaalrenovatie:** `app/(site)/totaalrenovatie` verwijderen; dan neemt de CMS-dienstpagina het weer over.

## Kwaliteitsronde (22-10, avond)

Zie:
- `06-tegenstrijdigheden.md`;
- `07-review-klant-150k.md`;
- `08-productiechecklist.md`.

Aangepast:
- prijzen incl. btw als hoofdbedrag (AV art. 4.1), met de opmerking over de materialen (art. 3.5);
- de rekenhulp gebruikt één geteste functie (`renovationBand`);
- hamburgermenu tot 1024 px: op tablet liep het menu van het scherm;
- echte teamfoto;
- reviews over grotere verbouwingen;
- de laatste onbevestigde claims uit de bestaande componenten;
- de advertentiepagina's tonen Trustoo en reactietijden alleen als die bevestigd zijn.
