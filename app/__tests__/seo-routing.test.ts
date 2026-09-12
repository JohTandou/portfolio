import { describe, it, expect, vi } from "vitest";

/* ============================================================
   Tests SEO & Routage — Vérifie les métadonnées, le sitemap,
   le robots.txt, la navigation et les headers HTTP.
   ============================================================ */

/* ---- Mocks pour next/font/google (appelés au top-level du layout) ---- */
vi.mock("next/font/google", () => ({
  Rajdhani: () => ({ variable: "--font-rajdhani" }),
  JetBrains_Mono: () => ({ variable: "--font-jetbrains-mono" }),
  VT323: () => ({ variable: "--font-vt323" }),
}));

/* ---- Mock pour next/image (utilisé dans Navigation) ---- */
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => null,
}));

/* ------------------------------------------------------------------ */
/* 1. Métadonnées du root layout (/)                                   */
/* ------------------------------------------------------------------ */
describe("Root layout metadata (/)", () => {
  it("should have the correct public title", async () => {
    const { metadata } = await import("../layout");
    const title = metadata.title as { default: string; template: string };
    expect(title.default).toBe("Joh Tandou — Software Engineer Java & Web");
  });

  it("should NOT contain Genève/Suisse references in description", async () => {
    const { metadata } = await import("../layout");
    expect(metadata.description).not.toMatch(/genève/i);
    expect(metadata.description).not.toMatch(/suisse/i);
  });

  it("should NOT contain Spring Boot in keywords", async () => {
    const { metadata } = await import("../layout");
    const keywords = metadata.keywords as string[];
    const joined = keywords.join(" ").toLowerCase();
    expect(joined).not.toContain("spring");
    expect(joined).not.toContain("spring boot");
  });

  it("should NOT contain JPA, Hibernate or microservices in keywords", async () => {
    const { metadata } = await import("../layout");
    const keywords = metadata.keywords as string[];
    const joined = keywords.join(" ").toLowerCase();
    expect(joined).not.toContain("jpa");
    expect(joined).not.toContain("hibernate");
    expect(joined).not.toContain("microservices");
  });

  it("should NOT contain Genève in OpenGraph description", async () => {
    const { metadata } = await import("../layout");
    expect(metadata.openGraph?.description).not.toMatch(/genève/i);
  });

  it("should NOT contain Genève in Twitter description", async () => {
    const { metadata } = await import("../layout");
    expect(metadata.twitter?.description).not.toMatch(/genève/i);
  });

  it("should set robots to index and follow", async () => {
    const { metadata } = await import("../layout");
    expect(metadata.robots).toEqual({
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    });
  });

  it("should have canonical pointing to root", async () => {
    const { metadata } = await import("../layout");
    expect(metadata.alternates?.canonical).toBe(
      "https://jtandou.dev"
    );
  });

  it("should have correct author and creator", async () => {
    const { metadata } = await import("../layout");
    expect(metadata.authors).toEqual([
      { name: "Joh Tandou", url: "https://jtandou.dev" },
    ]);
    expect(metadata.creator).toBe("Joh Tandou");
  });

  it("should define OG images with URL /backgrounds/hero.jpg, width 1200 and height 630", async () => {
    const { metadata } = await import("../layout");
    expect(metadata.openGraph?.images).toBeDefined();
    const images = metadata.openGraph!.images;
    expect(Array.isArray(images)).toBe(true);
    const first = images![0] as Record<string, unknown>;
    expect(first.url).toBe("/backgrounds/hero.jpg");
    expect(first.width).toBe(1200);
    expect(first.height).toBe(630);
  });

  it("should define Twitter images with URL /backgrounds/hero.jpg", async () => {
    const { metadata } = await import("../layout");
    expect(metadata.twitter?.images).toBeDefined();
    const images = metadata.twitter!.images;
    expect(Array.isArray(images)).toBe(true);
    const first = images![0] as Record<string, unknown>;
    expect(first.url).toBe("/backgrounds/hero.jpg");
  });
});

