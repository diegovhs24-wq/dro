# Fase 2: wat er is gebouwd (22-10-2026)

Branch `feat/fase-2-commercieel`, gestapeld op PR #24. Geen productie-deployment, geen wijzigingen in Sanity-content: alleen code en schema.

## 1. Twee conversieroutes

| Route | Pagina | Voor wie | Intake |
|---|---|---|---|
| Grote renovaties | `/grote-renovaties` | Totaalrenovatie, uitbouw, dakopbouw, € 50.000 tot € 250.000+ | Budgetschuif tot € 250.000+ (stappen van € 10.000), start op € 50k tot € 100k, bij totaalrenovatie of aanbouw € 75k tot € 150k |
| Constructieve werken | `/constructieve-werken` | Draagmuur, deuropening, doorbraak, stalen ligger, bouwkundige keuring | Draagmuur bovenaan, met de bestaande rekenmodule (directe prijsindicatie) |

Opbouw per pagina: hero met verifieerbare zekerheden (Google-score met datum, betaling, verzekering, erkenningen), voor wie, scope met links, prijs, werkwijze, team, projecten of casestudy's, FAQ, intake, verwijzing naar de andere route.

- **Rekenhulp grote renovaties**: m²-schuif met bandbreedte excl. en incl. btw en het betaalschema (€ 0 bij ondertekening, 20 tot 25% op de eerste werkdag). Alleen de bevestigde € 1.000 tot € 1.250 per m².
- **Doorlooptijd** wordt berekend uit de projecten in Sanity (bijv. "8 tot 14 weken"), niet ingetypt.
- Alle teksten staan in `lib/conversionRoutes.ts` en gebruiken alleen feiten uit `lib/seo/business.ts`. Een test faalt als er een garantie, reactietijd, Trustoo-cijfer, superlatief, em-dash of "geen aanbetaling" in komt.

## 2. Intake met budgetkwalificatie

- Nieuwe bronnen `route-grote-renovatie` en `route-specialistisch` (server accepteert alleen deze waarden).
- Elke lead krijgt `conversionRoute` en `budgetTier` (tot 25k, 25-50k, 50-100k, 100-250k, 250k+, onbekend). Beide in Studio filterbaar en in de leadmail ("Route", "Budgetklasse", "Verstuurd vanaf").
- Op de route grote renovatie geldt de budgetcheck "vanaf € 50.000" altijd, ook als iemand alleen een badkamer kiest.
- Nieuwe keuze bij "Hoe heeft u ons gevonden": AI-assistent (ChatGPT, Gemini, Perplexity of Copilot).
- Onderwerp van de leadmail is ongewijzigd, zodat "DRO mail op orde" en "DRO Ads schaalcheck" blijven werken.
- Vragen op routepagina's zijn `h2` (de pagina heeft al een `h1`); de budgetschuiven hebben nu een toegankelijk label.

## 3. Casestudy-architectuur

- Sanity, Project > tab **Casestudy**: publicatievinkje, toestemmingsdatum, routes, wijk, woningtype, bouwjaar, m², weken, budgetband (vaste banden) met eigen toestemming, doel, scope, uitdaging, oplossing, details, citaat met eigen toestemming, uitvoerder, foto's voor en na.
- `toPublicCaseStudy` is fail closed: zonder vinkje, geldige toestemmingsdatum, omschrijving, scope en na-foto bestaat de casestudy voor de site niet. Budgetband en citaat verdwijnen zonder eigen vinkje.
- Weergave: kaart op de routepagina (vervangt dan "Recente projecten"), volledige casestudy op `/projecten/[slug]`, en in de Markdown-versie voor AI.
- Nu staat er nog geen enkele casestudy aan. Zonder actie verandert er op de projectpagina's niets (behalve dat een leeg "Duur"-blok niet meer wordt getoond).

## 4. Placeholders voor geverifieerde claims

Sanity, Site Settings > tab **Geverifieerde claims**: garantie, reactietijd, Trustoo-score. Elk met "Bevestigd", "Bevestigd door", "Bevestigd op" en intern bewijsveld. Pas als alle drie zijn ingevuld verschijnt de claim op de routepagina's. Advertentiepagina's zijn bewust niet aangepast (lopende campagne).

## 5. Footer

Juridische regel uit `BUSINESS`: DRO Bouw en Aannemingsbedrijf B.V., Orionstraat 235, 2516 AS Den Haag, KvK, btw, erkenningen, verzekeringen. Blok "Voor uw project" met beide routes. De CMS-regel "DRO Bouw- en Aannemingsbedrijf" (met koppelteken) wordt niet meer getoond.

## 6. Meting en CRM-attributie

| Event | Wanneer | Parameters |
|---|---|---|
| `route_view` | Bezoek routepagina | route |
| `cta_click` | Klik op een link met `data-cta` | cta, placement |
| `click_call`, `click_whatsapp` | Bel- of WhatsApp-link | placement (hero, footer, ...) |
| `form_start` | Eerste afgeronde stap | route, source |
| `form_step_complete` | Elke stap vooruit | step, step_index, steps_total |
| `form_submit_success` | Geslaagde aanvraag (geen spam of dubbel) | lead_id, budget_tier, services |
| `form_submit_error` | Verzenden mislukt | route, source |

- Alleen met cookietoestemming. Parameters met namen als e-mail, telefoon, adres of waarden die op een e-mailadres of telefoonnummer lijken, worden geweigerd (getest).
- `lead_id` is gelijk aan het Sanity-document (`submission-...`): zo is elke conversie aan de lead en later aan de getekende offerte te koppelen.
- GA4 optioneel via `NEXT_PUBLIC_GA4_ID`. Zonder die variabele verandert er niets.
- De oude dubbele belklik-meting is vervangen door één event met plaatsing.

## 7. AI-vindbaarheid

Beide routes: Service-, FAQPage-, WebPage- en BreadcrumbList-schema, in de sitemap, in `llms.txt` (sectie "Twee routes voor een aanvraag"), in `llms-full.txt` en als Markdown via `Accept: text/markdown`. Casestudy's verschijnen in de Markdown van het project zodra ze zijn vrijgegeven.

## 8. Tests

`npm test`: 32 tests (6 GEO, 17 leadroute waarvan 3 nieuw, 9 fase 2). Typecheck en lint zonder fouten.

## 9. Wat Therab of het team nog moet doen

1. Na merge: per project dat mag, de tab Casestudy invullen (begin met 3 projecten boven € 50.000).
2. Garantie, reactietijd en Trustoo invullen en bevestigen in Site Settings, of leeg laten.
3. Beslissen of de routes in het hoofdmenu komen (Header is CMS-gestuurd: Site Settings > Header).
4. Optioneel GA4-property aanmaken en `NEXT_PUBLIC_GA4_ID` in Vercel zetten.
5. Prijsbanden voor uitbouw, dakopbouw en draagmuur (BESLUIT-2 t/m 4): dan kan de rekenhulp ook daarvoor.
