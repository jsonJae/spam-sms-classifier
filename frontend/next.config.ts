import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["192.168.18.*"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
