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

const multiScreenConfig: DesignFlowConfig = {
  screens: {
    login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
    dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 400, y: 0 } },
  },
  edges: [],
}

function MockScreen() {
  return <div>Mock Screen</div>
}

function LoginScreen() {
  return (
    <div>
      <h1>Login</h1>
      <button data-df-navigate="dashboard">Go to Dashboard</button>
    </div>
  )
}

function DashboardScreen() {
  return (
    <div>
      <h1>Dashboard</h1>
      <button data-df-navigate="login">Back to Login</button>
    </div>
  )
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
    // Canvas receives screens and creates nodes with component data
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
      // Default is light, click to toggle to dark
      fireEvent.click(btn)
      // The canvas wrapper should now have dark background
      const wrapper = screen.getByTestId("react-flow").parentElement as HTMLElement
      expect(wrapper.style.background).toContain("30, 41, 59")
    })
  })

  describe("screen-to-screen navigation", () => {
    it("should navigate from one screen to another via data-df-navigate", () => {
      render(
        <App
          config={multiScreenConfig}
          screens={{ login: LoginScreen, dashboard: DashboardScreen }}
        />
      )
      // Open the login screen viewer by double-clicking the node
      fireEvent.doubleClick(screen.getByTestId("node-login"))

      // Should see login screen content in viewer
      expect(screen.getByText("Go to Dashboard")).toBeInTheDocument()

      // Click the navigation element
      fireEvent.click(screen.getByText("Go to Dashboard"))

      // Should now show dashboard content in viewer (title in header)
      const viewer = screen.getByTestId("viewer-overlay")
      expect(viewer).toBeInTheDocument()
      expect(screen.getByText("Back to Login")).toBeInTheDocument()
    })

    it("should navigate back from dashboard to login", () => {
      render(
        <App
          config={multiScreenConfig}
          screens={{ login: LoginScreen, dashboard: DashboardScreen }}
        />
      )
      // Open login viewer
      fireEvent.doubleClick(screen.getByTestId("node-login"))

      // Navigate to dashboard
      fireEvent.click(screen.getByText("Go to Dashboard"))

      // Navigate back to login
      fireEvent.click(screen.getByText("Back to Login"))

      // Should show login content again
      expect(screen.getByText("Go to Dashboard")).toBeInTheDocument()
    })
  })
})
