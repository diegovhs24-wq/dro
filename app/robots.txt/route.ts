import {NextResponse} from "next/server";
import {getSiteUrl} from "@/lib/seo/site";

// robots.txt (GEO-01)
//
// Drie soorten crawlers, bewust apart benoemd:
// 1. Zoek- en antwoordcrawlers (indexeren voor zoekresultaten en AI-antwoorden
//    met bronvermelding). Die MOETEN erin: zonder deze toegang kan DRO niet
//    geciteerd of aanbevolen worden.
// 2. Door gebruikers aangestuurde fetchers (iemand vraagt ChatGPT/Claude/
//    Perplexity om deze pagina te lezen). Ook toestaan.
// 3. Trainingscrawlers (bouwen datasets voor het trainen van modellen). Toegang
//    is een bedrijfskeuze. Huidige keuze: toegestaan, omdat bekendheid van het
//    merk in trainingsdata de kans vergroot dat modellen DRO herkennen. Wilt u
//    dat niet, zet ALLOW_TRAINING op false: blokkeren van training heeft geen
//    invloed op zoekzichtbaarheid (die loopt via groep 1 en 2).
//
// Content-Signal (contentsignals.org) is een voorkeur, geen afdwingbare regel,
// en moet in lijn zijn met ALLOW_TRAINING.

const ALLOW_TRAINING = true;

const SEARCH_AND_ANSWER_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Applebot",
  "DuckDuckBot",
];

const USER_TRIGGERED_FETCHERS = ["ChatGPT-User", "Claude-User", "Perplexity-User", "MistralAI-User"];

const TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
];

const PRIVATE_PATHS = ["/api/", "/studio", "/studio-aanvragen"];

function group(agents: string[], allow: boolean) {
  return [
    ...agents.map((agent) => `User-agent: ${agent}`),
    ...(allow ? ["Allow: /", ...PRIVATE_PATHS.map((path) => `Disallow: ${path}`)] : ["Disallow: /"]),
    "",
  ];
}

export async function GET() {
  const siteUrl = getSiteUrl();

  const body = [
    "# robots.txt voor DRO Renovaties",
    `# Machineleesbaar overzicht voor AI-systemen: ${siteUrl}/llms.txt`,
    "",
    // Content-Signal hoort binnen een user-agent-groep (contentsignals.org).
    "User-agent: *",
    `Content-Signal: search=yes, ai-input=yes, ai-train=${ALLOW_TRAINING ? "yes" : "no"}`,
    "Allow: /",
    ...PRIVATE_PATHS.map((path) => `Disallow: ${path}`),
    "",
    "# Zoek- en antwoordcrawlers",
    ...group(SEARCH_AND_ANSWER_CRAWLERS, true),
    "# Door gebruikers aangestuurde AI-fetchers",
    ...group(USER_TRIGGERED_FETCHERS, true),
    "# Trainingscrawlers (bedrijfskeuze, zie broncode)",
    ...group(TRAINING_CRAWLERS, ALLOW_TRAINING),
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
