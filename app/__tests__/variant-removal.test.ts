import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/* ============================================================
   Garde structurel — Suppression définitive de la variante /1.

   Ce fichier verrouille la suppression de la variante Genève et
   de tout le système de variantes (PortfolioVariant / getCopy /
   GENEVA_COPY / genevaInfo / heroBadge) pour qu'il ne puisse pas
   être réintroduit silencieusement.

   Contrat vérifié :
   1. app/page.tsx est l'unique page de l'App Router
   2. Le dossier app/1/ et ses fichiers n'existent plus sur disque
   3. Aucun identifiant du système de variantes dans le code source

   Rappel : la redirection 308 (/1 → /) est couverte par
   seo-routing.test.ts (section 6) et e2e/hero-regression.spec.ts.
   Ce fichier ne couvre QUE le garde de suppression.
   ============================================================ */

const APP_DIR = path.resolve(__dirname, "..");
const PROJECT_ROOT = path.resolve(APP_DIR, "..");

/** Identifiants distinctifs de l'ancien système de variantes.
 *  Chacun est unique au projet — aucune collision avec des
 *  identifiants légitimes (ex: framer-motion "variants"). */
const VARIANT_IDENTIFIERS = [
  "PortfolioVariant",
  "GENEVA_COPY",
  "getCopy",
  "genevaInfo",
  "heroBadge",
] as const;

/** Fichiers legacy de la variante supprimée (relatifs à app/). */
const LEGACY_VARIANT_FILES = [
  "1/page.tsx",
  "1/layout.tsx",
  "1/GenevaInfoSection.tsx",
  "1/__tests__/GenevaInfoSection.test.tsx",
] as const;

/** Parcourt récursivement un dossier et retourne les fichiers
 *  (chemins absolus) satisfaisant le prédicat. */
function walk(dir: string, predicate: (file: string) => boolean): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath, predicate));
    } else if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

/** Vrai si le fichier appartient à un dossier de tests. */
function isTestFile(file: string): boolean {
  return (
    file.includes(`${path.sep}__tests__${path.sep}`) ||
    file.endsWith(".test.ts") ||
    file.endsWith(".test.tsx") ||
    file.endsWith(".spec.ts") ||
    file.endsWith(".spec.tsx")
  );
}

/* ------------------------------------------------------------------ */
/* 1. Route unique — app/page.tsx est la seule page                    */
/* ------------------------------------------------------------------ */
describe("route unique — app/page.tsx est l'unique page", () => {
  it("aucune page de route n'existe en dehors de app/page.tsx", () => {
    const pages = walk(APP_DIR, (file) => path.basename(file) === "page.tsx")
      .filter((file) => !isTestFile(file))
      .map((file) => path.relative(PROJECT_ROOT, file))
      .sort();

    expect(pages).toEqual(["app/page.tsx"]);
  });
});

/* ------------------------------------------------------------------ */
/* 2. Variante /1 — fichiers supprimés du disque                       */
/* ------------------------------------------------------------------ */
describe("variante /1 — arborescence supprimée", () => {
  it("le dossier app/1 n'existe plus", () => {
    expect(fs.existsSync(path.join(APP_DIR, "1"))).toBe(false);
  });

  it("aucun fichier legacy de la variante n'est présent", () => {
    const present = LEGACY_VARIANT_FILES.filter((legacy) =>
      fs.existsSync(path.join(APP_DIR, legacy))
    );

    expect(present).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* 3. Système de variantes — absent du code de production              */
/* ------------------------------------------------------------------ */
describe("système de variantes — absent du code de production", () => {
  it("aucun identifiant de variante dans app/ (hors tests)", () => {
    const sourceFiles = walk(
      APP_DIR,
      (file) => /\.(ts|tsx)$/.test(file) && !isTestFile(file)
    );

    const offenders: string[] = [];
    for (const file of sourceFiles) {
      const source = fs.readFileSync(file, "utf-8");
      for (const identifier of VARIANT_IDENTIFIERS) {
        if (source.includes(identifier)) {
          offenders.push(`${path.relative(PROJECT_ROOT, file)} → ${identifier}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("aucun identifiant de variante dans middleware.ts ni next.config.ts", () => {
    const rootFiles = ["middleware.ts", "next.config.ts"];

    const offenders: string[] = [];
    for (const relative of rootFiles) {
      const source = fs.readFileSync(path.join(PROJECT_ROOT, relative), "utf-8");
      for (const identifier of VARIANT_IDENTIFIERS) {
        if (source.includes(identifier)) {
          offenders.push(`${relative} → ${identifier}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
