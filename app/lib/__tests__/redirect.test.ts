/* ============================================================
   Tests unitaires pour la logique de redirection host-aware
   (app/lib/redirect.ts).

   Vérifie exhaustivement :
   - Le matching exact de l'hôte obsolète
   - La non-redirection des hôtes légitimes (canonique, localhost, previews)
   - La robustesse face aux entrées malveillantes/inattendues (null, casing)
   - La construction correcte des URLs canoniques
   ============================================================ */

import { describe, it, expect } from "vitest";
import {
  shouldRedirect,
  buildCanonicalUrl,
  OBSOLETE_HOST,
  CANONICAL_ORIGIN,
} from "@/lib/redirect";

/* ------------------------------------------------------------------ */
/* 1. shouldRedirect — matching exact de l'hôte obsolète              */
/* ------------------------------------------------------------------ */
describe("shouldRedirect — hôte obsolète", () => {
  it("doit rediriger l'hôte obsolète exact (minuscules)", () => {
    expect(shouldRedirect("jtandou-portfolio.vercel.app")).toBe(true);
  });

  it("doit rediriger l'hôte obsolète avec whitespace autour (trim)", () => {
    expect(shouldRedirect("  jtandou-portfolio.vercel.app  ")).toBe(true);
  });

  it("doit rediriger l'hôte obsolète en majuscules (Host insensible à la casse)", () => {
    expect(shouldRedirect("JTANDOU-PORTFOLIO.VERCEL.APP")).toBe(true);
  });

  it("doit rediriger l'hôte obsolète en casse mixte", () => {
    expect(shouldRedirect("Jtandou-Portfolio.Vercel.App")).toBe(true);
  });

  it("ne doit PAS rediriger un hôte partiellement similaire", () => {
    expect(shouldRedirect("jtandou-portfolio-vercel.app")).toBe(false);
  });

  it("ne doit PAS rediriger un hôte avec sous-domaine", () => {
    expect(shouldRedirect("www.jtandou-portfolio.vercel.app")).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* 2. shouldRedirect — hôtes jamais redirigés                         */
/* ------------------------------------------------------------------ */
describe("shouldRedirect — hôtes légitimes (jamais redirigés)", () => {
  it("ne doit JAMAIS rediriger le domaine canonique jtandou.dev", () => {
    expect(shouldRedirect("jtandou.dev")).toBe(false);
  });

  it("ne doit JAMAIS rediriger www.jtandou.dev", () => {
    expect(shouldRedirect("www.jtandou.dev")).toBe(false);
  });

  it("ne doit JAMAIS rediriger localhost", () => {
    expect(shouldRedirect("localhost")).toBe(false);
  });

  it("ne doit JAMAIS rediriger localhost:3100 (port)", () => {
    expect(shouldRedirect("localhost:3100")).toBe(false);
  });

  it("ne doit JAMAIS rediriger 127.0.0.1", () => {
    expect(shouldRedirect("127.0.0.1")).toBe(false);
  });

  it("ne doit JAMAIS rediriger les previews Vercel (pattern git-branch)", () => {
    // Les previews Vercel ont le format : project-git-branch.vercel.app
    expect(
      shouldRedirect("jtandou-portfolio-git-feature-redirect.vercel.app"),
    ).toBe(false);
    expect(
      shouldRedirect("jtandou-portfolio-fix-bug.vercel.app"),
    ).toBe(false);
  });

  it("ne doit JAMAIS rediriger les previews Vercel (hash)", () => {
    // Format alternatif : project-hash.vercel.app
    expect(
      shouldRedirect("jtandou-portfolio-abc123def.vercel.app"),
    ).toBe(false);
  });

  it("ne doit JAMAIS rediriger d'autres projets Vercel", () => {
    expect(shouldRedirect("other-project.vercel.app")).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* 3. shouldRedirect — entrées nulles, vides, invalides               */
/* ------------------------------------------------------------------ */
describe("shouldRedirect — entrées invalides", () => {
  it("ne doit pas rediriger quand host est null", () => {
    expect(shouldRedirect(null)).toBe(false);
  });

  it("ne doit pas rediriger quand host est une chaîne vide", () => {
    expect(shouldRedirect("")).toBe(false);
  });

  it("ne doit pas rediriger quand host est uniquement du whitespace", () => {
    expect(shouldRedirect("   ")).toBe(false);
  });

  it("ne doit pas rediriger une IP quelconque", () => {
    expect(shouldRedirect("192.168.1.1")).toBe(false);
  });

  it("ne doit pas rediriger un domaine complètement différent", () => {
    expect(shouldRedirect("example.com")).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* 4. buildCanonicalUrl — construction d'URL de destination           */
/* ------------------------------------------------------------------ */
describe("buildCanonicalUrl — construction d'URL canonique", () => {
  it("doit construire l'URL racine sans path ni query", () => {
    expect(buildCanonicalUrl("/", "")).toBe("https://jtandou.dev/");
  });

  it("doit préserver le pathname", () => {
    expect(buildCanonicalUrl("/about", "")).toBe("https://jtandou.dev/about");
  });

  it("doit préserver la query string", () => {
    expect(buildCanonicalUrl("/about", "?utm_source=twitter&ref=old")).toBe(
      "https://jtandou.dev/about?utm_source=twitter&ref=old",
    );
  });

  it("doit gérer un pathname sans / initial", () => {
    expect(buildCanonicalUrl("about", "")).toBe("https://jtandou.dev/about");
  });

  it("doit gérer un pathname profond", () => {
    expect(buildCanonicalUrl("/api/contact", "?lang=fr")).toBe(
      "https://jtandou.dev/api/contact?lang=fr",
    );
  });

  it("doit gérer une query string vide", () => {
    expect(buildCanonicalUrl("/", "")).toBe("https://jtandou.dev/");
  });

  it("doit gérer un pathname racine sans slash explicite", () => {
    expect(buildCanonicalUrl("", "?ref=old")).toBe(
      "https://jtandou.dev/?ref=old",
    );
  });
});

/* ------------------------------------------------------------------ */
/* 5. Constantes exportées                                            */
/* ------------------------------------------------------------------ */
describe("Constantes de redirection", () => {
  it("OBSOLETE_HOST doit être la valeur exacte du domaine Vercel", () => {
    expect(OBSOLETE_HOST).toBe("jtandou-portfolio.vercel.app");
  });

  it("CANONICAL_ORIGIN doit être le domaine canonique HTTPS", () => {
    expect(CANONICAL_ORIGIN).toBe("https://jtandou.dev");
  });
});
