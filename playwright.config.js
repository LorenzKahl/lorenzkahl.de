import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const port = 8082;
const fixturePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "tests/fixtures/reads.json");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  webServer: {
    command: `npx eleventy --serve --port=${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    env: {
      READS_FIXTURE_PATH: fixturePath,
    },
  },
  use: {
    baseURL: `http://localhost:${port}`,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
