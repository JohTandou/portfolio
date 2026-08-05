"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKonamiCode } from "../hooks/useKonamiCode";

/* ============================================================
   KonamiEasterEgg — Glitch total UI + console CTF cachée
   Direction esthétique : esthétique rétro-hacker, terminal CRT
   ============================================================ */

export function KonamiEasterEgg() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  const activate = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      setShowConsole(true);
    }, 2000);
  }, []);

  useKonamiCode(activate);

  return (
    <>
      {/* Overlay de glitch total */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[100]"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 4px)",
              mixBlendMode: "difference",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, times: [0, 0.2, 0.5, 0.8, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Inversion couleurs temporaire sur le body */}
      {isGlitching && (
        <style jsx global>{`
          body {
            filter: invert(1) hue-rotate(180deg) !important;
            transition: none !important;
          }
        `}</style>
      )}

      {/* Console interactive CTF */}
      <AnimatePresence>
        {showConsole && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(10, 14, 20, 0.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConsole(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Console secrète"
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-sm border p-6"
              style={{
                backgroundColor: "var(--color-bg-deep)",
                borderColor: "var(--color-accent-1)",
              }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowConsole(false);
                }
              }}
              tabIndex={0}
            >
              <div
                className="font-mono text-xs"
                style={{ color: "var(--color-accent-1)" }}
              >
                {`> SYSTEM BREACH DETECTED`}
              </div>
              <div
                className="mt-2 font-mono text-xs"
                style={{ color: "var(--color-text-mid)" }}
              >
                {`> Welcome to the hidden terminal, operator.`}
              </div>
              <div
                className="mt-2 font-mono text-xs"
                style={{ color: "var(--color-text-mid)" }}
              >
                {`> MODULE_CTF // COMPILATION EN COURS // RESTEZ À L'ÉCOUTE...`}
              </div>
              <div
                className="mt-4 font-mono text-xs"
                style={{ color: "var(--color-accent-1)" }}
              >
                {`> Press ESC or click to close...`}
              </div>
              <button
                className="mt-6 font-mono text-xs hover:text-[var(--color-accent-1)]"
                style={{ color: "var(--color-text-mid)" }}
                onClick={() => setShowConsole(false)}
                type="button"
              >
                [ CLOSE ]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
