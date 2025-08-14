import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    authInterrupts: true,
  },
};

export default nextConfig;
// The authInterrupts configuration option allows you to use forbidden and unauthorized APIs in your application.
// The dynamicIO configuration option allows you to use dynamic imports in your application.
