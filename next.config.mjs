/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'bcryptjs'],
  },
}

export default nextConfig
