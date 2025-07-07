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

  output: 'standalone',

  experimental: {
    // instruct Next.js’s file tracer to include your JSON
    outputFileTracingIncludes: {
      // key is the route path without extension
      'app/api/analyze/route': ['build/framework_patterns.json'],
    },
  },
};

export default nextConfig;
