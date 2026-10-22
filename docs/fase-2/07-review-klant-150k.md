# Review vanuit een particuliere opdrachtgever met € 150.000 (22-10-2026)

**Uitgangspunt:** een stel met een rijtjeshuis of een benedenwoning van ongeveer 110 tot 130 m² in Den Haag of omgeving. Zij hebben € 150.000 voor een totaalrenovatie, eventueel met een kleine uitbouw. Ze vergelijken drie aannemers en zijn vooral bang voor drie dingen:
- uitlopende kosten;
- een aannemer die halverwege verdwijnt;
- vooruitbetalen voor werk dat er nog niet is.

Beoordeeld: de homepage, `/grote-renovaties`, `/totaalrenovatie` en `/constructieve-werken`, op desktop, tablet en mobiel, op preview `38cc1c4`.

## Wat overtuigt

1. **Binnen tien seconden is duidelijk of DRO bij hen past.** De hero noemt het bereik (€ 50.000 tot € 250.000 en meer) en "onder één regie". Daarna kiezen ze een van twee routes. Wie € 150.000 heeft, voelt zich hier op de juiste plek en niet bij een klusbedrijf.
2. **De prijs is controleerbaar en eerlijk.** De rekenhulp geeft bij 120 m² € 145.000 tot € 185.000 incl. btw. Hun budget valt dus aan de onderkant van de bandbreedte. Dat is geen ontmoediging: het is precies het gesprek dat ze met een aannemer willen voeren. Erbij staan:
   - "Dit is een indicatie, geen offerte";
   - de zes factoren die de prijs hoger of lager maken;
   - wat er volgens de AV niet in zit (tegels, sanitair, keuken).

   Dat maakt het geloofwaardiger dan "vanaf"-prijzen.
3. **De angst voor meerwerk wordt benoemd en niet weggepoetst.** Er staat geen "geen verrassingen", maar wel: wat in de offerte staat, hoe meerwerk vooraf wordt gemeld, met het AV-artikel erbij. Voor iemand die al één verbouwing heeft meegemaakt is dat geruststellender.
4. **Er zijn namen en rollen:**
   - Therab voor afstemming en offerte;
   - Jarek voor techniek;
   - Esra voor betalingen en kwaliteit;
   - een echte teamfoto.

   Dat beantwoordt "wie belt mij als het misgaat".
5. **Betalen per fase**, met niets bij ondertekening. Dit is het sterkste commerciële argument tegen de angst om vooruit te betalen. Het staat wel ter discussie, zie hieronder.
6. **Echt werk.** Eindbeelden van projecten in de buurt (Leidschendam, Zoetermeer, Den Haag), met plaats, type en doorlooptijd. Het portfolio laat zich filteren op type.
7. **De intake kwalificeert.** Budgetschaal tot € 250.000, gerichte vragen per route en geen dubbele stappen. De lead die binnenkomt is bruikbaar voor een opname.

## Wat nog twijfel laat

| Punt | Waarom het telt bij € 150.000 | Blokkerend? | Wat te doen |
|---|---|---|---|
| "Bij ondertekening betaalt u niets" terwijl in de praktijk soms een aanbetaling vóór de start wordt gefactureerd | Een klant die dit leest en dan toch een aanbetalingsfactuur krijgt, verliest het vertrouwen op het moment dat het het meest telt. Juridisch is het een misleidende belofte | **Ja** | Besluit A of B in `06-tegenstrijdigheden.md` §2.1 |
| Oude CMS-pagina's (diensten, steden, werkwijze, over-ons) zeggen nog "vaste prijs" en "3 tot 15 jaar garantie" | Een klant die doorklikt ziet twee verhalen. De AV geven 12 maanden. Bij een geschil wordt de websitetekst aangehaald | **Ja** | De drie Sanity-releases publiceren na de codedeploy (checklist, stap 4) |
| Geen uitgewerkte casestudy | Bij dit bedrag wil men één vergelijkbaar project zien: uitgangssituatie, keuzes, doorlooptijd, budgetband, wat er tegenviel. Nu zijn het foto's met een korte tekst | Nee, wel de grootste commerciële winst | Twee casestudy's met toestemming invullen (Fuutlaan en Essehout). De pagina's tonen ze automatisch zodra `consentDate` en de inhoud er staan |
| Reviews gaan vooral over badkamers | Twee van de drie uitgelichte reviews gaan nu over een totaalrenovatie of renovatie, dat helpt. Een review over planning en budget van een groot project ontbreekt nog | Nee | Na oplevering van grote projecten actief om een review vragen |
| "Zo snel mogelijk" als reactietermijn | Klinkt vaag. Een concrete norm, die dan ook wordt gehaald, wint het van de concurrent | Nee | Norm kiezen en bevestigen in Sanity |
| Hoofdmenu (CMS) noemt `/totaalrenovatie` en de twee routes niet | Bezoekers die niet via de homepage binnenkomen, vinden de nieuwe pagina's minder snel | Nee, wel binnen een week | Menu-items toevoegen in Studio (siteSettings, header) |
| Geen garantie boven 12 maanden of afbouwgarantie | Concurrenten met een SWK- of Woningborg-achtige regeling lijken zekerder | Nee | Alleen benoemen als het er echt is. Nu niets beloven |
| Wie er dagelijks op de bouw is | AV 6.2 noemt een projectleider maximaal 2 keer per week. De site zegt "één vast meetmoment per week". Klopt, maar een klant wil weten wie er dagelijks staat | Nee | Eén zin per route over de vaste ploegleider op de bouw, als dat zo is |

## Oordeel

Commercieel staat de nieuwe richting: rustig, concreet en eerlijk over geld. Twee dingen moeten vóór livegang geregeld zijn, omdat ze anders het vertrouwen ondergraven dat de nieuwe pagina's opbouwen:

1. De betaalbelofte moet overeenkomen met de praktijk.
2. De oude CMS-teksten mogen de nieuwe pagina's niet langer tegenspreken.

De rest maakt de site sterker, maar mag na livegang.
