import Image from "next/image";
import { RainOverlay } from "./RainOverlay";
import { useSectionActivity } from "../hooks/useSectionActivity";
import { useReducedMotion } from "../providers/ReducedMotionProvider";

/* BackgroundSection — wrapper de section avec image de fond et overlay directionnel.
   Les sections s'adaptent à leur contenu (pas de hauteur fixe).

   backgroundFit:
   - "cover" (défaut) : image recadrée 16:9 desktop, plein écran mobile — préservé pour les autres sections.
   - "contain" : image entièrement visible sans rognage, fond var(--color-bg-deep) autour.

   desktopAspectRatio:
   - Si défini (ex: "16 / 9"), la section adopte ce ratio natif à partir de md.
   - L'image de fond est rendue en cover dans un conteneur de même ratio → aucun crop si l'image source a le même ratio.
   - Le contenu s'inscrit dans la section contrainte (overflow masqué si nécessaire). */

interface BackgroundSectionProps {
  id: string;
  backgroundImage: string;
  contentPosition: "left" | "right" | "center";
  wideContent?: boolean;
  /** CSS object-position for the background image. Default: "center center" */
  backgroundPosition?: string;
  /** Rendering mode for the background image. "cover" crops to fill, "contain" shows the full image. Default: "cover" */
  backgroundFit?: "cover" | "contain";
  /** Optionally force the section to a native aspect ratio on desktop (e.g. "16 / 9").
   *  The background renders cover inside a same-ratio box → zero crop when source matches. */
  desktopAspectRatio?: string;
  children: React.ReactNode;
}

/* ── Micro-composants internes ─────────────────────────────────── */

const SCANLINE_CSS = {
  backgroundImage:
    "repeating-linear-gradient(to bottom, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
  opacity: 0.5,
} as const;

function Scanlines() {
  return (
    <div
      className="absolute inset-0 z-[5] pointer-events-none"
      style={SCANLINE_CSS}
      aria-hidden="true"
    />
  );
}

const OVERLAY_BY_POSITION = {
  left: "linear-gradient(to left, rgba(10,14,20,0.85) 0%, rgba(10,14,20,0.65) 30%, rgba(10,14,20,0.25) 55%, rgba(10,14,20,0.05) 100%)",
  right:
    "linear-gradient(to right, rgba(10,14,20,0.85) 0%, rgba(10,14,20,0.65) 30%, rgba(10,14,20,0.25) 55%, rgba(10,14,20,0.05) 100%)",
  center:
    "radial-gradient(ellipse at center, rgba(10,14,20,0.85) 0%, rgba(10,14,20,0.55) 40%, rgba(10,14,20,0.15) 100%)",
} as const;

function Overlay({ contentPosition }: { contentPosition: "left" | "right" | "center" }) {
  return (
    <div
      className="absolute inset-0 z-10"
      style={{ background: OVERLAY_BY_POSITION[contentPosition] }}
    />
  );
}

/* ── Composant principal ───────────────────────────────────────── */

export function BackgroundSection({
  id,
  backgroundImage,
  contentPosition,
  wideContent = false,
  backgroundPosition = "center center",
  backgroundFit = "cover",
  desktopAspectRatio,
  children,
}: BackgroundSectionProps) {
  const isContain = backgroundFit === "contain";
  const desktopRatio = desktopAspectRatio?.replace(/\s*\/\s*/, "/"); // "16 / 9" → "16/9"

  /* Activité de section (visible + onglet actif) — pour RainOverlay */
  const { isActive } = useSectionActivity({ sectionId: id, threshold: 0 });
  const { isReducedMotion } = useReducedMotion();

  return (
    <section
      id={id}
      className="relative w-full"
      style={isContain ? { backgroundColor: "var(--color-bg-deep)" } : undefined}
    >
      {/* ── Style tag : force le ratio natif desktop sans modifier les autres sections ── */}
      {desktopRatio && (
        <style>{`@media(min-width:768px){#${id}{aspect-ratio:${desktopRatio}}}`}</style>
      )}

      {/* ── Fond : image → pluie → scanlines → overlay directionnel ── */}
      <div className={`absolute inset-0 z-0 ${!isContain ? "overflow-hidden" : ""}`}>
        {isContain ? (
          /* ── CONTAIN : image entière sans rognage, fond noir autour ── */
          <Image
            src={backgroundImage}
            fill
            className="object-contain"
            style={{ objectPosition: "top center" }}
            priority
            quality={90}
            alt=""
            sizes="100vw"
          />
        ) : (
          /* ── COVER : comportement existant (mobile plein écran, desktop 16:9) ── */
          <>
            {/* Mobile : image plein écran, centrée */}
            <div className="absolute inset-0 md:hidden">
              <Image
                src={backgroundImage}
                fill
                className="object-cover"
                style={{ objectPosition: "center center" }}
                priority
                quality={90}
                alt=""
                sizes="100vw"
              />
            </div>
            {/* Desktop : image au ratio configurable (défaut 16:9), position configurable */}
            <div className="hidden md:flex h-full w-full items-center justify-center">
              <div className="relative w-full" style={{ aspectRatio: desktopRatio || "16 / 9" }}>
                <Image
                  src={backgroundImage}
                  fill
                  className="object-cover"
                  style={{ objectPosition: backgroundPosition }}
                  priority
                  quality={90}
                  alt=""
                  sizes="100vw"
                />
              </div>
            </div>
          </>
        )}

        {/* ── Atmosphère : pluie (z-[3]) ── */}
        <RainOverlay sectionId={id} isActive={isActive} isReducedMotion={isReducedMotion} />

        {/* ── Scanlines (z-[5]) ── */}
        <Scanlines />

        {/* ── Overlay directionnel (z-10) — au-dessus de tout le fond ── */}
        <Overlay contentPosition={contentPosition} />
      </div>

      {/* ── Contenu (z-20) ── */}
      <div
        className={`relative z-20 flex items-center ${
          contentPosition === "right" ? "justify-end" : contentPosition === "center" ? "justify-center" : "justify-start"
        } px-6 py-12 md:px-12 lg:px-20`}
      >
        <div className={`w-full ${wideContent ? "max-w-7xl" : "max-w-2xl"}`}>
          {children}
        </div>
      </div>
    </section>
  );
}
