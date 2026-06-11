import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/it-financial-dashboard',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
