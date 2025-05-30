/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['jrxgocrwwoofyyliwsnk.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jrxgocrwwoofyyliwsnk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
