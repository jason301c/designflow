import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { FlowEdge } from "../../src/app/FlowEdge"

vi.mock("@xyflow/react", () => ({
  BaseEdge: ({ id, path, style }: any) => (
    <path data-testid={`base-edge-${id}`} d={path} style={style} />
  ),
  EdgeLabelRenderer: ({ children }: any) => <div data-testid="edge-label-renderer">{children}</div>,
  getSmoothStepPath: () => ["M0,0 L50,0 L50,100 L100,100", 50, 50],
}))

describe("FlowEdge", () => {
  const defaultProps = {
    id: "login-dashboard",
    source: "login",
    target: "dashboard",
    sourceX: 0,
    sourceY: 0,
    targetX: 100,
    targetY: 100,
    sourcePosition: "bottom" as any,
    targetPosition: "top" as any,
    data: { label: "Sign in" },
    selected: false,
    animated: false,
    markerEnd: undefined,
    markerStart: undefined,
    pathOptions: undefined,
    interactionWidth: 20,
    style: {},
  }

  it("should render edge path", () => {
    render(
      <svg>
        <FlowEdge {...defaultProps} />
      </svg>
    )
    expect(screen.getByTestId(`base-edge-${defaultProps.id}`)).toBeInTheDocument()
  })

  it("should render label when provided", () => {
    render(
      <svg>
        <FlowEdge {...defaultProps} />
      </svg>
    )
    expect(screen.getByText("Sign in")).toBeInTheDocument()
  })

  it("should not render label when not provided", () => {
    render(
      <svg>
        <FlowEdge {...defaultProps} data={{}} />
      </svg>
    )
    expect(screen.queryByText("Sign in")).not.toBeInTheDocument()
  })

  it("should have solid stroke style without dashes", () => {
    render(
      <svg>
        <FlowEdge {...defaultProps} />
      </svg>
    )
    const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
    expect(edge).toHaveStyle({ stroke: "#94a3b8", strokeWidth: "1.5" })
    expect(edge.style.strokeDasharray).toBeFalsy()
  })

  it("should render dashed style when inferred is true", () => {
    render(
      <svg>
        <FlowEdge {...defaultProps} data={{ label: "navigate", inferred: true }} />
      </svg>
    )
    const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
    expect(edge).toHaveStyle({ strokeDasharray: "6 3" })
  })

  it("should use reduced opacity for inferred edges", () => {
    render(
      <svg>
        <FlowEdge {...defaultProps} data={{ label: "navigate", inferred: true }} />
      </svg>
    )
    const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
    expect(edge).toHaveStyle({ stroke: "#94a3b8", opacity: "0.4" })
  })

  it("should not use dashed style when inferred is false or undefined", () => {
    render(
      <svg>
        <FlowEdge {...defaultProps} data={{ label: "Sign in" }} />
      </svg>
    )
    const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
    expect(edge).toHaveStyle({ stroke: "#94a3b8" })
    expect(edge.style.strokeDasharray).toBeFalsy()
  })

  describe("accent color", () => {
    it("should use accentColor from data when provided", () => {
      render(
        <svg>
          <FlowEdge {...defaultProps} data={{ label: "Sign in", accentColor: "#2563eb" }} />
        </svg>
      )
      const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
      expect(edge).toHaveStyle({ stroke: "#2563eb" })
    })

    it("should fall back to default color when accentColor not provided", () => {
      render(
        <svg>
          <FlowEdge {...defaultProps} data={{ label: "Sign in" }} />
        </svg>
      )
      const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
      expect(edge).toHaveStyle({ stroke: "#94a3b8" })
    })

    it("should apply accentColor to inferred edges with reduced opacity", () => {
      render(
        <svg>
          <FlowEdge {...defaultProps} data={{ label: "nav", inferred: true, accentColor: "#dc2626" }} />
        </svg>
      )
      const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
      expect(edge).toHaveStyle({ stroke: "#dc2626", opacity: "0.4" })
    })
  })

  describe("line style", () => {
    it("should apply solid line style (no dasharray)", () => {
      render(
        <svg>
          <FlowEdge {...defaultProps} data={{ label: "Sign in", lineStyle: "solid" }} />
        </svg>
      )
      const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
      expect(edge.style.strokeDasharray).toBeFalsy()
    })

    it("should apply dashed line style", () => {
      render(
        <svg>
          <FlowEdge {...defaultProps} data={{ label: "Sign in", lineStyle: "dashed" }} />
        </svg>
      )
      const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
      expect(edge).toHaveStyle({ strokeDasharray: "6 3" })
    })

    it("should apply dotted line style", () => {
      render(
        <svg>
          <FlowEdge {...defaultProps} data={{ label: "Sign in", lineStyle: "dotted" }} />
        </svg>
      )
      const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
      expect(edge).toHaveStyle({ strokeDasharray: "2 2" })
    })

    it("should apply lineStyle to inferred edges with opacity", () => {
      render(
        <svg>
          <FlowEdge {...defaultProps} data={{ inferred: true, lineStyle: "dotted", accentColor: "#059669" }} />
        </svg>
      )
      const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
      expect(edge).toHaveStyle({ strokeDasharray: "2 2", opacity: "0.4", stroke: "#059669" })
    })

    it("should default to solid when lineStyle not provided", () => {
      render(
        <svg>
          <FlowEdge {...defaultProps} data={{ label: "Sign in" }} />
        </svg>
      )
      const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
      expect(edge.style.strokeDasharray).toBeFalsy()
    })
  })
})
