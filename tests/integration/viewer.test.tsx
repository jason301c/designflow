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

  it("should fill the viewer pill with accent color", () => {
    render(
      <Viewer
        screenId="test"
        screenTitle="Test Screen"
        component={TestScreen}
        onClose={vi.fn()}
        accentColor="#7c3aed"
      />
    )
    const pill = screen.getByTestId("viewer-pill")
    // #7c3aed → rgb(124, 58, 237)
    expect(pill.style.background).toContain("124, 58, 237")
  })

  it("should call onNavigate when a data-df-navigate element is clicked", () => {
    function NavScreen() {
      return (
        <div>
          <button data-df-navigate="dashboard">Go to Dashboard</button>
          <span>No nav</span>
        </div>
      )
    }
    const onNavigate = vi.fn()
    render(
      <Viewer
        screenId="home"
        screenTitle="Home"
        component={NavScreen}
        onClose={vi.fn()}
        onNavigate={onNavigate}
      />
    )
    fireEvent.click(screen.getByText("Go to Dashboard"))
    expect(onNavigate).toHaveBeenCalledWith("dashboard")
  })

  it("should not call onNavigate for elements without data-df-navigate", () => {
    function NavScreen() {
      return (
        <div>
          <button data-df-navigate="dashboard">Go to Dashboard</button>
          <span>No nav</span>
        </div>
      )
    }
    const onNavigate = vi.fn()
    render(
      <Viewer
        screenId="home"
        screenTitle="Home"
        component={NavScreen}
        onClose={vi.fn()}
        onNavigate={onNavigate}
      />
    )
    fireEvent.click(screen.getByText("No nav"))
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it("should use white pill background when no accent color", () => {
    render(
      <Viewer
        screenId="test"
        screenTitle="Test Screen"
        component={TestScreen}
        onClose={vi.fn()}
      />
    )
    const pill = screen.getByTestId("viewer-pill")
    expect(pill.style.background).toContain("255, 255, 255")
  })
})
