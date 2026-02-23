import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { Canvas } from "../../src/app/Canvas"
import { DEFAULT_CANVAS_SETTINGS } from "../../src/types"
import type { DesignFlowConfig, CanvasSettings } from "../../src/types"

// Track onNodeDragStop callback passed to ReactFlow
let capturedOnNodeDragStop: ((...args: any[]) => void) | undefined
let capturedDefaultEdgeOptions: any

// Mock React Flow since jsdom doesn't support full rendering
vi.mock("@xyflow/react", () => {
  const ReactFlow = ({ nodes, edges, children, onNodeDragStop, defaultEdgeOptions, ...props }: any) => {
    capturedOnNodeDragStop = onNodeDragStop
    capturedDefaultEdgeOptions = defaultEdgeOptions
    return (
      <div data-testid="react-flow" data-nodes={JSON.stringify(nodes)} data-edges={JSON.stringify(edges)} data-has-drag-handler={String(!!onNodeDragStop)} data-default-edge-options={JSON.stringify(defaultEdgeOptions)}>
        {nodes?.map((n: any) => (
          <div key={n.id} data-testid={`node-${n.id}`}>
            {n.data?.title}
          </div>
        ))}
        {edges?.map((e: any) => (
          <div key={e.id} data-testid={`edge-${e.id}`}>
            {e.data?.label}
          </div>
        ))}
        {children}
      </div>
    )
  }

  return {
    ReactFlow,
    MiniMap: () => <div data-testid="minimap" />,
    Background: ({ variant, color }: any) => <div data-testid="background" data-variant={variant} data-color={color} />,
    BackgroundVariant: { Lines: "lines", Dots: "dots", Cross: "cross" },
    Handle: ({ type, position }: any) => <div data-testid={`handle-${type}`} />,
    Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
    BaseEdge: ({ path }: any) => <path d={path} />,
    EdgeLabelRenderer: ({ children }: any) => <div>{children}</div>,
    getSmoothStepPath: () => ["M0,0", 0, 0],
    MarkerType: { ArrowClosed: "arrowclosed" },
    useNodesState: (initial: any) => [initial, vi.fn(), vi.fn()],
    useEdgesState: (initial: any) => [initial, vi.fn(), vi.fn()],
    ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
    useReactFlow: () => ({ fitView: vi.fn(), zoomIn: vi.fn(), zoomOut: vi.fn(), setCenter: vi.fn() }),
  }
})

const sampleConfig: DesignFlowConfig = {
  screens: {
    login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
    dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 450, y: 0 } },
  },
  edges: [
    { from: "login", to: "dashboard", label: "Sign in" },
  ],
}

const defaultSettings: CanvasSettings = { ...DEFAULT_CANVAS_SETTINGS }

