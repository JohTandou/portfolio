# Design Doc — Hero Cyberpunk 2077 Menu Overlay

**Date :** 2026-05-04  
**Projet :** Portfolio Joh Tandou  
**Scope :** Redesign complet de la couche UI du hero (overlay par-dessus la vidéo/frames). La logique vidéo, le pin scroll et le comportement de scrub restent inchangés.

---

## 1. Contexte

Le portfolio dispose d'un hero immersif :
- Vidéo `hero-video.mp4` en arrière-plan, scrubbée par le scroll (pin scroll via Lenis).
- Première frame = borne d'arcade vue de face dans une salle sombre (sol damassé, écran teal/cyan).
- Le contenu actuel (nom, tagline, CTA scroll) est centré et masque partiellement la borne.

**Objectif** : remplacer ce contenu centré par un menu d'accueil inspiré du menu principal de *Cyberpunk 2077* — latéral, typographie monospace agressive, lignes de séparation jaunes, curseur `>` — tout en préservant la borne d'arcade comme sujet visuel principal.

---

## 2. Objectifs Utilisateur

1. Comprendre immédiatement qu'il s'agit d'un portfolio immersif (narrative "borne d'arcade / entrer dans le jeu").
2. Naviguer vers n'importe quelle section en un clic, avec une transition cinématique (scrub vidéo + scroll).
3. Activer/désactiver le son de la vidéo.
4. Avoir une expérience identique de qualité sur desktop et mobile.

---

## 3. Architecture

### 3.1 Composants

| Composant | Fichier | Responsabilité |
|-----------|---------|----------------|
| `HeroSection` | `app/sections/HeroSection.tsx` | Wrapper sticky. Gère l'état `activeItem`, `isTransitioning`, le layout responsive. |
| `HeroBackground` | `app/components/HeroBackground.tsx` | **Inchangé** dans son apparence. Expose un callback `scrubToProgress(progress: number, onComplete?: () => void)` pour les transitions programmatiques. |
| `HeroMenu` | `app/components/HeroMenu.tsx` | **Nouveau.** Rend le menu CP2077 (items, hover, curseur, animations stagger). |
| `HeroMenuItem` | `app/components/HeroMenuItem.tsx` | **Nouveau.** Un item de menu avec ligne de séparation, hover jaune, curseur clignotant. |
| `HeroAudioToggle` | `app/components/HeroAudioToggle.tsx` | **Nouveau.** Bouton son intégré au menu. |
| `HeroTransitionOverlay` | `app/components/HeroTransitionOverlay.tsx` | **Nouveau.** Flash chromatic aberration + scanline sweep pendant la transition. |

### 3.2 Hooks & Helpers

| Nom | Fichier | Rôle |
|-----|---------|------|
| `useHeroTransition` | `app/hooks/useHeroTransition.ts` | **Nouveau.** Orchestration de la transition : verrouille les inputs, scrub la vidéo, déclenche Lenis, gère le `isTransitioning`. |
| `VIDEO_TARGETS` | `app/lib/constants.ts` | Mapping `sectionId -> ratio vidéo (0..1)`. |

### 3.3 Providers impactés

- `AudioProvider` : réutilisé tel quel pour le toggle son.
- `ReducedMotionProvider` : si `isReducedMotion`, les transitions sont instantanées (pas de scrub animé).

---

## 4. Data Flow

```
[User clicks HeroMenuItem]
         |
         v
[HeroSection] setIsTransitioning(true)
         |
         v
[HeroTransitionOverlay] Mount → flash chromatic aberration (200 ms)
         |
         v
[useHeroTransition] -> scrubToProgress(targetRatio)
         |                  GSAP / rAF anime video.currentTime
         |                  de currentTime vers targetRatio * duration
         |                  durée : 600 ms, easing : power2.inOut
         v
[HeroBackground] video.currentTime = target
         |
         v
[onComplete] Lenis.scrollTo(sectionElement, { offset: 0 })
         |
         v
[HeroSection] setIsTransitioning(false)
```

### 4.1 Gestion du conflit scroll

Pendant `isTransitioning === true` :
- `HeroBackground` ignore les événements `wheel` (early return).
- Lenis est temporairement stoppé pendant le scrub vidéo, puis redémarré pour le scrollTo.
- Un `pointer-events-none` global peut être appliqué sur le body via un hook pour éviter les double-clics.

---

## 5. Responsive Strategy

### 5.1 Desktop (≥768 px)

- **Menu** : positionné en `absolute`, `left: 2rem`, `bottom: 15vh`.
- **Alignement** : aligné à gauche de la borne. La borne reste centrée horizontalement.
- **Taille** : largeur max `320px`. Le menu ne dépasse jamais sur le tiers central de l'écran.
- **Style** : fond `rgba(10, 14, 20, 0.6)` + `backdrop-filter: blur(8px)` très subtil. Pas de bordure arrondie — angles droits pour l'esthétique CP2077.

### 5.2 Mobile (<768 px)

- **Menu** : positionné en `absolute`, `bottom: 1.5rem`, `left: 0`, `right: 0`, `padding: 0 1rem`.
- **Alignement** : pleine largeur, items centrés ou alignés gauche selon lisibilité.
- **Taille** : hauteur max `45vh` pour ne pas masquer l'écran de la borne.
- **Scroll interne** : si les items dépassent, `overflow-y: auto` avec scrollbar masquée.
- **Item principal** : `> CONTINUER` est plus grand (font-size `1.5rem` vs `1rem` pour les autres).

---

## 6. Design Détails

### 6.1 Palette & Typographie

