"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

/* ── RainOverlay — pluie fine AAA via Canvas 2D ────────────────────
   Deux profondeurs de gouttes, couleur froide très subtile.
   Delta-time pour vitesse stable. Désactivé en reduced motion.

   Optimisations performance (avril 2026) :
   – DPR cap agressif : 1.25 desktop / 1 mobile
   – Densité réduite : 50 desktop / 20 mobile
   – Rendu groupé par profondeur : 2 stroke() par frame max
   – Frame pacing adaptatif : rendu max ~31 fps
   – Pause automatique hors viewport / onglet masqué
   – Détection native matchMedia réactive (filet reduced motion) */

interface RainOverlayProps {
  /** ID de la section parente (graine déterministe) */
  sectionId: string;
  /** Activité : section visible + onglet actif (depuis useSectionActivity) */
  isActive: boolean;
  /** Mode mouvement réduit (depuis ReducedMotionProvider) */
  isReducedMotion: boolean;
}

/* ── Types internes ─────────────────────────────────────────────── */

type DropDepth = 0 | 1;

interface Drop {
  x: number;
  y: number;
  speed: number; /* px/s de base */
  length: number;
  alpha: number;
  depth: DropDepth; /* 0 = loin, 1 = proche */
}

/** Regroupement des drops par profondeur pour rendu batché */
interface BatchGroup {
  depth: DropDepth;
  alpha: number;
  lineWidth: number;
  drops: Drop[];
}

/* ── Utilitaires ────────────────────────────────────────────────── */

/** Hash simple d'une chaîne → entier positif (graine) */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Générateur pseudo-aléatoire Lehmer (déterministe) */
function makeRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Constantes ─────────────────────────────────────────────────── */

const DROP_COLOR = "180, 210, 230"; /* bleu froid subtil */

/* Frame pacing : intervalle minimum entre deux rendus (~31 fps).
   Le rAF tourne à ~60 Hz mais on ne dessine que toutes les ~32 ms.
   L'accumulateur de simulation continue d'avancer même sans rendu. */
const MIN_FRAME_MS = 16; /* ≈ 60 fps cap — workload uniforme par frame, capé au refresh natif */

/* ── Composant ──────────────────────────────────────────────────── */

