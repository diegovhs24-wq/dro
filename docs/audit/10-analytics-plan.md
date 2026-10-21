# 10. Meetplan

## Huidige stand (waargenomen)

| Wat | Status |
|---|---|
| GA4 | Niet aanwezig |
| Vercel Web Analytics | Uit (API: "Web Analytics not found") |
| Google Ads-tag | Na toestemming; events `conversion` (na succesvolle verzending), `click_call`, `click_whatsapp` |
| Formulierstappen | Niet gemeten |
| AI-verkeer | **Nieuw**: kanaal "AI-assistent" op leads; `AI_REFERRAL`- en `AI_CRAWL`-regels in Vercel-logs |

## Voorgesteld eventmodel

| Event | Waar | Voorwaarde |
|---|---|---|
| `page_view` | Analytics-tool | Cookieloos (Vercel Analytics/Plausible) of na toestemming (GA4) |
| `cta_click`, `phone_click`, `whatsapp_click` | Bestaande click-listener uitbreiden | Toestemming bij GA4 |
| `form_start`, `form_step_complete` (stapnummer, dienst) | Wizard | |
| `form_submit_success` (lead-ID, kanaal) | Na 201 van de server | Eén keer per lead-ID |
| `lead_qualified`, `appointment_set`, `proposal_sent`, `contract_won` (bedrag) | **Server/Bouwe**, niet in de browser | Koppeling op lead-ID |

## Rapportage (maandelijks)

Per kanaal (Google Ads, organisch, AI-assistent, Trustoo/verwijzing, direct): bezoeken, leads, % kansrijk, bezichtigingen, offertes, gewonnen, gemiddelde contractwaarde, brutomarge, kosten per gekwalificeerde lead. Noordster: verwachte brutowinst uit websiteprojecten.

**Let op:** attributie is een model, geen bewijs van oorzaak. Iemand die via ChatGPT binnenkomt kan DRO eerder op Trustoo hebben gezien.

## Besluit nodig

Welke analytics-tool: Vercel Web Analytics (cookieloos, eenvoudig, kosten afhankelijk van volume) of GA4 (gratis, maar consent-afhankelijk en zwaarder). Voor AI-verwijzingen volstaat cookieloos.
