# 06. SEO-audit

Live crawl van alle 286 sitemap-URL's (21-10-2026) via de browser (WebFetch krijgt de Markdown-versie en ziet dus geen head-tags).

## Technisch

| ID | Bevinding | Status |
|---|---|---|
| SEO-01 | Alle URL's 200, self-canonical, server-rendered, geen noindex in sitemap | In orde |
| SEO-02 | Apex `dro-renovaties.nl` redirect niet naar www (200 op beide) | Handmatig in Vercel (zie 16, E8) |
| SEO-03 | 198 stad-x-dienst-URL's in sitemap, ~115 zonder lokale inhoud | **Opgelost**: sitemap 170 URL's, redirect naar stadspagina |
| SEO-04 | Markdown-versie voor agents had generieke titel en twee H1's | **Opgelost** |
| SEO-05 | robots.txt met 286 commentaarregels en tegenstrijdig trainingssignaal | **Opgelost** |
| SEO-06 | Drie overlappende bedrijfsentiteiten in JSON-LD, geen postcode, telefoon niet internationaal | **Opgelost** |
| SEO-07 | Zelfgepubliceerde aggregateRating op ~285 pagina's | **Verwijderd** |
| SEO-08 | Dubbele projecttitels ("Badkamer Den Haag" x3) en dubbele spaties | **Opgelost** in code (straat in de titel) |
| SEO-09 | `/diensten` titel "Services Index Page" zonder meta description | Sanity (handmatig) |
| SEO-10 | 165 meta descriptions te lang (> 165 tekens) | Sanity, in batches inkorten |
| SEO-11 | `/offerte-aanvragen` 404 | **Opgelost** (301 naar /contact) |
| SEO-12 | Advertentiepagina's `noindex, nofollow` | **Aangepast** naar `noindex, follow` |
| SEO-13 | Bulk-lastmod op stadspagina's (12-08-2026), 4 URL's zonder lastmod | Open; echte inhoudsdatum gebruiken |
| SEO-14 | `/privacypolicy` en `/algemene-voorwaarden` zonder H1 | Sanity |
| SEO-15 | Kennisbankartikelen met zichtbare FAQ maar zonder FAQPage-markup | Open |

## Informatiearchitectuur en content

- **Clusters met omzetwaarde:** (1) totaalrenovatie: dienstpagina + kosten + doorlooptijd + jaren-30-woning + projecten; (2) uitbouw/aanbouw/dakopbouw: dienstpagina + kosten + vergunningvrij + projecten; (3) draagmuur/constructief: **ontbreekt als dienstpagina**; (4) badkamer: goed gevuld.
- **Kannibalisatie:** drie artikelen over dakkapelkosten (`dakkapel-renoveren-kosten`, `wat-kost-dakkapel-renoveren`, `dakkapel-renoveren-of-vervangen`) en twee over badkamerkosten. Samenvoegen met redirects.
- **Lage commerciële waarde, wel veel pagina's:** warmtepomp, zonnepanelen, ISDE-subsidie, isolatie. Prima voor merkbekendheid, maar niet laten concurreren met de kernclusters in menu en interne links.
- **Lokaal:** 22 steden is ruim voor één vestiging in Den Haag. Advies: Den Haag, Rijswijk, Voorburg/Leidschendam, Wassenaar, Delft, Zoetermeer, Westland als kern met echte projecten; de rest alleen behouden waar projecten zijn opgeleverd.

## Juridische inhoud controleren

De draagmuur-advertentiepagina stelt dat een omgevingsvergunning verplicht is en dat de Wkb niet geldt voor verbouw. Beide komen overeen met IPLO (Bbl art. 2.27; verbouw nog niet onder gevolgklasse 1). Meldtermijn voor de start van de bouw eerst controleren op IPLO voordat die op de site komt. Zie 16, GEO-07.
