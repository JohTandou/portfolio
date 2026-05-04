"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ExperienceCard } from "../components/ExperienceCard";
import { EXPERIENCE_DATA } from "../lib/experience";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { useMediaQuery } from "../hooks/useMediaQuery";

/* Journal d'expérience — timeline horizontale sticky sur desktop, scroll vertical sur mobile */
export function ExperienceLogSection() {
  const { isReducedMotion } = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const setProgressRef = useRef(setProgress);
  setProgressRef.current = setProgress;

  const getActiveIndex = useCallback((prog: number) => {
    return Math.min(
      Math.floor(prog * EXPERIENCE_DATA.length),
      EXPERIENCE_DATA.length - 1
    );
  }, []);

  /* GSAP ScrollTrigger pour le scroll horizontal sur desktop */
  useEffect(() => {
    if (isMobile || isReducedMotion || typeof window === "undefined") return;

    let ctxCleanup: (() => void) | undefined;

    const initGSAP = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      const section = sectionRef.current;
      if (!container || !section) return;

      const totalScroll = container.scrollWidth - window.innerWidth + 64;

      const ctx = gsap.context(() => {
        gsap.to(container, {
          x: () => -totalScroll,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgressRef.current(self.progress);
            },
          },
        });
      });

      ctxCleanup = () => ctx.revert();
    };

    initGSAP();

    return () => {
      if (ctxCleanup) ctxCleanup();
    };
  }, [isMobile, isReducedMotion]);

  const totalEntries = EXPERIENCE_DATA.length;
  const activeIndex = getActiveIndex(progress);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative"
      style={{
        minHeight: isMobile ? "auto" : "200vh",
        backgroundColor: "var(--color-bg-elevated)",
      }}
    >
      {/* Container sticky sur desktop */}
      <div
        className="flex flex-col justify-center overflow-hidden px-6 py-24 md:sticky md:top-0 md:h-screen"
        style={{ backgroundColor: "var(--color-bg-elevated)" }}
      >
        {/* Titre et sous-titre */}
        <div className="mb-12 px-4 md:px-12">
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
            Parcours professionnel, missions et projets marquants.
          </motion.p>
        </div>

        {/* Container des cartes */}
        <div
          ref={containerRef}
          className="flex gap-8 px-4 md:px-12"
          style={{
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "max-content",
          }}
        >
          {EXPERIENCE_DATA.map((entry, index) => (
            <ExperienceCard
              key={entry.id}
              entry={entry}
              index={index}
              isActive={index === activeIndex}
            />
          ))}
        </div>

        {/* Progress dots — desktop uniquement */}
        {!isMobile && (
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
            <span
              className="font-mono text-xs"
              style={{ color: "var(--color-text-mid)" }}
            >
              [{String(activeIndex + 1).padStart(2, "0")}/
              {String(totalEntries).padStart(2, "0")}]
            </span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalEntries }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      i <= activeIndex
                        ? "var(--color-accent-1)"
                        : "var(--color-text-dim)",
                    opacity: i <= activeIndex ? 1 : 0.4,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Progress statique — mobile */}
        {isMobile && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <span
              className="font-mono text-xs"
              style={{ color: "var(--color-text-mid)" }}
            >
              [{String(activeIndex + 1).padStart(2, "0")}/
              {String(totalEntries).padStart(2, "0")}]
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
