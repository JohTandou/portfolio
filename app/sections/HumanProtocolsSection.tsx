"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "../components/SectionWrapper";
import { BackgroundSection } from "../components/BackgroundSection";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

const PROTOCOLS = [
  {
    number: "01",
    name: "ADAPTABILITY",
    description:
      "Passé en 3 ans de Xamarin VTC à Swing SNCF puis Angular R&D : 4 stacks majeures, 4 contextes métier.",
  },
  {
    number: "02",
    name: "COMMUNICATION",
    description:
      "Support direct de 20 utilisateurs finaux Hardis, recettes et go-live en autonomie chez SNCF.",
  },
  {
    number: "03",
    name: "RIGUEUR",
    description:
      "Couverture de tests JUnit +7% sur Hardis, scripts SQL et validateurs renforcés sur SNCF.",
  },
  {
    number: "04",
    name: "AUTONOMIE PRODUIT",
    description:
      "TopSeeker : conception → paiement Stripe → monitoring, full ownership d'un produit en prod.",
  },
  {
    number: "05",
    name: "CURIOSITÉ TECH",
    description:
      "Veille active IA appliquée : intégration Gemini 3 Flash, prompts multi-étapes anti-hallucination, agents Claude.",
  },
];

/* Protocoles humains — soft skills, méthodologies et valeurs */
export function HumanProtocolsSection() {
  const { isReducedMotion } = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [cursorActive, setCursorActive] = useState(false);

  useEffect(() => {
    if (isInView && !isReducedMotion) {
      setCursorActive(true);
      const timer = setTimeout(() => setCursorActive(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInView, isReducedMotion]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isReducedMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: isReducedMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <BackgroundSection id="human-protocols" backgroundImage="/backgrounds/soft-skills.jpg" contentPosition="right">
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
            PROTOCOLES HUMAINS
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
            Soft skills et méthodologies de travail
          </motion.p>
        </div>

        {/* Liste des protocoles */}
        <motion.div
          className="flex flex-col"
          variants={containerVariants}
          initial="hidden"
          animate={isInView && !isReducedMotion ? "visible" : "hidden"}
        >
          {PROTOCOLS.map((protocol) => (
            <motion.div
              key={protocol.number}
              variants={itemVariants}
              className="glass-card p-5 mb-4 flex flex-col gap-2"
            >
              <div className="flex items-baseline gap-2">
                <span
                  className="mr-1 inline-block font-mono text-xs"
                  style={{
                    color: "var(--color-accent-1)",
                    animation:
                      cursorActive && !isReducedMotion
                        ? "blink 1s infinite"
                        : "none",
                  }}
                >
                  ▸
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  {protocol.number}
                </span>
                <span
                  className="font-display text-xl font-bold md:text-2xl"
                  style={{ color: "var(--color-text-high)" }}
                >
                  {protocol.name}
                </span>
              </div>
              <p
                className="pl-5 font-body text-sm leading-relaxed md:text-base"
                style={{ color: "var(--color-text-mid)" }}
              >
                {protocol.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      </SectionWrapper>
    </BackgroundSection>
  );
}
