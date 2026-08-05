/* ============================================================
   Logique pure de redirection host-aware — sans dépendance
   à NextRequest, donc testable unitairement en Vitest.

   Le middleware (middleware.ts) appelle ces fonctions pour
   décider si une requête doit être redirigée de l'ancien
   domaine Vercel vers le domaine canonique jtandou.dev.

   Règles :
   - Redirige UNIQUEMENT l'hôte exact jtandou-portfolio.vercel.app
   - JAMAIS localhost, jtandou.dev, ni les previews Vercel
     (ex: jtandou-portfolio-git-feature.vercel.app)
   - 308 Permanent Redirect, conserve pathname + query string
   ============================================================ */

/** Ancien domaine Vercel à rediriger de façon permanente.
 *  Seul cet hôte exact déclenche la redirection — les previews
 *  Vercel (jtandou-portfolio-*.vercel.app) ne sont pas affectées. */
export const OBSOLETE_HOST = "jtandou-portfolio.vercel.app" as const;

/** Domaine canonique vers lequel rediriger. */
export const CANONICAL_ORIGIN = "https://jtandou.dev" as const;

/** Hôtes exclus de toute redirection (sécurité redondante :
 *  le matching exact de shouldRedirect suffit, mais cette liste
 *  documente explicitement les hôtes qu'on ne touche jamais). */
const NEVER_REDIRECT_HOSTS = new Set<string>([
  "jtandou.dev",
  "www.jtandou.dev",
  "localhost",
]);

/**
 * Détermine si l'hôte reçu doit déclencher une redirection 308.
 *
 * @param host - La valeur brute de l'en-tête HTTP Host (peut être null).
 * @returns true uniquement si l'hôte correspond exactement à l'ancien
 *          domaine Vercel ET n'est pas dans la liste d'exclusion.
 */
export function shouldRedirect(host: string | null): boolean {
  if (!host) return false;

  // Normalisation : trim + lowercase (les en-têtes Host sont
  // insensibles à la casse selon RFC 7230 §5.4)
  const normalized = host.trim().toLowerCase();

  // Exclusion explicite des hôtes qu'on ne redirige jamais
  if (NEVER_REDIRECT_HOSTS.has(normalized)) return false;

  // Seul l'hôte obsolète exact déclenche la redirection.
  // Les previews Vercel (projet-git-branch.vercel.app) ne matchent pas.
  return normalized === OBSOLETE_HOST;
}

/**
 * Construit l'URL canonique de destination pour une redirection.
 * Préserve le pathname et la query string.
 *
 * @param pathname - Le pathname de l'URL d'origine (ex: "/1", "/about")
 * @param search  - La query string d'origine (ex: "?utm_source=twitter"),
 *                   incluant le "?" initial si présent.
 * @returns L'URL canonique complète (ex: "https://jtandou.dev/1?ref=old")
 */
export function buildCanonicalUrl(pathname: string, search: string): string {
  // Normalisation : s'assurer que pathname commence par "/"
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${CANONICAL_ORIGIN}${normalizedPath}${search}`;
}
