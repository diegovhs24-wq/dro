import {NextResponse} from "next/server";
import {getBlogPosts, getLocations, getProjects, getServices, getSiteSettings} from "@/lib/cms";
import {BUSINESS, formatReviewSummary, getReviewSnapshot, stripOutdatedClaims} from "@/lib/seo/business";
import {absoluteUrl, resolveOrganizationSeo} from "@/lib/seo/site";

// llms.txt (llmstxt.org-conventie). Let op: dit is GEEN bewezen rankingfactor
// voor Google of ChatGPT. Het is een goedkoop, feitelijk overzicht dat agents
// en AI-tools kunnen lezen wanneer ze de site bezoeken. De inhoud moet exact
// overeenkomen met wat op de site en in de structured data staat (GEO-09).

export const revalidate = 3600;

function section(title: string, items: string[]) {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return "";
  return `## ${title}\n\n${filtered.join("\n")}\n`;
}

export async function GET() {
  const [siteSettings, services, projects, posts, locations] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getProjects(),
    getBlogPosts(),
    getLocations(),
  ]);

  const org = resolveOrganizationSeo(siteSettings, siteSettings.organizationSeo);
  const reviews = getReviewSnapshot(siteSettings.organizationSeo);
  const address = [org.streetAddress, [org.postalCode, org.addressLocality].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");

  const body = [
    `# ${BUSINESS.name}`,
    "",
    `> ${org.description}`,
    "",
    section("Kernfeiten", [
      `- Handelsnaam: ${BUSINESS.name}`,
      `- Juridische naam: ${BUSINESS.legalName}`,
      `- KvK-nummer: ${BUSINESS.kvkNumber}`,
      `- Btw-nummer: ${BUSINESS.vatId}`,
      `- Vestiging: ${address}, Nederland`,
      `- Telefoon: ${BUSINESS.phone.display} (ook via WhatsApp)`,
      `- E-mail: ${org.email}`,
      `- Website: ${org.siteUrl}`,
      `- Oprichter en eigenaar: ${BUSINESS.founder.name}`,
      `- Werkgebied: Den Haag en omgeving (Haaglanden), Zuid-Holland en de rest van de Randstad`,
      `- Talen: ${BUSINESS.languages.join(", ")}`,
      `- Erkenningen: ${BUSINESS.credentials.map((credential) => credential.name).join(", ")}`,
      `- Verzekeringen: ${BUSINESS.insurance.join(", ")}`,
      `- Betaalvoorwaarden: ${BUSINESS.paymentTerms}`,
      `- Reviews: ${formatReviewSummary(reviews)} (stand ${reviews.asOf})`,
      `- Gegevens gecontroleerd op: ${BUSINESS.verifiedAt}`,
    ]),
    "",
    section("Waar DRO in gespecialiseerd is", BUSINESS.specialisms.map((item) => `- ${item}`)),
    "",
    section("Voor wie DRO het beste past", [
      "- Huiseigenaren in de regio Den Haag en Zuid-Holland die een complete woning, een uitbouw of een constructieve verbouwing willen laten uitvoeren door één partij die het hele traject regisseert.",
      "- Opdrachtgevers die vooraf een duidelijke offerte, planning en betaling per afgeronde fase willen.",
      "- Architecten, tekenbureaus en vastgoedeigenaren die een uitvoerende aannemer zoeken.",
      "- Engelstalige bewoners (expats): communicatie in het Engels is mogelijk.",
    ]),
    "",
    section(
      "Prijsindicaties (geen vaste prijzen; definitieve prijs na opname op locatie)",
      BUSINESS.priceIndications.map((item) => `- ${item.service}: ${item.range}. ${item.note}`)
    ),
    "",
    section("Werkwijze in het kort", [
      "1. Aanvraag: een adviseur belt terug, bespreekt de wensen en plant zo nodig een bezichtiging.",
      "2. Bezichtiging en offerte: de oprichter bekijkt grotere projecten zelf en maakt een uitgewerkte offerte per onderdeel.",
      "3. Voorbereiding: bij akkoord volgen een planning en betaalschema; waar nodig regelt DRO de constructieberekening en vergunning via vaste constructeurs.",
      "4. Uitvoering: vaste vakteams onder een technisch hoofd uitvoering; elke week één vast overlegmoment en vragen via de app binnen 24 uur opgepakt.",
      "5. Betaling en oplevering: startbetaling, daarna betaling per afgeronde fase; oplevering met controle op openstaande punten.",
      `Meer: ${absoluteUrl("/werkwijze")}`,
    ]),
    "",
    section(
      "Diensten",
      services.map(
        (service) => `- [${service.title}](${absoluteUrl(service.href)}): ${stripOutdatedClaims(service.summary)}`
      )
    ),
    "",
    section(
      "Werkgebied (steden met een eigen pagina)",
      locations.map(
        (location) => `- [${location.name}](${absoluteUrl(location.href)}): ${stripOutdatedClaims(location.intro)}`
      )
    ),
    "",
    section(
      "Projecten (uitgevoerd werk)",
      projects
        .slice(0, 20)
        .map(
          (project) =>
            `- [${project.type} in ${project.location.trim()}](${absoluteUrl(`/projecten/${project.slug}`)}): ${stripOutdatedClaims(project.description)}`
        )
    ),
    "",
    section(
      "Kennisbank",
      posts
        .slice(0, 40)
        .map(
          (post) =>
            `- [${post.title}](${absoluteUrl(post.href)})${post.excerpt ? `: ${stripOutdatedClaims(post.excerpt)}` : ""}`
        )
    ),
    "",
    section("Bedrijfsinformatie", [
      `- [Over ons](${absoluteUrl("/over-ons")})`,
      `- [Werkwijze](${absoluteUrl("/werkwijze")})`,
      `- [Zakelijk en partners](${absoluteUrl("/zakelijk")})`,
      `- [Contact](${absoluteUrl("/contact")})`,
      `- [Algemene voorwaarden](${absoluteUrl("/algemene-voorwaarden")})`,
    ]),
    "",
    section("Optional", [
      `- [Volledige Markdown-export van alle pagina's](${absoluteUrl("/llms-full.txt")})`,
      `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
      "- Elke pagina is ook als Markdown op te vragen met de header `Accept: text/markdown`.",
    ]),
  ]
    .filter((part) => part !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
