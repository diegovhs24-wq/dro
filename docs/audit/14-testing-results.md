# 14. Testresultaten

> Bijgewerkt na de pre-productiereview: zie 17, §6, voor de actuele stand (20 tests, crawl van 288 URL's op preview `c18132d`). De tabel hieronder is de eerste ronde.

## Automatisch geslaagd

| Test | Resultaat |
|---|---|
| `npm run typecheck` (tsc --noEmit) | Geslaagd, 0 fouten |
| `npm run lint` | Geslaagd; alleen bestaande `<img>`-waarschuwingen |
| `npm run test:geo` (4 tests: claim-filter, review-notatie, juridische naam, AI-kanaal) | 4/4 geslaagd |
| Vercel preview-build van de branch | Geslaagd ("Deployment has completed") |

Lokale `next build` lukt niet in deze omgeving omdat Google Fonts niet bereikbaar is; daarom is gebouwd via de Vercel-preview.

## Handmatig gecontroleerd op de preview (via Chrome)

| Controle | Resultaat |
|---|---|
| robots.txt | Drie groepen, Content-Signal in `*`-groep, geen URL-dump |
| llms.txt | Kernfeiten correct, geen "aanbetaling" |
| JSON-LD homepage | GeneralContractor met legalName zonder koppelteken, `+31850871814`, postcode, founder, employee, hasCredential, offercatalogus; geen aggregateRating |
| Sitemap | 170 URL's (was 286) |
| `/delft/zonnepanelen` (geen lokale inhoud) | Redirect |
| `/den-haag/totaalrenovatie` | 200 |
| Markdown `/den-haag` | Titel "Renovatie in Den Haag", één H1, NAP-blok onderaan |
| "geen/zonder aanbetaling" op home, /den-haag, /werkwijze, /totaalrenovatie, advertentiepagina | Afwezig |
| Restant op /over-ons ("nooit met een grote aanbetaling in de kou") | Komt uit FAQ die in de Sanity-release is gecorrigeerd |
| Security headers | Aanwezig; geen `x-powered-by`; CSP report-only actief |
| Console home en contact (CSP-meldingen, fouten) | Geen |
| `/api/submit-request` met verkeerd content-type | 415 |
| `/api/submit-request` met lege velden | 400 met veldenlijst |
| `/api/submit-intake` | 410 |
| `/api/draft/enable` met vals geheim | 401 |
| `/offerte-aanvragen` | Redirect |
| Projecttitel `/projecten/paulinastraat` | "Totaalrenovatie, Paulinastraat Den Haag \| DRO Renovaties" |

## Bewust niet getest

- **Een echte geslaagde inzending**: die zou een mail naar Scott sturen en een lead in productie-Sanity aanmaken. Na merge: één testaanvraag met naam "TEST Claude" doen en daarna verwijderen, of een preview met `LEAD_NOTIFICATION_TO` naar een testadres.
- Gedrag bij Sanity-storing en ontbrekend token (codepad gereviewd, niet gesimuleerd).
- Google Rich Results Test en Schema.org-validator op de preview (preview staat achter Vercel-login). Na merge draaien op productie.

## Geblokkeerd door ontbrekende toegang

Search Console, Bing Webmaster, Google Bedrijfsprofiel, PageSpeed/CrUX, Vercel-domeininstellingen en -logs.
