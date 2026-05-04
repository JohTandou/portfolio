"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "../components/SectionWrapper";
import { AnimatedBar } from "../components/AnimatedBar";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

const LANGUAGES = [
  {
    code: "FR",
    name: "FRANÇAIS — NATIVE",
    fluency: 100,
    details: ["Origin : France", "Status : INSTALLED · v1.0 · CORE"],
  },
  {
    code: "EN",
    name: "ANGLAIS — C1",
    fluency: 85,
    details: [
      "Certif #1 : TOEIC 840/990",
      "Certif #2 : ILSC Montréal · C1 Advanced",
      "Field test : 3 mois immersion · Canada · 2023",
      "Status : INSTALLED · v2.4 · ADVANCED",
    ],
  },
  {
    code: "ES",
    name: "ESPAGNOL — B1",
    fluency: 45,
    details: [
      "Use case : Travel · Casual conversation",
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
    <SectionWrapper
      id="languages"
      className="bg-[var(--color-bg-elevated)]"
    >
      <div ref={ref} className="flex w-full flex-col gap-12">
        {/* Titre */}
        <motion.h2
          className="font-display font-bold tracking-tight"
          style={{
            fontSize: "clamp(3rem, 6vw, 5rem)",
            color: "var(--color-text-high)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          MODULES LINGUISTIQUES
        </motion.h2>

        {/* Liste des modules */}
        <div className="flex flex-col">
          {LANGUAGES.map((lang, index) => {
            const delay = index * 0.2;
            return (
              <div
                key={lang.code}
                className="relative flex flex-col gap-3 overflow-hidden py-8"
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

                {/* Barre de fluency */}
                <div className="mt-2">
                  <AnimatedBar
                    target={lang.fluency}
                    delay={delay}
                  />
                </div>

                {/* Pourcentage et détails */}
                <div className="flex flex-col gap-1">
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--color-text-mid)" }}
                  >
                    {lang.fluency}% FLUENCY
                  </span>
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
  );
}
