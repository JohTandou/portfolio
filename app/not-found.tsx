import Link from "next/link";

/* Page 404 cyberpunk — plein écran avec scanline et grain */
export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg-deep)] px-6 text-center">
      <h1 className="font-terminal text-6xl text-[var(--color-primary)] md:text-8xl">
        404 — SECTEUR NON TROUVÉ
      </h1>
      <p className="mt-6 max-w-md font-body text-lg text-[var(--color-text-high)]">
        Les coordonnées que vous avez saisies ne correspondent à aucun secteur connu.
      </p>
      <Link
        href="/"
        className="group relative mt-10 border border-[var(--color-accent-1)] bg-transparent px-8 py-3 font-terminal text-lg tracking-widest text-[var(--color-accent-1)] transition-colors hover:bg-[var(--color-accent-1)] hover:text-[var(--color-bg-deep)] hover:shadow-[0_0_20px_rgba(252,238,10,0.4)]"
      >
        RETOURNER_À_LA_BASE
      </Link>
    </div>
  );
}
