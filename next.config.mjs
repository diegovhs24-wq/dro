/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['sanity', 'next-sanity'],
  compiler: {
    styledComponents: true,
  },
  // Next haalt de trailing slash er standaard zelf af, vóór middleware draait.
  // Dat maakt van elke oude WordPress-URL een keten:
  //   /portfolio/ -> /portfolio -> /projecten
  // Met deze vlag doet middleware.ts de trailing slash zelf, in dezelfde
  // 301 als de host- en slugcorrectie.
  skipTrailingSlashRedirect: true,
  // De redirects die hier stonden (/diensten/<slug> en twee oude WP-URL's)
  // zijn naar middleware.ts verhuisd. redirects() draait vóór middleware en
  // geeft 308, dus regels op beide plekken leveren opnieuw een keten op.
}

export default nextConfig
