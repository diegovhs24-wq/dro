# 09. Salesfunnel en CRM

## Huidige keten (waargenomen + werkwijze DRO)

Website → `/api/submit-request` → Sanity `leads` (met kanaal, attributie, leadbeoordeling kansrijk/twijfel/past niet) → mail aan Scott (cc beheerder) → Scott belt en plant → Therab bezichtigt en maakt offerte (grotere projecten) in mijndro.app → akkoord → planning en betaalschema → Esra factureert startbetaling ± een week voor de start → uitvoering (Jarek technisch) → oplevering.

**Breuk:** na de mail is er geen automatische koppeling naar mijndro.app/Bouwe. Status, offertebedrag en uitkomst van een lead worden niet terug in de leadrecord gezet. Daardoor is niet te meten welk kanaal (Ads, organisch, AI, Trustoo) opdrachten en marge oplevert.

## Leadschema (bestaand + aan te vullen)

| Veld | Bestaat | Opmerking |
|---|---|---|
| ID, tijdstip, contact, diensten, adres, budget, planning, bericht, foto's | Ja | |
| Bron (`source`), kanaal (`channel`), attributie (utm, gclid, verwijzer, landingspagina) | Ja | Kanaal "AI-assistent" toegevoegd |
| Leadbeoordeling | Ja | Regels: dienst, budget ≥ € 50k, postcode 2200 t/m 3299, planning |
| `spamSuspect` | **Nieuw** | |
| Toestemming/versie privacyverklaring | Nee | Toevoegen |
| Eigenaar, status (nieuw/gebeld/bezichtiging/offerte/gewonnen/verloren), reden verlies | Nee | In Bouwe bijhouden, met lead-ID als sleutel |
| Offertebedrag, contractwaarde, marge | Nee | In Bouwe; maandelijks terug te koppelen naar kanaal |

## Integratievoorstel (na akkoord, niets geactiveerd)

1. Bij opslaan van een lead: webhook naar Bouwe met lead-ID (Sanity webhook of directe call vanuit de API-route).
2. Bouwe houdt status en bedragen bij.
3. Maandelijkse export per kanaal: leads, kansrijk, offertes, gewonnen, omzet, marge. Voor Ads: offline-conversie-import van gewonnen opdrachten (alleen met toestemming-gclid).

Automatische klantberichten (bevestiging, herinneringen) zijn bewust **niet** aangezet; dat vraagt expliciet akkoord.
