# Design system DRO Renovaties (22-10-2026)

**Referentie:** de pagina Over ons (warm, rustig, Poppins). Alle pagina's gebruiken dezelfde tokens. Zet nergens losse kleuren, lettertypen of hoeken; gebruik de tokens hieronder.

## Tokens

| Token | Waarde | Tailwind | CSS |
|---|---|---|---|
| Lettertype | Poppins 400 tot 800 (enige familie) | `font-sans` (ook `font-hand`, `font-serif` wijzen hiernaar) | `var(--font-poppins)` |
| Tekst | #181613 | `text-brand-ink` | `--dro-ink` |
| Tekst zacht | #3a3733 | `text-brand-ink-soft` | `--dro-ink-soft` |
| Gedempt | #6b665b / #5c574d | `text-brand-stone`, `text-lp-muted` | `--dro-muted` |
| Achtergrond warm | #f7f3ec | `bg-brand-cream`, `bg-lp-plaster` | `--dro-cream` |
| Lijn | #e7e3da | `border-brand-line` | `--dro-line` |
| Donker vlak | #181613 / #1f1c18 | `bg-brand-ink`, `bg-lp-slate` | `--dro-dark` |
| Oranje (knop en accent) | #c4520f (wit erop: 4,6:1, AA) | `bg-brand-orange` | `--dro-orange` |
| Oranje hover | #a9450c | `hover:bg-brand-orange-hover` | `--dro-orange-hover` |
| Hoek knop | 8 px | `rounded-btn` | `--dro-radius-btn` |
| Hoek kaart, formulierblok | 12 px | `rounded-card` | `--dro-radius-card` |
| Hoek beeldvlak | 16 px | `rounded-img` | `--dro-radius-img` |
| Schaduw knop | zacht oranje | `shadow-cta` | `--dro-shadow-cta` |
| Schaduw beeld | zacht | `shadow-img` | `--dro-shadow-img` |

## Componenten (vaste klassen)

- **Knoppen:**
  - `btn-primary` (oranje, schaduw);
  - `btn-outline` (donkere rand, op lichte achtergrond);
  - `btn-secondary` (alleen op donkere vlakken);
  - in de paginalaag `pr-btn`, `pr-btn-line`, `pr-btn-light`.
- **Hero:** `hero-ref`, `hero-ref-title` en `hero-ref-text`. Altijd crème, donkere zware kop, bovenkopje `eyebrow-slate` (spatiëring, gedempt). Nadruk in een kop: `<em class="font-serif">`, wordt oranje Poppins.
- **Pagina's met de paginalaag** (home, routes, portfolio, casestudy's): `.pr`, met `pr-display`, `pr-title`, `pr-h2`, `pr-h3`, `pr-lead`, `pr-measure` (bovenkopje), `pr-kalk` (crème vlak), `pr-dark` (donker vlak), `pr-steps`. Deze klassen lezen dezelfde tokens.
- **Intake:** de intake leest de tokens via `--intake-*` (`--dro-*`).
- **Advertentiepagina's:** dezelfde Poppins en tokens. De namen `lp-*` blijven bestaan, maar wijzen naar de huisstijlwaarden.

## Regels

- Eén H1 per pagina. De intake gebruikt standaard een h2.
- Zwevende knoppen:
  - geen op mobiel (bellen en WhatsApp staan in hero en menu);
  - intakeknop alleen op tablet en niet op pagina's met een eigen intake;
  - alles verdwijnt zodra de footer in beeld is.
- Lange samenstellingen breken af (`hyphens: auto`, `lang="nl"`), zodat niets breder wordt dan het scherm.
- Beelden: echte projectfoto's, afgerond (`rounded-img`). Geen stockfoto's in een hero.
- Metabeschrijving maximaal 160 tekens, en elke pagina heeft een deelafbeelding (standaard `/og/dro-renovaties.jpg`, de teamfoto).
