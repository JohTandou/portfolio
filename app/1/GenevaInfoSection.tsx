"use client";

import { PortfolioVariant } from "../types";
import { getCopy } from "../lib/copy";

/* Section dédiée aux informations de mobilité Genève.
   Affichée uniquement sur la route /1.
   Style glass-card cohérent avec le reste du portfolio. */
export function GenevaInfoSection() {
  const variant: PortfolioVariant = "geneva";
  const copy = getCopy(variant);

  if (!copy.genevaInfo) return null;

  const items = [
    { label: "MOBILITÉ", value: copy.genevaInfo.mobilite },
    { label: "RELOCALISATION", value: copy.genevaInfo.relocalisation },
    { label: "STATUT", value: copy.genevaInfo.statut },
    { label: "DISPONIBILITÉ", value: copy.genevaInfo.disponibilite },
  ];

  return (
    <section
      id="geneva-info"
      className="relative w-full"
      style={{
        paddingTop: "clamp(40px, 6vh, 80px)",
        paddingBottom: "clamp(40px, 6vh, 80px)",
        paddingLeft: "clamp(1rem, 4vw, 3rem)",
        paddingRight: "clamp(1rem, 4vw, 3rem)",
      }}
    >
      <div
        className="glass-panel mx-auto max-w-3xl p-6 md:p-10"
        style={{
          background: "rgba(17, 24, 32, 0.6)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(232, 168, 56, 0.15)",
        }}
      >
        <h2
          className="font-display font-bold tracking-tighter mb-8 text-center"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            color: "var(--color-text-high)",
          }}
        >
          INFORMATIONS GENÈVE
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="glass-card p-4 flex flex-col gap-1"
            >
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: "var(--color-accent-1)" }}
              >
                {item.label}
              </span>
              <span
                className="font-body text-sm md:text-base"
                style={{ color: "var(--color-text-mid)" }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
