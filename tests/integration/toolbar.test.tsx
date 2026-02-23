import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Toolbar } from "../../src/app/Toolbar"
import { DEFAULT_CANVAS_SETTINGS, ACCENT_COLORS } from "../../src/types"
import type { CanvasSettings } from "../../src/types"

const mockZoomIn = vi.fn()
const mockZoomOut = vi.fn()
const mockFitView = vi.fn()

// Mock React Flow
vi.mock("@xyflow/react", () => ({
  useReactFlow: () => ({
    zoomIn: mockZoomIn,
    zoomOut: mockZoomOut,
    fitView: mockFitView,
  }),
}))

const defaultSettings: CanvasSettings = { ...DEFAULT_CANVAS_SETTINGS }

describe("Toolbar", () => {
  it("should render zoom in button", () => {
    render(<Toolbar />)
    expect(screen.getByRole("button", { name: /zoom in/i })).toBeInTheDocument()
  })

  it("should render zoom out button", () => {
    render(<Toolbar />)
    expect(screen.getByRole("button", { name: /zoom out/i })).toBeInTheDocument()
  })

  it("should render fit view button", () => {
    render(<Toolbar />)
    expect(screen.getByRole("button", { name: /fit view/i })).toBeInTheDocument()
  })

  it("should call zoomIn when zoom in button is clicked", () => {
    render(<Toolbar />)
    fireEvent.click(screen.getByRole("button", { name: /zoom in/i }))
    expect(mockZoomIn).toHaveBeenCalled()
  })

  it("should call zoomOut when zoom out button is clicked", () => {
    render(<Toolbar />)
    fireEvent.click(screen.getByRole("button", { name: /zoom out/i }))
    expect(mockZoomOut).toHaveBeenCalled()
  })

  it("should call fitView when fit view button is clicked", () => {
    render(<Toolbar />)
    fireEvent.click(screen.getByRole("button", { name: /fit view/i }))
    expect(mockFitView).toHaveBeenCalled()
  })

  it("should render with toolbar testid", () => {
    render(<Toolbar />)
    expect(screen.getByTestId("toolbar")).toBeInTheDocument()
  })

  it("should tint toolbar border with accent color", () => {
    const onChange = vi.fn()
    const settings = { ...defaultSettings, accentColor: "#dc2626" }
    render(<Toolbar settings={settings} onSettingsChange={onChange} />)
    const toolbar = screen.getByTestId("toolbar")
    // #dc2626 → rgb(220, 38, 38)
    expect(toolbar.style.borderColor).toContain("220, 38, 38")
  })

  describe("settings popover", () => {
    it("should render settings button", () => {
      const onChange = vi.fn()
      render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
      expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument()
    })

    it("should not show popover by default", () => {
      const onChange = vi.fn()
      render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
      expect(screen.queryByTestId("settings-popover")).not.toBeInTheDocument()
    })

    it("should open popover when settings button is clicked", () => {
      const onChange = vi.fn()
      render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
      fireEvent.click(screen.getByRole("button", { name: /settings/i }))
      expect(screen.getByTestId("settings-popover")).toBeInTheDocument()
    })

    it("should close popover when settings button is clicked again", () => {
      const onChange = vi.fn()
      render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
      fireEvent.click(screen.getByRole("button", { name: /settings/i }))
      expect(screen.getByTestId("settings-popover")).toBeInTheDocument()
      fireEvent.click(screen.getByRole("button", { name: /settings/i }))
      expect(screen.queryByTestId("settings-popover")).not.toBeInTheDocument()
    })

    it("should close popover when Escape is pressed", () => {
      const onChange = vi.fn()
      render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
      fireEvent.click(screen.getByRole("button", { name: /settings/i }))
      expect(screen.getByTestId("settings-popover")).toBeInTheDocument()
      fireEvent.keyDown(document, { key: "Escape" })
      expect(screen.queryByTestId("settings-popover")).not.toBeInTheDocument()
    })

    describe("appearance toggle", () => {
      it("should render Light and Dark buttons", () => {
        const onChange = vi.fn()
        render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
        fireEvent.click(screen.getByRole("button", { name: /settings/i }))
        expect(screen.getByRole("button", { name: /light/i })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /dark/i })).toBeInTheDocument()
      })

      it("should call onSettingsChange with dark appearance when Dark is clicked", () => {
        const onChange = vi.fn()
        render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
        fireEvent.click(screen.getByRole("button", { name: /settings/i }))
        fireEvent.click(screen.getByRole("button", { name: /dark/i }))
        expect(onChange).toHaveBeenCalledWith({ ...defaultSettings, appearance: "dark" })
      })

      it("should call onSettingsChange with light appearance when Light is clicked", () => {
        const onChange = vi.fn()
        const darkSettings = { ...defaultSettings, appearance: "dark" as const }
        render(<Toolbar settings={darkSettings} onSettingsChange={onChange} />)
        fireEvent.click(screen.getByRole("button", { name: /settings/i }))
        fireEvent.click(screen.getByRole("button", { name: /light/i }))
        expect(onChange).toHaveBeenCalledWith({ ...darkSettings, appearance: "light" })
      })
    })

    describe("accent color swatches", () => {
      it("should render all accent color swatches", () => {
        const onChange = vi.fn()
        render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
        fireEvent.click(screen.getByRole("button", { name: /settings/i }))
        ACCENT_COLORS.forEach((color) => {
          expect(screen.getByTestId(`accent-${color}`)).toBeInTheDocument()
        })
      })

      it("should call onSettingsChange when a swatch is clicked", () => {
        const onChange = vi.fn()
        render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
        fireEvent.click(screen.getByRole("button", { name: /settings/i }))
        fireEvent.click(screen.getByTestId("accent-#dc2626"))
        expect(onChange).toHaveBeenCalledWith({ ...defaultSettings, accentColor: "#dc2626" })
      })
    })

    describe("background style", () => {
      it("should render Grid, Dots, and Blank buttons", () => {
        const onChange = vi.fn()
        render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
        fireEvent.click(screen.getByRole("button", { name: /settings/i }))
        expect(screen.getByRole("button", { name: /^grid$/i })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /^dots$/i })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /^blank$/i })).toBeInTheDocument()
      })

      it("should call onSettingsChange when background style is changed", () => {
        const onChange = vi.fn()
        render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
        fireEvent.click(screen.getByRole("button", { name: /settings/i }))
        fireEvent.click(screen.getByRole("button", { name: /^dots$/i }))
        expect(onChange).toHaveBeenCalledWith({ ...defaultSettings, backgroundStyle: "dots" })
      })
    })

    describe("line style", () => {
      it("should render Solid, Dashed, and Dotted buttons", () => {
        const onChange = vi.fn()
        render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
        fireEvent.click(screen.getByRole("button", { name: /settings/i }))
        expect(screen.getByRole("button", { name: /^solid$/i })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /^dashed$/i })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /^dotted$/i })).toBeInTheDocument()
      })

      it("should call onSettingsChange when line style is changed", () => {
        const onChange = vi.fn()
        render(<Toolbar settings={defaultSettings} onSettingsChange={onChange} />)
        fireEvent.click(screen.getByRole("button", { name: /settings/i }))
        fireEvent.click(screen.getByRole("button", { name: /^dashed$/i }))
        expect(onChange).toHaveBeenCalledWith({ ...defaultSettings, lineStyle: "dashed" })
      })
    })
  })
})
