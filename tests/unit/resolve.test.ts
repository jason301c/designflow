import { describe, it, expect, beforeEach, afterEach } from "vitest"
import fs from "fs"
import path from "path"
import os from "os"
import { buildCoreAliases, linkFilesystemDeps } from "../../src/cli/resolve"

describe("buildCoreAliases", () => {
  it("should return aliases for all core packages", () => {
    const aliases = buildCoreAliases()

    expect(aliases).toHaveProperty("react")
    expect(aliases).toHaveProperty("react-dom")
    expect(aliases).toHaveProperty("@xyflow/react")
    expect(aliases).toHaveProperty("@xyflow/system")
    expect(aliases).toHaveProperty("html-to-image")
    expect(aliases).toHaveProperty("use-sync-external-store")
  })

  it("should return absolute paths", () => {
    const aliases = buildCoreAliases()

    for (const p of Object.values(aliases)) {
      expect(path.isAbsolute(p)).toBe(true)
    }
  })

  it("should point to directories containing package.json", () => {
    const aliases = buildCoreAliases()

    for (const [pkg, dir] of Object.entries(aliases)) {
      const pkgJsonPath = path.join(dir, "package.json")
      expect(fs.existsSync(pkgJsonPath), `${pkg} → ${pkgJsonPath} should exist`).toBe(true)
    }
  })
})

describe("linkFilesystemDeps", () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "designflow-resolve-test-"))
  })

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })

  it("should create symlink for tailwindcss in node_modules", () => {
    const cleanup = linkFilesystemDeps(tmpDir)

    const target = path.join(tmpDir, "node_modules", "tailwindcss")
    expect(fs.existsSync(target)).toBe(true)
    expect(fs.existsSync(path.join(target, "package.json"))).toBe(true)

    cleanup()
  })

  it("should remove symlinks on cleanup", () => {
    const cleanup = linkFilesystemDeps(tmpDir)

    const target = path.join(tmpDir, "node_modules", "tailwindcss")
    expect(fs.existsSync(target)).toBe(true)

    cleanup()
    expect(fs.existsSync(target)).toBe(false)
  })

  it("should not overwrite user-installed packages", () => {
    // Simulate user having installed tailwindcss themselves
    const userPkg = path.join(tmpDir, "node_modules", "tailwindcss")
    fs.mkdirSync(userPkg, { recursive: true })
    fs.writeFileSync(path.join(userPkg, "package.json"), '{"name":"tailwindcss","version":"99.0.0"}')

    const cleanup = linkFilesystemDeps(tmpDir)

    // Should still be the user's version
    const content = JSON.parse(fs.readFileSync(path.join(userPkg, "package.json"), "utf-8"))
    expect(content.version).toBe("99.0.0")

    cleanup()
    // User's package should still exist after cleanup
    expect(fs.existsSync(userPkg)).toBe(true)
  })
})
