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

  test("author line ends at the same distance above the meta separator in every card", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/reads/");
    await page.locator("wa-card.reads-card").first().waitFor();

    const gaps = await page.locator(".reads-card").evaluateAll((cards) =>
      cards.map((card) => {
        const authors = card.querySelector(".reads-card__authors");
        const meta = card.querySelector(".reads-card__meta");
        const range = document.createRange();
        range.selectNodeContents(authors);
        return Math.round(meta.getBoundingClientRect().top - range.getBoundingClientRect().bottom);
      }),
    );

    expect(new Set(gaps).size).toBe(1);
  });

  test("unstretched cards keep at most 16px between headline and author", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/reads/");
    await page.locator("wa-card.reads-card").first().waitFor();

    const gaps = await page.locator(".reads-card").evaluateAll((cards) =>
      cards.map((card) => {
        const title = card.querySelector(".reads-card__title").getBoundingClientRect();
        const authors = card.querySelector(".reads-card__authors").getBoundingClientRect();
        return authors.top - title.bottom;
      }),
    );

    expect(gaps).toHaveLength(fixture.length);
    for (const gap of gaps) expect(gap).toBeLessThanOrEqual(16);
  });

  const cardFor = (page, id) => page.locator(`.reads-card:has(a[href="/reads/${id}/"])`);

  test("a single tag shows as one chip in the media area and never in the header", async ({ page }) => {
    await page.goto("/reads/");
    const card = cardFor(page, "fixture-annotated");

    const chips = card.locator(".reads-card__media wa-tag");
    await expect(chips).toHaveCount(1);
    await expect(chips.first()).toHaveText("testing");
    await expect(card.locator(".reads-card__header wa-tag")).toHaveCount(0);
  });

  test("more than two tags show two chips plus a +N chip with an aria-label", async ({ page }) => {
    await page.goto("/reads/");
    const card = cardFor(page, "fixture-many-tags");
    const [first, second, third] = fixture.find((read) => read.id === "fixture-many-tags").tags;

    const chips = card.locator(".reads-card__media wa-tag");
    await expect(chips).toHaveCount(3);
    await expect(chips.nth(0)).toHaveText(first);
    await expect(chips.nth(1)).toHaveText(second);
    await expect(chips.nth(2)).toHaveText("+1");
    await expect(chips.nth(2)).toHaveAttribute("aria-label", "und 1 weitere Tags");
    await expect(card.getByText(third, { exact: true })).toHaveCount(0);
    await expect(card.locator(".reads-card__header wa-tag")).toHaveCount(0);
  });

  test("a bookmark without tags renders no chip", async ({ page }) => {
    await page.goto("/reads/");

    await expect(cardFor(page, "fixture-no-image").locator("wa-tag")).toHaveCount(0);
  });

  test("headline starts at the same distance below the media area in every card", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/reads/");
    await page.locator("wa-card.reads-card").first().waitFor();

    const offsets = await page.locator(".reads-card").evaluateAll((cards) =>
      cards.map((card) => {
        const media = card.querySelector(".reads-card__media").getBoundingClientRect();
        const title = card.querySelector(".reads-card__title").getBoundingClientRect();
        return Math.round(title.top - media.bottom);
      }),
    );

    expect(offsets).toHaveLength(fixture.length);
    expect(new Set(offsets).size).toBe(1);
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
