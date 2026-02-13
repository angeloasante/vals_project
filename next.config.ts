import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [50, 60, 75, 85],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["@iconify/react"],
  },
};

export default nextConfig;
