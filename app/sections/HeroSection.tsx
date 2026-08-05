"use client";

import { motion } from "framer-motion";
import { BackgroundSection } from "../components/BackgroundSection";
import { getCopy } from "../lib/copy";
import { PortfolioVariant } from "../types";

/* ============================================================
   Direction esthétique : Éditorial/Minimal avec accents teal
   
   HeroSection — Page de conversion orientée recruteur.
   Hiérarchie claire : nom → titre → accroche 
   → preuves sociales → CTA.
   Animation stagger Framer Motion pour une entrée narrative 
   progressive.
   ============================================================ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
      ease: [0.22, 1, 0.36, 1],
      duration: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface HeroSectionProps {
  variant?: PortfolioVariant;
}

export function HeroSection({ variant = "public" }: HeroSectionProps) {
  const copy = getCopy(variant);

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <BackgroundSection
      id="hero"
      backgroundImage="/backgrounds/hero.jpg"
      contentPosition="right"
      backgroundPosition="top center"
      desktopAspectRatio="16 / 9"
    >
        {/* Badge — affiché uniquement si heroBadge est non-null */}
        {copy.heroBadge ? (
          <div className="pt-12">
            <span
              className="glass-badge !inline-flex items-center gap-2 whitespace-nowrap"
              style={{
                color: "var(--color-accent-1)",
                borderColor: "rgba(232, 168, 56, 0.25)",
                background: "rgba(232, 168, 56, 0.08)",
              }}
            >
              <span className="relative flex h-2 w-2 overflow-hidden">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: "var(--color-accent-1)" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-accent-1)" }} />
              </span>
              {copy.heroBadge}
            </span>
          </div>
        ) : (
          /* Spacer — compense la hauteur de la navigation fixe (80px).
             Le BackgroundSection ajoute py-12 (48px) → h-8 (32px) = 80px de garde. */
          <div className="h-8" data-testid="hero-nav-spacer" />
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 md:gap-8 mt-6"
        >
          {/* H1 — Nom */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-[var(--color-text-high)] tracking-[-0.02em] leading-[0.9] uppercase"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}
          >
            JOH TANDOU
          </motion.h1>

          {/* H2 — Intitulé métier */}
          <motion.h2
            variants={itemVariants}
            className="font-body text-[var(--color-accent-1)] font-medium"
            style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)" }}
          >
            {copy.heroTitle}
          </motion.h2>

          {/* Sous-titre */}
          <motion.p
            variants={itemVariants}
            className="font-body text-[var(--color-text-mid)] text-balance leading-relaxed"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)", maxWidth: "28rem" }}
          >
            {copy.heroSubtitle}
          </motion.p>

          {/* Stack technique */}
          <motion.p
            variants={itemVariants}
            className="font-mono text-[var(--color-accent-1)] text-balance leading-relaxed"
            style={{ fontSize: "clamp(0.875rem, 1.25vw, 1rem)", maxWidth: "28rem" }}
          >
            {copy.heroStack}
          </motion.p>

          {/* Accroche */}
          <motion.p
            variants={itemVariants}
            className="font-body text-[var(--color-text-mid)] text-balance leading-relaxed"
            style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)", maxWidth: "28rem" }}
          >
            {copy.heroTagline}
          </motion.p>

          {/* Preuves sociales */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4"
          >
            <div className="glass-card flex flex-col gap-1 px-5 py-4 min-w-[150px]">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--color-text-dim)]">
                TALAN
              </span>
              <span className="font-body text-sm text-[var(--color-text-mid)]">
                SNCF &amp; R&amp;D
              </span>
            </div>

            <div className="glass-card flex flex-col gap-1 px-5 py-4 min-w-[150px]">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[var(--color-text-dim)]">
                TOPSEEKER
              </span>
              <span className="font-body text-sm text-[var(--color-text-mid)]">
                Produit en production
              </span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants}>
            <button
              onClick={scrollToContact}
              className="glass-btn"
              style={{ fontSize: "0.8rem" }}
              aria-label="Défiler jusqu'à la section contact"
            >
              Me contacter
              <span aria-hidden="true">&nbsp;↓</span>
            </button>
          </motion.div>
        </motion.div>
    </BackgroundSection>
  );
}
