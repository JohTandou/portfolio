"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoadmapCheckpoint } from "../types";
import { HudCorners } from "./HudCorners";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

interface CheckpointModalProps {
  checkpoint: RoadmapCheckpoint | null;
  isOpen: boolean;
  onClose: () => void;
}

/* Modale pour afficher le manifesto d'un checkpoint de roadmap */
export function CheckpointModal({
  checkpoint,
  isOpen,
  onClose,
}: CheckpointModalProps) {
  useLockBodyScroll(isOpen);
  const dialogRef = useRef<HTMLDivElement>(null);

  /* Fermeture via la touche Escape */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!checkpoint) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(10, 14, 20, 0.85)",
            backdropFilter: "blur(12px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkpoint-modal-title"
        >
          {/* Carte modale */}
          <motion.div
            ref={dialogRef}
            className="glass-panel p-6 relative w-full max-w-[480px] overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Coins HUD animés */}
            <div className="pointer-events-none absolute top-4 left-4">
              <HudCorners size={28} color="var(--color-accent-1)" animate />
            </div>
            <div className="pointer-events-none absolute top-4 right-4 rotate-90">
              <HudCorners size={28} color="var(--color-accent-1)" animate />
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 -rotate-90">
              <HudCorners size={28} color="var(--color-accent-1)" animate />
            </div>
            <div className="pointer-events-none absolute bottom-4 right-4 rotate-180">
              <HudCorners size={28} color="var(--color-accent-1)" animate />
            </div>

            {/* Header */}
            <div className="flex flex-col gap-2">
              <span
                className="font-mono text-xs uppercase tracking-widest"
                style={{ color: "var(--color-accent-1)" }}
              >
                {checkpoint.label}
              </span>
              <h2
                id="checkpoint-modal-title"
                className="font-display text-2xl font-bold"
                style={{ color: "var(--color-text-high)" }}
              >
                {checkpoint.title}
              </h2>
            </div>

            {/* Body */}
            <p
              className="mt-6 font-body text-base leading-relaxed"
              style={{ color: "var(--color-text-mid)", lineHeight: 1.7 }}
            >
              {checkpoint.manifesto}
            </p>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
              <button
                className="font-mono text-xs transition-colors duration-200 hover:text-[var(--color-accent-1)]"
                style={{ color: "var(--color-text-mid)" }}
                onClick={onClose}
                type="button"
              >
                [ FERMER ]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