/* ------------------------------------------------------------------ */
/* 2. Métadonnées du layout Geneva (/1)                               */
/* ------------------------------------------------------------------ */
describe("Geneva layout metadata (/1)", () => {
  it("should have Geneva-specific title", async () => {
    const { metadata } = await import("../1/layout");
    expect(metadata.title).toBe(
      "Joh Tandou — Software Engineer | Genève & Grand Genève"
    );
  });

  it("should have Geneva-specific description", async () => {
    const { metadata } = await import("../1/layout");
    expect(metadata.description).toBe(
      "Software Engineer Java & Web, actuellement en poste et mobile vers le Grand Genève après signature et préavis contractuel."
    );
  });

  it("should set robots to noindex, nofollow", async () => {
    const { metadata } = await import("../1/layout");
    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
  });

  it("should have correct canonical for /1", async () => {
    const { metadata } = await import("../1/layout");
    expect(metadata.alternates?.canonical).toBe(
      "https://jtandou.dev/1"
    );
  });

  it("should have correct OpenGraph for /1", async () => {
    const { metadata } = await import("../1/layout");
    expect(metadata.openGraph?.url).toBe("https://jtandou.dev/1");
    expect(metadata.openGraph?.title).toMatch(/Genève/);
  });

  it("should have correct Twitter card for /1", async () => {
    const { metadata } = await import("../1/layout");
    expect(metadata.twitter?.card).toBe("summary_large_image");
    expect(metadata.twitter?.creator).toBe("@johtnd");
  });

  it("should define OG images on /1 layout", async () => {
    const { metadata } = await import("../1/layout");
    expect(metadata.openGraph?.images).toBeDefined();
    const images = metadata.openGraph!.images;
    expect(Array.isArray(images)).toBe(true);
    const first = images![0] as Record<string, unknown>;
    expect(first.url).toBe("/backgrounds/hero.jpg");
    expect(first.width).toBe(1200);
    expect(first.height).toBe(630);
  });

  it("should define Twitter images on /1 layout", async () => {
    const { metadata } = await import("../1/layout");
    expect(metadata.twitter?.images).toBeDefined();
    const images = metadata.twitter!.images;
    expect(Array.isArray(images)).toBe(true);
    const first = images![0] as Record<string, unknown>;
    expect(first.url).toBe("/backgrounds/hero.jpg");
  });
});

