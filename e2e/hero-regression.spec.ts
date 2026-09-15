import { test, expect } from "@playwright/test";

/* ── Régression Hero — Le H1 ne doit pas être recouvert par la navigation fixe ─
   Vérifie que sur /, en desktop et mobile, le H1 "JOH TANDOU"
   est entièrement visible au scroll=0 (aucune portion masquée derrière
   la barre de navigation fixe de 80px). */

/* ── Helpers ─────────────────────────────────────────────────────── */

/** Injecte localStorage visited=true avant toute navigation pour
 *  éviter la BootSequence (le check est fait au montage du composant). */
function skipBootScript(): string {
  return `localStorage.setItem("visited", "true");`;
}

/** Attend que le hero soit monté et que les animations stagger
 *  (Framer Motion) aient eu le temps de se terminer. */
async function waitForHeroReady(page: import("@playwright/test").Page) {
  const hero = page.locator("#hero");
  await hero.waitFor({ state: "attached", timeout: 10000 });
  // Laisser les animations framer-motion stagger (containerVariants
  // delayChildren: 0.3s + stagger 0.1s × ~7 éléments ≈ 1s)
  await page.waitForTimeout(1500);
}

/* ── Constante de référence ──────────────────────────────────────── */

/** Hauteur de la barre de navigation fixe (h-20 = 5rem = 80px).
 *  Le H1 doit avoir son bord supérieur strictement en dessous
 *  de cette valeur pour ne pas être masqué. */
const NAV_HEIGHT = 80;

/* ── Tests ───────────────────────────────────────────────────────── */

test.describe("Régression Hero — H1 non recouvert par la navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(skipBootScript);
  });

  /* ──── Desktop / ───────────────────────────────────────────────── */

  test.describe("Desktop 1440×900 — page /", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await waitForHeroReady(page);
    });

    test("le H1 'JOH TANDOU' est visible et son bord supérieur est ≥ 80px", async ({
      page,
    }) => {
      const h1 = page.locator("#hero h1");
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText("JOH TANDOU");

      const box = await h1.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.y).toBeGreaterThanOrEqual(NAV_HEIGHT);
    });

    test("le spacer de garde navigation (data-testid) est présent dans le DOM", async ({
      page,
    }) => {
      const spacer = page.locator('[data-testid="hero-nav-spacer"]');
      await expect(spacer).toBeAttached();
    });
  });

  /* ──── Mobile / ────────────────────────────────────────────────── */

  test.describe("Mobile 390×844 — page /", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await waitForHeroReady(page);
    });

    test("le H1 est visible et au-dessus du fold navigation sur mobile", async ({
      page,
    }) => {
      const h1 = page.locator("#hero h1");
      await expect(h1).toBeVisible();
      await expect(h1).toHaveText("JOH TANDOU");

      const box = await h1.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.y).toBeGreaterThanOrEqual(NAV_HEIGHT);
    });
  });

  /* ──── Redirection permanente /1 → / ──────────────────────────── */

  test("l'ancienne route /1 redirige en 308 vers / et affiche le hero", async ({
    page,
  }) => {
    const bareResponse = await page.request.get("/1", { maxRedirects: 0 });
    expect(bareResponse.status()).toBe(308);

    const nestedResponse = await page.request.get("/1/inconnu", {
      maxRedirects: 0,
    });
    expect(nestedResponse.status()).toBe(308);

    await page.goto("/1", { waitUntil: "domcontentloaded" });
    expect(new URL(page.url()).pathname).toBe("/");
    await expect(page.locator("#hero h1")).toHaveText("JOH TANDOU");
  });

  /* ──── Scroll-padding CSS ──────────────────────────────────────── */

  test.describe("scroll-padding-top CSS", () => {
    test("le html a un scroll-padding-top de 80px", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const scrollPadding = await page.evaluate(() => {
        return getComputedStyle(document.documentElement).scrollPaddingTop;
      });
      expect(scrollPadding).toBe("80px");
    });
  });
});
