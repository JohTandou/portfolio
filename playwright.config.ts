import { defineConfig, devices } from "@playwright/test";

/**
 * Configuration Playwright pour les tests E2E du portfolio.
 *
 * Projets :
 * - Chromium desktop 1440×900
 * - Chromium mobile 390×844
 * - WebKit desktop 1440×900
 * - WebKit mobile 390×844
 *
 * Le serveur Next.js dev est démarré automatiquement avant les tests.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        browserName: "chromium",
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 390, height: 844 },
        browserName: "chromium",
      },
    },
    {
      name: "webkit-desktop",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1440, height: 900 },
        browserName: "webkit",
      },
    },
    {
      name: "webkit-mobile",
      use: {
        ...devices["iPhone 13 Pro"],
        viewport: { width: 390, height: 844 },
        browserName: "webkit",
      },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