export function RainOverlay({
  sectionId,
  isActive,
  isReducedMotion,
}: RainOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const dropsRef = useRef<Drop[]>([]);
  const lastSimTimeRef = useRef<number>(0);
  const lastDrawTimeRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const resizeObsRef = useRef<ResizeObserver | null>(null);
  /* Accumulateur de simulation (ms) pour frame pacing */
  const simAccRef = useRef<number>(0);

  /* ── Détection native réactive ── */
  const nativeReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );

  /* Combinaison : natif réactif OU prop provider */
  const effectiveReducedMotion = nativeReducedMotion || isReducedMotion;

  /* ── Loop de rendu avec frame pacing et batch par profondeur ─── */
  const drawFrame = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height, dpr } = dimensionsRef.current;
      if (width === 0 || height === 0) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      /* ── Simulation (toujours à jour, delta-time réel) ── */
      const simDt = lastSimTimeRef.current
        ? timestamp - lastSimTimeRef.current
        : 0;
      lastSimTimeRef.current = timestamp;

      /* Accumuler le temps écoulé ; cap à 100 ms */
      simAccRef.current += Math.min(simDt, 100);

      const drops = dropsRef.current;
      const simStepSec = simAccRef.current / 1000;

      /* Avancer toutes les drops via l'accumulateur, en plusieurs
         micro-pas de 16ms pour éviter les sauts */
      const MAX_STEP_MS = 16;
      while (simAccRef.current >= MAX_STEP_MS) {
        const stepSec = MAX_STEP_MS / 1000;
        for (let i = 0; i < drops.length; i++) {
          const d = drops[i];
          const speedMul = d.depth === 0 ? 0.55 : 1;
          d.y += d.speed * speedMul * stepSec;
          if (d.y > height + d.length) {
            d.y = -d.length;
          }
        }
        simAccRef.current -= MAX_STEP_MS;
      }

      /* ── Frame pacing : ne rendre que si MIN_FRAME_MS écoulé ── */
      const drawDt = lastDrawTimeRef.current
        ? timestamp - lastDrawTimeRef.current
        : MIN_FRAME_MS + 1;
      if (drawDt < MIN_FRAME_MS) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }
      lastDrawTimeRef.current = timestamp;

      /* ── Rendu batché par profondeur ── */
      ctx.clearRect(0, 0, width * dpr, height * dpr);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";

      /* Construire les groupes de profondeur */
      const depthGroups = buildBatchGroups(drops);

      for (let g = 0; g < depthGroups.length; g++) {
        const group = depthGroups[g];
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${DROP_COLOR}, ${group.alpha.toFixed(3)})`;
        ctx.lineWidth = group.lineWidth;

        for (let i = 0; i < group.drops.length; i++) {
          const d = group.drops[i];
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x, d.y + d.length);
        }
        ctx.stroke();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(drawFrame);
    },
    []
  );

  /* ── Initialisation / destruction du canvas ───────────────────── */
  useEffect(() => {
    if (!isActive || effectiveReducedMotion) {
      /* Stopper toute animation en cours */
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastSimTimeRef.current = 0;
      lastDrawTimeRef.current = 0;
      simAccRef.current = 0;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── Déterminer les paramètres par device ── */
    const isDesktop =
      typeof window !== "undefined" && window.innerWidth >= 768;
    const rawDpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const dpr = Math.min(rawDpr, isDesktop ? 1.25 : 1);
    const count = isDesktop ? 50 : 20;
    const alphaMin = isDesktop ? 0.08 : 0.08;
    const alphaMax = isDesktop ? 0.22 : 0.18;
    const lenMin = isDesktop ? 6 : 4;
    const lenMax = isDesktop ? 14 : 10;

    /* ── Mesurer le parent (le conteneur de fond) ── */
    const parent = canvas.parentElement;
    if (!parent) return;

    const updateSize = () => {
      const rect = parent.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      dimensionsRef.current = { width: w, height: h, dpr };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    updateSize();

    /* ResizeObserver sur le parent */
    const ro = new ResizeObserver(() => updateSize());
    ro.observe(parent);
    resizeObsRef.current = ro;

    /* ── Générer les gouttes (déterministe par sectionId) ── */
    const seed = hashString(sectionId);
    const rand = makeRandom(seed);
    const drops: Drop[] = [];
    const { width, height } = dimensionsRef.current;

    for (let i = 0; i < count; i++) {
      const depth = i < Math.floor(count * 0.4) ? (0 as const) : (1 as const);
      const alpha =
        alphaMin + rand() * (alphaMax - alphaMin);
      drops.push({
        x: rand() * width,
        y: rand() * height,
        speed: 180 + rand() * 220, /* 180–400 px/s */
        length: lenMin + rand() * (lenMax - lenMin),
        alpha,
        depth,
      });
    }
    dropsRef.current = drops;

    /* ── Démarrer la boucle rAF ── */
    lastSimTimeRef.current = 0;
    lastDrawTimeRef.current = 0;
    simAccRef.current = 0;
    rafRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      ro.disconnect();
      resizeObsRef.current = null;
      lastSimTimeRef.current = 0;
      lastDrawTimeRef.current = 0;
      simAccRef.current = 0;
    };
  }, [isActive, effectiveReducedMotion, sectionId, drawFrame]);

  /* ── Nettoyage final au démontage ── */
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      resizeObsRef.current?.disconnect();
      resizeObsRef.current = null;
    };
  }, []);

  const hidden = !isActive || effectiveReducedMotion;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-[3] ${
        hidden ? "hidden" : ""
      }`}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
      data-section-id={sectionId}
      data-reduced-motion={effectiveReducedMotion ? "true" : "false"}
    />
  );
}

/* ── Helpers (hors composant, pas de re-création) ──────────────── */

/**
 * Regroupe les drops par profondeur pour le rendu batché.
 * Chaque groupe est rendu en un seul appel stroke().
 */
function buildBatchGroups(drops: Drop[]): BatchGroup[] {
  /* On utilise un mapping statique pour éviter les allocations */
  const groups: BatchGroup[] = [
    { depth: 0, alpha: 0, lineWidth: 0.5, drops: [] },
    { depth: 1, alpha: 0, lineWidth: 0.8, drops: [] },
  ];

  /* Alpha max par groupe (on prend celui de la 1ère drop représentative
     pour le strokeStyle ; comme les alphas sont proches, c'est suffisant) */
  let alpha0 = 0;
  let alpha1 = 0;

  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    if (d.depth === 0) {
      groups[0].drops.push(d);
      if (d.alpha > alpha0) alpha0 = d.alpha;
    } else {
      groups[1].drops.push(d);
      if (d.alpha > alpha1) alpha1 = d.alpha;
    }
  }

  groups[0].alpha = alpha0 || 0.12;
  groups[1].alpha = alpha1 || 0.18;

  return groups;
}
