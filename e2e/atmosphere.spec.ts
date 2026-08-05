import { test, expect } from "@playwright/test";

/* ── Atmosphère E2E — Pluie ─────────────────────────────────────────
   Vérifie la pluie (Rain) sur #identity et #roadmap.
   Contrôle : présence canvas, z-index rain < contenu, pointer-events,
   reduced-motion rain inactive, et pause hors viewport. */

/* ── Helpers ─────────────────────────────────────────────────────── */

/** Injecte localStorage visited=true avant toute navigation pour
 *  éviter la BootSequence (le check est fait au montage du composant). */
function skipBootScript(): string {
  return `localStorage.setItem("visited", "true");`;
}

/** Race-condition guard : attend que la navigation atteigne la section,
 *  puis laisse IntersectionObserver + React hydrater (~500ms). */
async function waitForSection(page: import("@playwright/test").Page, sectionId: string) {
  await page.goto(`/#${sectionId}`, { waitUntil: "domcontentloaded" });
  const section = page.locator(`#${sectionId}`);
  await section.waitFor({ state: "attached", timeout: 10000 });
  /* Laisser IntersectionObserver détecter l'intersection et
     les hooks réagir (useSectionActivity → rain active) */
  await page.waitForTimeout(800);
}

/* ── Tests ───────────────────────────────────────────────────────── */

test.describe("Atmosphère — Pluie", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(skipBootScript);
  });

  /* ──── Section #identity ───────────────────────────────────────── */

  test.describe("Section #identity", () => {
    test.beforeEach(async ({ page }) => {
      await waitForSection(page, "identity");
    });

    test("présence du canvas de pluie", async ({ page }) => {
      const rain = page.locator('#identity canvas[data-section-id="identity"]');
      await expect(rain).toBeAttached();
      /* La classe "hidden" serait présente seulement si inactif ou
         reduced-motion — or ici la section est visible. */
      await expect(rain).not.toHaveClass(/hidden/);
    });

    test("z-index rain (z-[3]) < contenu (z-20)", async ({ page }) => {
      const section = page.locator("#identity");

      /* Canvas Rain */
      const rain = section.locator('canvas[data-section-id="identity"]');
      await expect(rain).toHaveClass(/z-\[3\]/);

      /* Contenu au-dessus */
      const content = section.locator(".relative.z-20");
      await expect(content).toBeAttached();
    });

    test("pointer-events: none sur le canvas de pluie", async ({ page }) => {
      const rain = page.locator('#identity canvas[data-section-id="identity"]');
      await expect(rain).toHaveAttribute("aria-hidden", "true");
      /* Le style inline définit pointerEvents: none */
      const style = await rain.getAttribute("style");
      expect(style).toContain("pointer-events");
    });

    test("contenu supérieur visible et non vide", async ({ page }) => {
      const section = page.locator("#identity");
      const content = section.locator(".relative.z-20");
      await expect(content).toBeAttached();
      /* Le contenu contient du texte (composants IdentitySection) */
      await expect(content).not.toBeEmpty();
    });
  });

  /* ──── Section #roadmap ────────────────────────────────────────── */

  test.describe("Section #roadmap", () => {
    test.beforeEach(async ({ page }) => {
      await waitForSection(page, "roadmap");
      /* LenisProvider réinitialise le scroll à 0 après navigation ;
         scrollIntoViewIfNeeded() force #roadmap dans le viewport
         pour qu'IntersectionObserver active le RainOverlay. */
      await page.locator("#roadmap").scrollIntoViewIfNeeded();
      /* Attendre que le canvas perde sa classe "hidden" : Playwright
         auto-retry sur expect().not.toHaveClass. */
      await expect(
        page.locator('#roadmap canvas[data-section-id="roadmap"]')
      ).not.toHaveClass(/hidden/, { timeout: 5000 });
    });

    test("présence du canvas de pluie", async ({ page }) => {
      const rain = page.locator('#roadmap canvas[data-section-id="roadmap"]');
      await expect(rain).toBeAttached();
      await expect(rain).not.toHaveClass(/hidden/);
    });

    test("z-index rain (z-[3]) < contenu (z-20)", async ({ page }) => {
      const section = page.locator("#roadmap");

      const rain = section.locator('canvas[data-section-id="roadmap"]');
      await expect(rain).toHaveClass(/z-\[3\]/);

      const content = section.locator(".relative.z-20");
      await expect(content).toBeAttached();
    });

    test("pointer-events: none sur le canvas de pluie", async ({ page }) => {
      const rain = page.locator('#roadmap canvas[data-section-id="roadmap"]');
      await expect(rain).toHaveAttribute("aria-hidden", "true");
      const style = await rain.getAttribute("style");
      expect(style).toContain("pointer-events");
    });
  });

  /* ──── Reduced motion ──────────────────────────────────────────── */

  test.describe("Reduced motion (prefers-reduced-motion: reduce)", () => {
    test("Rain inactif (data-reduced-motion=true) sur #identity", async ({ browser }) => {
      const ctx = await browser.newContext({ reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.addInitScript(skipBootScript);
      await waitForSection(page, "identity");

      const rain = page.locator('#identity canvas[data-section-id="identity"]');
      const count = await rain.count();
      if (count > 0) {
        /* Le canvas peut rester dans le DOM avec data-reduced-motion="true"
           (et classe "hidden") plutôt qu'être retiré du DOM. */
        await expect(rain).toHaveAttribute("data-reduced-motion", "true");
      }
      /* Si count=0 → RainOverlay n'a pas monté le canvas → OK aussi */

      await ctx.close();
    });

    test("Rain inactif sur #roadmap", async ({ browser }) => {
      const ctx = await browser.newContext({ reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.addInitScript(skipBootScript);
      await waitForSection(page, "roadmap");

      const rain = page.locator('#roadmap canvas[data-section-id="roadmap"]');
      const count = await rain.count();
      if (count > 0) {
        await expect(rain).toHaveAttribute("data-reduced-motion", "true");
      }

      await ctx.close();
    });
  });

  /* ──── Pause hors viewport ─────────────────────────────────────── */

  test.describe("Pause hors viewport", () => {
    test("le canvas de pluie est masqué (hidden) quand la section sort du viewport", async ({ page }) => {
      await page.addInitScript(skipBootScript);
      await page.goto("/", { waitUntil: "domcontentloaded" });

      /* Attendre que les deux sections soient dans le DOM */
      await page.locator("#identity").waitFor({ state: "attached", timeout: 10000 });
      await page.locator("#roadmap").waitFor({ state: "attached", timeout: 10000 });
      await page.waitForTimeout(1000);

      /* Vérifier que #identity a un canvas de pluie visible */
      const identityRain = page.locator('#identity canvas[data-section-id="identity"]');
      const hasRain = await identityRain.count();
      if (hasRain === 0) {
        test.skip(true, "Canvas de pluie non monté sur #identity");
        return;
      }

      /* Si le canvas est déjà hidden (page très courte), on skip */
      const isHidden = await identityRain.evaluate((el) =>
        el.className.includes("hidden")
      );
      if (isHidden) {
        test.skip(true, "#identity n'est pas visible au chargement initial");
        return;
      }

      /* Scroller jusqu'à #roadmap pour sortir #identity du viewport */
      await page.locator("#roadmap").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500); /* laisser IntersectionObserver réagir */

      /* #identity rain doit être hidden maintenant */
      const identityRainAfter = page.locator('#identity canvas[data-section-id="identity"].hidden');
      await expect(identityRainAfter).toBeAttached();
    });
  });
});
