# 04. Premium positionering en vertrouwen

## Claims-audit (samenvatting)

Statussen: **GEVERIFIEERD** (door Therab bevestigd), **VEROUDERD**, **ONBEVESTIGD**, **RISICO** (juridisch of reputatie).

| Claim | Status | Actie |
|---|---|---|
| KvK 94825653, btw NL866905030B01, Orionstraat 235 | GEVERIFIEERD | Nu in JSON-LD en llms.txt; ook zichtbaar in de footer zetten |
| "DRO Bouw- en Aannemingsbedrijf" (met koppelteken) | VEROUDERD | KvK-schrijfwijze zonder koppelteken; in code en Sanity-release |
| "Geen aanbetaling" | VEROUDERD | Vervangen door "startbetaling 20 tot 25%, daarna per afgeronde fase" |
| 4,8 uit 273 Google-reviews | GEVERIFIEERD (17-10-2026) | Centraal in `BUSINESS.reviews`, altijd met bron |
| Trustoo 9,8 / 557, "Top Pro 2026" | ONBEVESTIGD | Live is 520 reviews gezien. Bevestigen of verwijderen van advertentiepagina's |
| VCA, SBB-leerbedrijf, CAR + aansprakelijkheid | GEVERIFIEERD | Uitleggen wat CAR dekt; verzekeraar noemen |
| VLOK | GEVERIFIEERD maar misleidend gepresenteerd | VLOK is een erkenning voor airco/warmtepompen; niet als algemene bouwerkenning tonen. Feitenbalk aangepast |
| "35+ vakmensen", "15+ jaar ervaring", "100+ projecten" | ONBEVESTIGD | 35+ en 15+ uit code verwijderd; 100+ staat alleen in CMS |
| "Vaste prijs vooraf, geen verrassingen" | RISICO | Algemene voorwaarden bevatten nacalculatie en stagnatiekosten. Herformuleren: "uitgewerkte offerte vooraf; meerwerk alleen na uw schriftelijk akkoord" |
| "5 jaar garantie" (badkamer-FAQ) | ONBEVESTIGD | Bevestigen of verwijderen |
| "Volledig verzekerd", "schade is gedekt" | RISICO | Polisvoorwaarden en eigen risico gelden; precies formuleren |
| "Binnen 1 werkuur teruggebeld" | ONBEVESTIGD | Alleen als het operationeel klopt |
| "Eigen ploegen", "eigen opslag" | ONBEVESTIGD | Klopt als vaste ploegen in dienst of vast ingehuurd zijn; formulering afstemmen |
| Dekking Noord-Holland, Utrecht, Zeeland "dankzij meerdere opstartlocaties" | RISICO | Er is één vestiging; schrappen of uitleggen |
| Verzonnen reviews (`Reviews.tsx`: "Sanne uit Utrecht"...) | RISICO | **Verwijderd** |
| Placeholder `tel:+31600000000` / `wa.me/31600000000` | RISICO | **Vervangen** door 085 087 1814 |

## Vertrouwensarchitectuur (wat een klant van € 50k tot € 250k wil zien)

| Zorg | Bewijs dat DRO kan tonen | Bestaat? |
|---|---|---|
| Is dit een echt bedrijf? | Juridische naam, KvK, btw, adres met postcode in footer | Deels (alleen op advertentiepagina's) |
| Kunnen ze dit? | Casestudy's met scope, m², duur, budgetband, foto's voor/na, klantcitaat met toestemming | Nee (alleen type, plaats, duur) |
| Wie is mijn aanspreekpunt? | Team met rollen: Therab (bezichtiging, offerte), Scott (planning, opvolging), Jarek (techniek), Esra (kwaliteit en betalingen) | Deels (Esra ontbreekt, Scott verkeerde rol) |
| Wat als het misgaat? | Verzekering uitgelegd, garantie, klachtenregeling, opleverprocedure | Nee |
| Wat gaat het kosten? | Prijsranges per dienst met datum, betaalschema | Ja op advertentiepagina's, tegenstrijdig elders |
| Hoe verloopt het? | Werkwijze met wekelijks overlegmoment en app-vragen binnen 24 uur | Ja op advertentiepagina, niet consistent op de site |

## Visuele richting

De huidige tokens (papier #fbfaf7, inkt #181613, oranje #d95b16, Schibsted Grotesk/Newsreader) passen bij een rustige, professionele aannemer. Punten die premium ondermijnen: Comic Sans als eerste font in `font-hand` (13 plekken), stockfoto's (Unsplash) in hero-poster en fallback-diensten, zeven lettertypefamilies, en de afbouw-iconengrid op de homepage. Advies: echte projectfotografie, één schreef- en één schreefloze letter, minder iconen en meer bewijs.
