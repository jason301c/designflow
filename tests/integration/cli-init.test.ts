import { describe, it, expect, beforeEach, afterEach } from "vitest"
import fs from "fs/promises"
import path from "path"
import os from "os"
import { runInit } from "../../src/cli/init"

describe("designflow init", () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "designflow-test-"))
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
  })

  it("should create wireframes directory with all required files", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    // Check directory structure
    const stat = await fs.stat(wireframesDir)
    expect(stat.isDirectory()).toBe(true)

    const screensStat = await fs.stat(path.join(wireframesDir, "screens"))
    expect(screensStat.isDirectory()).toBe(true)
  })

  it("should scaffold all screen files", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const files = await fs.readdir(path.join(wireframesDir, "screens"))
    expect(files).toContain("Login.tsx")
    expect(files).toContain("Dashboard.tsx")
    expect(files).toContain("Profile.tsx")
    expect(files).toContain("Settings.tsx")
    expect(files).toContain("Notifications.tsx")
  })

  it("should scaffold flows.ts", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const flowsContent = await fs.readFile(path.join(wireframesDir, "flows.ts"), "utf-8")
    expect(flowsContent).toContain("DesignFlowConfig")
    expect(flowsContent).toContain("screens")
    expect(flowsContent).toContain("edges")
  })

  it("should scaffold designflow.theme.ts", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const themeContent = await fs.readFile(path.join(wireframesDir, "designflow.theme.ts"), "utf-8")
    expect(themeContent).toContain("DesignFlowTheme")
    expect(themeContent).toContain("colors")
    expect(themeContent).toContain("primary")
  })

  it("should scaffold CLAUDE.md", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const claudeContent = await fs.readFile(path.join(wireframesDir, "CLAUDE.md"), "utf-8")
    expect(claudeContent).toContain("DesignFlow")
    expect(claudeContent).toContain("screens")
  })

  it("should respect custom --dir flag", async () => {
    const customDir = path.join(tmpDir, "my-design")
    await runInit({ dir: customDir })

    const stat = await fs.stat(customDir)
    expect(stat.isDirectory()).toBe(true)

    const files = await fs.readdir(path.join(customDir, "screens"))
    expect(files.length).toBeGreaterThan(0)
  })

  it("should throw error if directory already exists", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await fs.mkdir(wireframesDir, { recursive: true })

    await expect(runInit({ dir: wireframesDir })).rejects.toThrow()
  })

  it("should generate styles.css with Tailwind v4 @theme when --tailwind flag is set", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, tailwind: true })

    const content = await fs.readFile(path.join(wireframesDir, "styles.css"), "utf-8")
    expect(content).toContain('@import "tailwindcss"')
    expect(content).toContain("@theme {")
    expect(content).toContain("--color-primary")
    expect(content).toContain("var(--df-primary)")
  })

  it("should not generate styles.css by default", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const exists = await fs.access(path.join(wireframesDir, "styles.css")).then(() => true).catch(() => false)
    expect(exists).toBe(false)
  })

  it("should not generate tailwind.config.ts even with --tailwind", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, tailwind: true })

    const exists = await fs.access(path.join(wireframesDir, "tailwind.config.ts")).then(() => true).catch(() => false)
    expect(exists).toBe(false)
  })

  it("should scaffold Tailwind-class screens when --tailwind flag is set", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, tailwind: true })

    const loginContent = await fs.readFile(path.join(wireframesDir, "screens/Login.tsx"), "utf-8")
    expect(loginContent).toContain("className=")
    expect(loginContent).not.toContain("style={{")
  })

  it("should scaffold inline-style screens by default", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const loginContent = await fs.readFile(path.join(wireframesDir, "screens/Login.tsx"), "utf-8")
    expect(loginContent).toContain("style={{")
    expect(loginContent).not.toContain("className=")
  })

  it("should include default project name in scaffolded flows.ts", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir })

    const flowsContent = await fs.readFile(path.join(wireframesDir, "flows.ts"), "utf-8")
    expect(flowsContent).toContain('name: "My Designflow Project"')
  })

  it("should use custom project name when --name is provided", async () => {
    const wireframesDir = path.join(tmpDir, "wireframes")
    await runInit({ dir: wireframesDir, name: "Cool App" })

    const flowsContent = await fs.readFile(path.join(wireframesDir, "flows.ts"), "utf-8")
    expect(flowsContent).toContain('name: "Cool App"')
    expect(flowsContent).not.toContain("My Designflow Project")
  })
})
