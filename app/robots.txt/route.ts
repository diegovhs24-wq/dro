import {NextResponse} from "next/server";
import {getSitemapUrls} from "@/lib/seo/sitemap-data";
import {getSiteUrl} from "@/lib/seo/site";

export async function GET() {
  const urls = await getSitemapUrls();
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /api/draft-mode/",
    "",
    `Sitemap: ${getSiteUrl()}/sitemap.xml`,
    "",
    "Content-Signal: ai-train=no, search=yes, ai-input=yes",
    "",
    ...urls.map((entry) => `# ${entry.url}`),
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
