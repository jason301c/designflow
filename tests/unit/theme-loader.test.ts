import { describe, it, expect } from "vitest"
import { generateThemeCSS, generateThemeFile, generateTailwindConfig } from "../../src/runtime/theme-loader"
import { sampleTheme } from "../fixtures/sample-theme"

describe("generateThemeCSS", () => {
  it("should generate CSS custom properties from a full theme", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain(":root {")
    expect(css).toContain("}")
  })

  it("should generate color properties with --df- prefix", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--df-primary: #2563EB;")
    expect(css).toContain("--df-secondary: #7C3AED;")
    expect(css).toContain("--df-background: #FFFFFF;")
    expect(css).toContain("--df-text: #0F172A;")
    expect(css).toContain("--df-text-muted: #64748B;")
    expect(css).toContain("--df-text-invert: #FFFFFF;")
    expect(css).toContain("--df-surface-alt: #F1F5F9;")
  })

  it("should generate radius properties", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--df-radius-sm: 4px;")
    expect(css).toContain("--df-radius-md: 8px;")
    expect(css).toContain("--df-radius-full: 9999px;")
  })

  it("should generate spacing properties", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--df-spacing-xs: 4px;")
    expect(css).toContain("--df-spacing-md: 16px;")
    expect(css).toContain("--df-spacing-xxl: 48px;")
  })

  it("should generate typography properties", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--df-font-family: Inter, system-ui, sans-serif;")
    expect(css).toContain("--df-heading-weight: 600;")
    expect(css).toContain("--df-heading-h1: 2rem;")
    expect(css).toContain("--df-heading-h2: 1.5rem;")
    expect(css).toContain("--df-body-weight: 400;")
    expect(css).toContain("--df-body-base: 1rem;")
    expect(css).toContain("--df-body-sm: 0.875rem;")
  })

  it("should generate shadow properties", () => {
    const css = generateThemeCSS(sampleTheme)
    expect(css).toContain("--df-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);")
    expect(css).toContain("--df-shadow-md: 0 4px 6px rgba(0,0,0,0.07);")
  })

  it("should handle partial theme with only colors", () => {
    const partial = { colors: { primary: "#000", secondary: "#111", accent: "#222", background: "#fff", surface: "#eee", surfaceAlt: "#ddd", border: "#ccc", text: "#333", textMuted: "#666", textInvert: "#fff", success: "#0f0", warning: "#ff0", error: "#f00", info: "#00f" } } as any
    const css = generateThemeCSS(partial)
    expect(css).toContain("--df-primary: #000;")
    expect(css).not.toContain("--df-radius")
  })
})

describe("generateThemeFile", () => {
  it("should generate a valid TypeScript file with theme export", () => {
    const file = generateThemeFile(sampleTheme)
    expect(file).toContain('import type { DesignFlowTheme } from "designflow"')
    expect(file).toContain("const theme: DesignFlowTheme =")
    expect(file).toContain("export default theme")
  })

  it("should include all theme colors in the output", () => {
    const file = generateThemeFile(sampleTheme)
    expect(file).toContain('"primary"')
    expect(file).toContain('"#2563EB"')
    expect(file).toContain('"secondary"')
  })

  it("should include radius values", () => {
    const file = generateThemeFile(sampleTheme)
    expect(file).toContain('"sm"')
    expect(file).toContain('"4px"')
  })

  it("should produce parseable JSON for the theme object", () => {
    const file = generateThemeFile(sampleTheme)
    // Extract JSON from between "= " and the next newline before "export"
    const jsonStr = file.split("const theme: DesignFlowTheme = ")[1].split("\n\nexport")[0]
    const parsed = JSON.parse(jsonStr)
    expect(parsed.colors.primary).toBe("#2563EB")
    expect(parsed.radius.sm).toBe("4px")
  })
})

describe("generateTailwindConfig", () => {
  it("should generate a valid TypeScript Tailwind config", () => {
    const config = generateTailwindConfig(sampleTheme)
    expect(config).toContain('import type { Config } from "tailwindcss"')
    expect(config).toContain("const config: Config =")
    expect(config).toContain("export default config")
  })

  it("should include color tokens mapped to kebab-case", () => {
    const config = generateTailwindConfig(sampleTheme)
    expect(config).toContain('"primary"')
    expect(config).toContain('"surface-alt"')
    expect(config).toContain('"text-muted"')
  })

  it("should include spacing tokens", () => {
    const config = generateTailwindConfig(sampleTheme)
    expect(config).toContain('"xs"')
    expect(config).toContain('"4px"')
    expect(config).toContain('"xxl"')
  })

  it("should include border radius tokens", () => {
    const config = generateTailwindConfig(sampleTheme)
    expect(config).toContain('"borderRadius"')
    expect(config).toContain('"full"')
    expect(config).toContain('"9999px"')
  })

  it("should include font family", () => {
    const config = generateTailwindConfig(sampleTheme)
    expect(config).toContain('"fontFamily"')
    expect(config).toContain("Inter, system-ui, sans-serif")
  })

  it("should include box shadow tokens", () => {
    const config = generateTailwindConfig(sampleTheme)
    expect(config).toContain('"boxShadow"')
  })

  it("should include content glob for screens", () => {
    const config = generateTailwindConfig(sampleTheme)
    expect(config).toContain("./screens/**/*.tsx")
  })
})
