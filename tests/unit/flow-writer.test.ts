import { describe, it, expect } from "vitest"
import { serializeFlowConfig, updateScreenPosition } from "../../src/runtime/flow-writer"
import type { DesignFlowConfig } from "../../src/types"

const sampleConfig: DesignFlowConfig = {
  screens: {
    login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 }, viewport: "mobile" },
    dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 450, y: 0 }, viewport: "desktop" },
  },
  edges: [
    { from: "login", to: "dashboard", label: "Sign in" },
  ],
}

describe("updateScreenPosition", () => {
  it("should update position of an existing screen", () => {
    const updated = updateScreenPosition(sampleConfig, "login", { x: 100, y: 200 })
    expect(updated.screens.login.position).toEqual({ x: 100, y: 200 })
  })

  it("should not modify other screens", () => {
    const updated = updateScreenPosition(sampleConfig, "login", { x: 100, y: 200 })
    expect(updated.screens.dashboard.position).toEqual({ x: 450, y: 0 })
  })

  it("should preserve all other screen properties", () => {
    const updated = updateScreenPosition(sampleConfig, "login", { x: 100, y: 200 })
    expect(updated.screens.login.title).toBe("Login")
    expect(updated.screens.login.file).toBe("./screens/Login.tsx")
    expect(updated.screens.login.viewport).toBe("mobile")
  })

  it("should preserve edges", () => {
    const updated = updateScreenPosition(sampleConfig, "login", { x: 100, y: 200 })
    expect(updated.edges).toEqual(sampleConfig.edges)
  })

  it("should return unchanged config if screen not found", () => {
    const updated = updateScreenPosition(sampleConfig, "nonexistent", { x: 100, y: 200 })
    expect(updated).toEqual(sampleConfig)
  })
})

describe("serializeFlowConfig", () => {
  it("should produce valid TypeScript source", () => {
    const source = serializeFlowConfig(sampleConfig)
    expect(source).toContain('import type { DesignFlowConfig } from "designflow"')
    expect(source).toContain("const config: DesignFlowConfig")
    expect(source).toContain("export default config")
  })

  it("should include all screens", () => {
    const source = serializeFlowConfig(sampleConfig)
    expect(source).toContain("login")
    expect(source).toContain("dashboard")
    expect(source).toContain('"Login"')
    expect(source).toContain('"Dashboard"')
  })

  it("should include positions", () => {
    const source = serializeFlowConfig(sampleConfig)
    expect(source).toContain("x: 0")
    expect(source).toContain("x: 450")
  })

  it("should include edges", () => {
    const source = serializeFlowConfig(sampleConfig)
    expect(source).toContain("edges")
    expect(source).toContain('"login"')
    expect(source).toContain('"dashboard"')
    expect(source).toContain('"Sign in"')
  })

  it("should include viewport when defined", () => {
    const source = serializeFlowConfig(sampleConfig)
    expect(source).toContain('"mobile"')
    expect(source).toContain('"desktop"')
  })

  it("should handle config with no edges", () => {
    const noEdges: DesignFlowConfig = {
      screens: {
        login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
      },
    }
    const source = serializeFlowConfig(noEdges)
    expect(source).toContain("login")
    // Should either have empty edges array or no edges field
    expect(source).toBeDefined()
  })
})
