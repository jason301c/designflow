import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Toolbar } from "../../src/app/Toolbar"

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

  it("should not render viewport preset buttons", () => {
    render(<Toolbar />)
    expect(screen.queryByRole("button", { name: /desktop/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /tablet/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /mobile/i })).not.toBeInTheDocument()
  })

  it("should render with toolbar testid", () => {
    render(<Toolbar />)
    expect(screen.getByTestId("toolbar")).toBeInTheDocument()
  })
})