- **Titres / Labels** : `font-family: var(--font-terminal)` (VT323) pour l'authenticité CP2077.
- **Item principal** : `font-family: var(--font-display)` (Rajdhani) en `uppercase`, `letter-spacing: 0.1em`.
- **Couleur inactive** : `var(--color-text-high)` (`#E6E6E6`).
- **Couleur hover** : fond `var(--color-primary)` (`#FCEE0A`), texte `var(--color-bg-deep)` (`#0A0E14`).
- **Lignes de séparation** : `1px solid var(--color-primary)` au-dessus de chaque item (sauf le premier).
- **Curseur** : caractère `>` en `var(--color-accent-1)` (`#00F0FF`) clignotant (`blink` keyframe, 1s) sur l'item actif/focus.

### 6.2 États des items

| État | Style |
|------|-------|
| Default | Texte `#E6E6E6`, fond transparent. |
| Hover | Fond `#FCEE0A`, texte `#0A0E14`. La ligne de séparation au-dessus s'étend en largeur (scaleX 0→1). Transition `cubic-bezier(0.22, 1, 0.36, 1)`, 300 ms. |
| Active/Focused | Curseur `>` visible à gauche. |
| Disabled (transition en cours) | `opacity: 0.4`, `pointer-events: none`. |

### 6.3 Animation d'apparition (mount)

- Stagger des items : `delay = index * 80 ms`.
- Entrée : `translateY(20px) opacity(0)` → `translateY(0) opacity(1)`.
- Durée : `400 ms`.
- Easing : `cubic-bezier(0.22, 1, 0.36, 1)`.
- En reduced motion : pas d'animation, apparition instantanée.

### 6.4 Transition au clic

1. **Flash** : overlay plein écran avec `mix-blend-mode: screen` et `text-shadow` chromatique (rouge + cyan). Durée `200 ms`.
2. **Scanline sweep** : barre horizontale `#FCEE0A` de `0%` à `100%` en `300 ms`.
3. **Scrub vidéo** : la vidéo accélère vers le timestamp cible en `600 ms`.
4. **Scroll page** : Lenis prend le relais et glisse vers la section cible.

En reduced motion : pas de flash ni de scanline. Scrub instantané (définit `currentTime` directement), puis `scrollTo` standard.

---

## 7. Mapping Vidéo → Sections

Ajout dans `app/lib/constants.ts` :

```ts
export const VIDEO_TARGETS: Record<string, number> = {
  continue: 0.05,   // léger début de mouvement, puis scroll libre
  identity: 0.15,
  experience: 0.30,
  "tech-arsenal": 0.45,
  "human-protocols": 0.52,
  missions: 0.60,
  languages: 0.68,
  interests: 0.74,
  roadmap: 0.78,
  contact: 0.85,
};
```

- `continue` : débloque le scroll (même comportement que l'actuel "faire défiler").
- Les autres : scrub jusqu'au ratio, puis Lenis.scrollTo(`#${sectionId}`).

---

## 8. Comportement Son

- La vidéo reste `muted` par défaut (obligation navigateur).
- Le bouton son dans le menu toggle `video.muted` ET l'état global `AudioProvider`.
- Icône : `Volume2` (lucide-react) si son actif, `VolumeX` si muté.
- Label : "SON" / "MUET" en VT323.
- Position : dans le menu, en bas de la liste ou dans un coin (à discuter en implémentation).

---

## 9. Accessibilité

- **Navigation clavier** : le menu est une `<nav role="navigation" aria-label="Menu principal">`. Chaque item est un `<button>` (pas de `<a>` car action JS).
- **Focus** : styles `focus-visible` cohérents avec le reste du site (outline cyan).
- **Reduced motion** : respect strict. Pas de flash, pas de stagger, pas de scrub animé.
- **ARIA** : `aria-live="polite"` sur une zone invisible pour annoncer "Transition vers [Section]".
- **Contraste** : fond jaune sur texte noir au hover → ratio WCAG AAA. Texte gris sur fond noir par défaut → ratio WCAG AA.

---

## 10. Dépendances

- Aucune nouvelle dépendance.
- GSAP est déjà dans le projet (`gsap`, `@gsap/react` vérifiés via `package.json`). Utilisé pour le scrub programmatique de la vidéo (plus fluide qu'un rAF manuel).
- `framer-motion` est déjà utilisé dans le projet pour les animations de section. Réutilisé pour le stagger du menu.

---

## 11. Risques & Mitigations

| Risque | Mitigation |
|--------|------------|
| Scrub programmatique + scroll utilisateur simultané | `isTransitioning` verrouille tous les inputs pendant 600 ms. |
| GSAP pas installé | Vérifier dans `package.json`. Sinon, fallback rAF. |
| Menu masque la borne sur mobile | Menu bottom à 45vh max, fond très transparent, pas de box-shadow lourd. |
| Performance du backdrop-blur sur mobile | Valeur faible (`8px`), appliquée sur un conteneur petit (menu), pas sur l'écran entier. |
| Vidéo non chargée au clic | `HeroBackground` gère `isReady`. Le menu est masqué (`opacity: 0`, `pointer-events: none`) tant que `!isReady`. |

---

## 12. Test Plan (brouillon)

- **Desktop** : menu visible à gauche, hover jaune, clic sur "Expérience" → flash + scrub + scroll vers `#experience`.
- **Mobile** : menu visible en bas, clic sur "Continuer" → débloque le scroll natif.
- **Reduced motion** : pas de flash, transition instantanée.
- **Keyboard** : Tab traverse les items, Enter déclenche la transition.
- **Son** : clic sur toggle son → vidéo.muted change.

---

## 13. Out of Scope

- Refonte de `HeroBackground` (hors ajout du callback `scrubToProgress`).
- Ajout de nouvelles sections.
- Modification de la navigation fixe existante (`Navigation.tsx`).
- Changement de la vidéo ou de ses frames.

---

*Approuvé par :* _______________  
*Date d'approbation :* _______________
