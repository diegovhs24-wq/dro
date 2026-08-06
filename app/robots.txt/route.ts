import {NextResponse} from "next/server";
import {getSitemapUrls} from "@/lib/seo/sitemap-data";
import {getSiteUrl} from "@/lib/seo/site";

export async function GET() {
  const urls = await getSitemapUrls();
  const aiCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "CCBot",
  ];

  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /api/draft-mode/",
    "Disallow: /studio",
    "",
    ...aiCrawlers.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]),
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
