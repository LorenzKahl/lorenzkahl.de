import { test, expect } from "@playwright/test";

test.describe("page layout", () => {
  test("content blocks on /about keep their natural height at any viewport height", async ({ page }) => {
    const rowsByViewport = [];
    for (const height of [600, 900, 1400]) {
      await page.setViewportSize({ width: 1280, height });
      await page.goto("/about/");
      await page.evaluate(() => document.fonts.ready);

      rowsByViewport.push(
        await page.locator("main > *").evaluateAll((blocks) =>
          blocks.map((block) => Math.round(block.getBoundingClientRect().height)),
        ),
      );
    }

    for (const rows of rowsByViewport) {
      expect(rows).toEqual(rowsByViewport[0]);
    }
  });
});
