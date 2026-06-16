import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fixup/ui", "@fixup/types"],
  // Lets FileLeadStore resolve the shared data file when bundled (dev/self-host).
  outputFileTracingIncludes: { "/api/leads": ["../../data/prospectos.json"] },
};

export default nextConfig;
