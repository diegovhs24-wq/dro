# Tegenstrijdigheden: website, Sanity, offertes en algemene voorwaarden (22-10-2026)

**Gebruikte bronnen:**
- de gepubliceerde algemene voorwaarden (AV, versie augustus 2026, Sanity `696c8927…`);
- alle code op `feat/fase-2-commercieel`;
- 160 gepubliceerde Sanity-documenten;
- de begeleidende mails bij offertes uit mijndro.app (offerte A: totaalrenovatie voor een consument, oktober; offerte B: meerdere appartementen voor een zakelijke klant, oktober);
- mails over twee lopende projecten (C en D).

De PDF's van de offertes konden niet worden geopend. Leg één recente offerte-PDF handmatig naast de AV. Controleer daarbij:
- het betaalschema;
- de geldigheid;
- de garantietekst;
- de stelpostopslag.

**Afspraak:** aan de AV is niets gewijzigd. Wijzigingen staan in §3, ter goedkeuring. Laat ze juridisch toetsen.

## 1. Overzicht

Kolom "Website (code)" geeft de stand na deze kwaliteitsronde. Kolom "Sanity" gaat over de gepubliceerde content: die blijft zoals hij is totdat de releases worden gepubliceerd.

| Onderwerp | AV | Offertes en praktijk | Website (code) | Sanity (gepubliceerd) | Ernst | Oplossing |
|---|---|---|---|---|---|---|
| Garantie | Art. 12: 12 maanden op eigen werk, fabrieksgarantie op producten | Niet te zien (PDF) | 12 maanden, met verwijzing naar art. 12 | "3 tot 15 jaar" op 11 pagina's, "5 jaar" in FAQ `669fa316` | **Blokkerend** | In release `claims-garantie-meerwerk` (11 pagina's) en `claims-opschoning` (FAQ) |
| Vaste prijs | Art. 3.4: offerte limitatief. Art. 4.3 en 5: verrekening en meerwerk op nacalculatie | Offerte A zegt het eerlijk: hoeveelheden worden verrekend | Weg. Nu: "heldere offerte per onderdeel", meerwerk vooraf gemeld (ook op stadspagina's, wizard en draagmuur-LP) | "De prijs is de prijs" op 11 pagina's, 22 locaties, FAQ `c3875a92` | **Blokkerend** | In alle drie de releases |
| Betaling vooraf | Art. 8.1: schema uit de offerte; zonder schema 40/50/10 | **Project C: aanbetaling vóór de start gefactureerd.** E-mailhandtekening: "Vaste prijs, geen aanbetaling" | "Bij ondertekening betaalt u niets, 20 tot 25% op de eerste werkdag, daarna per fase" (door Therab bevestigd) | "Geen aanbetaling" in ongeveer 34 documenten (de code vervangt dit al bij weergave); "nooit vooruit" in FAQ `86251ec6` | **Blokkerend** | Besluit nodig, zie §2.1 |
| Slottermijn | Art. 10.2: kleine restpunten zijn geen reden om de slottermijn in te houden | Niet te zien | "Kleine restpunten komen op de opleverlijst; de slottermijn volgt bij oplevering" | "Pas als u tevreden bent" op 5 pagina's en in FAQ `92e19150` | Hoog | In releases |
| Btw | Art. 4.1: consumentenprijzen incl. btw | **Offerte A (consument) noemt het totaal excl. btw** | Hoofdbedrag incl. btw (€ 1.210 tot € 1.510 per m²), excl. als bijregel; ook in de rekenhulp | FAQ `90322b19` en `faq-iets-verandert` zonder btw-vermelding | Hoog | Website: opgelost, FAQ's in release. **Offertes:** in mijndro.app het consumententotaal incl. btw tonen |
| Planning | Art. 6.4: data indicatief | Project D: de klant noemt de datum uit het betaalschema "uiterste opleverdatum" | Indicatief, met verwijzing naar art. 6.4 | "Afspraak is afspraak" (werkwijze) | Hoog | Release. In het betaalschema: "verwachte opleverweek (indicatief)" |
| Vergunningen | Art. 7.1: de opdrachtgever zorgt voor vergunningen | Offerte A: "naar verwachting vergunning nodig", zonder te zeggen wie die regelt | "Zo nodig verzorgen wij de aanvraag" | "We vragen de vergunningen aan", blog `96ce3cfe` | Hoog | AV-aanvulling, zie §3.2 |
| Materialen | Art. 3.5: de klant levert esthetische materialen, tenzij anders afgesproken | Offerte A volgt dit; offerte B neemt keuken en sanitair op als stelpost | Bij elke m²-prijs: "volgens de AV kiest en levert u tegels, sanitair en keuken zelf, tenzij we afspreken dat wij ze leveren" | Badkamerblogs noemen prijzen "inclusief afwerking" | Hoog | Release (blogs). Code: opgelost |
| Schade en verzekering | Art. 13: beperkingen, eigen risico € 250 / € 500 | Niet te zien | "DRO heeft een CAR- en aansprakelijkheidsverzekering; wat gedekt is hangt af van de polis en art. 13" | "Volledig verzekerd" (zakelijk, siteSettings) | Hoog | Release |
| Stelposten | Art. 4.2: werkelijke kosten plus 10% | Offertes A en B noemen de 10% niet | Niet genoemd | Niet genoemd | Middel | Standaardregel in het offertesjabloon, zie §2.3 |
| Prijsindexatie | Art. 4.4 | Niet te zien | Geen "vaste prijs" meer | Zie vaste prijs | Middel | Optioneel in de offerte: "prijspeil [maand jaar]" |
| Eigen ploegen | Art. 6.1: derden toegestaan | Offerte B: "onze eigen vaste ploeg" | "vaste vakteams en vaste partners" | "Geen wisselende ploegen", "eigen vaste vakteams" | Middel | Release |
| Reactietijd | Niet geregeld | Project D: klacht over trage reacties | Nieuwe aanvragen: "zo snel mogelijk", tenzij de norm in Sanity is bevestigd. Vragen tijdens het project: "binnen 24 uur opgepakt" (bevestigd) | "Binnen 24 uur contact" (intakeformulier, contact, footer) | Middel | Release. Besluit over de norm, zie §4 |
| Juridische naam | Met koppelteken | Handtekening met koppelteken | Zonder koppelteken (KvK) | siteSettings met koppelteken (gecorrigeerd in release `geo-betaalvoorwaarden`) | Middel | AV en handtekening: zie §3.3 |

## 2. Praktijk en offertes (buiten de website)

### 2.1 Aanbetaling: besluit nodig vóór livegang

De website (code) zegt op vier plekken "Bij ondertekening betaalt u niets":
- de facts in de hero van de homepage;
- de facts in de hero van de routepagina's;
- de FAQ;
- de zekerheid "Betalingen".

Project C laat zien dat er wel eens vóór de start is gefactureerd. Kies één van twee:

- **A. De belofte klopt (aanbeveling als dit de standaard is).** Factureer voortaan nooit vóór de eerste werkdag. Zet in elke offerte het schema "0% bij ondertekening, 20 tot 25% op de eerste werkdag, daarna per fase". Daarmee geldt de standaard van art. 8.1 nooit.
- **B. Een aanbetaling blijft mogelijk.** Dan verander ik op de site "U betaalt niets" in "Betaalschema per fase, vastgelegd in de offerte". Het commerciële voordeel valt dan weg.

### 2.2 E-mailhandtekening (direct aanpassen)

De handtekening zegt "Vaste prijs, geen aanbetaling" en gebruikt de naam met koppelteken. Voorstel:

> DRO Renovaties | DRO Bouw en Aannemingsbedrijf B.V.
> Heldere offerte per onderdeel, betaling per afgeronde fase
> 085 087 1814 (ook via WhatsApp) | dro-renovaties.nl

### 2.3 Offertesjabloon in mijndro.app

1. Toon bij consumenten het totaal **incl. btw** als hoofdbedrag (art. 4.1).
2. Neem de vaste regel op: "Stelposten verrekenen we tegen de werkelijke kosten plus 10% coördinatie (AV art. 4.2)."
3. Zet bij de planning: "verwachte opleverweek, indicatief (AV art. 6.4)".
4. Vermeld bij een vergunningsplichtig werk wie de aanvraag doet. Als DRO dat doet: "DRO verzorgt de aanvraag; verlening, termijn en leges blijven voor rekening en risico van de opdrachtgever."

### 2.4 Mogelijk datalek (urgent, los van de website)

Op 19 oktober is een betalingsoverzicht van een lopend project per abuis in cc naar een derde gestuurd. Daarin stonden bedragen en offertenummers. De ontvanger zegt de mail te hebben verwijderd.

- Leg het voorval in elk geval vast in het interne datalekregister. Dat is verplicht, ook als er geen melding volgt.
- Beoordeel of melden aan de Autoriteit Persoonsgegevens nodig is. Een melding moet binnen 72 uur na ontdekking. Lage risico's hoeven niet gemeld te worden, maar die afweging moet worden vastgelegd.
- Ik ben geen jurist. Laat dit kort toetsen.

## 3. Voorgestelde wijzigingen in de AV (ter goedkeuring, niet doorgevoerd)

### 3.1 Art. 8.1 (betaalschema zonder afspraak)

Nu: 40% bij aanvang, 50% tijdens de uitvoering, 10% bij oplevering.

Voorstel, alleen bij keuze A uit §2.1:

> Ontbreekt in de offerte een betaalschema, dan betaalt Opdrachtgever niets bij ondertekening, 20% op de eerste werkdag, daarna termijnen per afgeronde fase en 10% bij oplevering.

### 3.2 Art. 7.1 (vergunningen), aanvulling

> …tenzij in de offerte is vermeld dat DRO de aanvraag verzorgt. Ook dan blijven de verlening, de doorlooptijd en de leges voor rekening en risico van Opdrachtgever.

### 3.3 Juridische naam

In de intro en in art. 1 "DRO Bouw- en Aannemingsbedrijf B.V." vervangen door "DRO Bouw en Aannemingsbedrijf B.V.", conform de KvK.

Dit stond eerder in release `claims-garantie-meerwerk` en is daaruit verwijderd, omdat de AV niet zelfstandig mogen worden gewijzigd. Titel en omschrijving van die release noemen het nog. Pas die aan of negeer ze.

**Let op bij elke AV-wijziging:**
- vermeld de nieuwe versiedatum;
- lopende overeenkomsten houden de versie waarnaar hun offerte verwees.

### 3.4 Wat in de AV kan blijven

Art. 3.4, 3.5, 4.1, 5, 6.1, 6.4, 10, 12 en 13 passen bij de nieuwe website. De site verwijst er nu naar in plaats van ze tegen te spreken.

## 4. Open beslissingen (inhoud, niet juridisch)

| Punt | Waar | Advies |
|---|---|---|
| Reactienorm voor nieuwe aanvragen | `verifiedClaims.responseTime` in Sanity | Kies een norm die altijd haalbaar is, bijvoorbeeld "binnen één werkdag". Zet die verified in Sanity; de pagina's nemen hem dan over |
| Trustoo 9,8 uit 557 op de advertentiepagina's | `verifiedClaims.trustoo` | Verborgen totdat hij met datum is bevestigd. Bevestig hem met de link naar het profiel, of laat hem weg |
| Prijzen uitbouw, aanbouw, vloerverwarming en draagmuur in FAQ's en blogs | FAQ `c928507e`, `ee026ab1`, `46706e99`; blogs `6184ed82`, `96ce3cfe`, `a6f2817a` | Ze spreken elkaar tegen. Geef één bevestigde bandbreedte per dienst, anders "prijs op maat na een opname" |
| Team | over-ons | Esra heeft geen profiel. Jarek "twintig jaar ervaring" en "Ons team groeit hard" zijn onbevestigd |
| Reviews die Lauren noemen | review `313123d5`, `926325a0` (staat op over-ons) | Niet meer tonen. Een klantquote niet herschrijven |
| Werkgebied Utrecht en Amsterdam | `siteSettings.organizationSeo.areaServed` | Beperken tot Den Haag, Haaglanden, Zuid-Holland en Randstad |
| Projectdata | `badkamertahiti`: titel Zoetermeer, locatie Den Haag. Slug `totaalrenovatie-gezinswoning-rijswijk` is een badkamer in Alphen | Corrigeren in Studio. Bij een slugwijziging een redirect toevoegen |
