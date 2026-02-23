import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ScreenNode } from "../../src/app/ScreenNode"

// Mock Handle from React Flow
vi.mock("@xyflow/react", () => ({
  Handle: ({ type, position }: any) => <div data-testid={`handle-${type}`} />,
  Position: { Top: "top", Bottom: "bottom", Left: "left", Right: "right" },
}))

describe("ScreenNode", () => {
  const defaultProps = {
    id: "login",
    type: "screen" as const,
    data: {
      title: "Login",
      screenId: "login",
      onSelect: vi.fn(),
    },
    selected: false,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
    zIndex: 0,
    dragging: false,
    dragHandle: undefined,
    parentId: undefined,
    sourcePosition: undefined,
    targetPosition: undefined,
    width: 300,
    height: 200,
    measured: { width: 300, height: 200 },
  }

  it("should render screen title", () => {
    render(<ScreenNode {...defaultProps} />)
    expect(screen.getByText("Login")).toBeInTheDocument()
  })

  it("should have source and target handles", () => {
    render(<ScreenNode {...defaultProps} />)
    expect(screen.getByTestId("handle-source")).toBeInTheDocument()
    expect(screen.getByTestId("handle-target")).toBeInTheDocument()
  })

  it("should call onSelect when clicked", () => {
    render(<ScreenNode {...defaultProps} />)
    fireEvent.doubleClick(screen.getByText("Login"))
    expect(defaultProps.data.onSelect).toHaveBeenCalledWith("login")
  })
})
