import { test, expect } from "@playwright/test";
import fixture from "../fixtures/reads.json" with { type: "json" };

test.describe("reads page", () => {
  test("lists exactly the fixture bookmarks as cards", async ({ page }) => {
    await page.goto("/reads/");

    const cards = page.locator(".reads-card");
    await expect(cards).toHaveCount(fixture.length);
  });

  test("renders every card as a wa-card", async ({ page }) => {
    await page.goto("/reads/");

    await expect(page.locator("wa-card.reads-card")).toHaveCount(fixture.length);
  });

  test("cards in the same grid row start at the same top edge", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/reads/");
    await page.locator("wa-card.reads-card").first().waitFor();

    const tops = await page
      .locator(".reads-card")
      .evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().top));

    expect(tops).toHaveLength(fixture.length);
    expect(new Set(tops).size).toBe(1);
  });

  for (const width of [1280, 800]) {
    test(`cards in the same grid row have equal height at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/reads/");
      await page.locator("wa-card.reads-card").first().waitFor();

      const rects = await page.locator(".reads-card").evaluateAll((cards) =>
        cards.map((card) => {
          const { top, height } = card.getBoundingClientRect();
          return { top, height };
        }),
      );

      const rows = Map.groupBy(rects, (rect) => rect.top);
      for (const row of rows.values()) {
        expect(new Set(row.map((rect) => rect.height)).size).toBe(1);
      }
    });
  }

  test("meta row sits at the bottom edge of every card", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/reads/");
    await page.locator("wa-card.reads-card").first().waitFor();

    const gaps = await page.locator(".reads-card").evaluateAll((cards) =>
      cards.map((card) => {
        const meta = card.querySelector(".reads-card__meta").getBoundingClientRect();
        return Math.round(card.getBoundingClientRect().bottom - meta.bottom);
      }),
    );

    expect(new Set(gaps).size).toBe(1);
  });

  test("clicking a card navigates to its detail page", async ({ page }) => {
    await page.goto("/reads/");

    await page.getByRole("link", { name: "An Annotated Article" }).click();

    await expect(page).toHaveURL(/\/reads\/fixture-annotated\/$/);
  });

  test("shows a note only for the annotated highlight", async ({ page }) => {
    await page.goto("/reads/fixture-annotated/");

    const annotations = page.locator(".reads-detail__annotation");
    await expect(annotations).toHaveCount(2);

    await expect(annotations.nth(0).locator(".reads-detail__note")).toHaveText(
      "This is my note about the passage.",
    );
    await expect(annotations.nth(1).locator(".reads-detail__note")).toHaveCount(0);
  });

  test("source link points at a text-fragment URL", async ({ page }) => {
    await page.goto("/reads/fixture-annotated/");

    const sourceLink = page.locator(".reads-detail__source-link").first();
    await expect(sourceLink).toHaveAttribute("href", /#:~:text=/);
  });
});
