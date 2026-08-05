import type { Metadata } from "next";

/* ============================================================
   Layout Geneva (/1) — Variante SEO pour Genève & Grand Genève
   Metadata noindex/nofollow, ne figure ni au sitemap ni à la nav
   ============================================================ */

export const metadata: Metadata = {
  title: "Joh Tandou — Software Engineer | Genève & Grand Genève",
  description:
    "Software Engineer Java & Web, actuellement en poste et mobile vers le Grand Genève après signature et préavis contractuel.",
  keywords: [
    "développeur full-stack",
    "react",
    "next.js",
    "java",
    "genève",
    "grand genève",
    "suisse",
    "portfolio",
  ],
  authors: [{ name: "Joh Tandou", url: "https://jtandou.dev" }],
  creator: "Joh Tandou",
  metadataBase: new URL("https://jtandou.dev"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://jtandou.dev/1",
    siteName: "Joh Tandou Portfolio",
    title: "Joh Tandou — Software Engineer | Genève & Grand Genève",
    description:
      "Software Engineer Java & Web, actuellement en poste et mobile vers le Grand Genève après signature et préavis contractuel.",
    images: [
      {
        url: "/backgrounds/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Joh Tandou — Software Engineer Java & Web",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joh Tandou — Software Engineer | Genève & Grand Genève",
    description:
      "Software Engineer Java & Web, actuellement en poste et mobile vers le Grand Genève après signature et préavis contractuel.",
    creator: "@johtnd",
    images: [
      {
        url: "/backgrounds/hero.jpg",
        alt: "Joh Tandou — Software Engineer Java & Web",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: "https://jtandou.dev/1",
  },
};

export default function GenevaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Layout minimal — le root layout (app/layout.tsx) fournit déjà
     les providers globaux (ReducedMotionProvider, LenisProvider, etc.).
     Ce layout ne fait que définir les métadonnées spécifiques à la
     variante Genève, puis délègue le rendu au root layout parent. */
  return <>{children}</>;
}
