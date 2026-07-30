"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BackgroundSection } from "../components/BackgroundSection";
import { CheckpointModal } from "../components/CheckpointModal";
import { RoadmapCheckpointComponent } from "../components/RoadmapCheckpoint";
import { ROADMAP_DATA } from "../lib/roadmap";
import { RoadmapCheckpoint } from "../types";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

/* Feuille de route future — timeline horizontale néon avec path drawing */
export function FutureRoadmapSection() {
  const { isReducedMotion } = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] =
    useState<RoadmapCheckpoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* GSAP ScrollTrigger pour le path drawing */
  useEffect(() => {
    if (isReducedMotion || typeof window === "undefined") return;

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
  }, [isReducedMotion]);

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
      <BackgroundSection id="roadmap" backgroundImage="/backgrounds/goals.jpg" contentPosition="left" wideContent>
      <div
        ref={sectionRef}
        className="relative"
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

        {/* Timeline horizontale avec SVG décoratif */}
        <div className="relative px-4 md:px-12">
          {/* SVG décoratif en arrière-plan (desktop uniquement) */}
          <svg
            className="pointer-events-none absolute top-1/2 left-0 h-2 w-full -translate-y-1/2 hidden md:block"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8 md:py-16">
            {ROADMAP_DATA.map((checkpoint, index) => (
              <motion.div
                key={checkpoint.id}
                className="flex flex-col items-center gap-3"
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
