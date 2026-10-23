const SERVICE_SLUGS = [
  'badkamer-renovatie',
  'totaalrenovatie',
  'uitbouw-aanbouw',
  'stuc-schilderwerk',
  'vloerverwarming',
  'onderhoud',
  'afbouw-nieuwbouw',
  'warmtepomp',
  'zonnepanelen',
]

/** @type {import('next').NextConfig} */
// Beveiligingsheaders (BE-09). CSP staat bewust in Report-Only: eerst een
// week meekijken in de browserconsole/rapporten, daarna afdwingen.
const SECURITY_HEADERS = [
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
  {key: 'Strict-Transport-Security', value: 'max-age=31536000'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()'},
]

const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net",
  "connect-src 'self' https://api.pdok.nl https://*.sanity.io wss://*.sanity.io https://www.google.com https://*.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
  "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://www.google.com https://www.google.nl https://googleads.g.doubleclick.net https://www.googletagmanager.com",
  "media-src 'self' https://cdn.sanity.io",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net https://www.youtube.com https://player.vimeo.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const nextConfig = {
  poweredByHeader: false,
  // next/image wordt niet gebruikt; optimizer uit verkleint het aanvalsoppervlak (BE-10).
  images: {unoptimized: true},
  transpilePackages: ['sanity', 'next-sanity'],
  async headers() {
    return [
      {source: '/:path*', headers: SECURITY_HEADERS},
      {
        source: '/((?!studio|studio-aanvragen).*)',
        headers: [{key: 'Content-Security-Policy-Report-Only', value: CSP_REPORT_ONLY}],
      },
      {source: '/studio/:path*', headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}]},
      {source: '/studio-aanvragen/:path*', headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}]},
      {source: '/api/:path*', headers: [{key: 'X-Robots-Tag', value: 'noindex, nofollow'}]},
    ]
  },
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      ...SERVICE_SLUGS.map((slug) => ({
        source: `/diensten/${slug}`,
        destination: `/${slug}`,
        permanent: true,
      })),
      {
        source: '/badkamerrenovatie',
        destination: '/badkamer-renovatie',
        permanent: true,
      },
      {
        source: '/offerte-aanvragen',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacypolicy',
        permanent: true,
      },
      {
        source: '/stuc-en-schilderwerk-2',
        destination: '/stuc-schilderwerk',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
