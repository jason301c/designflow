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

  describe("per-screen viewport toggle", () => {
    it("should render D/T/M viewport toggle buttons", () => {
      render(<ScreenNode {...defaultProps} />)
      expect(screen.getByTestId("viewport-toggle")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /desktop/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /tablet/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /mobile/i })).toBeInTheDocument()
    })

    it("should default to desktop active", () => {
      render(<ScreenNode {...defaultProps} />)
      const desktopBtn = screen.getByRole("button", { name: /desktop/i })
      expect(desktopBtn).toHaveAttribute("data-active", "true")
    })

    it("should change thumbnail size when clicking mobile toggle", () => {
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

      // Click mobile
      fireEvent.click(screen.getByRole("button", { name: /mobile/i }))

      // Now should be mobile: 390x844
      expect(inner.style.width).toBe("390px")
      expect(inner.style.height).toBe("844px")
    })

    it("should change thumbnail size when clicking tablet toggle", () => {
      function TestScreen() {
        return <div>Content</div>
      }
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, component: TestScreen },
      }
      render(<ScreenNode {...props} />)

      fireEvent.click(screen.getByRole("button", { name: /tablet/i }))

      const inner = getInnerContent()
      expect(inner.style.width).toBe("768px")
      expect(inner.style.height).toBe("1024px")
    })

    it("should update active state when viewport toggle is clicked", () => {
      render(<ScreenNode {...defaultProps} />)
      const mobileBtn = screen.getByRole("button", { name: /mobile/i })
      const desktopBtn = screen.getByRole("button", { name: /desktop/i })

      fireEvent.click(mobileBtn)

      expect(mobileBtn).toHaveAttribute("data-active", "true")
      expect(desktopBtn).toHaveAttribute("data-active", "false")
    })

    it("should initialize with viewport from data prop", () => {
      const props = {
        ...defaultProps,
        data: { ...defaultProps.data, viewport: "tablet" as const },
      }
      render(<ScreenNode {...props} />)
      const tabletBtn = screen.getByRole("button", { name: /tablet/i })
      expect(tabletBtn).toHaveAttribute("data-active", "true")
    })

  })

  describe("per-screen color scheme toggle", () => {
    it("should render light/dark toggle buttons", () => {
      render(<ScreenNode {...defaultProps} />)
      expect(screen.getByTestId("color-scheme-toggle")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /light/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /dark/i })).toBeInTheDocument()
    })

    it("should default to light active", () => {
      render(<ScreenNode {...defaultProps} />)
      const lightBtn = screen.getByRole("button", { name: /light/i })
      expect(lightBtn).toHaveAttribute("data-active", "true")
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

      fireEvent.click(screen.getByRole("button", { name: /dark/i }))

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

      fireEvent.click(screen.getByRole("button", { name: /dark/i }))

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
      fireEvent.click(screen.getByRole("button", { name: /dark/i }))
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

      const darkBtn = screen.getByRole("button", { name: /dark/i })
      expect(darkBtn).toHaveAttribute("data-active", "true")
      const thumbnail = screen.getByTestId("screen-thumbnail")
      expect(thumbnail.style.background).toContain("15, 23, 42")
    })
  })
})
