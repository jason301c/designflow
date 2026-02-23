import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:4800",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "npx tsx bin/cli.ts dev --dir ./test-wireframes --port 4800",
    port: 4800,
    reuseExistingServer: true,
    timeout: 15_000,
  },
})
