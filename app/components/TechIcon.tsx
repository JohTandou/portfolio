"use client";

import { motion } from "framer-motion";

interface TechIconProps {
  label: string;
  index?: number;
}

export function TechIcon({
  label,
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
      <span
        className="inline-flex cursor-default items-center gap-1.5 font-body text-sm"
        style={{ color: "var(--color-text-mid)" }}
      >
        <span style={{ color: "var(--color-accent-1)" }}>▸</span>
        {label}
      </span>
    </motion.div>
  );
}
