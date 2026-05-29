/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: '*.railway.app' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'bcryptjs'],
  },
}

export default nextConfig
