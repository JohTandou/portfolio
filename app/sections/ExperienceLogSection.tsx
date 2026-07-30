"use client";

import { motion } from "framer-motion";
import { BackgroundSection } from "../components/BackgroundSection";
import { ExperienceCard } from "../components/ExperienceCard";
import { SectionWrapper } from "../components/SectionWrapper";
import { EXPERIENCE_DATA } from "../lib/experience";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { useAnimationFallback } from "../hooks/useAnimationFallback";

/* Journal d'expérience — cartes empilées verticalement dans un fond vitré fixe */
export function ExperienceLogSection() {
  const { isReducedMotion } = useReducedMotion();
  const fallbackRef = useAnimationFallback(3000);

  return (
    <BackgroundSection
      id="experience"
      backgroundImage="/backgrounds/professional-experience.jpg"
      contentPosition="right"
    >
      <SectionWrapper>
        <div ref={fallbackRef}>
        {/* Titre et sous-titre */}
        <div className="mb-12">
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

        {/* Cartes empilées verticalement */}
        <div className="flex flex-col gap-6">
          {EXPERIENCE_DATA.map((entry, index) => (
            <ExperienceCard
              key={entry.id}
              entry={entry}
              index={index}
              isActive={true}
            />
          ))}
        </div>
        </div>
      </SectionWrapper>
    </BackgroundSection>
  );
}
