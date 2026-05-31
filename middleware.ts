import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

const API_CATALOG_LINK = '</.well-known/api-catalog>; rel="api-catalog"'

function withAgentHeaders(response: NextResponse) {
  response.headers.append('Link', API_CATALOG_LINK)
  return response
}

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl
  const accept = request.headers.get('accept') || ''

  if (
    accept.includes('text/markdown') &&
    !pathname.startsWith('/studio') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    pathname !== '/robots.txt' &&
    pathname !== '/sitemap.xml' &&
    !pathname.startsWith('/.well-known')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/api/markdown'
    url.searchParams.set('path', pathname)
    return withAgentHeaders(NextResponse.rewrite(url))
  }

  return withAgentHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
