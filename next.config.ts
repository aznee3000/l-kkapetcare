import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Sitter applications and dashboard photo updates upload images up to 5 MB
    // via Server Actions; raise the default 1 MB body cap to accommodate them.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    // Allow Supabase Storage public URLs and a generic placeholder host.
    // FUTURE: tighten this to your exact Supabase project hostname.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
