# 05. UX/UI- en toegankelijkheidsaudit

Benchmark: WCAG 2.2 AA. Gecontroleerd in code; contrastwaarden berekend.

## Toegankelijkheid

| ID | Probleem | Waar | Fix |
|---|---|---|---|
| UX-01 | Formuliervelden zonder gekoppeld label (alleen placeholder); budgetschuiven zonder label | `SmartIntakeWizard.tsx` (naam, e-mail, telefoon, adres, sliders) | `id`/`htmlFor` en `aria-label` toevoegen |
| UX-02 | Meerdere H1's: elke wizardstap is een H1, plus de pagina-H1 | wizard, `LeadForm.tsx`, advertentiepagina's | Wizardkoppen H2 maken |
| UX-03 | Geen focusbeheer of live region tussen wizardstappen | wizard | Focus naar de stapkop bij stapwissel |
| UX-04 | Hero-video speelt automatisch in een lus zonder pauzeknop (WCAG 2.2.2) | `Hero.tsx` | Pauzeknop |
| UX-05 | Contrast: oranje #d95b16 op wit 3,85:1; stone #87816f op soft 3,4 tot 3,7:1; megamenu-titels 2,5:1; WhatsApp-bubbel 1,98:1 | tokens, `Header.tsx`, `FloatingActions.tsx` | Tekst-oranje ± #b54a0f (5,3:1), stone ± #6b665a |
| UX-06 | Belangrijke afbeeldingen als CSS-achtergrond zonder alt-tekst | projecten, ServiceCard, ProjectCard, team | `<img>` met alt of `role="img"` + `aria-label` |
| UX-07 | Megamenu zonder `aria-expanded`, opent alleen bij hover/focus | `Header.tsx` | Knop met aria-attributen |
| UX-08 | Geen skip-link | `(site)/layout.tsx` | "Naar inhoud"-link |
| UX-09 | Engelse placeholdertekst kan publiek zichtbaar worden ("No content blocks...", "Our Services", "Services Index Page") | `CmsPageView.tsx`, Sanity | Niets renderen / Nederlandse titels |

## UI en design system

- Drie kleurensets (brand, lp, CSS-variabelen) plus losse waarden (#e85f00, #ff6a00). Samenvoegen tot één set tokens.
- Zeven of meer lettertypen; de wizard laadt Bricolage Grotesque en Hanken Grotesk op elke pagina met een formulier.
- `section.bg-white` krijgt overal een patroon en `overflow:hidden` (kan dropdowns afknippen).
- Dubbele componenten: reviews (4 varianten), CTA (2), intake (was 2), ± 300 regels gekopieerd tussen de twee advertentiepagina's.

## Mobiel

De zwevende intakeknop is op mobiel verborgen en er is geen vaste belbalk op de hoofdsite. Voor een mobiele bezoeker die snel wil bellen is de eerste actie dus ver weg. Advies: vaste balk onderin met "Bel" en "WhatsApp" (085 087 1814) en "Start aanvraag".