describe("Canvas", () => {
  it("should render React Flow instance", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    expect(screen.getByTestId("react-flow")).toBeInTheDocument()
  })

  it("should create nodes from screen config", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    expect(screen.getByTestId("node-login")).toBeInTheDocument()
    expect(screen.getByTestId("node-dashboard")).toBeInTheDocument()
  })

  it("should show screen titles in nodes", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    expect(screen.getByText("Login")).toBeInTheDocument()
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })

  it("should create edges with handle IDs from edge config", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    const edgeEl = screen.getByTestId("edge-login-dashboard")
    expect(edgeEl).toBeInTheDocument()
    // Verify edge data includes sourceHandle and targetHandle
    const rfEl = screen.getByTestId("react-flow")
    const edges = JSON.parse(rfEl.getAttribute("data-edges") || "[]")
    const edge = edges.find((e: any) => e.id === "login-dashboard")
    expect(edge.sourceHandle).toBe("source-right")
    expect(edge.targetHandle).toBe("target-left")
  })

  it("should show edge labels", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    expect(screen.getByText("Sign in")).toBeInTheDocument()
  })

  it("should handle empty config", () => {
    const emptyConfig: DesignFlowConfig = { screens: {} }
    render(<Canvas config={emptyConfig} onScreenSelect={vi.fn()} />)
    expect(screen.getByTestId("react-flow")).toBeInTheDocument()
  })

  it("should accept focusNodeId prop", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} focusNodeId="login" />)
    expect(screen.getByTestId("react-flow")).toBeInTheDocument()
  })

  it("should pass viewport through node data", () => {
    const configWithViewport: DesignFlowConfig = {
      screens: {
        login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 }, viewport: "mobile" },
      },
    }
    render(<Canvas config={configWithViewport} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    const nodes = JSON.parse(rfEl.getAttribute("data-nodes") || "[]")
    expect(nodes[0].data.viewport).toBe("mobile")
  })

  it("should not pass resolution in node data", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    const nodes = JSON.parse(rfEl.getAttribute("data-nodes") || "[]")
    expect(nodes[0].data).not.toHaveProperty("resolution")
  })

  it("should render MiniMap inside ReactFlow", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    expect(screen.getByTestId("minimap")).toBeInTheDocument()
  })

  it("should render Toolbar", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    expect(screen.getByTestId("toolbar")).toBeInTheDocument()
  })

  describe("dark mode", () => {
    it("should apply truly dark background (#000) when appearance is dark", () => {
      const darkSettings = { ...defaultSettings, appearance: "dark" as const }
      render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} settings={darkSettings} onSettingsChange={vi.fn()} />)
      const wrapper = screen.getByTestId("react-flow").parentElement as HTMLElement
      // #000000 → rgb(0, 0, 0)
      expect(wrapper.style.background).toContain("0, 0, 0")
    })

    it("should default to light background", () => {
      render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
      const wrapper = screen.getByTestId("react-flow").parentElement as HTMLElement
      expect(wrapper.style.background).not.toContain("0, 0, 0")
    })
  })

  describe("background style", () => {
    it("should render Background with Lines variant when backgroundStyle is grid", () => {
      render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} settings={defaultSettings} onSettingsChange={vi.fn()} />)
      const bg = screen.getByTestId("background")
      expect(bg.getAttribute("data-variant")).toBe("lines")
    })

    it("should render Background with Dots variant when backgroundStyle is dots", () => {
      const dotsSettings = { ...defaultSettings, backgroundStyle: "dots" as const }
      render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} settings={dotsSettings} onSettingsChange={vi.fn()} />)
      const bg = screen.getByTestId("background")
      expect(bg.getAttribute("data-variant")).toBe("dots")
    })

    it("should not render Background when backgroundStyle is blank", () => {
      const blankSettings = { ...defaultSettings, backgroundStyle: "blank" as const }
      render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} settings={blankSettings} onSettingsChange={vi.fn()} />)
      expect(screen.queryByTestId("background")).not.toBeInTheDocument()
    })

    it("should not render Background when no settings provided", () => {
      render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
      expect(screen.queryByTestId("background")).not.toBeInTheDocument()
    })
  })

  describe("edge settings", () => {
    it("should pass accentColor and lineStyle through edge data", () => {
      const settings = { ...defaultSettings, accentColor: "#dc2626", lineStyle: "dashed" as const }
      render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} settings={settings} onSettingsChange={vi.fn()} />)
      const rfEl = screen.getByTestId("react-flow")
      const edges = JSON.parse(rfEl.getAttribute("data-edges") || "[]")
      const edge = edges.find((e: any) => e.id === "login-dashboard")
      expect(edge.data.accentColor).toBe("#dc2626")
      expect(edge.data.lineStyle).toBe("dashed")
    })

    it("should not use arrow markers on edges", () => {
      render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} settings={defaultSettings} onSettingsChange={vi.fn()} />)
      const rfEl = screen.getByTestId("react-flow")
      const opts = JSON.parse(rfEl.getAttribute("data-default-edge-options") || "{}")
      expect(opts.markerEnd).toBeUndefined()
    })
  })
})

