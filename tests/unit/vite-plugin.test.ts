import { describe, it, expect } from "vitest"
import { designflowPlugin } from "../../src/runtime/vite-plugin"

describe("designflowPlugin", () => {
  it("should return a valid Vite plugin object", () => {
    const plugin = designflowPlugin({ dir: "./wireframes" })
    expect(plugin).toBeDefined()
    expect(plugin.name).toBe("designflow")
  })

  it("should accept dir option", () => {
    const plugin = designflowPlugin({ dir: "./custom-dir" })
    expect(plugin).toBeDefined()
  })

  it("should have transformIndexHtml hook", () => {
    const plugin = designflowPlugin({ dir: "./wireframes" })
    expect(plugin.transformIndexHtml).toBeDefined()
    expect(typeof plugin.transformIndexHtml).toBe("function")
  })

  it("should have configureServer hook", () => {
    const plugin = designflowPlugin({ dir: "./wireframes" })
    expect(plugin.configureServer).toBeDefined()
    expect(typeof plugin.configureServer).toBe("function")
  })

  it("should have resolveId hook for virtual modules", () => {
    const plugin = designflowPlugin({ dir: "./wireframes" })
    expect(plugin.resolveId).toBeDefined()
    expect(typeof plugin.resolveId).toBe("function")
  })

  it("should have load hook for virtual modules", () => {
    const plugin = designflowPlugin({ dir: "./wireframes" })
    expect(plugin.load).toBeDefined()
    expect(typeof plugin.load).toBe("function")
  })

  it("should resolve virtual module id", () => {
    const plugin = designflowPlugin({ dir: "./wireframes" })
    const resolveId = plugin.resolveId as (id: string) => string | undefined
    expect(resolveId("virtual:designflow/theme")).toBe(
      "\0virtual:designflow/theme"
    )
    expect(resolveId("virtual:designflow/screens")).toBe(
      "\0virtual:designflow/screens"
    )
    expect(resolveId("some-other-module")).toBeUndefined()
  })
})
