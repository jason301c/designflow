import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { ScreenNode } from "../../src/app/ScreenNode"

// Mock Handle from React Flow
vi.mock("@xyflow/react", () => ({
  Handle: ({ type, position, id }: any) => <div data-testid={`handle-${type}`} data-position={position} data-handle-id={id} />,
  Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
}))

// Mock export-png
const mockExportScreenPng = vi.fn()
vi.mock("../../src/app/export-png", () => ({
  exportScreenPng: (...args: any[]) => mockExportScreenPng(...args),
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
    selectable: true,
    deletable: true,
    draggable: true,
    width: 300,
    height: 200,
    measured: { width: 300, height: 200 },
  }

  /** Helper: find the color-scheme wrapper inside the thumbnail */
  function getColorSchemeWrapper() {
    return screen.getByTestId("screen-thumbnail").querySelector("[data-df-color-scheme]") as HTMLElement
  }

  /** Helper: find the inner content div (with transform scale) inside the color-scheme wrapper */
  function getInnerContent() {
    return getColorSchemeWrapper().firstElementChild as HTMLElement
  }

  it("should render screen title inside pill bar", () => {
    render(<ScreenNode {...defaultProps} />)
    const title = screen.getByTestId("node-title")
    expect(title).toBeInTheDocument()
    expect(title.textContent).toBe("Login")
    // Title should be inside the controls pill, not the thumbnail
    const controls = screen.getByTestId("node-controls")
    expect(controls.contains(title)).toBe(true)
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
    fireEvent.doubleClick(screen.getByTestId("node-title"))
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

  it("should render pill-shaped controls bar above thumbnail", () => {
    render(<ScreenNode {...defaultProps} />)
    expect(screen.getByTestId("node-controls")).toBeInTheDocument()
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
    const inner = getInnerContent()
    expect(inner).toBeTruthy()
    expect(inner.style.transform).toContain("scale")
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
    const inner = getInnerContent()
    // Default desktop: 1440x900
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
    const inner = getInnerContent()
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
    const inner = getInnerContent()
    // Tablet: 768x1024
    expect(inner.style.width).toBe("768px")
    expect(inner.style.height).toBe("1024px")
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

  describe("viewport dropdown", () => {
    it("should render a viewport select dropdown", () => {
      render(<ScreenNode {...defaultProps} />)
      expect(screen.getByTestId("viewport-select")).toBeInTheDocument()
    })

    it("should default to desktop", () => {
      render(<ScreenNode {...defaultProps} />)
      const select = screen.getByTestId("viewport-select") as HTMLSelectElement
      expect(select.value).toBe("desktop")
    })

    it("should have desktop, tablet, mobile options", () => {
      render(<ScreenNode {...defaultProps} />)
      const select = screen.getByTestId("viewport-select") as HTMLSelectElement
      const options = Array.from(select.options).map((o) => o.value)
      expect(options).toEqual(["desktop", "tablet", "mobile"])
    })

    it("should change thumbnail size when selecting mobile", () => {
      function TestScreen() {
        return <div>Content</div>
      }
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, component: TestScreen },
      }
      render(<ScreenNode {...props} />)
      const inner = getInnerContent()
      expect(inner.style.width).toBe("1440px")

      fireEvent.change(screen.getByTestId("viewport-select"), { target: { value: "mobile" } })

      expect(inner.style.width).toBe("390px")
      expect(inner.style.height).toBe("844px")
    })

    it("should change thumbnail size when selecting tablet", () => {
      function TestScreen() {
        return <div>Content</div>
      }
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, component: TestScreen },
      }
      render(<ScreenNode {...props} />)

      fireEvent.change(screen.getByTestId("viewport-select"), { target: { value: "tablet" } })

      const inner = getInnerContent()
      expect(inner.style.width).toBe("768px")
      expect(inner.style.height).toBe("1024px")
    })

    it("should initialize with viewport from data prop", () => {
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, viewport: "tablet" as const },
      }
      render(<ScreenNode {...props} />)
      const select = screen.getByTestId("viewport-select") as HTMLSelectElement
      expect(select.value).toBe("tablet")
    })

    it("should overlay select with opacity 0 for clean look", () => {
      render(<ScreenNode {...defaultProps} />)
      const select = screen.getByTestId("viewport-select") as HTMLSelectElement
      expect(select.style.opacity).toBe("0")
    })
  })

  describe("accent color pill", () => {
    it("should use accent color as pill background when provided", () => {
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, accentColor: "#dc2626" },
      }
      render(<ScreenNode {...props} />)
      const controls = screen.getByTestId("node-controls")
      // #dc2626 → rgb(220, 38, 38)
      expect(controls.style.background).toContain("220, 38, 38")
    })

    it("should use white pill background when no accent color", () => {
      render(<ScreenNode {...defaultProps} />)
      const controls = screen.getByTestId("node-controls")
      expect(controls.style.background).toContain("255, 255, 255")
    })

    it("should use white text on accent-colored pill", () => {
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, accentColor: "#2563eb" },
      }
      render(<ScreenNode {...props} />)
      const title = screen.getByTestId("node-title")
      expect(title.style.color).toContain("255, 255, 255")
    })
  })

  describe("color scheme toggle", () => {
    it("should render a color scheme toggle", () => {
      render(<ScreenNode {...defaultProps} />)
      expect(screen.getByTestId("color-scheme-toggle")).toBeInTheDocument()
    })

    it("should default to light (unchecked)", () => {
      render(<ScreenNode {...defaultProps} />)
      const toggle = screen.getByTestId("color-scheme-toggle").querySelector("input") as HTMLInputElement
      expect(toggle.checked).toBe(false)
    })

    it("should change color-scheme CSS property when toggling to dark", () => {
      function TestScreen() {
        return <div>Content</div>
      }
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, component: TestScreen },
      }
      render(<ScreenNode {...props} />)

      const toggle = screen.getByTestId("color-scheme-toggle").querySelector("input") as HTMLInputElement
      fireEvent.click(toggle)

      const wrapper = getColorSchemeWrapper()
      expect(wrapper).toBeTruthy()
      expect(wrapper.style.colorScheme).toBe("dark")
    })

    it("should set data-df-color-scheme attribute on wrapper", () => {
      function TestScreen() {
        return <div>Content</div>
      }
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, component: TestScreen },
      }
      render(<ScreenNode {...props} />)

      const toggle = screen.getByTestId("color-scheme-toggle").querySelector("input") as HTMLInputElement
      fireEvent.click(toggle)

      const wrapper = getColorSchemeWrapper()
      expect(wrapper).toHaveAttribute("data-df-color-scheme", "dark")
    })

    it("should change thumbnail background for dark mode", () => {
      function TestScreen() {
        return <div>Content</div>
      }
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, component: TestScreen },
      }
      render(<ScreenNode {...props} />)

      // Default light background
      const thumbnail = screen.getByTestId("screen-thumbnail")
      expect(thumbnail.style.background).toContain("248, 250, 252")

      // Toggle to dark
      const toggle = screen.getByTestId("color-scheme-toggle").querySelector("input") as HTMLInputElement
      fireEvent.click(toggle)
      expect(thumbnail.style.background).toContain("15, 23, 42")
    })

    it("should initialize from colorScheme data prop", () => {
      function TestScreen() {
        return <div>Content</div>
      }
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, component: TestScreen, colorScheme: "dark" as const },
      }
      render(<ScreenNode {...props} />)

      const toggle = screen.getByTestId("color-scheme-toggle").querySelector("input") as HTMLInputElement
      expect(toggle.checked).toBe(true)
      const thumbnail = screen.getByTestId("screen-thumbnail")
      expect(thumbnail.style.background).toContain("15, 23, 42")
    })

    it("should sync color scheme when data prop changes", () => {
      function TestScreen() {
        return <div>Content</div>
      }
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, component: TestScreen, colorScheme: "light" as const },
      }
      const { rerender } = render(<ScreenNode {...props} />)

      // Starts light
      const thumbnail = screen.getByTestId("screen-thumbnail")
      expect(thumbnail.style.background).toContain("248, 250, 252")

      // Rerender with dark from parent (toolbar toggle)
      const darkProps = {
        ...defaultProps,
        data: { ...defaultProps.data, component: TestScreen, colorScheme: "dark" as const },
      }
      act(() => { rerender(<ScreenNode {...darkProps} />) })

      expect(thumbnail.style.background).toContain("15, 23, 42")
      const toggle = screen.getByTestId("color-scheme-toggle").querySelector("input") as HTMLInputElement
      expect(toggle.checked).toBe(true)
    })
  })

  describe("export screen PNG", () => {
    it("should render export button in pill bar", () => {
      render(<ScreenNode {...defaultProps} />)
      const btn = screen.getByTestId("export-screen-png")
      expect(btn).toBeInTheDocument()
      const controls = screen.getByTestId("node-controls")
      expect(controls.contains(btn)).toBe(true)
    })

    it("should have correct aria-label", () => {
      render(<ScreenNode {...defaultProps} />)
      expect(screen.getByRole("button", { name: /export screen as png/i })).toBeInTheDocument()
    })

    it("should call exportScreenPng with screenId on click", () => {
      render(<ScreenNode {...defaultProps} />)
      fireEvent.click(screen.getByTestId("export-screen-png"))
      expect(mockExportScreenPng).toHaveBeenCalledWith("login", undefined)
    })

    it("should pass project name to exportScreenPng", () => {
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, projectName: "Cool App" },
      }
      render(<ScreenNode {...props} />)
      fireEvent.click(screen.getByTestId("export-screen-png"))
      expect(mockExportScreenPng).toHaveBeenCalledWith("login", "Cool App")
    })

    it("should have data-df-screen-id on root element", () => {
      const { container } = render(<ScreenNode {...defaultProps} />)
      const root = container.firstElementChild as HTMLElement
      expect(root).toHaveAttribute("data-df-screen-id", "login")
    })

    it("should not propagate click to parent (prevents viewer open)", () => {
      const parentClick = vi.fn()
      const { container } = render(
        <div onClick={parentClick}>
          <ScreenNode {...defaultProps} />
        </div>
      )
      fireEvent.click(screen.getByTestId("export-screen-png"))
      expect(parentClick).not.toHaveBeenCalled()
    })
  })
})
