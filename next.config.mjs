/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['sanity', 'next-sanity'],
  compiler: {
    styledComponents: true,
  },
}

export default nextConfig
