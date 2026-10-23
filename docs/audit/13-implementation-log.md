# 13. Implementatielog

Branch `feat/geo-ai-findability-audit`. Niets is naar productie gedeployed; Vercel heeft een preview gebouwd per push.

## Code

| Groep | Bestanden | Wat |
|---|---|---|
| Bedrijfsfeiten | `lib/seo/business.ts` (nieuw) | Geverifieerde feiten, reviews met datum, prijsindicaties, claim-vangnet |
| Structured data | `lib/seo/structured-data.ts`, `lib/seo/site.ts`, `components/seo/JsonLd.tsx`, `app/(site)/layout.tsx` | Eén GeneralContractor-entiteit, founder/team/credentials/offercatalogus, geen aggregateRating, veilige serialisatie |
| AI-crawlers | `app/robots.txt/route.ts`, `app/llms.txt/route.ts`, `lib/seo/markdown.ts`, `app/.well-known/api-catalog/route.ts` | Zie 16 |
| Dunne pagina's | `lib/seo/sitemap-data.ts`, `app/(site)/[slug]/[service]/page.tsx` | Alleen combinaties met lokale inhoud |
| CMS-vangnet | `lib/sanity.ts` | Verouderde claim uit gepubliceerde content |
| Leads | `app/api/submit-request/route.ts`, `lib/leadEmail.ts`, `components/SmartIntakeWizard.tsx`, `sanity/schemaTypes/documents.ts`, `app/api/submit-intake/route.ts` | Zie 08 |
| Attributie | `lib/leadInsights.ts`, `middleware.ts` | Kanaal AI-assistent, AI_CRAWL/AI_REFERRAL-logging |
| Beveiliging | `next.config.mjs`, `app/api/draft/enable/route.ts`, `package.json` | Headers, CSP report-only, Next 14.2.35, draft-check, image-optimizer uit |
| Redirects | `next.config.mjs` | `/privacy` → `/privacypolicy`, `/offerte-aanvragen` → `/contact` |
| Claims | `HomeFeitenBalk.tsx`, `TrustSignals.tsx`, `GoogleReviews.tsx`, `GoogleRatingBadge.tsx`, `LocationPage.tsx`, `LocationServicePage.tsx`, `cms-fallback.ts`, `projecten/[slug]/page.tsx`, beide advertentiepagina's | Review-cijfers centraal, nepnummers weg, 35+/15+/VLOK-framing, "geen aanbetaling" op advertentiepagina, unieke projecttitels, advertentiepagina's `noindex, follow` |
| Verwijderd | `IntakeWizard.tsx`, `Reviews.tsx`, `CTA.tsx`, `lib/sanityWriteClient.ts` | Dode code met risico's |
| Tests | `scripts/tests/*`, `npm run test:geo`, `npm run typecheck` | |

## Sanity

Release `geo-betaalvoorwaarden` aangemaakt met 21 documentversies (18 steden, site settings, 2 FAQ's). **Niet gepubliceerd.** Zie 16, §4.

## Aannames (omkeerbaar)

- Postcode 2516 AS uit het SBB Stagemarkt-profiel; bevestigen met KvK-uittreksel.
- Trainingscrawlers toegestaan (`ALLOW_TRAINING = true`), conform het feitelijke gedrag van de oude robots.txt.
- Combinaties stad x dienst buiten `popularServices` worden doorgestuurd naar de stadspagina (308).
- Feitenbalk: "35+ vakmensen" vervangen door "SBB erkend leerbedrijf"; "VLOK" door "VCA, CAR-verzekerd".
