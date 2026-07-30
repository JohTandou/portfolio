import type { Metadata } from "next";
import { Rajdhani, JetBrains_Mono, VT323 } from "next/font/google";
import "./globals.css";

import { ReducedMotionProvider } from "./providers/ReducedMotionProvider";
import { LenisProvider } from "./providers/LenisProvider";
import { Navigation } from "./components/Navigation";
import { ScanlinesOverlay } from "./components/ScanlinesOverlay";
import { GrainOverlay } from "./components/GrainOverlay";
import { KonamiEasterEgg } from "./components/KonamiEasterEgg";
import { Analytics } from "@vercel/analytics/react";

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
    default: "Joh Tandou · Software Engineer Full-Stack",
    template: "%s · Joh Tandou"
  },
  description: "Portfolio de Joh Tandou — développeur full-stack spécialisé en expériences interactives, data science et solutions sur mesure. Paris / IDF.",
  keywords: ["développeur full-stack", "react", "next.js", "java", "spring boot", "data science", "paris", "fosses", "portfolio"],
  authors: [{ name: "Joh Tandou", url: "https://joh-tandou.vercel.app" }],
  creator: "Joh Tandou",
  metadataBase: new URL("https://joh-tandou.vercel.app"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://joh-tandou.vercel.app",
    siteName: "Joh Tandou Portfolio",
    title: "Joh Tandou · Software Engineer Full-Stack",
    description: "Portfolio de Joh Tandou — développeur full-stack spécialisé en expériences interactives, data science et solutions sur mesure. Paris / IDF.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joh Tandou · Software Engineer Full-Stack",
    description: "Portfolio de Joh Tandou — développeur full-stack spécialisé en expériences interactives, data science et solutions sur mesure. Paris / IDF.",
    creator: "@johtnd"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  alternates: {
    canonical: "https://joh-tandou.vercel.app"
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
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "name": "Joh Tandou",
                  "jobTitle": "Software Engineer Full-Stack",
                  "url": "https://joh-tandou.vercel.app",
                  "email": "joh.tandou@gmail.com",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Fosses",
                    "addressRegion": "Île-de-France",
                    "addressCountry": "FR"
                  },
                  "knowsAbout": ["React", "Next.js", "TypeScript", "Java", "Spring Boot", "Python", "Data Science", "Machine Learning"],
                  "alumniOf": {
                    "@type": "EducationalOrganization",
                    "name": "ILSC Montréal"
                  }
                },
                {
                  "@type": "CreativeWork",
                  "name": "Portfolio Joh Tandou",
                  "author": { "@type": "Person", "name": "Joh Tandou" },
                  "url": "https://joh-tandou.vercel.app",
                  "description": "Portfolio interactif de Joh Tandou — Software Engineer Full-Stack"
                }
              ]
            })
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
              {/* Overlay de scanlines en plein écran */}
              <ScanlinesOverlay />

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