/* ------------------------------------------------------------------ */
/* 3. Sitemap — pas de /1                                             */
/* ------------------------------------------------------------------ */
describe("Sitemap", () => {
  it("should NOT contain /1", async () => {
    const { default: sitemap } = await import("../sitemap");
    const entries = sitemap();
    const urls = entries.map((e: { url: string }) => e.url);
    expect(urls).not.toContain("https://jtandou.dev/1");
  });

  it("should contain the root URL", async () => {
    const { default: sitemap } = await import("../sitemap");
    const entries = sitemap();
    const urls = entries.map((e: { url: string }) => e.url);
    expect(urls).toContain("https://jtandou.dev");
  });

  it("should have exactly one entry", async () => {
    const { default: sitemap } = await import("../sitemap");
    const entries = sitemap();
    expect(entries).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------ */
/* 4. Robots.txt — disallow /1, allow /                               */
/* ------------------------------------------------------------------ */
describe("Robots.txt", () => {
  it("should disallow /1", async () => {
    const { default: robots } = await import("../robots");
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const disallowRule = rules.find(
      (r: { disallow?: string }) => r.disallow === "/1"
    );
    expect(disallowRule).toBeDefined();
    if (disallowRule) {
      expect(disallowRule.userAgent).toBe("*");
    }
  });

  it("should allow /", async () => {
    const { default: robots } = await import("../robots");
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const allowRule = rules.find(
      (r: { allow?: string }) => r.allow === "/"
    );
    expect(allowRule).toBeDefined();
  });

  it("should include sitemap URL", async () => {
    const { default: robots } = await import("../robots");
    const result = robots();
    expect(result.sitemap).toBe(
      "https://jtandou.dev/sitemap.xml"
    );
  });
});

/* ------------------------------------------------------------------ */
/* 5. Navigation — pas de lien vers /1                                */
/* ------------------------------------------------------------------ */
describe("Navigation — no /1 link", () => {
  it("should only contain internal anchor targets, never /1", async () => {
    /* On lit le fichier source pour vérifier qu'aucun href="/1" n'existe.
       Le composant est "use client" et difficile à monter en jsdom,
       mais on peut vérifier le contenu statique du fichier source. */
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../components/Navigation.tsx");
    const source = fs.readFileSync(filePath, "utf-8");

    /* Aucune occurrence de href ou to pointant vers /1 */
    expect(source).not.toMatch(/href=["']\/1["']/);
    expect(source).not.toMatch(/href=["']\/1\//);
    expect(source).not.toMatch(/to=["']\/1["']/);
    /* Vérifie aussi qu'aucun link ne référence /1 dans les ancres */
    expect(source).not.toMatch(/target.*["']\/1/);
  });

  it("should contain only internal anchor targets", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../components/Navigation.tsx");
    const source = fs.readFileSync(filePath, "utf-8");

    /* Les targets sont définis comme target: "identity", target: "experience", etc.
       On vérifie leur présence dans le source. */
    expect(source).toContain('target: "identity"');
    expect(source).toContain('target: "experience"');
    expect(source).toContain('target: "tech-arsenal"');
    expect(source).toContain('target: "missions"');
    expect(source).toContain('target: "contact"');
  });
});

/* ------------------------------------------------------------------ */
/* 6. next.config.ts — X-Robots-Tag pour /1                           */
/* ------------------------------------------------------------------ */
describe("next.config.ts — X-Robots-Tag for /1", () => {
  it("should define X-Robots-Tag: noindex, nofollow for /1/:path*", async () => {
    const { default: nextConfig } = await import("../../next.config");
    /* nextConfig est un objet ; headers() est async, on l'appelle */
    const result = await nextConfig.headers();
    /* Cherche l'entrée pour /1/:path* */
    const genevaEntry = result.find(
      (entry: { source: string }) => entry.source === "/1/:path*"
    );
    expect(genevaEntry).toBeDefined();
    const robotsHeader = genevaEntry.headers.find(
      (h: { key: string }) => h.key === "X-Robots-Tag"
    );
    expect(robotsHeader).toBeDefined();
    expect(robotsHeader.value).toBe("noindex, nofollow");
  });

  it("should place /1 header entry BEFORE the wildcard entry", async () => {
    const { default: nextConfig } = await import("../../next.config");
    const result = await nextConfig.headers();
    const gIndex = result.findIndex(
      (entry: { source: string }) => entry.source === "/1/:path*"
    );
    const wildcardIndex = result.findIndex(
      (entry: { source: string }) => entry.source === "/:path*"
    );
    expect(gIndex).toBeLessThan(wildcardIndex);
    expect(gIndex).toBeGreaterThanOrEqual(0);
  });
});

/* ------------------------------------------------------------------ */
/* 7. Layout Geneva — réutilise le même rendu que /                   */
/* ------------------------------------------------------------------ */
describe("Geneva page (/1)", () => {
  it("should export a default React component", async () => {
    const { default: GenevaPage } = await import("../1/page");
    expect(GenevaPage).toBeDefined();
    expect(typeof GenevaPage).toBe("function");
  });
});

/* ------------------------------------------------------------------ */
/* 8. Vérification croisée : pas de fuite Genève dans /               */
/* ------------------------------------------------------------------ */
describe("Cross-check: no Geneva leak on public route", () => {
  it("root layout metadata.description must not mention Genève or Suisse", async () => {
    const { metadata } = await import("../layout");
    const text = JSON.stringify(metadata).toLowerCase();
    expect(text).not.toContain("genève");
    expect(text).not.toContain("suisse");
  });

  it("root layout JSON-LD must not contain Spring Boot or JPA", async () => {
    /* On lit le fichier source pour vérifier le JSON-LD */
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../layout.tsx");
    const source = fs.readFileSync(filePath, "utf-8");

    expect(source).not.toMatch(/Spring Boot/i);
    expect(source).not.toMatch(/JPA/);
    expect(source).not.toMatch(/Hibernate/);
    expect(source).not.toMatch(/microservices/i);
  });

  it("root layout JSON-LD must be built from app/lib/seo.ts (buildSeoGraph)", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../layout.tsx");
    const source = fs.readFileSync(filePath, "utf-8");

    /* Vérifie que buildSeoGraph est bien importé et utilisé */
    expect(source).toContain("buildSeoGraph(");
    expect(source).toContain('import { buildSeoGraph } from "./lib/seo"');
  });

  it("root layout JSON-LD must NOT contain hardcoded address or alumniOf", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../layout.tsx");
    const source = fs.readFileSync(filePath, "utf-8");

    /* L'ancien JSON-LD hardcodé contenait address, alumniOf et knowsAbout.
       Avec buildSeoGraph, ces champs ne doivent plus apparaître. */
    expect(source).not.toMatch(/"address"\s*:/);
    expect(source).not.toMatch(/"alumniOf"/);
    expect(source).not.toMatch(/"knowsAbout"/);
  });
});

/* ------------------------------------------------------------------ */
/* 9. JSON-LD structure — vérification fonctionnelle                   */
/* ------------------------------------------------------------------ */
describe("JSON-LD structure validation", () => {
  it("buildSeoGraph should produce valid Person + WebSite graph", async () => {
    const { buildSeoGraph } = await import("../lib/seo");
    const graph = buildSeoGraph(
      "Portfolio de Joh Tandou — développeur full-stack."
    );

    expect(graph["@graph"]).toHaveLength(2);
    expect(graph["@graph"][0]["@type"]).toBe("Person");
    expect(graph["@graph"][1]["@type"]).toBe("WebSite");
  });

  it("JSON-LD Person must contain LinkedIn and GitHub sameAs", async () => {
    const { buildSeoGraph } = await import("../lib/seo");
    const graph = buildSeoGraph("Portfolio de Joh Tandou.");

    const person = graph["@graph"][0];
    expect(person.sameAs).toContain(
      "https://www.linkedin.com/in/johtandou/"
    );
    expect(person.sameAs).toContain("https://github.com/JohTandou");
    expect(person.sameAs).toHaveLength(2);
  });

  it("JSON-LD Person must contain English, French, Spanish languages", async () => {
    const { buildSeoGraph } = await import("../lib/seo");
    const graph = buildSeoGraph("Portfolio de Joh Tandou.");

    const person = graph["@graph"][0];
    expect(person.knowsLanguage).toEqual(
      expect.arrayContaining(["English", "French", "Spanish"])
    );
  });

  it("JSON-LD Person must contain email johtandou@gmail.com", async () => {
    const { buildSeoGraph } = await import("../lib/seo");
    const graph = buildSeoGraph("Portfolio de Joh Tandou.");

    const person = graph["@graph"][0];
    expect(person.email).toBe("johtandou@gmail.com");
  });

  it("JSON-LD Person must NOT contain Spring, JPA, Hibernate or microservices", async () => {
    const { buildSeoGraph } = await import("../lib/seo");
    const graph = buildSeoGraph("Portfolio de Joh Tandou.");
    const json = JSON.stringify(graph).toLowerCase();

    expect(json).not.toContain("spring");
    expect(json).not.toContain("jpa");
    expect(json).not.toContain("hibernate");
    expect(json).not.toContain("microservices");
  });

  it("JSON-LD Person must NOT contain address, alumniOf or knowsAbout", async () => {
    const { buildSeoGraph } = await import("../lib/seo");
    const graph = buildSeoGraph("Portfolio de Joh Tandou.");

    const person = graph["@graph"][0] as Record<string, unknown>;
    expect(person).not.toHaveProperty("address");
    expect(person).not.toHaveProperty("alumniOf");
    expect(person).not.toHaveProperty("knowsAbout");
  });

  it("JSON-LD WebSite must have inLanguage fr and author referencing Person @id", async () => {
    const { buildSeoGraph } = await import("../lib/seo");
    const graph = buildSeoGraph("Portfolio de Joh Tandou.");

    const website = graph["@graph"][1];
    expect(website.inLanguage).toBe("fr");
    expect(website.author["@id"]).toBe("https://jtandou.dev/#person");
    expect(website.author).not.toHaveProperty("@type");
    expect(website.author).not.toHaveProperty("name");
  });

  it("JSON-LD must expose @id for Person and WebSite with entity consistency", async () => {
    const { buildSeoGraph } = await import("../lib/seo");
    const graph = buildSeoGraph("Portfolio de Joh Tandou.");

    const person = graph["@graph"][0];
    const website = graph["@graph"][1];
    expect(person["@id"]).toBe("https://jtandou.dev/#person");
    expect(website["@id"]).toBe("https://jtandou.dev/#website");
    expect(website.author["@id"]).toBe(person["@id"]);
  });
});

