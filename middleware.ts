import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

const API_CATALOG_LINK = '</.well-known/api-catalog>; rel="api-catalog"'

const CANONICAL_HOST = 'www.dro-renovaties.nl'
const BARE_HOST = 'dro-renovaties.nl'

// Oude URL's van de WordPress-site (Adaptoo) en van de vorige /diensten/*
// structuur, naar hun huidige tegenhanger. Bron: wpv7_posts in droren_mainweb,
// 39 gepubliceerde pagina's, tegen productie gecontroleerd.
//
// Deze map staat hier en niet in next.config redirects(), omdat we hiermee
// host, oude slug en trailing slash in EEN antwoord afhandelen. Via
// redirects() worden dat twee hops, en krijg je 308 in plaats van 301.
const LEGACY_REDIRECTS: Record<string, string> = {
  // Stadspagina's
  '/aannemer-delft': '/delft',
  '/aannemer-den-haag': '/den-haag',
  '/aannemer-rijswijk': '/rijswijk',
  '/aannemer-rotterdam': '/rotterdam',
  '/dro-renovaties-den-hague': '/den-haag',

  // Diensten
  '/badkamerrenovatie': '/badkamer-renovatie',
  '/stuc-en-schilderwerk': '/stuc-schilderwerk',
  '/stuc-en-schilderwerk-2': '/stuc-schilderwerk',
  '/renovatie': '/totaalrenovatie',
  '/totaalrenovatie-2': '/totaalrenovatie',
  '/woningrenovatie': '/totaalrenovatie',
  '/nieuwbouw': '/afbouw-nieuwbouw',
  '/opbouw': '/uitbouw-aanbouw',

  // Overzichten
  '/portfolio': '/projecten',
  '/blog': '/kennisbank',
  '/blogs': '/kennisbank',
  '/ons-team': '/over-ons',
  '/home-concept': '/',

  // Offerteaanvraag loopt nu via contact
  '/offerte': '/contact',
  '/offerte-aanvragen': '/contact',
  '/offerte-aanvragen-2': '/contact',
  '/offerteaanvraag': '/contact',
  '/offerteformulier': '/contact',

  // Diensten zonder eigen pagina meer
  '/isolatie': '/diensten',
  '/keuken': '/diensten',
  '/kunststof-kozijnen': '/diensten',
  '/sloopwerk': '/diensten',
  '/tegelwerk': '/diensten',

  // Vorige structuur: diensten stonden onder /diensten/<slug>
  '/diensten/badkamer-renovatie': '/badkamer-renovatie',
  '/diensten/totaalrenovatie': '/totaalrenovatie',
  '/diensten/uitbouw-aanbouw': '/uitbouw-aanbouw',
  '/diensten/stuc-schilderwerk': '/stuc-schilderwerk',
  '/diensten/vloerverwarming': '/vloerverwarming',
  '/diensten/onderhoud': '/onderhoud',
  '/diensten/afbouw-nieuwbouw': '/afbouw-nieuwbouw',
  '/diensten/warmtepomp': '/warmtepomp',
  '/diensten/zonnepanelen': '/zonnepanelen',
}

// Diensten die DRO niet meer levert, plus een testpagina die nooit live had
// moeten staan. Bewust 410 in plaats van een redirect, zodat Google ze uit
// de index haalt.
const GONE_PATHS = new Set(['/transport', '/transport-2', '/testpagina'])

// Hier raken we niet aan: API-routes, Next-interne requests, de Sanity Studio
// en well-known bestanden.
const UNTOUCHED = /^\/(?:api|_next|studio|\.well-known)(?:\/|$)/

function withAgentHeaders(response: NextResponse) {
  response.headers.append('Link', API_CATALOG_LINK)
  return response
}

// Trailing slash weghalen: alle oude WordPress-URL's staan mét slash in
// Google, alle huidige pagina's zonder.
function stripTrailingSlash(pathname: string) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/'
}

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl

  // Redirects gaan voor op alles. Alleen op GET/HEAD, zodat een 301 nooit
  // een POST naar /api of een formulier omzet.
  if (
    (request.method === 'GET' || request.method === 'HEAD') &&
    !UNTOUCHED.test(pathname)
  ) {
    const path = stripTrailingSlash(pathname)

    if (GONE_PATHS.has(path)) {
      return new NextResponse('410 Gone', {
        status: 410,
        headers: {'content-type': 'text/plain; charset=utf-8'},
      })
    }

    const host = request.headers.get('host') || CANONICAL_HOST
    // Previews op *.vercel.app blijven op hun eigen host staan.
    const targetHost = host === BARE_HOST ? CANONICAL_HOST : host
    const mapped = LEGACY_REDIRECTS[path]

    if (mapped || targetHost !== host || path !== pathname) {
      const destination = new URL(`https://${targetHost}`)
      // Via .pathname zetten, niet via de URL-constructor: een pad als
      // "//example.com" zou anders als andere host worden gelezen.
      destination.pathname = mapped || path
      destination.search = request.nextUrl.search
      // Expliciet 301; NextResponse.redirect geeft standaard 307.
      return NextResponse.redirect(destination, 301)
    }
  }

  const accept = request.headers.get('accept') || ''

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
