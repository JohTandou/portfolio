"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BackgroundSection } from "../components/BackgroundSection";
import { SectionWrapper } from "../components/SectionWrapper";

const Avatar3D = dynamic(
  () => import("../components/Avatar3D").then((m) => ({ default: m.Avatar3D })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center"
        style={{
          width: "clamp(180px, 25vw, 320px)",
          height: "clamp(180px, 25vw, 320px)",
        }}
      >
        {/* Fallback SVG identique à l'actuel */}
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="var(--color-accent-3)"
            strokeWidth="1.5"
            strokeDasharray="30 15"
            style={{
              transformOrigin: "center",
              animation: "spin 20s linear infinite",
            }}
          />
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            strokeDasharray="20 20"
            style={{
              transformOrigin: "center",
              animation: "spin-reverse 15s linear infinite",
            }}
          />
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="var(--color-accent-1)"
            strokeWidth="1.5"
            strokeDasharray="15 25"
            style={{
              transformOrigin: "center",
              animation: "spin 12s linear infinite",
            }}
          />
          <circle
            cx="100"
            cy="100"
            r="25"
            fill="none"
            stroke="var(--color-text-dim)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>
      </div>
    ),
  }
);

const STATS = [
  { label: "DATASETS_HANDLED", value: "1M+", unit: "lignes" },
  { label: "APPS_DEPLOYED", value: "5+", unit: "applications" },
  { label: "USERS_SUPPORTED", value: "20+", unit: "utilisateurs" },
  { label: "COFFEES_PER_DAY", value: "4", unit: "cafés" },
];

/* Section identité — présentation personnelle et stats RPG avec fond vitré */
export function IdentitySection() {
  return (
    <BackgroundSection
      id="identity"
      backgroundImage="/backgrounds/about.jpg"
      contentPosition="left"
    >
      <SectionWrapper>
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Left pane — sticky sur desktop */}
          <div
            className="flex flex-col items-center md:sticky md:top-24"
            style={{ alignSelf: "start" }}
          >
            {/* Avatar 3D avec fallback SVG */}
            <Avatar3D />

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
          </div>

          {/* Right pane — scrollable */}
          <div className="flex flex-col gap-8">
            <h2
              className="font-display font-bold tracking-tight"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                color: "var(--color-text-high)",
              }}
            >
              IDENTITÉ
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="glass-badge">
                  Localisation
                </span>
                <span
                  className="font-body text-sm md:text-base"
                  style={{ color: "var(--color-text-mid)" }}
                >
                  Fosses, IDF
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="glass-badge">
                  Statut
                </span>
                <span
                  className="font-body text-sm md:text-base"
                  style={{ color: "var(--color-text-mid)" }}
                >
                  OPERATIONAL
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="glass-badge">
                  Spécialité
                </span>
                <span
                  className="font-body text-sm md:text-base"
                  style={{ color: "var(--color-text-mid)" }}
                >
                  Full-Stack
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="glass-badge">
                  Années actif
                </span>
                <span
                  className="font-body text-sm md:text-base"
                  style={{ color: "var(--color-text-mid)" }}
                >
                  02
                </span>
              </div>
            </div>

            {/* Séparateur horizontal fin */}
            <div
              className="h-px w-full"
              style={{ backgroundColor: "var(--color-text-dim)", opacity: 0.2 }}
            />

            <p
              className="font-body text-base leading-[1.7] md:text-lg"
              style={{ color: "var(--color-text-mid)" }}
            >
              Développeur spécialisé en architectures micro-services, passionné par
              l&apos;optimisation et la manipulation de datasets complexes.
            </p>

            {/* Séparateur horizontal fin */}
            <div
              className="h-px w-full"
              style={{ backgroundColor: "var(--color-text-dim)", opacity: 0.2 }}
            />

            {/* Stats RPG */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {STATS.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-card p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span className="glass-badge">
                    {stat.label}
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span
                      className="font-display text-2xl font-bold md:text-3xl"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: "var(--color-text-mid)" }}
                    >
                      {stat.unit}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </BackgroundSection>
  );
}
