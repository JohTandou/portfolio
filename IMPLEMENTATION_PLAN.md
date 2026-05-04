# PLAN D'IMPLÉMENTATION — PORTFOLIO JOH TANDOU

> Généré par Agent Swarm Orchestrator
> Date : 2026-05-01
> Statut : PRÊT POUR KICKOFF (en attente GO utilisateur)

---

## RÉCAPITULATIF DES CHOIX VALIDÉS

| Choix | Décision |
|---|---|
| **Typographie** | Rajdhani (titres) + Satoshi (corps) + JetBrains Mono (UI/labels) + VT323 (glitch/terminal) |
| **Vidéo Hero** | Fournie par l'utilisateur (`video.MOV` à la racine). Pipeline de compression AV1/HEVC/H.264 + poster WebP. Fallback poster statique en attendant le traitement. |
| **Avatar 3D v1** | Option C : sculpture abstraite wireframe + particules (R3F). Fallback image statique sur mobile/low-end. |
| **Contenu placeholder** | Placeholders réalistes pour débloquer les sprints. Remplacement par données réelles en cours de route. |
| **Palette** | Cyberpunk 2077 calibrée web (§2.1 PROPOSITION_VALEUR) |
| **Stack** | Next.js 15 App Router + React 19 + TypeScript 5.5+ + Tailwind CSS 4 + GSAP 3.12 + Lenis + Framer Motion + R3F + Howler |
| **Déploiement** | Vercel (Edge runtime pour /api/contact) |

---

## ARCHITECTURE DES SPRINTS

### SPRINT 0 — FONDATIONS & ARCHITECTURE
**Route Swarm :** FULL (search → contract → back)
**Durée estimée :** 1 jour

**Objectif** : Repo stable, design system tokenisé, layout global, smooth scroll actif.

