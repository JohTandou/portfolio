import { test, expect } from "@playwright/test";

test.describe("Favicon", () => {
  test("should have the correct favicon", async ({ page }) => {
    await page.goto("/");
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute("href", "/favicon.png");
    await expect(favicon).toHaveAttribute("type", "image/png");
  });
});
