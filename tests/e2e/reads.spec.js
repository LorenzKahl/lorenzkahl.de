import { test, expect } from "@playwright/test";
import fixture from "../fixtures/reads.json" with { type: "json" };

// Layout assertions need Web Awesome's elements upgraded and fonts loaded;
// measuring earlier races the first render and gives flaky heights.
async function waitForLayout(page) {
  await page.evaluate(async () => {
    await Promise.all(["wa-card", "wa-tag", "wa-badge"].map((name) => customElements.whenDefined(name)));
    await document.fonts.ready;
  });
}


// Row heights as rendered (stretched) next to the natural card heights, which
// are measured by letting every card shrink to its content.
async function measureRows(page) {
  const lis = page.locator(".reads-grid > li");
  const read = () =>
    lis.evaluateAll((items) =>
      items.map((li) => {
        const card = li.querySelector(".reads-card");
        const authors = card.querySelector(".reads-card__authors");
        const title = card.querySelector(".reads-card__title");
        return {
          top: Math.round(li.getBoundingClientRect().top),
          height: li.getBoundingClientRect().height,
          cardHeight: card.getBoundingClientRect().height,
          gap: authors.getBoundingClientRect().top - title.getBoundingClientRect().bottom,
          authorsMargin: parseFloat(getComputedStyle(authors).marginBlockStart),
        };
      }),
    );
  const rendered = await read();
  await page.addStyleTag({ content: ".reads-grid { align-items: start; } .reads-card { height: auto; }" });
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => resolve())));
  const natural = await read();
  return { rendered, natural };
}

