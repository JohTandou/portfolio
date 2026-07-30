"use client";

import { motion } from "framer-motion";
import { ExperienceEntry } from "../types";
import { HudCorners } from "./HudCorners";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

interface ExperienceCardProps {
  entry: ExperienceEntry;
  index: number;
  isActive: boolean;
}

/* Card holographique pour le journal d'expérience professionnelle.
   Utilise le style glass-card pour l'effet vitré avec teinte teal au hover. */
export function ExperienceCard({ entry, index }: ExperienceCardProps) {
  const { isReducedMotion } = useReducedMotion();

  const initials = entry.company.slice(0, 2).toUpperCase();
  const dateRange = entry.endDate
    ? `${entry.startDate} → ${entry.endDate}`
    : `${entry.startDate} → NOW`;

  return (
    <motion.div
      className="glass-card group relative flex-shrink-0 overflow-hidden p-6 md:p-8"
      initial={isReducedMotion ? undefined : { opacity: 0, y: 20 }}
      whileInView={isReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Coins HUD animés */}
      <div className="pointer-events-none absolute top-3 left-3">
        <HudCorners size={24} color="var(--color-accent-1)" animate />
      </div>
      <div className="pointer-events-none absolute top-3 right-3 rotate-90">
        <HudCorners size={24} color="var(--color-accent-1)" animate />
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 -rotate-90">
        <HudCorners size={24} color="var(--color-accent-1)" animate />
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 rotate-180">
        <HudCorners size={24} color="var(--color-accent-1)" animate />
      </div>

      {/* Scanlines internes */}
      <div
        className="pointer-events-none absolute inset-0 rounded-sm"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 5px)",
          opacity: 0.03,
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative flex items-start gap-4">
        {/* Logo placeholder */}
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm border font-display text-lg font-bold"
          style={{
            backgroundColor: "var(--color-bg-deep)",
            borderColor: "var(--color-text-dim)",
            color: "var(--color-text-high)",
          }}
        >
          {initials}
        </div>

        <div className="flex flex-col gap-1">
          <h3
            className="font-display text-xl font-semibold"
            style={{ color: "var(--color-text-high)" }}
          >
            {entry.role}
          </h3>
          <span
            className="font-mono text-xs"
            style={{ color: "var(--color-text-mid)" }}
          >
            [{dateRange}] · {entry.location}
          </span>
        </div>
      </div>

      {/* Séparateur */}
      <div
        className="relative my-4 h-px w-full"
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      />

      {/* Mission */}
      <div className="relative flex flex-col gap-2">
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--color-accent-1)" }}
        >
          Mission
        </span>
        <p
          className="font-body text-sm leading-relaxed"
          style={{ color: "var(--color-text-mid)", lineHeight: 1.6 }}
        >
          {entry.mission}
        </p>
      </div>

      {/* Impact */}
      <div className="relative mt-4 flex flex-col gap-2">
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--color-accent-1)" }}
        >
          Impact
        </span>
        <ul className="flex flex-col gap-1.5">
          {entry.impact.map((item) => (
            <li
              key={item}
              className="font-body text-sm"
              style={{ color: "var(--color-text-mid)", lineHeight: 1.6 }}
            >
              <span style={{ color: "var(--color-accent-1)" }}>› </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Stack */}
      <div className="relative mt-4 flex flex-col gap-2">
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--color-accent-1)" }}
        >
          Stack
        </span>
        <div className="flex flex-wrap gap-2">
          {entry.stack.map((tech, techIndex) => (
            <motion.span
              key={tech}
              className="glass-badge font-mono text-xs"
              initial={isReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
              whileInView={isReducedMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: techIndex * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
