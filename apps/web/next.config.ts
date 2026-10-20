import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@nodal/ui", "@nodal/content", "@nodal/tokens"],
  reactStrictMode: true,
};
export default config;
