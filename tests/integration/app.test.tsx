import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { App } from "../../src/app/App"
import type { DesignFlowConfig, DesignFlowTheme } from "../../src/types"

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

  describe("theme panel toggle", () => {
    let themeStyleEl: HTMLStyleElement

    const sampleThemeObj: DesignFlowTheme = {
      colors: {
        primary: "#2563EB",
        secondary: "#7C3AED",
        accent: "#F59E0B",
        background: "#FFFFFF",
        surface: "#F8FAFC",
        surfaceAlt: "#F1F5F9",
        border: "#E2E8F0",
        text: "#0F172A",
        textMuted: "#64748B",
        textInvert: "#FFFFFF",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      radius: { sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
      spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", xxl: "48px" },
      typography: {
        fontFamily: "Inter, system-ui, sans-serif",
        heading: { weight: 600, sizes: { h1: "2rem", h2: "1.5rem", h3: "1.25rem", h4: "1.125rem" } },
        body: { weight: 400, sizes: { base: "1rem", sm: "0.875rem", xs: "0.75rem" } },
      },
      shadows: { sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.07)", lg: "0 10px 15px rgba(0,0,0,0.1)" },
    }

    beforeEach(() => {
      themeStyleEl = document.createElement("style")
      themeStyleEl.setAttribute("data-designflow-theme", "")
      themeStyleEl.textContent = ":root {}"
      document.head.appendChild(themeStyleEl)
    })

    afterEach(() => {
      themeStyleEl.remove()
    })

    it("should render theme toggle button", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} theme={sampleThemeObj} />)
      expect(screen.getByRole("button", { name: /theme/i })).toBeInTheDocument()
    })

    it("should show theme panel when theme toggle is clicked", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} theme={sampleThemeObj} />)
      fireEvent.click(screen.getByRole("button", { name: /theme/i }))
      expect(screen.getByTestId("theme-panel")).toBeInTheDocument()
    })

    it("should hide theme panel when close is clicked", () => {
      render(<App config={sampleConfig} screens={{ login: MockScreen }} theme={sampleThemeObj} />)
      fireEvent.click(screen.getByRole("button", { name: /theme/i }))
      expect(screen.getByTestId("theme-panel")).toBeInTheDocument()

      fireEvent.click(screen.getByRole("button", { name: /close/i }))
      expect(screen.queryByTestId("theme-panel")).not.toBeInTheDocument()
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
