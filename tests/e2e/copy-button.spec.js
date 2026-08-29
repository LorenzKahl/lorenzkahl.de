import { test, expect } from "@playwright/test";

test.describe("code block copy button", () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  });

  test("copies the fenced block's plain-text code, not the highlighted markup", async ({
    page,
  }) => {
    await page.goto("/posts/a-second-post/");

    const codeBlock = page.locator(".code-block").first();
    const expectedCode = await codeBlock.locator("pre").textContent();

    await codeBlock.locator("wa-copy-button").click();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(expectedCode);
    expect(clipboardText).not.toContain("<span");
  });
});
