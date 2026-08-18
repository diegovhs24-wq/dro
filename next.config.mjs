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
const nextConfig = {
  transpilePackages: ['sanity', 'next-sanity'],
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
        source: '/stuc-en-schilderwerk-2',
        destination: '/stuc-schilderwerk',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
