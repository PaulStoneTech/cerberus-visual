import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint checks during `next build`
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip TypeScript type errors during `next build`
  typescript: {
    ignoreBuildErrors: true,
  },

  /* other config options here */
};

export default nextConfig;
