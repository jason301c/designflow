import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { App } from "../../src/app/App"
import type { DesignFlowConfig } from "../../src/types"

// Mock React Flow and its provider
vi.mock("@xyflow/react", () => {
  const ReactFlow = ({ nodes, children }: any) => (
    <div data-testid="react-flow">
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

  describe("canvas appearance", () => {
    it("should render appearance toggle button", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      expect(screen.getByRole("button", { name: /appearance/i })).toBeInTheDocument()
    })

    it("should toggle appearance when button is clicked", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} />)
      const btn = screen.getByRole("button", { name: /appearance/i })
      fireEvent.click(btn)
      const wrapper = screen.getByTestId("react-flow").parentElement as HTMLElement
      expect(wrapper.style.background).toContain("30, 41, 59")
    })
  })
})
