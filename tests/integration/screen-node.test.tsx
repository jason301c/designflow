import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ScreenNode } from "../../src/app/ScreenNode"

// Mock Handle from React Flow
vi.mock("@xyflow/react", () => ({
  Handle: ({ type, position, id }: any) => <div data-testid={`handle-${type}`} data-position={position} data-handle-id={id} />,
  Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
}))

describe("ScreenNode", () => {
  const defaultProps = {
    id: "login",
    type: "screen" as const,
    data: {
      title: "Login",
      screenId: "login",
      onSelect: vi.fn(),
    },
    selected: false,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
    dragging: false,
    dragHandle: undefined,
    parentId: undefined,
    sourcePosition: undefined,
    targetPosition: undefined,
    width: 300,
    height: 200,
    measured: { width: 300, height: 200 },
  }

  it("should render screen title", () => {
    render(<ScreenNode {...defaultProps} />)
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("should have left target and right source handles", () => {
    render(<ScreenNode {...defaultProps} />)
    const target = screen.getByTestId("handle-target")
    const source = screen.getByTestId("handle-source")
    expect(target).toBeInTheDocument()
    expect(source).toBeInTheDocument()
    expect(target).toHaveAttribute("data-position", "left")
    expect(source).toHaveAttribute("data-position", "right")
    expect(target).toHaveAttribute("data-handle-id", "target-left")
    expect(source).toHaveAttribute("data-handle-id", "source-right")
  })

  it("should call onSelect when clicked", () => {
    render(<ScreenNode {...defaultProps} />)
    fireEvent.doubleClick(screen.getByText("Login"))
    expect(defaultProps.data.onSelect).toHaveBeenCalledWith("login")
  })

  it("should render screen component when provided", () => {
    function TestScreen() {
      return <div data-testid="test-screen">Screen Content</div>
    }
    const props = {
      ...defaultProps,
      data: { ...defaultProps.data, component: TestScreen },
    }
    render(<ScreenNode {...props} />)
    expect(screen.getByTestId("test-screen")).toBeInTheDocument()
    expect(screen.getByText("Screen Content")).toBeInTheDocument()
  })

  it("should have a thumbnail container with data-testid", () => {
    render(<ScreenNode {...defaultProps} />)
    expect(screen.getByTestId("screen-thumbnail")).toBeInTheDocument()
  })

  it("should apply scale transform to thumbnail content", () => {
    function TestScreen() {
      return <div>Content</div>
    }
    const props = {
      ...defaultProps,
      data: { ...defaultProps.data, component: TestScreen },
    }
    render(<ScreenNode {...props} />)
    const thumbnail = screen.getByTestId("screen-thumbnail")
    // The inner content wrapper should have a transform scale
    const inner = thumbnail.firstElementChild
    expect(inner).toBeTruthy()
    expect((inner as HTMLElement).style.transform).toContain("scale")
  })

  it("should render at desktop resolution by default", () => {
    function TestScreen() {
      return <div>Content</div>
    }
    const props = {
      ...defaultProps,
      data: { ...defaultProps.data, component: TestScreen },
    }
    render(<ScreenNode {...props} />)
    const thumbnail = screen.getByTestId("screen-thumbnail")
    const inner = thumbnail.firstElementChild as HTMLElement
    // Default desktop: 1440x900, scale = 420/max(1440,900) ≈ 0.292
    expect(inner.style.width).toBe("1440px")
    expect(inner.style.height).toBe("900px")
  })

  it("should render at mobile resolution when viewport is mobile", () => {
    function TestScreen() {
      return <div>Content</div>
    }
    const props = {
      ...defaultProps,
      data: { ...defaultProps.data, component: TestScreen, viewport: "mobile" as const },
    }
    render(<ScreenNode {...props} />)
    const thumbnail = screen.getByTestId("screen-thumbnail")
    const inner = thumbnail.firstElementChild as HTMLElement
    // Mobile: 390x844
    expect(inner.style.width).toBe("390px")
    expect(inner.style.height).toBe("844px")
  })

  it("should render at tablet resolution when viewport is tablet", () => {
    function TestScreen() {
      return <div>Content</div>
    }
    const props = {
      ...defaultProps,
      data: { ...defaultProps.data, component: TestScreen, viewport: "tablet" as const },
    }
    render(<ScreenNode {...props} />)
    const thumbnail = screen.getByTestId("screen-thumbnail")
    const inner = thumbnail.firstElementChild as HTMLElement
    // Tablet: 768x1024
    expect(inner.style.width).toBe("768px")
    expect(inner.style.height).toBe("1024px")
  })

  it("should use explicit resolution over viewport preset", () => {
    function TestScreen() {
      return <div>Content</div>
    }
    const props = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        component: TestScreen,
        viewport: "mobile" as const,
        resolution: { width: 1920, height: 1080 },
      },
    }
    render(<ScreenNode {...props} />)
    const thumbnail = screen.getByTestId("screen-thumbnail")
    const inner = thumbnail.firstElementChild as HTMLElement
    expect(inner.style.width).toBe("1920px")
    expect(inner.style.height).toBe("1080px")
  })

  it("should size thumbnail proportional to resolution", () => {
    function TestScreen() {
      return <div>Content</div>
    }
    const props = {
      ...defaultProps,
      data: { ...defaultProps.data, component: TestScreen, viewport: "mobile" as const },
    }
    render(<ScreenNode {...props} />)
    const thumbnail = screen.getByTestId("screen-thumbnail")
    // Mobile 390x844: scale = 420/844 ≈ 0.498, thumbnail = 194x420
    expect(thumbnail.style.width).toBe("194px")
    expect(thumbnail.style.height).toBe("420px")
  })

  it("should display resolution badge", () => {
    function TestScreen() {
      return <div>Content</div>
    }
    const props = {
      ...defaultProps,
      data: { ...defaultProps.data, component: TestScreen, viewport: "mobile" as const },
    }
    render(<ScreenNode {...props} />)
    expect(screen.getByText("390\u00d7844")).toBeInTheDocument()
  })
})
