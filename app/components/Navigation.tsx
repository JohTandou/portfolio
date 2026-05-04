"use client";

import { useState, useEffect } from "react";
import { useAudio } from "../providers/AudioProvider";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { AnimatePresence, motion } from "framer-motion";

/* ============================================================
   Navigation — Barre fixe avec glassmorphism et menu mobile
   Direction esthétique : HUD futuriste, clarté radicale
   ============================================================ */

export function Navigation() {
  const { isMuted, toggleMute, playSound } = useAudio();
  const { isReducedMotion, toggleReducedMotion } = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* Détection du scroll pour ajuster l'opacité/bordure */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    playSound("select");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "IDENTITÉ", target: "identity" },
    { label: "EXPÉRIENCE", target: "experience" },
    { label: "TECH", target: "tech-arsenal" },
    { label: "MISSIONS", target: "missions" },
    { label: "CONTACT", target: "contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-40 w-full h-20 backdrop-blur-xl transition-all duration-300 ${
          isScrolled
            ? "bg-[rgba(10,14,20,0.85)] border-b border-[rgba(0,240,255,0.15)]"
            : "bg-[rgba(10,14,20,0.7)] border-b border-[rgba(255,255,255,0.05)]"
        }`}
      >
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <button
            onClick={() => handleScrollTo("hero")}
            className="font-display text-xl font-bold tracking-[0.15em] text-[var(--color-primary)] hover:text-[var(--color-accent-1)] transition-colors duration-300"
          >
            JOH TANDOU
          </button>

          {/* Liens d'ancrage desktop */}
          <ul className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <li key={link.target}>
                <button
                  onClick={() => handleScrollTo(link.target)}
                  className="group relative flex min-h-[44px] items-center px-3 py-2 font-mono text-xs tracking-widest text-[var(--color-text-mid)] hover:text-[var(--color-text-high)] transition-colors duration-300"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent-1)] transition-transform duration-300 group-hover:scale-x-100" />
                </button>
              </li>
            ))}

            {/* Lien CV */}
            <li>
              <a
                href="/cv_joh_tandou_2026.pdf"
                download
                onClick={() => playSound("select")}
                className="group relative flex min-h-[44px] items-center px-3 py-2 font-mono text-xs tracking-widest text-[var(--color-text-mid)] hover:text-[var(--color-text-high)] transition-colors duration-300"
              >
                CV
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent-1)] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          </ul>

          {/* Toggles + Hamburger mobile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound("select");
                toggleReducedMotion();
              }}
              className="hidden min-h-[44px] px-3 py-2 font-mono text-[10px] tracking-wider text-[var(--color-text-dim)] hover:text-[var(--color-text-high)] transition-colors duration-300 uppercase sm:block"
              aria-pressed={isReducedMotion}
            >
              {isReducedMotion ? "EFFETS ON" : "REDUCE EFFECTS"}
            </button>

            <button
              onClick={() => {
                playSound("select");
                toggleMute();
              }}
              className="flex min-h-[44px] items-center px-3 py-2 font-mono text-xs tracking-wider text-[var(--color-text-mid)] hover:text-[var(--color-text-high)] transition-colors duration-300"
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
              aria-pressed={!isMuted}
            >
              {isMuted ? "MUTE" : "UNMUTE"}
            </button>

            {/* Hamburger mobile */}
            <button
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => {
                playSound("select");
                setIsMobileMenuOpen(true);
              }}
              aria-label="Ouvrir le menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="block h-px w-6 bg-[var(--color-text-high)]" />
              <span className="block h-px w-6 bg-[var(--color-text-high)]" />
              <span className="block h-px w-6 bg-[var(--color-text-high)]" />
            </button>
          </div>
        </nav>
      </header>

      {/* Drawer mobile fullscreen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-xl bg-[rgba(10,14,20,0.95)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Bouton fermeture */}
            <button
              className="absolute top-6 right-6 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center"
              onClick={() => {
                playSound("select");
                setIsMobileMenuOpen(false);
              }}
              aria-label="Fermer le menu"
            >
              <span className="absolute h-px w-6 rotate-45 bg-[var(--color-text-high)]" />
              <span className="absolute h-px w-6 -rotate-45 bg-[var(--color-text-high)]" />
            </button>

            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.target}
                  onClick={() => handleScrollTo(link.target)}
                  className="flex min-h-[44px] items-center px-4 py-2 font-display text-2xl tracking-widest text-[var(--color-text-high)] hover:text-[var(--color-accent-1)] transition-colors duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.a
                href="/cv_joh_tandou_2026.pdf"
                download
                onClick={() => playSound("select")}
                className="flex min-h-[44px] items-center px-4 py-2 font-display text-2xl tracking-widest text-[var(--color-text-high)] hover:text-[var(--color-accent-1)] transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: navLinks.length * 0.08,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                CV
              </motion.a>

              <motion.div
                className="mt-8 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <button
                  onClick={() => {
                    playSound("select");
                    toggleReducedMotion();
                  }}
                  className="flex min-h-[44px] items-center px-3 py-2 font-mono text-xs tracking-wider text-[var(--color-text-dim)] hover:text-[var(--color-text-high)] transition-colors duration-300 uppercase"
                  aria-pressed={isReducedMotion}
                >
                  {isReducedMotion ? "EFFETS ON" : "REDUCE EFFECTS"}
                </button>

                <button
                  onClick={() => {
                    playSound("select");
                    toggleMute();
                  }}
                  className="flex min-h-[44px] items-center px-3 py-2 font-mono text-xs tracking-wider text-[var(--color-text-mid)] hover:text-[var(--color-text-high)] transition-colors duration-300"
                  aria-label={isMuted ? "Activer le son" : "Couper le son"}
                  aria-pressed={!isMuted}
                >
                  {isMuted ? "MUTE" : "UNMUTE"}
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
