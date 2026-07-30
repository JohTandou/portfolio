import Image from "next/image";

/* BackgroundSection — wrapper de section avec image de fond fixe et overlay directionnel.
   Le contenu se cale du côté sombre de l'image (contentPosition).
   Utilise next/image pour l'optimisation automatique. */

interface BackgroundSectionProps {
  /** ID HTML de la section (navigation, snap points) */
  id: string;
  /** Chemin relatif depuis /public (ex: "/backgrounds/hero.jpg") */
  backgroundImage: string;
  /** Côté où le texte se place — correspond à la zone sombre de l'image */
  contentPosition: "left" | "right";
  /** Use full-width container (max-w-7xl) instead of max-w-2xl. For grids and wide layouts. */
  wideContent?: boolean;
  children: React.ReactNode;
}

export function BackgroundSection({
  id,
  backgroundImage,
  contentPosition,
  wideContent = false,
  children,
}: BackgroundSectionProps) {
  return (
    <section
      id={id}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Fond — image plein écran avec overlay directionnel */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          fill
          className="object-cover object-center"
          priority
          quality={85}
          alt=""
        />
        {/* Overlay gradient — plus sombre côté texte, transparent côté image */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              contentPosition === "right"
                ? "linear-gradient(to right, rgba(10,14,20,0.85) 0%, rgba(10,14,20,0.65) 30%, rgba(10,14,20,0.25) 55%, rgba(10,14,20,0.05) 100%)"
                : "linear-gradient(to left, rgba(10,14,20,0.85) 0%, rgba(10,14,20,0.65) 30%, rgba(10,14,20,0.25) 55%, rgba(10,14,20,0.05) 100%)",
          }}
        />
      </div>

      {/* Contenu — aligné selon contentPosition */}
      <div
        className={`relative z-20 flex min-h-screen items-center ${
          contentPosition === "right" ? "justify-end" : "justify-start"
        } px-6 py-24 md:px-12 lg:px-20`}
      >
        <div className={`w-full ${wideContent ? "max-w-7xl" : "max-w-2xl"}`}>
          <div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
