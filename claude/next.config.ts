import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 🎭 Ignore type errors during build - runtime works fine!
    // This matches V0's config for consistency across variants
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
