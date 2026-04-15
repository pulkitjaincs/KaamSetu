import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  reactCompiler: true,
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { hostname: "logo.clearbit.com" },
      { hostname: "**.amazonaws.com" },
    ],
  },
};

export default nextConfig;
