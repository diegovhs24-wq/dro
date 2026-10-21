# 03. Conversie-analyse

Bron: code (`Hero.tsx`, `SmartIntakeWizard.tsx`, `HomeSlotSection.tsx`, advertentiepagina's), seed-content en live crawl. Geen gedragsdata beschikbaar (geen analytics), dus dit zijn hypothesen die gemeten moeten worden.

## Homepage

Volgorde: hero → feitenbalk → werkwijze ("Doorlopende lijn") → probleem/oplossing → afbouw-iconen (metselwerk, tegelwerk...) → partners → Google-reviews → intakeformulier helemaal onderaan.

| Vraag | Antwoord |
|---|---|
| Waarom komt iemand? | Merkzoekopdracht, Trustoo-doorklik, of "aannemer Den Haag" |
| Wat wil hij? | Snel inschatten of DRO zijn project aankan en wat het ongeveer kost |
| Waar is hij bang voor? | Uitloop, meerwerk, slechte communicatie, betalen zonder zekerheid |
| Wat ontbreekt? | Vergelijkbare projecten met budget/m²/duur, prijsindicatie, wie zijn aanspreekpunt is, garantie/klachtenregeling |
| Wat houdt de volgende stap tegen? | De hero-knop "Plan een kennismaking" scrolt langs 5+ secties; mobiel is er geen vaste knop; de afbouw-iconen trekken kleine klussen aan |

## Bevindingen

1. **Eén pad voor iedereen.** Alleen de begeleide intake, telefoon en een WhatsApp-bubbel. Ontbreekt: snel terugbelverzoek (naam + telefoon), architect/partner-route (alleen `/zakelijk` voor vastgoed), afspraak op kantoor.
2. **Budget-anker te laag.** De wizard op home en contact start bij € 15k tot € 45k; alleen de totaalrenovatie-advertentiepagina geeft `largeBudget` (€ 50k tot € 100k) mee. De leadbeoordeling rekent wel met € 50k als ondergrens.
3. **Drie verschillende reactiebeloftes** ("binnen 1 werkuur", "binnen één werkdag", "binnen 24 uur"). Kies één en houd die waar.
4. **Advertentiepagina's zijn sterker dan de hoofdsite**: betaalschema, prijstabel, vergunning-FAQ, videogetuigenissen. Neem die bouwstenen over op de dienstpagina's.
5. **Formulier-toegankelijkheid**: velden zonder gekoppelde labels, meerdere H1's per stap (zie 05).
6. **Na verzenden**: dank-scherm werkt; nu ook dubbele-inzending-bescherming en automatische herkansing zonder foto's (zie 08).

## Gewenste paden per bezoekerstype

| Bezoeker | Volgende stap | Kwalificatie |
|---|---|---|
| Ads: totaalrenovatie | Advertentiepagina → intake met budget vanaf € 50k | Budget, postcode, planning |
| Organisch: vergelijkt aannemers | Dienstpagina met projecten en prijsrange → intake of terugbelverzoek | Lichte kwalificatie |
| Welgestelde huiseigenaar, uitbouw | Casestudy + werkwijze + "plan een opname" | Tekeningen aanwezig? constructeur nodig? |
| Terugkerende bezoeker (checkt betrouwbaarheid) | Over ons, KvK, verzekering, reviews met bron, klachtenregeling | Geen |
| Architect / tekenbureau | Aparte partnerpagina, direct contact met Therab | Projecttype, fase, regio |
| Mobiel, wil snel bellen | Vaste belknop + WhatsApp onderin | Geen |

## Experimenten (na meetbaarheid, zie 10)

| ID | Hypothese | Meting |
|---|---|---|
| X1 | Eerste wizardstap direct onder de hero verhoogt starts zonder de leadkwaliteit te verlagen | `form_start`, aandeel "kansrijk" |
| X2 | Budgetschuif vanaf € 50k voor totaalrenovatie/uitbouw verlaagt het aandeel "past niet" | Leadbeoordeling in Sanity |
| X3 | Terugbelverzoek (2 velden) als tweede pad verhoogt mobiele conversie | Leads per apparaattype |
