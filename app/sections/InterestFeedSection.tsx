"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "../components/SectionWrapper";

const INTERESTS = [
  {
    name: "TENNIS / PADEL",
    baseline: "Reflexes calibrés pour basse latence.",
  },
  {
    name: "BEATMAKING · MAO",
    baseline:
      "Compositeur en chambre. Mêmes patterns de pensée qu'en code : structure et boucle.",
  },
  {
    name: "PHOTOGRAPHIE · VIDÉOGRAPHIE · MONTAGE",
    baseline:
      "Cadrer le réel, le couper, le ré-assembler. Comme refactorer une codebase.",
  },
];

const POLAROIDS = [
  {
    gradient:
      "linear-gradient(135deg, rgba(252, 238, 10, 0.06), rgba(252, 238, 10, 0.02))",
    rotation: -8,
    top: "10%",
    left: "5%",
  },
  {
    gradient:
      "linear-gradient(135deg, rgba(189, 0, 255, 0.06), rgba(189, 0, 255, 0.02))",
    rotation: 5,
    top: "50%",
    right: "8%",
  },
  {
    gradient:
      "linear-gradient(135deg, rgba(0, 240, 255, 0.06), rgba(0, 240, 255, 0.02))",
    rotation: 12,
    bottom: "15%",
    left: "15%",
  },
];

/* Flux d'intérêts — passions, veille et centres d'intérêt */
export function InterestFeedSection() {
  return (
    <SectionWrapper id="interests" className="bg-[var(--color-bg-deep)]">
      {/* Polaroids décoratifs en arrière-plan */}
      {POLAROIDS.map((polaroid, index) => (
        <div
          key={index}
          className="pointer-events-none absolute z-0"
          style={{
            width: "200px",
            height: "260px",
            background: polaroid.gradient,
            transform: `rotate(${polaroid.rotation}deg)`,
            top: polaroid.top,
            left: polaroid.left,
            right: polaroid.right,
            bottom: polaroid.bottom,
            mixBlendMode: "overlay",
            opacity: 0.3,
            borderRadius: "4px",
          }}
          aria-hidden="true"
        />
      ))}

      <div className="relative z-10 flex w-full flex-col gap-12">
        {/* Titre et sous-titre */}
        <div className="flex flex-col gap-3">
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
            FLUX D'INTÉRÊTS
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
            Passions, veille et centres d'intérêt
          </motion.p>
        </div>

        {/* Grille de fiches */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {INTERESTS.map((interest, index) => (
            <motion.div
              key={interest.name}
              className="group flex flex-col gap-4 p-8 transition-all duration-300"
              style={{
                backgroundColor: "var(--color-bg-elevated)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(0, 240, 255, 0.2)",
              }}
            >
              <h3
                className="font-display text-xl font-bold uppercase"
                style={{ color: "var(--color-text-high)" }}
              >
                {interest.name}
              </h3>
              <p
                className="font-body text-sm leading-relaxed transition-all duration-300 group-hover:text-[var(--color-accent-1)]"
                style={{
                  color: "var(--color-text-mid)",
                  lineHeight: 1.6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow =
                    "0 0 8px rgba(0, 240, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                {interest.baseline}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
