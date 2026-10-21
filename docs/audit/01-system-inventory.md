# 01. Systeeminventaris

Datum: 21-10-2026. Repo: `diegovhs24-wq/dro` (commit `d4d5400` als basis). Branch met wijzigingen: `feat/geo-ai-findability-audit`.

## Tech stack (waargenomen)

| Laag | Technologie |
|---|---|
| Framework | Next.js 14 App Router (was 14.2.30, nu 14.2.35), React 18, TypeScript 5.5 |
| Styling | Tailwind CSS 3.4 + globale CSS; styled-components alleen voor Sanity Studio |
| CMS | Sanity v3, project `cwblo9lu`, dataset `production` (content) en `leads` (aanvragen, privé) |
| Studio | Ingebouwd op `/studio` (content) en `/studio-aanvragen` (leads) |
| E-mail | Resend (leadmail naar `LEAD_NOTIFICATION_TO`, standaard scott@, cc beheerder) |
| Adres-lookup | PDOK (overheid), direct vanuit de browser |
| Analytics | Alleen Google Ads-tag + conversie, pas na cookietoestemming. Geen GA4, geen Vercel Web Analytics |
| Hosting | Vercel (project `dro`), previews per branch, beveiligd met Vercel-login |
| Tests | Geen testsuite aanwezig; nu `npm run test:geo` (node:test) |

## Architectuur

```
Bezoeker ──► Vercel Edge (middleware: Markdown-negotiatie, AI-logging, Link-header)
               │
               ├─► app/(site)/*   pagina's, server-rendered, data via fetchSanity (CDN, revalidate 60 s)
               ├─► app/(lp)/*     advertentiepagina's (noindex), eigen layout
               ├─► /robots.txt, /sitemap.xml, /llms.txt, /llms-full.txt, /.well-known/api-catalog
               ├─► /api/markdown  Markdown-versie per pagina (Accept: text/markdown)
               ├─► /api/submit-request ─► Sanity `leads` (formSubmission + foto's) ─► Resend-mail
               ├─► /api/submit-intake  (uitgeschakeld, 410)
               └─► /api/draft/*  voorbeeldmodus voor Sanity Presentation
Sanity `production` ◄── Studio (/studio)        Sanity `leads` ◄── Studio (/studio-aanvragen)
```

## Route-inventaris

| Route | Bron | Aantal (live) | Index |
|---|---|---|---|
| `/` | CMS-pagina `home` | 1 | ja |
| `/{slug}` | CMS-pagina, anders stad (`location`) | 17 pagina's + 22 steden | ja |
| `/{stad}/{dienst}` | Stad x dienst | was 198 in sitemap, nu ~83 (alleen `popularServices`) | ja |
| `/diensten`, `/projecten`, `/kennisbank`, `/handige-tools`, `/cookie-informatie` | Indexpagina's | 5 | ja |
| `/projecten/{slug}` | Sanity `project` | 20 | ja |
| `/kennisbank/{slug}` | Sanity `blogPost` | 26 | ja |
| `/totaalrenovatie-den-haag`, `/draagmuur-verwijderen-den-haag` | Advertentiepagina's | 2 | noindex, follow |
| `/studio`, `/studio-aanvragen` | Sanity Studio | | noindex |

Sitemap live (vóór wijziging): 286 URL's, alle 200 en self-canonical. Op de preview van deze branch: 170 URL's.

## Sanity-inhoud (gepubliceerd)

18 pagina's, 9 diensten, 22 steden, 20 projecten, 26 artikelen (allemaal auteur "Therab"), 53 FAQ's. Diensten: totaalrenovatie, uitbouw/aanbouw, badkamer, afbouw nieuwbouw, stuc/schilderwerk, vloerverwarming, onderhoud, warmtepomp, zonnepanelen. **Er is geen dienst of indexeerbare pagina voor draagmuur verwijderen of dakopbouw.**

## Dode en dubbele code (gevonden)

- Verwijderd: `IntakeWizard.tsx` (oud formulier), `Reviews.tsx` (verzonnen reviews), `CTA.tsx` (nepnummer), `lib/sanityWriteClient.ts` (ongebruikte schrijfclient).
- Nog aanwezig en ongebruikt: `TeamMember`, `TeamFaqSection`, `Process`, `SystemLayers`, `Services`, `About`, `ServicePage`, `ReviewCard`, het CMS-type `intakeForm` en `seed-intake-form.mjs`.
- `SmartIntakeWizard.tsx` is 2.377 regels met ± 1.300 regels inline CSS en laadt twee extra Google Fonts.
- README verwijst naar bestanden die niet meer bestaan.
- `mergeServicesWithFallback` houdt altijd alle 9 fallbackdiensten (met stockfoto's) zichtbaar, ook als ze in Sanity zijn verwijderd.

## Configuratie en omgevingsvariabelen (namen, geen waarden)

`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`, `SANITY_API_WRITE_TOKEN` (leads), `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL`, `LEAD_NOTIFICATION_TO`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`, `NEXT_PUBLIC_SITE_URL`. Geen geheimen in code of git-geschiedenis gevonden.
