"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { MissionBriefing } from "../components/MissionBriefing";
import { MISSIONS_DATA } from "../lib/missions";
import { DESKTOP_CARD_WIDTH } from "../lib/constants";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { BackgroundSection } from "../components/BackgroundSection";
import { COPY } from "../lib/copy";

/* ============================================================
   MissionsArchiveSection — Carrousel 3D horizontal avec snap scroll
   Direction esthétique : archives tactiques, immersion cinématique
   ============================================================ */

export function MissionsArchiveSection() {
  const { isReducedMotion } = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [cardWidth, setCardWidth] = useState(DESKTOP_CARD_WIDTH);
  const gap = 24;

  /* Mise à jour de la largeur de carte selon la taille d'écran */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateWidth = () => {
      setCardWidth(window.innerWidth < 768 ? window.innerWidth * 0.85 : DESKTOP_CARD_WIDTH);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  /* Calcul de l'index actif depuis le scroll */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(newIndex, MISSIONS_DATA.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [cardWidth, gap]);

  /* Navigation via clavier */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (e.key === "ArrowLeft") {
        container.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
      } else if (e.key === "ArrowRight") {
        container.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
      }
    },
    [cardWidth, gap]
  );

  /* Navigation via flèches HUD */
  const scrollLeft = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
  }, [cardWidth, gap]);

  const scrollRight = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
  }, [cardWidth, gap]);

  /* Recentrage fluide sur une carte précise (dots + clic direct sur une carte) */
  const goToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;
      container.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
    },
    [cardWidth, gap]
  );

  return (
    <BackgroundSection id="missions" backgroundImage="/backgrounds/achievements.jpg" contentPosition="left" wideContent>
      <div className="relative overflow-visible">
      {/* Titre et sous-titre */}
      <div className="mb-16 px-6 text-center md:px-12">
        <motion.h2
          className="font-display font-bold tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: "var(--color-text-high)",
          }}
          initial={isReducedMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={isReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          MISSIONS_ARCHIVE
        </motion.h2>
        <motion.p
          className="mt-4 font-body text-lg"
          style={{ color: "var(--color-text-mid)" }}
          initial={isReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={isReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {COPY.missionsSubtitle}
        </motion.p>
      </div>

      {/* Container du carrousel avec perspective 3D */}
      <div
        className="relative"
        style={{ perspective: isReducedMotion ? "none" : "1200px" }}
      >
        {/* Carrousel scrollable */}
        <div
          ref={containerRef}
          className="scrollbar-hide flex items-center gap-6 overflow-x-auto scroll-smooth"
          style={{
            scrollSnapType: "x mandatory",
            paddingLeft: isMobile ? "7.5vw" : `calc(50vw - ${DESKTOP_CARD_WIDTH / 2}px)`,
            paddingRight: isMobile ? "7.5vw" : `calc(50vw - ${DESKTOP_CARD_WIDTH / 2}px)`,
            WebkitOverflowScrolling: "touch",
          }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Carrousel de missions"
        >
          {MISSIONS_DATA.map((mission, index) => {
            const isFocused = index === activeIndex;
            const distance = index - activeIndex;

            /* Rotation 3D selon la position relative */
            let rotateY = 0;
            if (!isReducedMotion) {
              rotateY = isMobile ? distance * 8 : distance * 25;
            }

            return (
              <div
                key={mission.id}
                className="flex-shrink-0"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  // Un clic sur un lien interne (MissionBriefing) doit ouvrir
                  // le lien, pas recentrer le carrousel.
                  if ((e.target as HTMLElement).closest("a, button")) return;
                  goToIndex(index);
                }}
                style={{
                  width: isMobile ? "85vw" : `${DESKTOP_CARD_WIDTH}px`,
                  scrollSnapAlign: "center",
                  transform: `rotateY(${rotateY}deg) scale(${isFocused ? 1 : 0.85})`,
                  opacity: isFocused ? 1 : 0.5,
                  transition:
                    "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
                  zIndex: isFocused ? 10 : 5,
                  cursor: isFocused ? "default" : "pointer",
                }}
              >
                <MissionBriefing mission={mission} isFocused={isFocused} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Flèches de navigation — visibles sur tous les écrans, au-dessus des dots */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          className="glass-btn font-mono text-2xl px-4 py-2"
          style={{ color: "var(--color-accent-1)" }}
          onClick={scrollLeft}
          aria-label="Mission précédente"
          type="button"
        >
          <span className="hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
            &lt;
          </span>
        </button>
        <button
          className="glass-btn font-mono text-2xl px-4 py-2"
          style={{ color: "var(--color-accent-1)" }}
          onClick={scrollRight}
          aria-label="Mission suivante"
          type="button"
        >
          <span className="hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
            &gt;
          </span>
        </button>
      </div>

      {/* Indicateurs de pagination */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {MISSIONS_DATA.map((_, index) => (
          <button
            key={index}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                index === activeIndex
                  ? "var(--color-accent-1)"
                  : "var(--color-text-dim)",
              opacity: index === activeIndex ? 1 : 0.4,
              transform: index === activeIndex ? "scale(1.3)" : "scale(1)",
            }}
            onClick={() => goToIndex(index)}
            aria-label={`Aller à la mission ${index + 1}`}
            type="button"
          />
        ))}
      </div>
      </div>
    </BackgroundSection>
  );
}