**Livrables :**
- Next.js 15 App Router scaffoldé (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`)
- Tailwind config v4 avec custom properties cyberpunk (palette §2.1, spacing scale 4px/8px)
- Fonts via `next/font` : Rajdhani + Satoshi + JetBrains Mono (VT323 en lazy)
- Providers globaux : Lenis smooth scroll, `ReducedMotionContext`, `AudioContext`
- Structure dossiers : `sections/`, `components/`, `hooks/`, `lib/`, `types/`, `public/assets/`
- Composants shell vides : `<BootSequence />`, `<Hero />`, `<Identity />`, `<ExperienceLog />`, `<TechArsenal />`, `<HumanProtocols />`, `<MissionsArchive />`, `<LanguageModules />`, `<InterestFeed />`, `<FutureRoadmap />`, `<ContactTerminal />`, `<Footer />`
- Scanlines overlay global (SVG pattern fixed, 5% opacity)
- Navigation fixed glassmorphism (shell vide)

**Validation** : `npm run dev` passe. Layout sans contenu affiche la palette + fonts correctes. Smooth scroll actif.

**Dépendances** : Aucune (premier sprint).

---

### SPRINT 1 — BOOT SEQUENCE + HERO
**Route Swarm :** MEDIUM (front)
**Durée estimée :** 2-3 jours

**Objectif** : Première impression cinématique. Le recruteur doit s'arrêter.

**Livrables :**
- `BootSequence` : Terminal typewriter 1.5s, skip on click, localStorage `visited=true`
- `Navigation` : Fixed glassmorphism, sound toggle (mute par défaut), CV download, scroll-to-section anchors
- `HeroSection` :
  - Vidéo BG autoplay muted loop playsinline (ou poster statique temporaire)
  - Overlay grille SVG cyan 8% + scanlines + vignette radiale noire 40%
  - Nom "JOH TANDOU" en text scramble reveal (800ms, GSAP)
  - HUD corners `╔ ╗ ╚ ╝` SVG stroke-dashoffset (600ms)
  - Tagline + meta ("> full-stack", "> 2 yrs xp", "> paris.fr")
  - "↓ SCROLL TO ENGAGE" pulse cyan (boucle 2s)
  - Chromatic aberration pulse (200ms) au premier scroll
- `Footer` minimal (crédits, version, easter egg stub)

**Animations clés :**
- Text scramble sur le nom
- Stroke draw HUD corners
- Pulse scroll indicator
- Chromatic aberration au premier scroll

**Validation** : Premier scroll fluide. Skip boot fonctionnel. Vidéo/poster s'affiche. HUD corners se dessinent.

**Dépendances** : Sprint 0.

---

### SPRINT 2 — SECTIONS STATIQUES
**Route Swarm :** MEDIUM (front)
**Durée estimée :** 3-4 jours

**Objectif** : 60% du contenu scrollable sans interaction lourde.

**Livrables :**
- `IdentitySection` :
  - Layout 50/50 desktop, sticky left pane
  - Avatar placeholder (cercle stylisé ou image statique, 3D en v2)
  - Bio courte + stats RPG (DATASETS_HANDLED, APPS_DEPLOYED, USERS_SUPPORTED, COFFEES_PER_DAY)
  - HUD frame
- `TechArsenalSection` :
  - Grille `grid-cols-6` desktop (4 mobile)
  - Catégories : LANGAGES, FRAMEWORKS, LIBS, DATA, CLOUD, METHODS, AI
  - Animation scroll : grayscale 1 → couleur native + glow cyan, stagger 40ms
  - Tooltip terminal-style au hover
- `HumanProtocolsSection` :
  - 5 protocoles (ADAPTABILITY, COMMUNICATION, RIGUEUR, AUTONOMIE PRODUIT, CURIOSITÉ TECH)
  - Apparition typewriter ligne par ligne (Framer Motion stagger)
  - `▸` clignotant cyan pendant la frappe
- `LanguageModulesSection` :
  - 3 modules empilés : FR (native), EN (C1), ES (B1)
  - Effet boot scan vertical cyan (400ms) à l'apparition
  - Barres de fluency qui se remplissent en stagger (1s)
  - Hover pulse magenta
- `InterestFeedSection` :
  - Fiche netrunner : TENNIS/PADEL, BEATMAKING, PHOTOGRAPHIE/VIDÉO
  - Baseline poétique au hover
  - 3 polaroids/screenshots en arrière-plan (blend overlay 30%)

**Placeholders à remplacer plus tard :**
- Soft skills (5 axes inférés du CV)
- Projets académiques (2 fiches)
- Projet bible AI (nom, pitch, stack)
- Année séjour Montréal

**Validation** : Toutes les sections s'affichent au scroll. Animations stagger fonctionnelles. Tooltips au hover. Grayscale → couleur au scroll.

**Dépendances** : Sprint 1.

---

### SPRINT 3 — SECTIONS COMPLEXES
**Route Swarm :** FULL (front)
**Durée estimée :** 3-4 jours

**Objectif** : Coeur narratif — l'expérience et les projets.

**Livrables :**
- `ExperienceLogSection` :
  - Timeline horizontale sticky (GSAP ScrollTrigger pin)
  - 5 cartes holographiques (chronologie inverse : Talan SNCF → Talan R&D → Hardis React/Python → Hardis Java Mobile → Digit-R Xamarin)
  - Anatomie carte : logo, poste, dates, mission, impact (5+ bullets), stack tags
  - Effets : border glow cyan, HUD corners animés, chromatic aberration logo au hover, scanlines carte, stack tags stagger 80ms
  - Progression dots en bas `[01/05] ─────●──○──○──○──○─────`
  - **Fallback mobile** : scroll vertical classique (pas de pinning sur <768px)
- `MissionsArchiveSection` :
  - Carrousel 3D horizontal (cards `transform: rotateY` légère)
  - Fiche centrale en focus, adjacentes inclinées en perspective
  - Structure briefing : MISSION_ID, CODENAME, CLASS, TIMELINE, BRIEFING, OBJECTIVES COMPLETED, ARSENAL DEPLOYED, ACCESS (Live Demo, GitHub, Case Study)
  - Navigation scroll horizontal snap + flèches HUD
  - Missions : #001 TOPSEEKER (shipped), #002 BIBLE_AI (in progress), #003 ACADEMIC_1, #004 ACADEMIC_2 (placeholders)
- `FutureRoadmapSection` :
  - Timeline horizontale néon cyan qui se trace au scroll (GSAP path drawing)
  - 4 checkpoints : NOW (CDI Talan + side projects), NEXT MISSION (CDI grand groupe non-ESN IDF), MID-TERM (projects scaling), LONG HORIZON (relocation CH)
  - Checkpoints cliquables → mini-modale avec manifeste
  - **Fallback mobile** : timeline verticale simplifiée

**Risques identifiés :**
- GSAP ScrollTrigger pin capricieux sur mobile → fallback obligatoire
- Carrousel 3D : clipping potentiel sur certains viewports → testé sur 1024px+

**Validation** : Pinning fluide desktop. Carrousel 3D sans clipping. Modales accessibles (focus trap, Escape pour fermer). Path drawing au scroll.

**Dépendances** : Sprint 2.

---

### SPRINT 4 — 3D, AUDIO, INTERACTIONS AVANCÉES
**Route Swarm :** MEDIUM (front)
**Durée estimée :** 2 jours

**Objectif** : "Wow factor" et polish émotionnel.

**Livrables :**
- `Avatar3D` (IdentitySection) :
  - Option C : wireframe sphere + particules flottantes
  - Lumières dynamiques cyan/jaune
  - Rotation lente réagissant au scroll (rotation Y liée à scroll position)
  - Lazy-load via `<Suspense>` avec fallback image statique
  - Post-processing bloom subtil
  - **Fallback** : désactivé sur mobile (<768px) et si WebGL indisponible
- `AudioManager` :
  - Howler.js, 5 samples (<300ms chacun, -18dB par défaut)
  - Samples : hover.wav, select.wav, glitch.wav, terminal.wav, whoosh.wav
  - Mute persistant localStorage (mute par défaut au premier visit)
  - Toggle UI en haut à droite (icône speaker stylisée)
  - **Gestion AudioContext** : débloqué uniquement au premier clic/scroll (policy navigateur)
- `MagneticCursor` :
  - Sur CTA principaux et photos
  - Framer Motion + lerp (facteur 0.15)
- `KonamiEasterEgg` :
  - Séquence ↑↑↓↓←→←→BA
  - Déclenche glitch total UI (2s) : chromatic aberration max, scanlines intensifiées, inversion couleurs
  - Puis affiche console interactive type CTF (mini-jeu de code)
- Polish global :
  - Hover states premium (scale 1.02-1.05, ombre étendue, luminosité)
  - `:active` scale(0.97) + transition 100ms sur boutons
  - Grain noise overlay (opacity 0.03, canvas Perlin très lent)
  - Chromatic aberration sur images au hover
  - Bordures lumineuses dégradées sur cartes importantes

**Validation** : Avatar s'affiche et tourne. Son se déclenche sur interaction après déblocage AudioContext. Easter egg fonctionnel. Pas de régression perf (bundle <180KB gzippé hors 3D).

**Dépendances** : Sprint 3.

---

### SPRINT 5 — CONTACT, API, SEO
**Route Swarm :** FULL (back + front)
**Durée estimée :** 2 jours

**Objectif** : Convertir le visiteur en lead.

**Livrables :**
- API `/api/contact` (Edge function Vercel) :
  - Méthode POST uniquement
  - Validation Zod (name, email, company, message)
  - Honeypot field (bot detection)
  - Rate limiting Upstash Redis (5 requêtes/minute/IP)
  - Envoi email via Resend.com (free tier 100/jour)
  - Réponse JSON structurée
- `ContactTerminalSection` :
  - Design terminal : `ESTABLISH_CONNECTION`
  - Champs : NAME, EMAIL, COMPANY, PAYLOAD (textarea)
  - React Hook Form + Zod validation client
  - États : default, loading, error, success
  - Confirmation visuelle : `> TRANSMISSION SUCCESSFUL · ETA REPLY: 24H`
  - Lien direct CV download (`/cv_joh_tandou_2026.pdf`)
  - Direct channels : Email, Phone, LinkedIn, GitHub, Malt (URLs à confirmer)
- SEO complet :
  - `<title>` : "Joh Tandou · Software Engineer Full-Stack · Portfolio"
  - Meta description (150 chars, mots-clés recrutement)
  - OpenGraph + Twitter Card (1200x630)
  - JSON-LD `Person` schema (jobTitle, address, alumniOf, knowsLanguage, knowsAbout)
  - Sitemap.xml généré statiquement
  - robots.txt
  - PWA minimal : manifest.json

**Validation** : Envoi d'email réussi end-to-end. Rate limit testé (6ème requête rejetée). Lighthouse SEO ≥ 90.

**Dépendances** : Sprint 4.

---

### SPRINT 6 — POLISH, PERFORMANCE, QA, DEPLOY
**Route Swarm :** FULL (tester + reviewer + writer)
**Durée estimée :** 2-3 jours

**Objectif** : Production-ready.

**Livrables :**
- **Performance** :
  - Vidéo : compression AV1 (Chrome) + H.265 (Safari) + H.264 (fallback), 1280x720 max, bitrate 1.5Mbps, poster WebP
  - Bundle analyse `next build` : cible <180KB JS initial gzippé
  - Lazy load sections below-fold (`next/dynamic`)
  - GSAP import modulaire (pas le bundle complet)
  - Three.js : texture compression KTX2 si applicable, mesh <10k tris
  - Audio : OGG + MP3 fallback, lazy load après interaction
- **Responsive** :
  - Desktop : 1024px → 2560px
  - Mobile (<768px) : version simplifiée, pas de pinning, pas de 3D, animations CSS only
  - Tablette : 768px-1024px (layout adapté)
  - Touch targets ≥44x44px
- **Accessibilité** :
  - `prefers-reduced-motion` : désactive parallax, scrub, glitch, 3D. Animations basiques uniquement.
  - Toggle "REDUCE EFFECTS" dans la nav
  - Focus visible custom (ring cyan 2px)
  - Skip-to-content link
  - Semantic HTML (`<main>`, `<section>`, `<nav>`, `<article>`, `<form>`)
  - ARIA labels sur éléments interactifs custom
  - Contrastes WCAG AA minimum
- **Cross-browser** : Chrome, Firefox, Safari, Edge (dernières 2 versions)
- **Lighthouse audit** :
  - Performance ≥ 85
  - Accessibilité ≥ 90
  - Best Practices ≥ 90
  - SEO ≥ 90
- **Documentation** :
  - README.md : captures, stack, run instructions, lien live
  - Commentaires inline (pourquoi, pas quoi)
- **Git** : commit propre, repo public propre
- **Déploiement** : Vercel production

**Validation** : Lighthouse audit PASS. Reviewer APPROVE. Git commit + push. Vercel deploy OK.

**Dépendances** : Sprint 5.

---

## RISQUES & MITIGATIONS

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Vidéo hero alourdit LCP | Élevée | Fort | Compression agressive + poster WebP + `preload="metadata"` + fallback poster statique |
| Mobile UX dégradée (scroll-driven) | Élevée | Moyen | Version mobile simplifiée : pas de pinning, pas de 3D, animations CSS only |
| Effets glitch perçus "kitsch" | Moyenne | Moyen | Doser fin. Sections sérieuses (XP, contact) plus sobres. Toggle reduce effects |
| Three.js plante sur vieux GPU | Faible | Faible | Fallback statique image avatar. Désactivé sur mobile |
| Form spam | Moyenne | Faible | Honeypot + rate limit Redis + validation Zod stricte |
| Coût Resend dépassé | Très faible | Faible | Free tier = 100/jour, suffit largement pour un portfolio |
| React 19 incompatibilités libs | Moyenne | Moyen | Sprint 0 de validation (Lenis, GSAP, R3F, Framer Motion) |
| Bundle JS > 180KB | Moyenne | Moyen | Code splitting par section, lazy load 3D/audio, import modulaire GSAP |

---

## STRUCTURE DE REPOSITORY PRÉVUE

```
portfolio/
├── app/
│   ├── layout.tsx              # Root layout, providers, fonts
│   ├── page.tsx                # Single page, composition sections
│   ├── globals.css             # Tailwind imports, custom properties, scanlines
│   ├── api/
│   │   └── contact/
│   │       └── route.ts        # Edge function POST /api/contact
│   ├── sections/               # 12 sections = 12 fichiers
│   │   ├── BootSequence.tsx
│   │   ├── HeroSection.tsx
│   │   ├── IdentitySection.tsx
│   │   ├── ExperienceLogSection.tsx
│   │   ├── TechArsenalSection.tsx
│   │   ├── HumanProtocolsSection.tsx
│   │   ├── MissionsArchiveSection.tsx
│   │   ├── LanguageModulesSection.tsx
│   │   ├── InterestFeedSection.tsx
│   │   ├── FutureRoadmapSection.tsx
│   │   ├── ContactTerminalSection.tsx
│   │   └── FooterSection.tsx
│   ├── components/             # Composants réutilisables
│   │   ├── Navigation.tsx
│   │   ├── ScanlinesOverlay.tsx
│   │   ├── HudCorners.tsx
│   │   ├── TextScramble.tsx
│   │   ├── GlitchEffect.tsx
│   │   ├── MagneticButton.tsx
│   │   ├── AudioManager.tsx
│   │   ├── Avatar3D.tsx
│   │   ├── KonamiEasterEgg.tsx
│   │   ├── SectionWrapper.tsx
│   │   ├── TechIcon.tsx
│   │   ├── MissionCard.tsx
│   │   ├── ExperienceCard.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useLenis.ts
│   │   ├── useScrollProgress.ts
│   │   ├── useReducedMotion.ts
│   │   ├── useAudio.ts
│   │   ├── useKonamiCode.ts
│   │   └── useInView.ts
│   ├── lib/
│   │   ├── utils.ts            # cn() helper, etc.
│   │   ├── constants.ts        # Données sections (XP, projets, skills)
│   │   └── schemas.ts          # Zod schemas (contact form)
│   ├── types/
│   │   └── index.ts            # Types TypeScript partagés
│   └── providers/
│       ├── LenisProvider.tsx
│       ├── ReducedMotionProvider.tsx
│       └── AudioProvider.tsx
├── public/
│   ├── assets/
│   │   ├── video/
│   │   │   ├── hero-av1.mp4
│   │   │   ├── hero-hevc.mp4
│   │   │   ├── hero-h264.mp4
│   │   │   └── hero-poster.webp
│   │   ├── audio/
│   │   │   ├── hover.ogg
│   │   │   ├── select.ogg
│   │   │   ├── glitch.ogg
│   │   │   ├── terminal.ogg
│   │   │   └── whoosh.ogg
│   │   ├── images/
│   │   │   ├── avatar-fallback.webp
│   │   │   ├── og-image.jpg
│   │   │   └── polaroids/
│   │   └── cv/
│   │       └── cv_joh_tandou_2026.pdf
│   ├── favicon.ico
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── package.json
├── .env.local.example
├── .eslintrc.json
├── .prettierrc
└── README.md
```

---

## CONVENTIONS DE CODE

- **Langue UI** : Français (tout texte visible)
- **Langue code** : Anglais (variables, fonctions, fichiers, commentaires)
- **Commentaires** : En français, expliquent le POURQUOI, jamais le QUOI
- **Composants** : 1 responsabilité = 1 composant. Séparer affichage et logique métier.
- **Styling** : Tailwind pour 90%, CSS Modules pour effets complexes (shaders, keyframes custom)
- **Animation** : GSAP pour timelines complexes (pinning, scrub), Framer Motion pour micro-interactions React, CSS transitions pour hover states
- **Données** : Centralisées dans `lib/constants.ts` (facile à remplacer par API plus tard)
- **Images** : Format WebP/AVIF, lazy load sauf hero, alt texts descriptifs

---

## CHECKLIST PRE-DEPLOY

- [ ] Lighthouse Desktop : Performance ≥ 85, A11y ≥ 90, BP ≥ 90, SEO ≥ 90
- [ ] Lighthouse Mobile : Performance ≥ 60 (mobile est plus permissif avec le scroll-driven)
- [ ] Vidéo hero compressée et fallback poster OK
- [ ] Avatar 3D fallback statique fonctionnel
- [ ] Audio mute par défaut, toggle persistant
- [ ] Reduced motion : toutes les animations degradent proprement
- [ ] Form contact : honeypot + rate limit + email reçu
- [ ] Sitemap + robots + OG + JSON-LD en place
- [ ] Responsive testé : 320px, 768px, 1024px, 1440px, 2560px
- [ ] Cross-browser : Chrome, Firefox, Safari, Edge
- [ ] Konami code easter egg fonctionnel
- [ ] Pas de `console.log` en production
- [ ] Pas de `TODO` sans issue
- [ ] README complet avec captures et instructions
- [ ] Git commit propre avec message conventionnel
- [ ] Vercel deploy OK (preview + production)

---

*Plan généré par l'Orchestrateur Agent Swarm — Version 1.0*
*À activer avec le GO de l'utilisateur*
