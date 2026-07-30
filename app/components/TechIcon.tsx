"use client";

import { motion } from "framer-motion";
import { Tooltip } from "./Tooltip";

/* ============================================================
   TechIcon — Label techno avec tooltip, animation et son hover
   Direction esthétique : lisibilité premium, feedback sensoriel
   ============================================================ */

interface TechIconProps {
  label: string;
  description?: string;
  index?: number;
}

export function TechIcon({
  label,
  description = "Compétence maîtrisée — niveau avancé",
  index = 0,
}: TechIconProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "grayscale(1)" }}
      whileInView={{ opacity: 1, filter: "grayscale(0)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Tooltip content={description}>
        <span
          className="group inline-flex cursor-default items-center gap-1.5 font-body text-sm transition-all duration-200"
          style={{ color: "var(--color-text-mid)" }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.color = "var(--color-accent-1)";
            target.style.textShadow = "0 0 8px var(--color-accent-1)";
            target.style.transform = "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.color = "var(--color-text-mid)";
            target.style.textShadow = "none";
            target.style.transform = "translateX(0)";
          }}
        >
          <span style={{ color: "var(--color-accent-1)" }}>▸</span>
          {label}
        </span>
      </Tooltip>
    </motion.div>
  );
}
