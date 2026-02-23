import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ThemePanel } from "../../src/app/ThemePanel"
import type { DesignFlowTheme } from "../../src/types"

const sampleTheme: DesignFlowTheme = {
  colors: {
    primary: "#2563EB",
    secondary: "#7C3AED",
    accent: "#F59E0B",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    surfaceAlt: "#F1F5F9",
    border: "#E2E8F0",
    text: "#0F172A",
    textMuted: "#64748B",
    textInvert: "#FFFFFF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    heading: {
      weight: 600,
      sizes: { h1: "2rem", h2: "1.5rem", h3: "1.25rem", h4: "1.125rem" },
    },
    body: {
      weight: 400,
      sizes: { base: "1rem", sm: "0.875rem", xs: "0.75rem" },
    },
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.07)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
  },
}

describe("ThemePanel", () => {
  let themeStyleEl: HTMLStyleElement

  beforeEach(() => {
    // Create a mock <style data-designflow-theme> element
    themeStyleEl = document.createElement("style")
    themeStyleEl.setAttribute("data-designflow-theme", "")
    themeStyleEl.textContent = ":root {}"
    document.head.appendChild(themeStyleEl)
  })

  afterEach(() => {
    themeStyleEl.remove()
    vi.restoreAllMocks()
  })

  it("should render with theme panel testid", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    expect(screen.getByTestId("theme-panel")).toBeInTheDocument()
  })

  it("should render a close button", () => {
    const onClose = vi.fn()
    render(<ThemePanel theme={sampleTheme} onClose={onClose} />)
    const closeBtn = screen.getByRole("button", { name: /close/i })
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })

  it("should render Colors section with color inputs for each color token", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    expect(screen.getByText("Colors")).toBeInTheDocument()
    // Should have color inputs for all 14 color tokens
    const colorInputs = screen.getAllByTestId(/^color-input-/)
    expect(colorInputs.length).toBe(14)
  })

  it("should render Radius section with text inputs", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    expect(screen.getByText("Radius")).toBeInTheDocument()
    const radiusInputs = screen.getAllByTestId(/^radius-input-/)
    expect(radiusInputs.length).toBe(5)
  })

  it("should render Spacing section with text inputs", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    expect(screen.getByText("Spacing")).toBeInTheDocument()
    const spacingInputs = screen.getAllByTestId(/^spacing-input-/)
    expect(spacingInputs.length).toBe(6)
  })

  it("should render Typography section", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    expect(screen.getByText("Typography")).toBeInTheDocument()
    expect(screen.getByTestId("typography-input-fontFamily")).toBeInTheDocument()
  })

  it("should render Shadows section", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    expect(screen.getByText("Shadows")).toBeInTheDocument()
    const shadowInputs = screen.getAllByTestId(/^shadow-input-/)
    expect(shadowInputs.length).toBe(3)
  })

  it("should show color input values matching theme colors", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    const primaryInput = screen.getByTestId("color-input-primary") as HTMLInputElement
    // HTML color inputs normalize to lowercase
    expect(primaryInput.value).toBe("#2563eb")
  })

  it("should update CSS variable when a color input changes", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    const primaryInput = screen.getByTestId("color-input-primary")
    fireEvent.input(primaryInput, { target: { value: "#ff0000" } })

    const styleEl = document.querySelector("[data-designflow-theme]") as HTMLStyleElement
    expect(styleEl.textContent).toContain("--df-primary: #ff0000")
  })

  it("should update CSS variable when a spacing input changes", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    const spacingInput = screen.getByTestId("spacing-input-md")
    fireEvent.change(spacingInput, { target: { value: "20px" } })

    const styleEl = document.querySelector("[data-designflow-theme]") as HTMLStyleElement
    expect(styleEl.textContent).toContain("--df-spacing-md: 20px")
  })

  it("should update CSS variable when a radius input changes", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    const radiusInput = screen.getByTestId("radius-input-lg")
    fireEvent.change(radiusInput, { target: { value: "16px" } })

    const styleEl = document.querySelector("[data-designflow-theme]") as HTMLStyleElement
    expect(styleEl.textContent).toContain("--df-radius-lg: 16px")
  })

  it("should send POST request when Save button is clicked", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    )

    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    const saveBtn = screen.getByRole("button", { name: /save/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/__designflow/update-theme",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      )
    })

    // Verify the body contains the theme object
    const callBody = JSON.parse(fetchSpy.mock.calls[0][1]!.body as string)
    expect(callBody.theme).toBeDefined()
    expect(callBody.theme.colors.primary).toBe("#2563EB")
  })

  it("should send modified theme when Save is clicked after editing", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    )

    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)

    // Change a color
    const primaryInput = screen.getByTestId("color-input-primary")
    fireEvent.input(primaryInput, { target: { value: "#ff0000" } })

    // Save
    fireEvent.click(screen.getByRole("button", { name: /save/i }))

    await waitFor(() => {
      const callBody = JSON.parse(fetchSpy.mock.calls[0][1]!.body as string)
      expect(callBody.theme.colors.primary).toBe("#ff0000")
    })
  })

  it("should restore original theme when Reset button is clicked", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)

    // Change a color
    const primaryInput = screen.getByTestId("color-input-primary") as HTMLInputElement
    fireEvent.input(primaryInput, { target: { value: "#ff0000" } })
    expect(primaryInput.value).toBe("#ff0000")

    // Reset
    fireEvent.click(screen.getByRole("button", { name: /reset/i }))

    // Should be back to original
    const resetInput = screen.getByTestId("color-input-primary") as HTMLInputElement
    expect(resetInput.value).toBe("#2563eb")
  })

  it("should restore CSS when Reset button is clicked", () => {
    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)

    // Change a color
    const primaryInput = screen.getByTestId("color-input-primary")
    fireEvent.input(primaryInput, { target: { value: "#ff0000" } })

    const styleEl = document.querySelector("[data-designflow-theme]") as HTMLStyleElement
    expect(styleEl.textContent).toContain("--df-primary: #ff0000")

    // Reset
    fireEvent.click(screen.getByRole("button", { name: /reset/i }))

    expect(styleEl.textContent).toContain("--df-primary: #2563EB")
  })

  it("should send POST to generate-tailwind when Generate Tailwind button is clicked", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    )

    render(<ThemePanel theme={sampleTheme} onClose={vi.fn()} />)
    const genBtn = screen.getByRole("button", { name: /generate tailwind/i })
    fireEvent.click(genBtn)

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/__designflow/generate-tailwind",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      )
    })
  })
})
