/* ============================================================
   Middleware Next.js — Redirection 308 permanente depuis
   l'ancien domaine Vercel vers le domaine canonique.

   Comportement :
   - Host === "jtandou-portfolio.vercel.app" → 308 redirect
     vers https://jtandou.dev, avec conservation du pathname
     et de la query string.
   - Tous les autres hosts (localhost, jtandou.dev, previews
     Vercel) → passe à travers sans modification.

   Ne casse JAMAIS les headers HTTP définis dans next.config.ts :
   la redirection envoie le navigateur vers le domaine canonique
   où ces headers sont appliqués normalement.

   Le matcher exclut les assets statiques pour ne pas ralentir
   le chargement des ressources.
   ============================================================ */

import { NextRequest, NextResponse } from "next/server";
import { shouldRedirect, buildCanonicalUrl } from "./app/lib/redirect";

export function middleware(request: NextRequest): NextResponse {
  const host = request.headers.get("host");

  if (shouldRedirect(host)) {
    const canonicalUrl = buildCanonicalUrl(
      request.nextUrl.pathname,
      request.nextUrl.search,
    );
    // 308 Permanent Redirect — conserve la méthode HTTP (GET, POST, etc.)
    // et garantit que les moteurs de recherche mettent à jour leur index.
    return NextResponse.redirect(canonicalUrl, 308);
  }

  // Hôte non concerné — la requête continue normalement
  return NextResponse.next();
}

/**
 * Matcher : toutes les routes sauf les assets statiques Next.js.
 * Le middleware ne s'exécute pas sur _next/static, _next/image,
 * ni sur les favicons — la redirection d'hôte ne concerne que
 * les requêtes de page.
 */
export const config = {
  matcher: [
    /*
     * Match toutes les requêtes sauf celles qui commencent par :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico, icon.svg (favicons)
     * - assets/ (ressources statiques publiques)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|assets/).*)",
  ],
};
