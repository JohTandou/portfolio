"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BackgroundSection } from "../components/BackgroundSection";
import { CheckpointModal } from "../components/CheckpointModal";
import { RoadmapCheckpointComponent } from "../components/RoadmapCheckpoint";
import { ROADMAP_DATA } from "../lib/roadmap";
import { RoadmapCheckpoint } from "../types";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { useMediaQuery } from "../hooks/useMediaQuery";

/* Feuille de route future — timeline horizontale néon avec path drawing */
export function FutureRoadmapSection() {
  const { isReducedMotion } = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] =
    useState<RoadmapCheckpoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* GSAP ScrollTrigger pour le path drawing sur desktop */
  useEffect(() => {
    if (isMobile || isReducedMotion || typeof window === "undefined") return;

    let ctxCleanup: (() => void) | undefined;

    const initGSAP = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const path = pathRef.current;
      if (!path) return;

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      const ctx = gsap.context(() => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
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

  const handleCheckpointClick = (checkpoint: RoadmapCheckpoint) => {
    setSelectedCheckpoint(checkpoint);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCheckpoint(null), 300);
  };

  return (
    <>
      <BackgroundSection id="roadmap" backgroundImage="/backgrounds/goals.jpg" contentPosition="left">
      <div
        ref={sectionRef}
        className="relative py-24"
      >
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
            FUTURE_ROADMAP
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
            Objectifs professionnels et aspirations futures.
          </motion.p>
        </div>

        {/* Desktop : Timeline horizontale avec SVG décoratif */}
        {!isMobile && (
          <div className="relative px-12">
            {/* SVG décoratif en arrière-plan */}
            <svg
              className="pointer-events-none absolute top-1/2 left-0 h-2 w-full -translate-y-1/2"
              viewBox="0 0 1200 2"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <path
                ref={pathRef}
                d="M0 1 L1200 1"
                fill="none"
                stroke="var(--color-accent-1)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: "1200",
                  strokeDashoffset: "1200",
                }}
              />
            </svg>

            {/* Grille responsive des checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-16">
              {ROADMAP_DATA.map((checkpoint, index) => (
                <motion.div
                  key={checkpoint.id}
                  className="max-w-[280px] mx-auto flex flex-col items-center gap-3"
                  initial={isReducedMotion ? undefined : { opacity: 0, scale: 0 }}
                  whileInView={
                    isReducedMotion ? undefined : { opacity: 1, scale: 1 }
                  }
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <RoadmapCheckpointComponent
                    checkpoint={checkpoint}
                    isActive={checkpoint.status === "active"}
                    onClick={() => handleCheckpointClick(checkpoint)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile : Timeline verticale simplifiée */}
        {isMobile && (
          <div className="relative px-6">
            {/* Ligne verticale */}
            <div
              className="absolute top-0 bottom-0 left-10 w-px"
              style={{
                backgroundColor: "var(--color-accent-1)",
                opacity: 0.3,
              }}
            />

            <div className="flex flex-col gap-12">
              {ROADMAP_DATA.map((checkpoint, index) => (
                <motion.div
                  key={checkpoint.id}
                  className="relative flex items-start gap-6 pl-16"
                  initial={isReducedMotion ? undefined : { opacity: 0, x: -20 }}
                  whileInView={
                    isReducedMotion ? undefined : { opacity: 1, x: 0 }
                  }
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Cercle sur la ligne */}
                  <div
                    className="absolute top-1 left-10 h-3 w-3 -translate-x-1/2 rounded-full border-2"
                    style={{
                      borderColor: "var(--color-accent-1)",
                      backgroundColor:
                        checkpoint.status === "active"
                          ? "var(--color-accent-1)"
                          : "transparent",
                    }}
                  />

                  <RoadmapCheckpointComponent
                    checkpoint={checkpoint}
                    isActive={checkpoint.status === "active"}
                    onClick={() => handleCheckpointClick(checkpoint)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      </BackgroundSection>

      {/* Modale checkpoint */}
      <CheckpointModal
        checkpoint={selectedCheckpoint}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
