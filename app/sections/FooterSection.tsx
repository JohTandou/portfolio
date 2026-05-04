"use client";

/* Pied de page avec crédits, liens et easter egg caché */
export function FooterSection() {
  const handleEasterEgg = () => {
    /* Stub pour le Konami code du Sprint 4 */
    // eslint-disable-next-line no-console
    console.log("EASTER_EGG_DETECTED");
  };

  return (
    <footer
      id="footer"
      className="relative flex flex-col items-center justify-center bg-[var(--color-bg-elevated)] px-6"
      style={{ paddingTop: "clamp(80px, 10vh, 120px)", paddingBottom: "clamp(80px, 10vh, 120px)" }}
    >
      <div className="flex w-full max-w-5xl flex-col items-center gap-8">
        {/* Ligne supérieure : nom */}
        <p className="font-display text-4xl font-bold tracking-tighter text-[var(--color-text-dim)] sm:text-5xl md:text-6xl">
          JOH TANDOU
        </p>

        {/* Ligne du milieu : crédits */}
        <p className="font-mono text-xs text-[var(--color-text-dim)]">
          © 2026 — Conçu et développé par Joh Tandou
        </p>

        {/* Liens directs */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="mailto:joh@tandou.dev"
            className="group relative font-mono text-xs tracking-widest text-[var(--color-text-dim)] hover:text-[var(--color-accent-1)] transition-colors duration-300"
          >
            EMAIL
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent-1)] transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group relative font-mono text-xs tracking-widest text-[var(--color-text-dim)] hover:text-[var(--color-accent-1)] transition-colors duration-300"
          >
            LINKEDIN
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent-1)] transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group relative font-mono text-xs tracking-widest text-[var(--color-text-dim)] hover:text-[var(--color-accent-1)] transition-colors duration-300"
          >
            GITHUB
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent-1)] transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="group relative font-mono text-xs tracking-widest text-[var(--color-text-dim)] hover:text-[var(--color-accent-1)] transition-colors duration-300"
          >
            MALT
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-accent-1)] transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </div>

        {/* Ligne du bas : version du site */}
        <p className="font-terminal text-sm text-[var(--color-text-dim)]">
          v2.0.0 · BUILD 2026.05.01
        </p>
      </div>

      {/* Easter egg : point cyan discret dans le coin inférieur droit */}
      <button
        onClick={handleEasterEgg}
        className="absolute bottom-4 right-4 h-1 w-1 rounded-full bg-[var(--color-accent-1)] opacity-40 hover:opacity-100 transition-opacity duration-300"
        aria-label="Easter egg"
        title="?"
      />
    </footer>
  );
}
