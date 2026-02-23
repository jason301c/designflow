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

  it("should use lighter stroke color for inferred edges", () => {
    render(
      <svg>
        <FlowEdge {...defaultProps} data={{ label: "navigate", inferred: true }} />
      </svg>
    )
    const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
    expect(edge).toHaveStyle({ stroke: "#cbd5e1" })
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
})
