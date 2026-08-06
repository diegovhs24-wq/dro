import {NextResponse} from "next/server";
import {getBlogPosts, getProjects, getServices, getSiteSettings} from "@/lib/cms";
import {absoluteUrl} from "@/lib/seo/site";

function section(title: string, items: string[]) {
  if (!items.length) return "";
  return `## ${title}\n\n${items.join("\n")}\n\n`;
}

export async function GET() {
  const [siteSettings, services, projects, posts] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getProjects(),
    getBlogPosts(),
  ]);

  const description =
    siteSettings.description || siteSettings.footer.description || "Renovatiebedrijf in Nederland.";

  const lines = [
    "# DRO Renovaties",
    "",
    `> ${description}`,
    "",
    "DRO Renovaties is een renovatie- en afbouwbedrijf. Deze site biedt machine-leesbare content: elke pagina retourneert Markdown in plaats van HTML wanneer opgevraagd met een 'Accept: text/markdown' header. Een volledige export van alle pagina's staat op /llms-full.txt.",
    "",
    section(
      "Diensten",
      services.map((service) => `- [${service.title}](${absoluteUrl(service.href)}): ${service.summary}`)
    ),
    section(
      "Projecten",
      projects
        .slice(0, 20)
        .map(
          (project) =>
            `- [${project.type} in ${project.location}](${absoluteUrl(`/projecten/${project.slug}`)}): ${project.description}`
        )
    ),
    section(
      "Kennisbank",
      posts
        .slice(0, 20)
        .map((post) => `- [${post.title}](${absoluteUrl(post.href)})${post.excerpt ? `: ${post.excerpt}` : ""}`)
    ),
    section("Bedrijfsinformatie", [
      `- [Over ons](${absoluteUrl("/over-ons")})`,
      `- [Werkwijze](${absoluteUrl("/werkwijze")})`,
      `- [Zakelijk](${absoluteUrl("/zakelijk")})`,
      `- [Contact](${absoluteUrl("/contact")})`,
    ]),
    section("Overig", [
      `- [Volledige Markdown-export](${absoluteUrl("/llms-full.txt")})`,
      `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
      `- [API-catalogus](${absoluteUrl("/.well-known/api-catalog")})`,
    ]),
  ]
    .filter(Boolean)
    .join("\n");

  return new NextResponse(lines, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
