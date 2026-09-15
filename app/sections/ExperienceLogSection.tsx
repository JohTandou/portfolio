"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BackgroundSection } from "../components/BackgroundSection";
import { ExperienceCard } from "../components/ExperienceCard";
import { SectionWrapper } from "../components/SectionWrapper";
import { EXPERIENCE_DATA } from "../lib/experience";
import { DESKTOP_CARD_WIDTH } from "../lib/constants";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { useAnimationFallback } from "../hooks/useAnimationFallback";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { COPY } from "../lib/copy";

/* Journal d'expérience — carrousel horizontal avec snap scroll. */
export function ExperienceLogSection() {
  const { isReducedMotion } = useReducedMotion();
  const fallbackRef = useAnimationFallback(3000);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [cardWidth, setCardWidth] = useState(DESKTOP_CARD_WIDTH);
  const gap = 24;

  /* Mise à jour de la largeur de carte selon la taille d'écran */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateWidth = () => {
      setCardWidth(window.innerWidth < 768 ? Math.min(DESKTOP_CARD_WIDTH, window.innerWidth * 0.85) : DESKTOP_CARD_WIDTH);
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
      setActiveIndex(Math.min(Math.max(newIndex, 0), EXPERIENCE_DATA.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [cardWidth, gap]);

  const scrollLeft = () => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
  };

  /* Recentrage fluide sur une carte précise (dots + clic direct sur une carte) */
  const goToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  };

  return (
    <BackgroundSection
      id="experience"
      backgroundImage="/backgrounds/professional-experience.jpg"
      contentPosition="right"
      wideContent
    >
      <SectionWrapper>
        <div ref={fallbackRef}>
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
              EXPERIENCE_LOG
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
              {COPY.experienceSubtitle}
            </motion.p>
          </div>

          {/* Carrousel horizontal scrollable */}
          <div
            ref={containerRef}
            className="scrollbar-hide flex items-start gap-6 overflow-x-auto scroll-smooth"
            style={{
              scrollSnapType: "x mandatory",
              paddingLeft: isMobile ? "7.5vw" : `calc(50vw - ${DESKTOP_CARD_WIDTH / 2}px)`,
              paddingRight: isMobile ? "7.5vw" : `calc(50vw - ${DESKTOP_CARD_WIDTH / 2}px)`,
              WebkitOverflowScrolling: "touch",
            }}
          >
            {EXPERIENCE_DATA.map((entry, index) => (
              <div
                key={entry.id}
                className="flex-shrink-0"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  // Clic sur une carte = recentrage, sauf si l'utilisateur
                  // interagit avec un lien/bouton interne (on laisse alors
                  // le comportement natif s'exécuter).
                  if ((e.target as HTMLElement).closest("a, button")) return;
                  goToIndex(index);
                }}
                style={{
                  width: `min(${DESKTOP_CARD_WIDTH}px, 85vw)`,
                  scrollSnapAlign: "center",
                  cursor: index === activeIndex ? "default" : "pointer",
                }}
              >
                <ExperienceCard
                  entry={entry}
                  index={index}
                  isActive={true}
                />
              </div>
            ))}
          </div>

          {/* Flèches de navigation — visibles sur tous les écrans, au-dessus des dots */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              className="glass-btn font-mono text-2xl px-4 py-2"
              style={{ color: "var(--color-accent-1)" }}
              onClick={scrollLeft}
              aria-label="Expérience précédente"
              type="button"
            >
              &lt;
            </button>
            <button
              className="glass-btn font-mono text-2xl px-4 py-2"
              style={{ color: "var(--color-accent-1)" }}
              onClick={scrollRight}
              aria-label="Expérience suivante"
              type="button"
            >
              &gt;
            </button>
          </div>

          {/* Indicateurs de pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {EXPERIENCE_DATA.map((_, index) => (
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
                aria-label={`Aller à l'expérience ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </SectionWrapper>
    </BackgroundSection>
  );
}
