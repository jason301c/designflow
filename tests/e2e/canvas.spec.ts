import { test, expect } from "@playwright/test"

test.describe("Canvas smoke tests", () => {
  test("should render the React Flow canvas", async ({ page }) => {
    await page.goto("/")
    const canvas = page.locator(".react-flow")
    await expect(canvas).toBeVisible({ timeout: 10_000 })
  })

  test("should render all three screen nodes", async ({ page }) => {
    await page.goto("/")
    await page.locator(".react-flow").waitFor({ state: "visible", timeout: 10_000 })

    await expect(page.getByText("Login")).toBeVisible()
    await expect(page.getByText("Dashboard")).toBeVisible()
    await expect(page.getByText("Settings")).toBeVisible()
  })

  test("should render edge labels", async ({ page }) => {
    await page.goto("/")
    await page.locator(".react-flow").waitFor({ state: "visible", timeout: 10_000 })

    await expect(page.getByText("Sign in")).toBeVisible()
    await expect(page.getByText("Gear icon")).toBeVisible()
    await expect(page.getByText("Back")).toBeVisible()
  })

  test("should open viewer on double-click and close with Escape", async ({ page }) => {
    await page.goto("/")
    await page.locator(".react-flow").waitFor({ state: "visible", timeout: 10_000 })

    // Double-click the Login screen node to open viewer
    const loginNode = page.getByText("Login").first()
    await loginNode.dblclick()

    // Viewer overlay should appear
    const viewer = page.locator("[data-testid='viewer-overlay']")
    await expect(viewer).toBeVisible()

    // Press Escape to close
    await page.keyboard.press("Escape")
    await expect(viewer).not.toBeVisible()
  })

  test("should close viewer with Close button", async ({ page }) => {
    await page.goto("/")
    await page.locator(".react-flow").waitFor({ state: "visible", timeout: 10_000 })

    // Double-click a screen node to open viewer
    const dashboardNode = page.getByText("Dashboard").first()
    await dashboardNode.dblclick()

    const viewer = page.locator("[data-testid='viewer-overlay']")
    await expect(viewer).toBeVisible()

    // Click the Close button
    await page.getByRole("button", { name: "Close" }).click()
    await expect(viewer).not.toBeVisible()
  })
})
