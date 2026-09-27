import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "Templates" became the Explore wall
  redirects() {
    return [{ source: "/templates", destination: "/explore", permanent: true }];
  },
};

export default nextConfig;