const maxHeightByRow = (cards, key) => {
  const rows = Map.groupBy(cards, (card) => card.top);
  return [...rows.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, row]) => Math.max(...row.map((card) => card[key])));
};

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
    await waitForLayout(page);

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
      await waitForLayout(page);

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
    await waitForLayout(page);

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
    await waitForLayout(page);

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
    await waitForLayout(page);

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
    await waitForLayout(page);

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

  test("chips sit in one line, aligned with the headline, 12-20px above the image bottom", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/reads/");
    await waitForLayout(page);

    const placement = await cardFor(page, "fixture-many-tags").evaluate((card) => {
      const cover = card.querySelector(".reads-card__cover").getBoundingClientRect();
      const chips = [...card.querySelectorAll(".reads-card__media wa-tag")].map((chip) =>
        chip.getBoundingClientRect(),
      );
      const title = card.querySelector(".reads-card__title").getBoundingClientRect();
      return {
        leftDeviation: Math.abs(chips[0].left - title.left),
        bottom: cover.bottom - Math.max(...chips.map((chip) => chip.bottom)),
        tops: chips.map((chip) => Math.round(chip.top)),
        insideRight: Math.max(...chips.map((chip) => chip.right)) <= cover.right,
      };
    });

    expect(placement.leftDeviation).toBeLessThanOrEqual(1);
    expect(placement.bottom).toBeGreaterThanOrEqual(12);
    expect(placement.bottom).toBeLessThanOrEqual(20);
    expect(new Set(placement.tops).size).toBe(1);
    expect(placement.insideRight).toBe(true);
  });

  test("chip text and background reach a contrast of at least 4.5:1", async ({ page }) => {
    await page.goto("/reads/");
    await waitForLayout(page);

    const ratios = await page.locator(".reads-card__media wa-tag").evaluateAll((chips) => {
      const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      const toRgba = (value) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = "#000";
        ctx.fillStyle = value;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data];
      };
      const luminance = ([r, g, b]) => {
        const [lr, lg, lb] = [r, g, b].map((channel) => {
          const c = channel / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
      };
      return chips.map((chip) => {
        const style = getComputedStyle(chip);
        const background = toRgba(style.backgroundColor);
        const text = toRgba(style.color);
        const [light, dark] = [luminance(background), luminance(text)].sort((a, b) => b - a);
        return { alpha: background[3], ratio: (light + 0.05) / (dark + 0.05) };
      });
    });

    expect(ratios.length).toBeGreaterThan(0);
    for (const { alpha, ratio } of ratios) {
      expect(alpha).toBe(255);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("a 60-character tag is cut inside the image and the page does not overflow at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/reads/");
    await waitForLayout(page);

    const result = await cardFor(page, "fixture-many-tags").evaluate((card) => {
      const cover = card.querySelector(".reads-card__cover").getBoundingClientRect();
      const [shortChip, longChip, moreChip] = card.querySelectorAll(".reads-card__media wa-tag");
      const isClipped = (chip) => chip.scrollWidth > chip.clientWidth;
      return {
        shortClipped: isClipped(shortChip),
        moreClipped: isClipped(moreChip),
        chipRight: longChip.getBoundingClientRect().right,
        coverRight: cover.right,
        clipped: isClipped(longChip),
        overflowX: getComputedStyle(longChip).overflowX,
        textOverflow: getComputedStyle(longChip).textOverflow,
        pageOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });

    expect(result.chipRight).toBeLessThanOrEqual(result.coverRight);
    expect(result.clipped).toBe(true);
    expect(result.overflowX).toBe("hidden");
    expect(result.textOverflow).toBe("ellipsis");
    expect(result.shortClipped).toBe(false);
    expect(result.moreClipped).toBe(false);
    expect(result.pageOverflow).toBe(false);
  });

  test("the cover keeps the 16:9 ratio of its width and height attributes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/reads/");
    await waitForLayout(page);

    const box = await cardFor(page, "fixture-many-tags").locator(".reads-card__cover").boundingBox();

    expect(Math.abs(box.height - (box.width * 675) / 1200)).toBeLessThanOrEqual(1);
  });

  for (const width of [390, 800, 1280]) {
    test(`each row is as tall as its tallest card needs at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/reads/");
      await waitForLayout(page);

      const { rendered, natural } = await measureRows(page);
      const renderedRows = maxHeightByRow(rendered, "height");
      const naturalRows = maxHeightByRow(natural, "cardHeight");

      expect(renderedRows).toHaveLength(naturalRows.length);
      renderedRows.forEach((height, index) => {
        expect(Math.abs(height - naturalRows[index])).toBeLessThanOrEqual(1);
      });
    });
  }

  test("row heights do not depend on the viewport height", async ({ page }) => {
    const heights = [];
    for (const height of [600, 900, 1400]) {
      await page.setViewportSize({ width: 1280, height });
      await page.goto("/reads/");
      await waitForLayout(page);
      const { rendered } = await measureRows(page);
      heights.push(maxHeightByRow(rendered, "height"));
    }

    for (const rows of heights) {
      expect(rows).toHaveLength(heights[0].length);
      rows.forEach((value, index) => {
        expect(Math.abs(value - heights[0][index])).toBeLessThanOrEqual(1);
      });
    }
  });

  test("the tallest card keeps only the authors margin between headline and author", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/reads/");
    await waitForLayout(page);

    const { rendered, natural } = await measureRows(page);
    const tallest = natural.reduce((best, card, index) => (card.cardHeight > natural[best].cardHeight ? index : best), 0);

    expect(rendered[tallest].gap).toBeLessThanOrEqual(rendered[tallest].authorsMargin + 1);
  });

  test("titles are shown in full without clipping", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/reads/");
    await waitForLayout(page);

    const clipped = await page.locator(".reads-card__title").evaluateAll((titles) =>
      titles.map((title) => {
        const link = title.querySelector(".reads-card__title-link");
        const range = document.createRange();
        range.selectNodeContents(link);
        return range.getBoundingClientRect().bottom > title.getBoundingClientRect().bottom + 1;
      }),
    );

    expect(clipped).toHaveLength(fixture.length);
    expect(clipped.every((value) => value === false)).toBe(true);
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
