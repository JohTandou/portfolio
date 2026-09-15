"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BackgroundSection } from "../components/BackgroundSection";
import { SectionWrapper } from "../components/SectionWrapper";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { COPY } from "../lib/copy";

const LANGUAGES = [
  {
    code: "FR",
    name: "FRANÇAIS — NATIVE",
    details: ["Origin : France", "Status : INSTALLED · v1.0 · CORE"],
  },
  {
    code: "EN",
    name: "ANGLAIS — C1",
    details: [
      "TOEIC 840/990",
      "Certificat : C1 Advanced English Certificate — ILSC Education Group · Montréal, Canada",
      "Status : INSTALLED · v2.4 · ADVANCED",
    ],
  },
  {
    code: "ES",
    name: "ESPAGNOL — B1",
    details: [
      "Niveau : intermédiaire (B1)",
      "Status : INSTALLED · v1.0 · INTERMEDIATE",
    ],
  },
];

/* Modules linguistiques — langues parlées et niveaux */
export function LanguageModulesSection() {
  const { isReducedMotion } = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <BackgroundSection id="languages" backgroundImage="/backgrounds/languages.jpg" contentPosition="right">
    <SectionWrapper>
      <div ref={ref} className="flex w-full flex-col gap-12">
        {/* Titre et sous-titre */}
        <div className="flex flex-col gap-3">
          <motion.h2
            className="font-display font-bold tracking-tighter whitespace-nowrap"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              color: "var(--color-text-high)",
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            MODULES LINGUISTIQUES
          </motion.h2>
          <motion.p
            className="font-mono text-sm"
            style={{ color: "var(--color-text-mid)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {COPY.languageModulesSubtitle}
          </motion.p>
        </div>

        {/* Liste des modules */}
        <div className="flex flex-col">
          {LANGUAGES.map((lang, index) => {
            const delay = index * 0.2;
            return (
              <div
                key={lang.code}
                className="glass-card p-6 mb-4 relative flex flex-col gap-3 overflow-hidden"
              >
                {/* Effet boot scan — trait vertical cyan */}
                {!isReducedMotion && (
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 w-0.5"
                    style={{
                      backgroundColor: "var(--color-accent-1)",
                      opacity: isInView ? 1 : 0,
                      animation: isInView
                        ? `scanSweep 400ms ease-out ${delay}s forwards`
                        : "none",
                    }}
                  />
                )}

                {/* Code langue */}
                <span
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  {lang.code}
                </span>

                {/* Nom complet avec hover magenta */}
                <span
                  className="font-display text-2xl font-bold transition-all duration-200 md:text-3xl"
                  style={{ color: "var(--color-text-high)" }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    target.style.color = "var(--color-accent-3)";
                    target.style.textShadow = "0 0 12px var(--color-accent-3)";
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    target.style.color = "var(--color-text-high)";
                    target.style.textShadow = "none";
                  }}
                >
                  {lang.name}
                </span>

                {/* Détails — sans jauges ni pourcentages */}
                <div className="flex flex-col gap-1">
                  {lang.details.map((detail) => (
                    <span
                      key={detail}
                      className="font-mono text-xs"
                      style={{ color: "var(--color-text-dim)" }}
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
    </BackgroundSection>
  );
}