describe("Canvas — inferred edges merging", () => {
  const configWithEdge: DesignFlowConfig = {
    screens: {
      login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
      dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 450, y: 0 } },
      settings: { title: "Settings", file: "./screens/Settings.tsx", position: { x: 900, y: 0 } },
    },
    edges: [
      { from: "login", to: "dashboard", label: "Sign in" },
    ],
  }

  const inferredEdges = [
    { from: "login", to: "dashboard", label: "navigate", inferred: true },
    { from: "login", to: "settings", label: "navigate", inferred: true },
  ]

  it("should prefer explicit edges over inferred edges for the same from+to pair", () => {
    render(<Canvas config={configWithEdge} inferredEdges={inferredEdges} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    const edges = JSON.parse(rfEl.getAttribute("data-edges") || "[]")
    // login->dashboard should be the explicit edge (no inferred flag)
    const loginDash = edges.find((e: any) => e.id === "login-dashboard")
    expect(loginDash).toBeDefined()
    expect(loginDash.data.label).toBe("Sign in")
    expect(loginDash.data.inferred).toBeFalsy()
  })

  it("should include inferred edges that are not covered by explicit edges", () => {
    render(<Canvas config={configWithEdge} inferredEdges={inferredEdges} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    const edges = JSON.parse(rfEl.getAttribute("data-edges") || "[]")
    // login->settings is only inferred, should appear
    const loginSettings = edges.find((e: any) => e.id === "inferred-login-settings")
    expect(loginSettings).toBeDefined()
    expect(loginSettings.data.inferred).toBe(true)
  })

  it("should render without inferred edges when prop is not provided", () => {
    render(<Canvas config={configWithEdge} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    const edges = JSON.parse(rfEl.getAttribute("data-edges") || "[]")
    expect(edges).toHaveLength(1)
    expect(edges[0].id).toBe("login-dashboard")
  })

  it("should render without inferred edges when prop is empty array", () => {
    render(<Canvas config={configWithEdge} inferredEdges={[]} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    const edges = JSON.parse(rfEl.getAttribute("data-edges") || "[]")
    expect(edges).toHaveLength(1)
  })

  it("should collapse reverse-direction edges into one per unordered pair", () => {
    // Explicit: login→dashboard, Inferred: dashboard→login
    // Should only produce one edge for the (login, dashboard) pair
    const reverseInferred = [
      { from: "dashboard", to: "login", label: "navigate", inferred: true },
      { from: "login", to: "settings", label: "navigate", inferred: true },
    ]
    render(<Canvas config={configWithEdge} inferredEdges={reverseInferred} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    const edges = JSON.parse(rfEl.getAttribute("data-edges") || "[]")
    // login↔dashboard = 1 edge (explicit wins), login→settings = 1 inferred edge
    expect(edges).toHaveLength(2)
    // The explicit login→dashboard should be kept
    const loginDash = edges.find((e: any) => e.id === "login-dashboard")
    expect(loginDash).toBeDefined()
    expect(loginDash.data.label).toBe("Sign in")
    // No reverse dashboard→login edge
    const dashLogin = edges.find((e: any) => e.source === "dashboard" && e.target === "login")
    expect(dashLogin).toBeUndefined()
  })

  it("should deduplicate inferred edges that form a reverse pair", () => {
    const configNoEdges: DesignFlowConfig = {
      screens: {
        login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
        dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 450, y: 0 } },
      },
    }
    const bidirectionalInferred = [
      { from: "login", to: "dashboard", label: "navigate", inferred: true },
      { from: "dashboard", to: "login", label: "navigate", inferred: true },
    ]
    render(<Canvas config={configNoEdges} inferredEdges={bidirectionalInferred} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    const edges = JSON.parse(rfEl.getAttribute("data-edges") || "[]")
    // Only one edge for the (login, dashboard) pair
    expect(edges).toHaveLength(1)
  })

  it("should deduplicate explicit edges that form a reverse pair", () => {
    const configBidirectional: DesignFlowConfig = {
      screens: {
        dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 0, y: 0 } },
        settings: { title: "Settings", file: "./screens/Settings.tsx", position: { x: 450, y: 0 } },
      },
      edges: [
        { from: "dashboard", to: "settings", label: "Gear icon" },
        { from: "settings", to: "dashboard", label: "Back" },
      ],
    }
    render(<Canvas config={configBidirectional} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    const edges = JSON.parse(rfEl.getAttribute("data-edges") || "[]")
    // Only one edge — first explicit wins
    expect(edges).toHaveLength(1)
    expect(edges[0].id).toBe("dashboard-settings")
    expect(edges[0].data.label).toBe("Gear icon")
  })
})

describe("Canvas — position persistence", () => {
  beforeEach(() => {
    capturedOnNodeDragStop = undefined
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: true })))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("should pass onNodeDragStop handler to ReactFlow", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    const rfEl = screen.getByTestId("react-flow")
    expect(rfEl.getAttribute("data-has-drag-handler")).toBe("true")
  })

  it("should send position update to dev server when node is dragged", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)

    expect(capturedOnNodeDragStop).toBeDefined()

    // Simulate drag stop event
    const mockEvent = {} as any
    const mockNode = { id: "login", position: { x: 100, y: 200 } }
    capturedOnNodeDragStop!(mockEvent, mockNode)

    expect(fetch).toHaveBeenCalledWith(
      "/__designflow/update-positions",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positions: { login: { x: 100, y: 200 } },
        }),
      }),
    )
  })
})
