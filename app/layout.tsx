import type { Metadata } from "next";
import { Rajdhani, JetBrains_Mono, VT323 } from "next/font/google";
import "./globals.css";

import { ReducedMotionProvider } from "./providers/ReducedMotionProvider";
import { LenisProvider } from "./providers/LenisProvider";
import { Navigation } from "./components/Navigation";
import { GrainOverlay } from "./components/GrainOverlay";
import { KonamiEasterEgg } from "./components/KonamiEasterEgg";
import { Analytics } from "@vercel/analytics/react";
import { buildSeoGraph } from "./lib/seo";

/* Configuration des polices Google avec next/font */
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Joh Tandou — Software Engineer Java & Web",
    template: "%s · Joh Tandou"
  },
  description: "Portfolio de Joh Tandou — développeur full-stack créant des expériences interactives et des solutions logicielles sur mesure. Expertise Java, React, TypeScript, IA & LLM.",
  keywords: ["développeur full-stack", "react", "next.js", "java", "typescript", "intelligence artificielle", "LLM", "île-de-france", "portfolio"],
  authors: [{ name: "Joh Tandou", url: "https://jtandou.dev" }],
  creator: "Joh Tandou",
  metadataBase: new URL("https://jtandou.dev"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://jtandou.dev",
    siteName: "Joh Tandou Portfolio",
    title: "Joh Tandou — Software Engineer Java & Web",
    description: "Portfolio de Joh Tandou — développeur full-stack créant des expériences interactives et des solutions logicielles sur mesure. Expertise Java, React, TypeScript, IA & LLM.",
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
    title: "Joh Tandou — Software Engineer Java & Web",
    description: "Portfolio de Joh Tandou — développeur full-stack créant des expériences interactives et des solutions logicielles sur mesure. Expertise Java, React, TypeScript, IA & LLM.",
    creator: "@johtnd",
    images: [
      {
        url: "/backgrounds/hero.jpg",
        alt: "Joh Tandou — Software Engineer Java & Web",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  alternates: {
    canonical: "https://jtandou.dev"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${rajdhani.variable} ${jetbrainsMono.variable} ${vt323.variable}`}
    >
      <head>
        {/* Préchargement de la vidéo hero pour un seeking instantané
            sur toute la durée — le navigateur la télécharge en priorité */}
        <link
          rel="preload"
          as="video"
          href="/assets/videos/hero-video.mp4"
          type="video/mp4"
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
        {/* fallback SVG conservé dans public/icon.svg */}

        <link rel="stylesheet" href="/styles/glass-compat.v1.css" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              buildSeoGraph(
                "Portfolio de Joh Tandou — développeur full-stack créant des expériences interactives et des solutions logicielles sur mesure. Expertise Java, React, TypeScript, IA & LLM."
              )
            ),
          }}
        />
      </head>
      <body className="relative min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-accent-1)] focus:text-[var(--color-bg-deep)] focus:font-bold focus:rounded focus:outline-none"
        >
          Aller au contenu principal
        </a>
        {/* Providers globaux imbriqués */}
        <ReducedMotionProvider>
          <LenisProvider>
              {/* Overlay de grain noise subtil */}
              <GrainOverlay />

              {/* Navigation fixe en haut */}
              <Navigation />

              <main id="main-content" tabIndex={-1} className="relative">
                {children}
              </main>

              {/* Easter egg Konami — glitch + console CTF */}
              <KonamiEasterEgg />
          </LenisProvider>
        </ReducedMotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
