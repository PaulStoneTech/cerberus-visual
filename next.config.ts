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
  },

  // Include your pattern JSON in the API function bundle
  outputFileTracingIncludes: {
    // key is the route path (sans file extension), value is an array of files to bundle
    "app/api/analyze/route": ["build/framework_patterns.json"],
  },

  /* other config options here */
};

export default nextConfig;
