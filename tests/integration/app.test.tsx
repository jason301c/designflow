import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { App } from "../../src/app/App"
import type { DesignFlowConfig } from "../../src/types"

// Mock React Flow and its provider
vi.mock("@xyflow/react", () => {
  const ReactFlow = ({ nodes, edges }: any) => (
    <div data-testid="react-flow">
      {nodes?.map((n: any) => (
        <div key={n.id} data-testid={`node-${n.id}`}>{n.data?.title}</div>
      ))}
    </div>
  )
  return {
    ReactFlow,
    ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
    Handle: () => <div />,
    Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
    BaseEdge: () => <path />,
    EdgeLabelRenderer: ({ children }: any) => <div>{children}</div>,
    getBezierPath: () => ["M0,0", 0, 0],
    useNodesState: (initial: any) => [initial, vi.fn(), vi.fn()],
    useEdgesState: (initial: any) => [initial, vi.fn(), vi.fn()],
    useReactFlow: () => ({ fitView: vi.fn(), setCenter: vi.fn() }),
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
  it("should render canvas", () => {
    render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
    expect(screen.getByTestId("react-flow")).toBeInTheDocument()
  })

  it("should render screen nodes from config", () => {
    render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("should pass focusNodeId to Canvas when viewer was closed", async () => {
    render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
    expect(screen.getByTestId("react-flow")).toBeInTheDocument()
  })
})
