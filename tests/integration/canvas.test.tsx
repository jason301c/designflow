import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { Canvas } from "../../src/app/Canvas"
import type { DesignFlowConfig } from "../../src/types"

// Track onNodeDragStop callback passed to ReactFlow
let capturedOnNodeDragStop: ((...args: any[]) => void) | undefined

// Mock React Flow since jsdom doesn't support full rendering
vi.mock("@xyflow/react", () => {
  const ReactFlow = ({ nodes, edges, children, onNodeDragStop, ...props }: any) => {
    capturedOnNodeDragStop = onNodeDragStop
    return (
      <div data-testid="react-flow" data-nodes={JSON.stringify(nodes)} data-edges={JSON.stringify(edges)} data-has-drag-handler={String(!!onNodeDragStop)}>
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

  it("should pass onThemeToggle to Toolbar", () => {
    const onThemeToggle = vi.fn()
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} onThemeToggle={onThemeToggle} />)
    // Theme button should be rendered inside toolbar when onThemeToggle is provided
    expect(screen.getByRole("button", { name: /theme/i })).toBeInTheDocument()
  })

  it("should not render Theme button when onThemeToggle is not provided", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    expect(screen.queryByRole("button", { name: /theme/i })).not.toBeInTheDocument()
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
