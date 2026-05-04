# Design Doc — Hero Scrub Frame-by-Frame à 30fps

**Date :** 2026-05-04  
**Projet :** Portfolio Joh Tandou  
**Scope :** Modifier `useHeroTransition` pour scrubber la vidéo frame par frame à 30fps au lieu d'une interpolation temporelle GSAP.

---

## 1. Contexte

Le hero dispose d'un menu CP2077. Au clic sur un item, la vidéo doit scrubber de la frame actuelle jusqu'à la dernière frame, puis scroller vers la section cible.

Actuellement, le scrub utilise GSAP pour animer `video.currentTime` sur une durée temporelle (`videoDuration × 0.5`). L'utilisateur demande un scrub **frame-by-frame à 30fps** avec une durée proportionnelle à la longueur de la vidéo.

---

## 2. Architecture

### 2.1 Composants impactés

| Composant | Action | Responsabilité |
|-----------|--------|----------------|
| `useHeroTransition` | Modifier | Orchestration du scrub frame-by-frame |

Aucun autre composant n'est modifié. `HeroSection` et `HeroMenu` appellent déjà `navigateTo(sectionId)` — l'interface reste identique.

---

## 3. Data Flow

```
[User clicks menu item]
         |
         v
[HeroSection] navigateTo("experience")
         |
         v
[useHeroTransition]
  1. Calcule totalFrames = Math.round(videoDuration * 30)
  2. Calcule scrubDurationMs = (totalFrames / 30) * 1000 * speedFactor
     speedFactor = 2.0 (2× plus vite que temps réel)
  3. Lance un interval/setTimeout/frame loop
  4. À chaque tick (tous les scrubDurationMs / totalFrames ms) :
     video.currentTime = currentFrame / 30
  5. Quand currentFrame == totalFrames :
     arrête le loop, scroll vers la section
```

---

## 4. Design Détails

### 4.1 Calcul des frames

```typescript
const FPS = 30;
const SPEED_FACTOR = 2.0; // 2× plus vite que temps réel

const totalFrames = Math.round(videoDuration * FPS);
const scrubDurationMs = (totalFrames / FPS) * 1000 / SPEED_FACTOR;
const frameIntervalMs = scrubDurationMs / totalFrames;
```

Exemples :
| Vidéo | Frames total | Durée scrub | Interval entre frames |
|-------|-------------|-------------|----------------------|
| 5s | 150 | 2.5s | ~16.7ms |
| 10s | 300 | 5s | ~16.7ms |
| 15s | 450 | 7.5s | ~16.7ms |

### 4.2 Loop de rendu

Utiliser `requestAnimationFrame` ou `setTimeout` avec le `frameIntervalMs` calculé. `requestAnimationFrame` est préférable pour la synchronisation avec le refresh rate de l'écran.

```typescript
let currentFrame = Math.round(video.currentTime * FPS);
const startTime = performance.now();

const tick = (now: number) => {
  const elapsed = now - startTime;
  const progress = Math.min(1, elapsed / scrubDurationMs);
  const targetFrame = Math.round(progress * totalFrames);
  
  if (targetFrame > currentFrame) {
    currentFrame = targetFrame;
    video.currentTime = currentFrame / FPS;
  }
  
  if (progress < 1) {
    requestAnimationFrame(tick);
  } else {
    // Scrub terminé → scroll vers section
    scrollToSection(sectionId);
  }
};

requestAnimationFrame(tick);
```

### 4.3 Gestion du reduced motion

Si `isReducedMotion`, pas de scrub frame-by-frame. Saut direct à `videoDuration` puis scroll instantané.

### 4.4 Fallback vidéo non prête

Si `!video || videoDuration === 0`, scroll direct vers la section (déjà implémenté).

---

## 5. Accessibilité

- Le menu reste disabled pendant le scrub (`isTransitioning`).
- En reduced motion, transition instantanée.

---

## 6. Dépendances

Aucune. Suppression de GSAP pour cette fonctionnalité (le scrub ne l'utilise plus). GSAP reste dans le projet pour d'autres animations.

---

## 7. Test Plan

- Clic sur EXPÉRIENCE → vidéo scrubbe frame-by-frame à 30fps jusqu'à la fin, puis scroll vers `#experience`.
- Vérifier que le nombre de frames correspond bien à `duration * 30`.
- Reduced motion → saut direct.

---

*Approuvé par :* _______________
