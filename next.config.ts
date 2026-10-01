import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Result photos in public/results/ are replaced in place (same file name). Next.js can't
    // invalidate its optimised-image cache, so keep it short: a replaced photo shows within
    // about a minute instead of up to 4 hours (the default).
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
