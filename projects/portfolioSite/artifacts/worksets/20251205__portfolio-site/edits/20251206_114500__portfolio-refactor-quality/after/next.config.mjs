/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.funteru.co.jp' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
