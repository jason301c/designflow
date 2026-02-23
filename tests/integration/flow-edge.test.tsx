import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { FlowEdge } from "../../src/app/FlowEdge"

vi.mock("@xyflow/react", () => ({
  BaseEdge: ({ id, path, style }: any) => (
    <path data-testid={`base-edge-${id}`} d={path} style={style} />
  ),
  EdgeLabelRenderer: ({ children }: any) => <div data-testid="edge-label-renderer">{children}</div>,
  getBezierPath: () => ["M0,0 C50,0 50,100 100,100", 50, 50],
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

  it("should have animated dash style", () => {
    render(
      <svg>
        <FlowEdge {...defaultProps} />
      </svg>
    )
    const edge = screen.getByTestId(`base-edge-${defaultProps.id}`)
    expect(edge).toHaveStyle({ strokeDasharray: "5 5" })
  })
})
