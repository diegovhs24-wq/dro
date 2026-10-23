# 08. Backend, betrouwbaarheid en beveiliging

## Leadstroom (na wijziging)

1. Browser: `SmartIntakeWizard` maakt één `submissionId` per inzending, post JSON naar `/api/submit-request`.
2. Server: Origin- en content-type-controle, rate limit (6 per 10 min per IP, per instantie), validatie en lengtelimieten.
3. **Eerst opslaan** in Sanity `leads` met `_id = submission-<id>` (dubbel verstuurd = 409 = netjes "ok").
4. Foto's daarna, parallel, max 12 s; mislukken blokkeert niets.
5. Mail via Resend, max 8 s. Mislukt opslaan, dan staat bovenaan de mail "NIET OPGESLAGEN, dit is de enige kopie".
6. Alleen als opslaan **én** mailen mislukken krijgt de bezoeker een foutmelding (met 085 087 1814). Log: `LEAD_LOST`.
7. Browser: bij 413 of 5xx één nieuwe poging zonder foto's.
8. Honeypot ingevuld: lead wordt opgeslagen met `spamSuspect: true`, geen mail. Niets gaat meer stil verloren.

## Bevindingen en status

| ID | Ernst | Bevinding | Status |
|---|---|---|---|
| BE-01 | P0 | Honeypot `company` kon door autofill gevuld worden; lead werd stil weggegooid | **Opgelost** (veld `hp_x7`, opslaan met spamvlag) |
| BE-02 | P1 | Sanity-fout = geen mail | **Opgelost** (mail als fallback) |
| BE-03 | P1 | Ontbrekend schrijf-token blokkeerde 100% van de leads | **Opgelost** (mail als fallback) |
| BE-04 | P1 | Foto's (base64) konden 4,5 MB-limiet of 30 s time-out raken vóór opslaan | **Opgelost** (eerst opslaan, herkansing zonder foto's) |
| BE-05 | P1 | Ontbrekende Resend-config alleen als warning | **Opgelost** (`LEAD_EMAIL_NOT_CONFIGURED` als error, functie geeft true/false) |
| BE-06 | P1 | HTML-injectie via Funda-URL in leadmail | **Opgelost** |
| BE-07 | P1 | Voorbeeldmodus te openen met elk "geheim", open redirect | **Opgelost** (`defineEnableDraftMode`, getest: 401) |
| BE-08 | P1 | Geen rate limiting | **Deels** (in code); Vercel WAF-regel op `/api/submit-*` instellen |
| BE-09 | P1 | Geen security headers | **Opgelost** (nosniff, X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy, CSP in report-only, noindex op studio/api) |
| BE-10 | P1 | Next 14.2.30 met kritieke kwetsbaarheden | **Deels**: 14.2.35 (laatste 14.x). `npm audit` meldt nog advisories die pas in Next 15 zijn opgelost; image-optimizer uitgezet. **Upgrade naar Next 15 plannen** |
| BE-11 | P2 | Oude route `/api/submit-intake` zonder spamcontrole | **Opgelost** (410) |
| BE-12 | P2 | Geen dubbele-inzending-bescherming | **Opgelost** |
| BE-13 | P2 | Geen lengte- of telefoonvalidatie | **Opgelost** |
| BE-14 | P2 | Mail kon hangen tot time-out | **Opgelost** (8 s) |
| BE-15 | P2 | Geen privacyverwijzing bij het formulier | **Opgelost** (link naar /privacypolicy); versie van de privacyverklaring nog niet bij de lead opgeslagen |
| BE-16 | P2 | Geen bewaartermijn voor leads en foto's | Open: termijn vaststellen (bv. 24 maanden voor niet-geconverteerde leads) en opschoonjob |
| BE-17 | P2 | Elk Sanity-projectlid kan leads zien | Open: rollen per dataset |
| BE-18 | P3 | Zwakke CSRF-bescherming | **Opgelost** (content-type + origin) |
| BE-19 | P3 | Ongebruikte schrijfclient zonder `server-only` | **Verwijderd** |
| BE-20 | P3 | Seedscripts vallen terug op verkeerd project `lxi5ttc2` | Open |
| BE-21 | P3 | Ads-conversie zonder `transaction_id` | Open (lead-ID wordt nu teruggegeven, klaar om mee te sturen) |

## Monitoring instellen (handmatig, 15 minuten)

In Vercel > Logs > een alert of log drain op de termen `LEAD_LOST`, `LEAD_EMAIL_FAILED`, `LEAD_EMAIL_NOT_CONFIGURED`. Wekelijks in Studio filteren op `spamSuspect = true` en die leads nalopen.

## AVG-punten voor juridische toets

Privacyverklaring actueel? Grondslag voor bewaren van woningfoto's? Verwerkersovereenkomsten met Sanity, Resend, Vercel, Google. Deze audit is geen juridisch advies.
