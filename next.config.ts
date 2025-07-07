import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // produce a standalone build for minimal Lambda bundles
  output: "standalone",

  // Skip ESLint and TS errors during builds (optional)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }

  /* other config options here */
};

export default nextConfig;
