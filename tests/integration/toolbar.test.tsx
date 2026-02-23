import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Toolbar } from "../../src/app/Toolbar"
import { DEFAULT_CANVAS_SETTINGS, ACCENT_COLORS } from "../../src/types"
import type { CanvasSettings } from "../../src/types"

const mockZoomIn = vi.fn()
const mockZoomOut = vi.fn()
const mockFitView = vi.fn()
const mockGetNodes = vi.fn(() => [])

// Mock React Flow
vi.mock("@xyflow/react", () => ({
  useReactFlow: () => ({
    zoomIn: mockZoomIn,
    zoomOut: mockZoomOut,
    fitView: mockFitView,
    getNodes: mockGetNodes,
  }),
}))

// Mock export-png
const mockExportCanvasPng = vi.fn()
vi.mock("../../src/app/export-png", () => ({
  exportCanvasPng: (...args: any[]) => mockExportCanvasPng(...args),
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

  it("should not tint toolbar border with accent color", () => {
    const onChange = vi.fn()
    const settings = { ...defaultSettings, accentColor: "#dc2626" }
    render(<Toolbar settings={settings} onSettingsChange={onChange} />)
    const toolbar = screen.getByTestId("toolbar")
    // Should use default gray border, not accent
    expect(toolbar.style.borderColor).toContain("226, 232, 240")
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
        fireEvent.click(screen.getByTestId("accent-#ef3060"))
        expect(onChange).toHaveBeenCalledWith({ ...defaultSettings, accentColor: "#ef3060" })
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

  describe("export canvas PNG", () => {
    it("should render export button with correct aria-label", () => {
      render(<Toolbar />)
      expect(screen.getByRole("button", { name: /export canvas as png/i })).toBeInTheDocument()
    })

    it("should have correct data-testid", () => {
      render(<Toolbar />)
      expect(screen.getByTestId("export-canvas-png")).toBeInTheDocument()
    })

    it("should call exportCanvasPng on click", () => {
      render(<Toolbar />)
      fireEvent.click(screen.getByTestId("export-canvas-png"))
      expect(mockExportCanvasPng).toHaveBeenCalledWith(mockGetNodes, { backgroundColor: "#ffffff", projectName: undefined })
    })

    it("should pass black background when dark mode", () => {
      const onChange = vi.fn()
      const darkSettings = { ...defaultSettings, appearance: "dark" as const }
      render(<Toolbar settings={darkSettings} onSettingsChange={onChange} />)
      fireEvent.click(screen.getByTestId("export-canvas-png"))
      expect(mockExportCanvasPng).toHaveBeenCalledWith(mockGetNodes, { backgroundColor: "#000000", projectName: undefined })
    })

    it("should pass project name to exportCanvasPng", () => {
      render(<Toolbar projectName="My App" />)
      fireEvent.click(screen.getByTestId("export-canvas-png"))
      expect(mockExportCanvasPng).toHaveBeenCalledWith(mockGetNodes, { backgroundColor: "#ffffff", projectName: "My App" })
    })
  })
})
