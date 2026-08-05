"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BackgroundSection } from "../components/BackgroundSection";
import { useReducedMotion } from "../providers/ReducedMotionProvider";
import { getCopy } from "../lib/copy";
import { PortfolioVariant } from "../types";

interface IdentitySectionProps {
  variant?: PortfolioVariant;
}

/* Section identité — présentation personnelle avec fond vitré */
export function IdentitySection({ variant = "public" }: IdentitySectionProps) {
  const { isReducedMotion } = useReducedMotion();
  const copy = getCopy(variant);

  return (
    <BackgroundSection
      id="identity"
      backgroundImage="/backgrounds/about.jpg"
      contentPosition="left"
      wideContent
    >
      {/* Grille responsive — 1 colonne sur mobile, 2 sur desktop.
          Mobile : photo/nom en premier, carte Identité en dessous.
          Desktop : carte Identité à gauche, photo/nom à droite (ordre inversé via md:order-*). */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {/* Pane photo/nom — premier sur mobile, à droite sur desktop */}
        <motion.div
          className="flex flex-col items-center order-1 md:order-2"
          initial={isReducedMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={isReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Conteneur de la photo avec anneau doré tournant */}
          <div
            className="relative flex-shrink-0"
            style={{
              width: "clamp(208px, calc(20vw + 28px), 248px)",
              height: "clamp(208px, calc(20vw + 28px), 248px)",
            }}
          >
            {/* Anneau SVG doré — tourne lentement en continu */}
            <svg
              className="absolute"
              viewBox="0 0 100 100"
              style={{
                width: "100%",
                height: "100%",
                animation: isReducedMotion
                  ? "none"
                  : "avatar-ring-spin 30s linear infinite",
              }}
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="var(--color-accent-1)"
                strokeWidth="1.5"
                strokeDasharray="6 16"
                strokeLinecap="round"
              />
            </svg>

            {/* Photo ronde — parfaitement circulaire, espacement 14px de l'anneau */}
            <div
              className="absolute overflow-hidden"
              style={{
                width: "clamp(180px, 20vw, 220px)",
                height: "clamp(180px, 20vw, 220px)",
                borderRadius: "50%",
                top: "14px",
                left: "14px",
              }}
            >
              <Image
                src="/identity-photo.jpg"
                alt="Photo de Joh Tandou"
                fill
                className="object-cover"
                style={{ objectPosition: "center 15%" }}
                priority
                sizes="(max-width: 768px) 180px, 220px"
              />
            </div>
          </div>

          {/* Prénom et nom */}
          <div className="mt-8 text-center">
            <p
              className="font-display font-bold leading-none tracking-tight"
              style={{
                fontSize: "clamp(2rem, 4vw, 4rem)",
                color: "var(--color-text-high)",
              }}
            >
              JOH
            </p>
            <p
              className="font-display font-bold leading-none tracking-tight"
              style={{
                fontSize: "clamp(2rem, 4vw, 4rem)",
                color: "var(--color-text-high)",
              }}
            >
              TANDOU
            </p>
          </div>

          {/* Ligne fine horizontale cyan */}
          <div
            className="mt-4 h-px w-32"
            style={{ backgroundColor: "var(--color-accent-1)", opacity: 0.3 }}
          />
        </motion.div>

        {/* Pane carte Identité — deuxième sur mobile, à gauche sur desktop */}
        <div className="glass-card p-4 sm:p-6 order-2 md:order-1">
          <motion.div
            initial={isReducedMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={isReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="font-display font-bold tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                color: "var(--color-text-high)",
              }}
            >
              IDENTITÉ
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6">
              <div className="flex flex-col gap-1">
                <span className="glass-badge">
                  Localisation
                </span>
                <span
                  className="font-body text-base"
                  style={{ color: "var(--color-text-mid)" }}
                >
                  {copy.identityLocation}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="glass-badge">
                  Statut
                </span>
                <span
                  className="font-body text-base"
                  style={{ color: "var(--color-text-mid)" }}
                >
                  {copy.identityStatut}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="glass-badge">
                  Spécialité
                </span>
                <span
                  className="font-body text-base"
                  style={{ color: "var(--color-text-mid)" }}
                >
                  Full-Stack
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="glass-badge">
                  Années d&apos;XP
                </span>
                <span
                  className="font-body text-base"
                  style={{ color: "var(--color-text-mid)" }}
                >
                  02
                </span>
              </div>
            </div>

            {/* Séparateur horizontal fin */}
            <div
              className="h-px w-full mt-8"
              style={{ backgroundColor: "var(--color-text-dim)", opacity: 0.2 }}
            />

            <p
              className="font-body text-base sm:text-lg leading-[1.7] mt-6 sm:mt-8"
              style={{ color: "var(--color-text-mid)" }}
            >
              {copy.identityBio}
            </p>

            {/* Séparateur horizontal fin */}
            <div
              className="h-px w-full mt-8"
              style={{ backgroundColor: "var(--color-text-dim)", opacity: 0.2 }}
            />

            {/* Formation */}
            <div className="mt-6 sm:mt-8">
              <span className="glass-badge">Formation</span>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span
                    className="font-body text-sm font-semibold"
                    style={{ color: "var(--color-text-high)" }}
                  >
                    EFREI Paris
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--color-text-dim)" }}
                  >
                    Diplôme d&apos;Ingénieur
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--color-text-dim)" }}
                  >
                    2021 → 2023
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    className="font-body text-sm font-semibold"
                    style={{ color: "var(--color-text-high)" }}
                  >
                    Université Paris Cité
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--color-text-dim)" }}
                  >
                    Licence MIAGE
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--color-text-dim)" }}
                  >
                    2018 → 2021
                  </span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </BackgroundSection>
  );
}
