import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      formats: ["image/avif", "image/webp"],
      deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560, 3840],
    },
    async redirects() {
    return [
      {
        /* Ancienne variante supprimée définitivement : redirection
           permanente vers la racine. Deux entrées car le wildcard
           ne matche pas la route nue. permanent: true → 308,
           cohérent avec le 308 du middleware host-based. */
        source: "/1",
        destination: "/",
        permanent: true,
      },
      {
        source: "/1/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
    async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://api.fontshare.com; img-src 'self' data: blob:; font-src 'self' https://api.fontshare.com https://cdn.fontshare.com; media-src 'self' data:; connect-src 'self' https://va.vercel-scripts.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
