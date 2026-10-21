# 12. Geprioriteerde backlog

Impact is een hypothese met betrouwbaarheid (H/M/L). Geen verzonnen percentages.

| ID | Prio | Onderdeel | Probleem | Oplossing | Effort | Afhankelijk van | Acceptatie | Status |
|---|---|---|---|---|---|---|---|---|
| R01 | P0 | Leads | Leads konden stil verloren gaan (BE-01 t/m 05, 12, 14) | Opslaan eerst, mail als fallback, dedupe, herkansing | M | | Lead komt binnen bij Sanity-storing, ontbrekend token, autofill-honeypot, te grote foto's | **Klaar** |
| R02 | P0 | Content | "Geen aanbetaling" op 24 plekken | Code-vangnet + Sanity-release | S | Therab publiceert release | `aanbetaling`-zoekactie op live site leeg op home/steden/FAQ | **Klaar in code**, release wacht |
| R03 | P0 | Content | Nepnummer op projectpagina's, verzonnen reviews in code | Vervangen/verwijderen | S | | Geen `31600000000` in build | **Klaar** |
| R04 | P0 | Claims | Trustoo 9,8/557, "1 werkuur", "5 jaar garantie" onbevestigd op betaald verkeer | Bevestigen of verwijderen | S | Therab | Alleen bevestigde claims live | Open |
| R05 | P1 | Security | Kwetsbare Next.js, geen headers, draft mode open | 14.2.35, headers, draft-check | S | | `npm audit` next-advisories alleen nog die pas in v15 zijn opgelost | **Klaar** |
| R06 | P1 | Security | Next 14 krijgt geen fixes meer | Upgrade naar Next 15 + React 19 | L | Testsessie | Build groen, formulier getest op preview | Open |
| R07 | P1 | GEO | Tegenstrijdige prijzen | Eén range per dienst in `BUSINESS.priceIndications`; FAQ's en artikelen aanpassen | M | BESLUIT-2/3/4 | Eén cijfer per dienst op hele site | Open |
| R08 | P1 | GEO | Versnipperde NAP online | Google, Bing, Trustoo, Klustarief, Drimble, LinkedIn bijwerken | M | Therab/Scott | NAP-tabel in 16 overal gelijk | Open |
| R09 | P1 | SEO | Dunne stad-x-dienst-pagina's | Sitemap + redirects | S | | Sitemap 170 URL's, combinatie zonder lokale inhoud = 308 | **Klaar** |
| R10 | P1 | SEO/GEO | Entity-graph versnipperd | Eén GeneralContractor | S | | Rich Results Test zonder fouten | **Klaar** (Rich Results Test nog draaien) |
| R11 | P1 | Content | Geen draagmuur-dienstpagina, dunne dienstpagina's | Contentplan C1 t/m C7 (16) | L | R07 | Pagina's > 1.500 woorden met tabel, bron, auteur, projecten | Open |
| R12 | P1 | Domein | Apex niet naar www, go.-subdomein SSL-fout | Vercel-domeininstellingen | S | Toegang Vercel | `dro-renovaties.nl` → 308 www | Open |
| R13 | P1 | Trust | Footer zonder juridische naam, KvK, btw, postcode | Footer uit `BUSINESS` | S | | Zichtbaar op alle pagina's | Open |
| R14 | P1 | Toegankelijkheid | Labels, H1's, contrast | Zie 05 | M | | axe zonder kritieke fouten op home/contact | Open |
| R15 | P2 | Meting | Geen analytics | Vercel Web Analytics of GA4 + eventmodel | S | Kostenbesluit | AI-verwijzingen per platform zichtbaar | Open |
| R16 | P2 | CRM | Geen terugkoppeling offerte/opdracht naar lead | Webhook naar Bouwe op lead-ID | M | Bouwe-API | Omzet per kanaal per maand | Open |
| R17 | P2 | CRO | Hero-CTA scrolt naar einde; budget start bij € 15k; geen architect-pad | Eerste stap onder hero, budget per dienst, partnerpagina | M | | Experimenten X1 t/m X3 (03) | Open |
| R18 | P2 | Casestudy's | Projecten zonder scope, m², budgetband | Sanity-velden + sjabloon | M | Toestemming klanten | 6 tot 10 casestudy's | Open |
| R19 | P2 | Security | Bewaartermijn leads, rollen per dataset, WAF-regel | Zie 08 | S | | | Open |
| R20 | P3 | Code | Dode componenten, Comic Sans, zeven fonts, stockfoto's | Opruimen | M | | | Deels |
