# 07. Performance-audit

**Beperking:** vanuit deze omgeving waren geen Lighthouse- of CrUX-metingen mogelijk (geen toegang tot PageSpeed API of Search Console). Onderstaande punten zijn uit code en bestandsgroottes afgeleid. Een nulmeting met PageSpeed Insights (mobiel) op `/`, `/totaalrenovatie`, `/den-haag/totaalrenovatie` en `/totaalrenovatie-den-haag` is stap 1.

| ID | Bevinding | Verwachte impact | Fix |
|---|---|---|---|
| PERF-01 | Afbeeldingen in `public/` tot 21 MB (`dro-renovaties-team.jpg`) | LCP op pagina's die ze gebruiken | Comprimeren naar < 300 kB, WebP/AVIF |
| PERF-02 | Hero-video `hero-totaalrenovatie.mp4` autoplay op de homepage | LCP en dataverbruik mobiel | Poster als LCP-element, video lazy na interactie of alleen desktop |
| PERF-03 | Zeven lettertypen; wizard laadt twee extra Google Fonts | Render-blokkade, CLS | Max twee families, zelf hosten |
| PERF-04 | `SmartIntakeWizard.tsx` (2.377 regels) client-side op elke pagina met formulier | JavaScript-bundel, INP | Opsplitsen per stap (dynamic import), CSS naar module |
| PERF-05 | `next/image` niet gebruikt; afbeeldingen als CSS-achtergrond | Geen responsive formaten | Sanity image-URL's met `w=` en `srcset` (optimizer staat bewust uit om veiligheidsredenen) |
| PERF-06 | Sanity-data via CDN met revalidate 60 s | Goed | Behouden |
| PERF-07 | Third-party: alleen Google Ads na toestemming | Goed | Behouden |

Na de wijzigingen in deze branch zijn er geen nieuwe client-side scripts toegevoegd; de AI-logging draait in de bestaande middleware en voegt geen netwerkverzoeken toe.
