import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static public pages were keeping a 5-minute Client Cache, so after an
  // admin mutation (even with revalidatePath) soft navigations could still
  // show stale RSC payloads without hitting the server. Zero the static TTL
  // so navigations always pick up on-demand revalidation.
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
};

export default nextConfig;
