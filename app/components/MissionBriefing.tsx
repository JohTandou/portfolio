"use client";

import { MissionEntry } from "../types";

interface MissionBriefingProps {
  mission: MissionEntry;
  isFocused: boolean;
}

/* Fiche de mission style dossier classifié */
export function MissionBriefing({ mission, isFocused }: MissionBriefingProps) {
  const statusConfig = {
    shipped: {
      bg: "rgba(0, 240, 160, 0.1)",
      border: "rgba(0, 240, 160, 0.3)",
      color: "#00F0A0",
      label: "SHIPPED",
    },
    "in-progress": {
      bg: "rgba(252, 238, 10, 0.1)",
      border: "rgba(252, 238, 10, 0.3)",
      color: "var(--color-primary)",
      label: "IN PROGRESS",
    },
    archived: {
      bg: "rgba(74, 79, 88, 0.2)",
      border: "rgba(74, 79, 88, 0.4)",
      color: "var(--color-text-dim)",
      label: "ARCHIVED",
    },
  };

  const statusStyle = statusConfig[mission.status];

  return (
    <div
      className="glass-card p-6 md:p-8 relative flex flex-col gap-4 overflow-hidden rounded-sm"
    >
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
      <div className="relative flex items-center justify-between">
        <span
          className="font-mono text-xs"
          style={{ color: "var(--color-text-dim)" }}
        >
          MISSION_ID : {mission.missionId}
        </span>
        <span
          className="rounded-sm border px-2 py-0.5 font-mono text-xs"
          style={{
            backgroundColor: statusStyle.bg,
            borderColor: statusStyle.border,
            color: statusStyle.color,
          }}
        >
          STATUS: {statusStyle.label}
        </span>
      </div>

      {/* Codename */}
      <div className="relative flex flex-col gap-1">
        <span
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: "var(--color-text-dim)" }}
        >
          Codename
        </span>
        <h3
          className="font-display text-3xl font-bold"
          style={{ color: "var(--color-text-high)" }}
        >
          {mission.codename}
        </h3>
      </div>

      {/* Class + Timeline */}
      <div className="relative flex flex-col gap-1">
        <span
          className="font-mono text-sm"
          style={{ color: "var(--color-text-mid)" }}
        >
          {mission.classification}
        </span>
        <span
          className="font-mono text-sm"
          style={{ color: "var(--color-text-mid)" }}
        >
          {mission.timeline}
        </span>
      </div>

      {/* Séparateur Briefing */}
      <div
        className="relative my-1 font-mono text-xs"
        style={{ color: "var(--color-text-dim)" }}
      >
        ──── BRIEFING ────
      </div>

      {/* Briefing */}
      <p
        className="relative font-body text-sm"
        style={{ color: "var(--color-text-mid)", lineHeight: 1.6 }}
      >
        {mission.briefing}
      </p>

      {/* Objectives */}
      <div
        className="relative my-1 font-mono text-xs"
        style={{ color: "var(--color-text-dim)" }}
      >
        ──── OBJECTIFS COMPLÉTÉS ────
      </div>
      <ul className="relative flex flex-col gap-1.5">
        {mission.objectives.map((obj, i) => (
          <li
            key={obj}
            className="flex items-start gap-2 font-body text-sm"
            style={{ color: "var(--color-text-mid)" }}
          >
            <span
              className="flex-shrink-0 font-mono text-xs"
              style={{ color: "var(--color-accent-1)" }}
            >
              [{String(i + 1).padStart(2, "0")}]
            </span>
            {obj}
          </li>
        ))}
      </ul>

      {/* Arsenal */}
      <div
        className="relative my-1 font-mono text-xs"
        style={{ color: "var(--color-text-dim)" }}
      >
        ──── ARSENAL DEPLOYED ────
      </div>
      <div className="relative flex flex-wrap gap-2">
        {mission.arsenal.map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs"
            style={{
              backgroundColor: "var(--color-bg-deep)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--color-text-mid)",
              padding: "2px 8px",
              borderRadius: "2px",
            }}
          >
            [{tech}]
          </span>
        ))}
      </div>

      {/* Access */}
      <div
        className="relative my-1 font-mono text-xs"
        style={{ color: "var(--color-text-dim)" }}
      >
        ──── ACCESS ────
      </div>
      <div className="relative flex flex-wrap gap-3">
        {mission.access.length > 0 ? (
          mission.access.map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="font-mono text-xs transition-all duration-200 hover:brightness-125"
              style={{ color: "var(--color-accent-1)" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                &gt; {link.label.toUpperCase().replace(/\s/g, "_")}
              </span>
            </a>
          ))
        ) : (
          <span
            className="font-mono text-xs"
            style={{ color: "var(--color-text-dim)" }}
          >
            &gt; CLASSIFIED
          </span>
        )}
      </div>
    </div>
  );
}
