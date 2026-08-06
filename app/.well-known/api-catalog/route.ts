import {NextResponse} from "next/server";
import {getSiteUrl} from "@/lib/seo/site";

export async function GET() {
  const siteUrl = getSiteUrl();

  const body = {
    name: "DRO Renovaties",
    description:
      "Machine-readable entry points for AI agents and crawlers indexing drorenovaties.nl.",
    endpoints: [
      {
        title: "llms.txt",
        url: `${siteUrl}/llms.txt`,
        description: "Curated overview and link index for LLMs, per the llms.txt convention.",
      },
      {
        title: "llms-full.txt",
        url: `${siteUrl}/llms-full.txt`,
        description: "Full Markdown export of all public pages for retrieval/ingestion.",
      },
      {
        title: "sitemap.xml",
        url: `${siteUrl}/sitemap.xml`,
        description: "Standard XML sitemap of all indexable pages.",
      },
      {
        title: "robots.txt",
        url: `${siteUrl}/robots.txt`,
        description: "Crawl and AI-training directives.",
      },
      {
        title: "Markdown content negotiation",
        url: `${siteUrl}/{path}`,
        description:
          "Any page on this site returns clean Markdown instead of HTML when requested with an 'Accept: text/markdown' header.",
      },
    ],
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
