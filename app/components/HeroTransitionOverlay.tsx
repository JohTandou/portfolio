"use client";

import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   HeroTransitionOverlay — Overlay de transition plein écran
   avec flash chromatique et balayage scanline horizontal.
   ============================================================ */

interface HeroTransitionOverlayProps {
  isVisible: boolean;
}

export function HeroTransitionOverlay({ isVisible }: HeroTransitionOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, times: [0, 0.3, 1] }}
            className="pointer-events-none fixed inset-0 z-[100] mix-blend-screen"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(252,238,10,0.2), transparent 70%)",
              boxShadow:
                "inset 0 0 60px rgba(0,240,255,0.15), inset 0 0 60px rgba(255,0,60,0.15)",
            }}
            aria-hidden="true"
          />
          <motion.div
            key="scanline"
            initial={{ left: "-10%", opacity: 1 }}
            animate={{ left: "110%", opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="pointer-events-none fixed top-0 bottom-0 z-[101] w-[3px] bg-[var(--color-primary)]"
            style={{ boxShadow: "0 0 20px var(--color-primary)" }}
            aria-hidden="true"
          />
        </>
      )}
    </AnimatePresence>
  );
}
