"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

/* ============================================================
   Navigation — Barre fixe avec glassmorphism et menu mobile
   Direction esthétique : HUD futuriste, clarté radicale
   ============================================================ */

export function Navigation() {
  const { isReducedMotion } = useReducedMotion();
  const { isActive: isAudioActive, toggle: toggleAudio } = useAudioPlayer();
  const headerRef = useRef<HTMLElement>(null);
  const isScrolledRef = useRef(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  /* Détection du scroll — mise à jour directe du DOM sans re-render React */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        header.style.borderBottom = scrolled
          ? "1px solid rgba(62, 207, 178, 0.15)"
          : "1px solid rgba(255, 255, 255, 0.05)";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* IntersectionObserver pour détecter la section visible */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" },
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const lenis = (window as Window & { __lenis?: { scrollTo: (target: HTMLElement, options?: { offset?: number }) => void } }).__lenis;

    if (lenis?.scrollTo) {
      lenis.scrollTo(element, { offset: -80 });
    } else {
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
        ref={headerRef}
        className="fixed top-0 left-0 z-40 w-full h-20"
        style={{
          background: "rgba(10, 14, 20, 0.7)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo desktop — image avec transparence native, hauteur visuelle alignée au hamburger */}
          <button
            onClick={() => handleScrollTo("hero")}
            aria-label="Retour à l'accueil — JOH TANDOU"
            className="relative hidden md:flex items-center h-11 min-w-[44px] cursor-pointer"
          >
            <Image
              src="/logo.png"
              alt="Logo JOH TANDOU"
              width={200}
              height={44}
              className="h-11 max-w-[180px] w-auto object-contain"
              priority
            />
          </button>

          {/* Logo mobile — mot-symbole horizontal « Joh Tandou » */}
          <button
            onClick={() => handleScrollTo("hero")}
            aria-label="Retour à l'accueil"
            className="md:hidden flex items-center justify-center h-11 min-h-[44px] min-w-[44px] cursor-pointer"
          >
            <Image
              src="/logo.png"
              alt="JOH TANDOU"
              width={120}
              height={44}
              className="h-11 w-auto max-w-[120px] sm:max-w-[160px] object-contain"
              priority
            />
          </button>

          {/* Liens d'ancrage desktop */}
          <ul className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) => {
                const isActive = activeSection === link.target;
                return (
                  <li key={link.target}>
                    <button
                      onClick={() => handleScrollTo(link.target)}
                      data-nav-glow=""
                      className={`glass-badge group relative flex min-h-[44px] items-center px-3 py-2 font-mono text-xs tracking-widest transition-colors duration-300 cursor-pointer ${
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text-mid)] hover:text-[var(--color-text-high)]"
                      }`}
                    >
                      {link.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-px w-full bg-[var(--color-accent-1)] transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0 origin-left group-hover:scale-x-100"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}

            {/* Bouton audio desktop */}
            <li className="ml-4">
              <button
                type="button"
                onClick={toggleAudio}
                aria-pressed={isAudioActive}
                aria-label={
                  isAudioActive
                    ? "Désactiver la musique d'ambiance"
                    : "Activer la musique d'ambiance"
                }
                data-nav-glow=""
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center transition-colors duration-300 text-[var(--color-text-mid)] hover:text-[var(--color-primary)] cursor-pointer"
              >
                {isAudioActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </li>
          </ul>

          {/* Groupe mobile : audio + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleAudio}
              aria-pressed={isAudioActive}
              aria-label={
                isAudioActive
                  ? "Désactiver la musique d'ambiance"
                  : "Activer la musique d'ambiance"
              }
              data-nav-glow=""
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center transition-colors duration-300 text-[var(--color-text-mid)] hover:text-[var(--color-primary)] cursor-pointer"
            >
              {isAudioActive ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>

            {/* Hamburger mobile */}
            <button
              data-nav-glow=""
              className="flex h-11 w-11 min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 cursor-pointer"
              onClick={() => {
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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center glass-panel"
            style={{
              background: "rgba(10, 14, 20, 0.92)",
              borderRadius: "0",
            }}
            initial={isReducedMotion ? undefined : { opacity: 0 }}
            animate={isReducedMotion ? undefined : { opacity: 1 }}
            exit={isReducedMotion ? undefined : { opacity: 0 }}
            transition={isReducedMotion ? { duration: 0 } : { duration: 0.3 }}
          >
            {/* Bouton fermeture */}
            <button
              data-nav-glow=""
              className="absolute top-6 right-6 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center cursor-pointer"
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
              aria-label="Fermer le menu"
            >
              <span className="absolute h-px w-6 rotate-45 bg-[var(--color-text-high)]" />
              <span className="absolute h-px w-6 -rotate-45 bg-[var(--color-text-high)]" />
            </button>

            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.target;
                return (
                  <motion.button
                    key={link.target}
                    onClick={() => handleScrollTo(link.target)}
                    data-nav-glow=""
                    className={`flex min-h-[44px] items-center px-4 py-2 font-display text-2xl tracking-widest transition-colors duration-300 cursor-pointer ${
                      isActive
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-text-high)] hover:text-[var(--color-accent-1)]"
                    }`}
                    initial={isReducedMotion ? undefined : { opacity: 0, y: 20 }}
                    animate={isReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={
                      isReducedMotion
                        ? { duration: 0 }
                        : {
                            delay: index * 0.08,
                            duration: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                          }
                    }
                  >
                    {link.label}
                  </motion.button>
                );
              })}

            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow cyan local sur les contrôles du Header — ne modifie pas .glass-btn ni .glass-badge globales */}
      <style>{`
        [data-nav-glow] {
          transition: color 300ms, box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        [data-nav-glow]:hover,
        [data-nav-glow]:focus-visible {
          box-shadow: 0 4px 24px rgba(62, 207, 178, 0.1);
        }
        [data-nav-glow]:focus-visible {
          outline: 2px solid rgba(62, 207, 178, 0.7);
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          [data-nav-glow] {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
