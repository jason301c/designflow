import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import { Canvas } from "../../src/app/Canvas"
import { DEFAULT_CANVAS_SETTINGS } from "../../src/types"
import type { DesignFlowConfig } from "../../src/types"

// Mock React Flow (same mock as canvas.test.tsx)
vi.mock("@xyflow/react", () => {
  const ReactFlow = ({ nodes, edges, children, ...props }: any) => {
    return (
      <div data-testid="react-flow" data-nodes={JSON.stringify(nodes)} data-edges={JSON.stringify(edges)}>
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
  edges: [{ from: "login", to: "dashboard", label: "Sign in" }],
}

describe("Share button", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, slug: "abc123", url: "https://designflow.cc/s/abc123" }) })))
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn(() => Promise.resolve()) } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("should render share button in normal mode", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)
    expect(screen.getByTestId("share-button")).toBeInTheDocument()
    expect(screen.getByText("Share")).toBeInTheDocument()
  })

  it("should not render share button in export mode", () => {
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} exportMode />)
    expect(screen.queryByTestId("share-button")).not.toBeInTheDocument()
  })

  it("should show error toast when popup is blocked", async () => {
    vi.stubGlobal("open", vi.fn(() => null))
    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)

    await act(async () => {
      fireEvent.click(screen.getByTestId("share-button"))
    })

    await waitFor(() => {
      expect(screen.getByTestId("export-toast")).toBeInTheDocument()
      expect(screen.getByText(/allow popups/i)).toBeInTheDocument()
    })
  })

  it("should show success toast with URL after successful share", async () => {
    // Mock popup that posts token back
    const mockPopup = { closed: false }
    vi.stubGlobal("open", vi.fn(() => mockPopup))

    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)

    await act(async () => {
      fireEvent.click(screen.getByTestId("share-button"))
    })

    // Simulate postMessage from popup
    await act(async () => {
      window.dispatchEvent(new MessageEvent("message", {
        data: { type: "df-share-token", token: "test-token-123" },
        origin: "https://designflow.cc",
      }))
    })

    await waitFor(() => {
      expect(screen.getByTestId("export-toast")).toBeInTheDocument()
      expect(screen.getByText(/designflow\.cc\/s\/abc123/)).toBeInTheDocument()
      expect(screen.getByText(/copied/i)).toBeInTheDocument()
    })

    // Verify fetch was called to share endpoint
    expect(fetch).toHaveBeenCalledWith("/__designflow/share", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ token: "test-token-123" }),
    }))
  })

  it("should show error toast on share failure", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ error: "Upload failed" }) })))
    const mockPopup = { closed: false }
    vi.stubGlobal("open", vi.fn(() => mockPopup))

    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)

    await act(async () => {
      fireEvent.click(screen.getByTestId("share-button"))
    })

    await act(async () => {
      window.dispatchEvent(new MessageEvent("message", {
        data: { type: "df-share-token", token: "test-token-123" },
        origin: "https://designflow.cc",
      }))
    })

    await waitFor(() => {
      expect(screen.getByTestId("export-toast")).toBeInTheDocument()
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument()
    })
  })

  it("should show loading state while sharing", async () => {
    // Mock popup that posts token back
    const mockPopup = { closed: false }
    vi.stubGlobal("open", vi.fn(() => mockPopup))
    // Make fetch hang to test loading state
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})))

    render(<Canvas config={sampleConfig} onScreenSelect={vi.fn()} />)

    await act(async () => {
      fireEvent.click(screen.getByTestId("share-button"))
    })

    // Simulate postMessage
    await act(async () => {
      window.dispatchEvent(new MessageEvent("message", {
        data: { type: "df-share-token", token: "test-token-123" },
        origin: "https://designflow.cc",
      }))
    })

    // Button should show "Sharing..." during the fetch
    await waitFor(() => {
      expect(screen.getByText("Sharing...")).toBeInTheDocument()
    })
  })
})
