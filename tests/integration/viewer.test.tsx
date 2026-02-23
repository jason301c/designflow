import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { useState } from "react"
import { Viewer } from "../../src/app/Viewer"

// Simple test screen components
function TestScreen() {
  return <div>Test Screen Content</div>
}

function InteractiveScreen() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      {open && <div data-testid="modal">Modal Content</div>}
    </div>
  )
}

describe("Viewer", () => {
  it("should render when open with a screen", () => {
    render(
      <Viewer
        screenId="test"
        screenTitle="Test Screen"
        component={TestScreen}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByText("Test Screen Content")).toBeInTheDocument()
  })

  it("should display screen title", () => {
    render(
      <Viewer
        screenId="test"
        screenTitle="Test Screen"
        component={TestScreen}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByText("Test Screen")).toBeInTheDocument()
  })

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn()
    render(
      <Viewer
        screenId="test"
        screenTitle="Test Screen"
        component={TestScreen}
        onClose={onClose}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it("should call onClose when Escape key is pressed", () => {
    const onClose = vi.fn()
    render(
      <Viewer
        screenId="test"
        screenTitle="Test Screen"
        component={TestScreen}
        onClose={onClose}
      />
    )
    fireEvent.keyDown(document, { key: "Escape" })
    expect(onClose).toHaveBeenCalled()
  })

  it("should support local interactions (useState) within screen", () => {
    render(
      <Viewer
        screenId="interactive"
        screenTitle="Interactive Screen"
        component={InteractiveScreen}
        onClose={vi.fn()}
      />
    )
    // Modal should not be visible initially
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument()

    // Click should open modal
    fireEvent.click(screen.getByText("Open Modal"))
    expect(screen.getByTestId("modal")).toBeInTheDocument()
    expect(screen.getByText("Modal Content")).toBeInTheDocument()
  })

  it("should render as a full-screen overlay", () => {
    render(
      <Viewer
        screenId="test"
        screenTitle="Test Screen"
        component={TestScreen}
        onClose={vi.fn()}
      />
    )
    const overlay = screen.getByTestId("viewer-overlay")
    expect(overlay).toBeInTheDocument()
  })
})
