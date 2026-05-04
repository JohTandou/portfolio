# Hero Scrub 30fps Frame-by-Frame — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development

**Goal:** Remplacer le scrub GSAP temporel par un scrub frame-by-frame à 30fps avec durée proportionnelle à la vidéo.

**Architecture:** `useHeroTransition` calcule le nombre total de frames (`duration * 30`), puis utilise `requestAnimationFrame` pour incrémenter `video.currentTime` frame par frame à la vitesse configurée. Aucune dépendance supplémentaire.

**Tech Stack:** React, TypeScript, GSAP (supprimé pour cette fonctionnalité), HTML5 Video API.

---

### Task 1: Modifier `useHeroTransition` pour scrub frame-by-frame

**Files:**
- Modify: `app/hooks/useHeroTransition.ts`

- [ ] **Step 1: Lire le fichier existant**

Lis `/Users/johtnd/portfolio/app/hooks/useHeroTransition.ts` pour comprendre la structure actuelle.

- [ ] **Step 2: Implémenter le scrub frame-by-frame**

Remplacer la logique GSAP par un loop `requestAnimationFrame` :

```typescript
"use client";

import { useState, useCallback, useRef } from "react";

/* ============================================================
   useHeroTransition — Orchestration des transitions vidéo
   Scrub frame-by-frame à 30fps avec durée proportionnelle.
   ============================================================ */

const FPS = 30;
const SPEED_FACTOR = 2.0; // 2× plus vite que temps réel

interface UseHeroTransitionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoDuration: number;
  isReducedMotion: boolean;
}

export function useHeroTransition({
  videoRef,
  videoDuration,
  isReducedMotion,
}: UseHeroTransitionOptions) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rafRef = useRef<number | null>(null);

  const navigateTo = useCallback(
    (sectionId: string) => {
      if (isTransitioning) return;

      const video = videoRef.current;

      /* Fallback : si la vidéo n'est pas prête, scroll direct */
      if (!video || videoDuration === 0) {
        const el = document.getElementById(sectionId);
        if (el) {
          const lenis = (
            window as Window & {
              __lenis?: {
                scrollTo: (target: string | HTMLElement, options?: object) => void;
              };
            }
          ).__lenis;
          if (lenis) {
            lenis.scrollTo(el, { offset: 0 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
        return;
      }

      /* Mode réduit : transition instantanée */
      if (isReducedMotion) {
        video.currentTime = videoDuration;
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "auto" });
        return;
      }

      setIsTransitioning(true);

      const totalFrames = Math.round(videoDuration * FPS);
      const scrubDurationMs = (totalFrames / FPS) * 1000 / SPEED_FACTOR;
      const startTime = performance.now();
      const startFrame = Math.round(video.currentTime * FPS);

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / scrubDurationMs);
        const targetFrame = Math.round(startFrame + progress * (totalFrames - startFrame));

        video.currentTime = targetFrame / FPS;

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          /* Scrub terminé → scroll vers section */
          const el = document.getElementById(sectionId);
          if (el) {
            const lenis = (
              window as Window & {
                __lenis?: {
                  scrollTo: (target: string | HTMLElement, options?: object) => void;
                };
              }
            ).__lenis;
            if (lenis) {
              lenis.scrollTo(el, { offset: 0 });
            } else {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }
          setTimeout(() => {
            setIsTransitioning(false);
          }, 400);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [isTransitioning, videoDuration, videoRef, isReducedMotion]
  );

  const cancelTransition = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsTransitioning(false);
  }, []);

  return { isTransitioning, navigateTo, cancelTransition };
}
```

- [ ] **Step 3: Vérifier la compilation**

Run: `npx tsc --noEmit` dans `/Users/johtnd/portfolio`
Expected: 0 erreurs

- [ ] **Step 4: Commit**

```bash
git add app/hooks/useHeroTransition.ts
git commit -m "feat: frame-by-frame video scrub at 30fps with proportional duration"
```

---

## Spec Coverage Checklist

| Spec Requirement | Task |
|-----------------|------|
| FPS constante (30) | Step 2 ✅ |
| Durée proportionnelle à la vidéo | Step 2 ✅ |
| requestAnimationFrame loop | Step 2 ✅ |
| Fallback scroll direct | Step 2 ✅ |
| Reduced motion instantané | Step 2 ✅ |

## Placeholder Scan
- [x] Aucun placeholder

## Type Consistency
- `navigateTo(sectionId: string)` — signature simplifiée, `targetProgress` retiré (non utilisé) ✅
