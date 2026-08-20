import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
