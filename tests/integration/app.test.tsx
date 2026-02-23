import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { App } from "../../src/app/App"
import { DEFAULT_CANVAS_SETTINGS } from "../../src/types"
import type { DesignFlowConfig } from "../../src/types"

// Mock React Flow and its provider
vi.mock("@xyflow/react", () => {
  const ReactFlow = ({ nodes, children, defaultEdgeOptions }: any) => (
    <div data-testid="react-flow" data-default-edge-options={JSON.stringify(defaultEdgeOptions)}>
      {nodes?.map((n: any) => (
        <div key={n.id} data-testid={`node-${n.id}`} onDoubleClick={() => n.data?.onSelect?.(n.id)}>
          {n.data?.title}
        </div>
      ))}
      {children}
    </div>
  )
  return {
    ReactFlow,
    ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
    Handle: () => <div />,
    Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
    BaseEdge: () => <path />,
    EdgeLabelRenderer: ({ children }: any) => <div>{children}</div>,
    getSmoothStepPath: () => ["M0,0", 0, 0],
    MarkerType: { ArrowClosed: "arrowclosed" },
    MiniMap: () => <div />,
    Background: ({ variant, color }: any) => <div data-testid="background" data-variant={variant} data-color={color} />,
    BackgroundVariant: { Lines: "lines", Dots: "dots", Cross: "cross" },
    useNodesState: (initial: any) => [initial, vi.fn(), vi.fn()],
    useEdgesState: (initial: any) => [initial, vi.fn(), vi.fn()],
    useReactFlow: () => ({ fitView: vi.fn(), zoomIn: vi.fn(), zoomOut: vi.fn(), setCenter: vi.fn() }),
  }
})

const sampleConfig: DesignFlowConfig = {
  screens: {
    login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
  },
  edges: [],
}

function MockScreen() {
  return <div>Mock Screen</div>
}

describe("App", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should render canvas", () => {
    render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
    expect(screen.getByTestId("react-flow")).toBeInTheDocument()
  })

  it("should render screen nodes from config", () => {
    render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("should pass screens prop to Canvas", () => {
    render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
    const rfEl = screen.getByTestId("react-flow")
    expect(rfEl).toBeInTheDocument()
  })

  it("should pass focusNodeId to Canvas when viewer was closed", async () => {
    render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
    expect(screen.getByTestId("react-flow")).toBeInTheDocument()
  })

  describe("canvas settings", () => {
    it("should render settings button", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument()
    })

    it("should use default settings initially", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      // Default is light mode, so no dark bg
      const wrapper = screen.getByTestId("react-flow").parentElement as HTMLElement
      expect(wrapper.style.background).not.toContain("0, 0, 0")
    })

    it("should toggle to dark mode via settings popover", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      fireEvent.click(screen.getByRole("button", { name: /settings/i }))
      fireEvent.click(screen.getByRole("button", { name: /dark/i }))
      const wrapper = screen.getByTestId("react-flow").parentElement as HTMLElement
      expect(wrapper.style.background).toContain("0, 0, 0")
    })

    it("should persist settings to localStorage as JSON", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      fireEvent.click(screen.getByRole("button", { name: /settings/i }))
      fireEvent.click(screen.getByRole("button", { name: /dark/i }))
      const stored = JSON.parse(localStorage.getItem("df-appearance") || "{}")
      expect(stored.appearance).toBe("dark")
    })

    it("should restore settings from localStorage", () => {
      const customSettings = { ...DEFAULT_CANVAS_SETTINGS, appearance: "dark" }
      localStorage.setItem("df-appearance", JSON.stringify(customSettings))
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      const wrapper = screen.getByTestId("react-flow").parentElement as HTMLElement
      expect(wrapper.style.background).toContain("0, 0, 0")
    })

    it("should fall back to defaults when localStorage has invalid JSON", () => {
      localStorage.setItem("df-appearance", "not-json")
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      const wrapper = screen.getByTestId("react-flow").parentElement as HTMLElement
      expect(wrapper.style.background).not.toContain("0, 0, 0")
    })

    it("should render background with grid by default", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      const bg = screen.getByTestId("background")
      expect(bg.getAttribute("data-variant")).toBe("lines")
    })

    it("should update accent color via settings", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      fireEvent.click(screen.getByRole("button", { name: /settings/i }))
      fireEvent.click(screen.getByTestId("accent-#dc2626"))
      const toolbar = screen.getByTestId("toolbar")
      // #dc2626 → rgb(220, 38, 38)
      expect(toolbar.style.borderColor).toContain("220, 38, 38")
    })
  })
})
