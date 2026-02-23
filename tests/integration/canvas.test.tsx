import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { Canvas } from "../../src/app/Canvas"
import type { DesignFlowConfig } from "../../src/types"

// Mock React Flow since jsdom doesn't support full rendering
vi.mock("@xyflow/react", () => {
  const ReactFlow = ({ nodes, edges, children, ...props }: any) => (
    <div data-testid="react-flow" data-nodes={JSON.stringify(nodes)} data-edges={JSON.stringify(edges)}>
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

  return {
    ReactFlow,
    Handle: ({ type, position }: any) => <div data-testid={`handle-${type}`} />,
    Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
    BaseEdge: ({ path }: any) => <path d={path} />,
    EdgeLabelRenderer: ({ children }: any) => <div>{children}</div>,
    getBezierPath: () => ["M0,0", 0, 0],
    useNodesState: (initial: any) => [initial, vi.fn(), vi.fn()],
    useEdgesState: (initial: any) => [initial, vi.fn(), vi.fn()],
    ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
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

  it("should create edges from edge config", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    expect(screen.getByTestId("edge-login-dashboard")).toBeInTheDocument()
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
})
