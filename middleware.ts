import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

const API_CATALOG_LINK = '</.well-known/api-catalog>; rel="api-catalog"'

function withAgentHeaders(response: NextResponse) {
  response.headers.append('Link', API_CATALOG_LINK)
  return response
}

// AI-zichtbaarheid meten (GEO-10). Logt alleen welke AI-crawler of welk
// AI-platform een pagina opvraagt, plus het pad. Geen IP, geen persoonsgegevens.
// Terug te vinden in Vercel > Logs met zoekterm "AI_CRAWL" of "AI_REFERRAL".
const AI_BOTS: Array<[RegExp, string]> = [
  [/OAI-SearchBot/i, 'OAI-SearchBot'],
  [/ChatGPT-User/i, 'ChatGPT-User'],
  [/GPTBot/i, 'GPTBot'],
  [/Claude-SearchBot/i, 'Claude-SearchBot'],
  [/Claude-User/i, 'Claude-User'],
  [/ClaudeBot/i, 'ClaudeBot'],
  [/Perplexity-User/i, 'Perplexity-User'],
  [/PerplexityBot/i, 'PerplexityBot'],
  [/Applebot/i, 'Applebot'],
  [/bingbot/i, 'Bingbot'],
  [/CCBot/i, 'CCBot'],
  [/meta-externalagent/i, 'Meta-AI'],
  [/MistralAI-User/i, 'MistralAI-User'],
  [/DuckAssistBot/i, 'DuckAssistBot'],
]

const AI_REFERRERS: Array<[RegExp, string]> = [
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/i, 'ChatGPT'],
  [/(^|\.)perplexity\.ai$/i, 'Perplexity'],
  [/^gemini\.google\.com$/i, 'Gemini'],
  [/^copilot\.microsoft\.com$/i, 'Copilot'],
  [/(^|\.)claude\.ai$/i, 'Claude'],
  [/(^|\.)you\.com$/i, 'You.com'],
  [/(^|\.)meta\.ai$/i, 'Meta AI'],
]

function logAiTraffic(request: NextRequest, pathname: string) {
  // Alleen echte paginaverzoeken: geen assets (pad met extensie), geen API,
  // Studio of RSC-prefetches. Houdt het logvolume en de kosten laag.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    /\.[a-z0-9]{2,5}$/i.test(pathname) ||
    request.headers.get('rsc') === '1' ||
    request.nextUrl.searchParams.has('_rsc')
  ) {
    return
  }
  const ua = request.headers.get('user-agent') || ''
  const bot = AI_BOTS.find(([pattern]) => pattern.test(ua))
  if (bot) {
    console.log(`AI_CRAWL bot=${bot[1]} path=${pathname}`)
    return
  }
  const utmSource = request.nextUrl.searchParams.get('utm_source') || ''
  let refHost = ''
  try {
    refHost = new URL(request.headers.get('referer') || '').hostname
  } catch {
    refHost = ''
  }
  const platform =
    AI_REFERRERS.find(([pattern]) => pattern.test(refHost))?.[1] ||
    (/chatgpt\.com/i.test(utmSource) ? 'ChatGPT' : /perplexity/i.test(utmSource) ? 'Perplexity' : '')
  if (platform) console.log(`AI_REFERRAL platform=${platform} path=${pathname}`)
}

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl
  const accept = request.headers.get('accept') || ''
  logAiTraffic(request, pathname)

  if (
    accept.includes('text/markdown') &&
    !pathname.startsWith('/studio') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    pathname !== '/robots.txt' &&
    pathname !== '/sitemap.xml' &&
    pathname !== '/llms.txt' &&
    pathname !== '/llms-full.txt' &&
    !pathname.startsWith('/.well-known')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/api/markdown'
    url.searchParams.set('path', pathname)

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-markdown-path', pathname)

    return withAgentHeaders(
      NextResponse.rewrite(url, {
        request: {headers: requestHeaders},
      })
    )
  }

  return withAgentHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
