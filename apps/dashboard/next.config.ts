import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@fixup/ui", "@fixup/types"],
  outputFileTracingIncludes: { "/**": ["../../data/prospectos.json"] },
};

export default nextConfig;
