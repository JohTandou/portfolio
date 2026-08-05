"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "../components/SectionWrapper";
import { BackgroundSection } from "../components/BackgroundSection";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { getCopy } from "../lib/copy";
import { PortfolioVariant } from "../types";

const PROTOCOLS = [
  {
    number: "01",
    name: "ADAPTATION",
    description:
      "Xamarin pour les chauffeurs VTC, React/FastAPI pour des managers, Angular en R&D puis Java/Swing à la SNCF : j'entre vite dans un nouveau métier, ses contraintes et ses outils.",
  },
  {
    number: "02",
    name: "SENS DU TERRAIN",
    description:
      "Je ne livre pas à distance : support de 20 utilisateurs chez Hardis, recettes et mise en production à la SNCF. Une solution n'a de valeur que si elle fonctionne dans la vraie journée de ses utilisateurs.",
  },
  {
    number: "03",
    name: "FIABILITÉ",
    description:
      "Tests JUnit et Pytest, validateurs, scripts SQL, tests de robustesse : je sécurise les cas concrets avant qu'ils ne deviennent des incidents utilisateurs.",
  },
  {
    number: "04",
    name: "ESPRIT D'ÉQUIPE",
    description:
      "Daily scrums, collaboration avec les équipes métier et relais Talan à l'Ekiden : j'avance avec le collectif, j'assume ma part et je passe le relais proprement. Habitué aux environnements hybrides et aux collaborations distribuées.",
  },
  {
    number: "05",
    name: "CURIOSITÉ APPLIQUÉE",
    description:
      "De Devoxx à Swarm, puis à ce portfolio : je transforme une veille sur les agents de code en expérimentations concrètes pour mieux cartographier, planifier, tester et fiabiliser, sans déléguer le jugement.",
  },
];

interface HumanProtocolsSectionProps {
  variant?: PortfolioVariant;
}

/* Protocoles humains — soft skills, méthodologies et valeurs */
export function HumanProtocolsSection({ variant = "public" }: HumanProtocolsSectionProps) {
  const copy = getCopy(variant);
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
            {copy.humanProtocolsSubtitle}
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
            <div
              key={protocol.number}
              className="glass-card p-5 mb-4"
            >
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-2"
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
            </div>
          ))}
        </motion.div>
      </div>
      </SectionWrapper>
    </BackgroundSection>
  );
}
