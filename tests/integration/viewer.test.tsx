import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { useState } from "react"
import { Viewer } from "../../src/app/Viewer"
import type { DesignFlowConfig } from "../../src/types"

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

// Screen with navigation links
function NavScreen() {
  return (
    <div>
      <h1>Login Page</h1>
      <button data-df-navigate="dashboard">Go to Dashboard</button>
      <a data-df-navigate="settings" href="#">Settings</a>
    </div>
  )
}

// Screen with a single navigation link
function SingleNavScreen() {
  return (
    <div>
      <button data-df-navigate="login">Back to Login</button>
    </div>
  )
}

const navConfig: DesignFlowConfig = {
  screens: {
    login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
    dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 400, y: 0 } },
    settings: { title: "Settings", file: "./screens/Settings.tsx", position: { x: 800, y: 0 } },
  },
  edges: [],
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

  describe("navigation badges", () => {
    it("should display badges for data-df-navigate elements", () => {
      render(
        <Viewer
          screenId="login"
          screenTitle="Login"
          component={NavScreen}
          onClose={vi.fn()}
          onNavigate={vi.fn()}
          config={navConfig}
        />
      )
      // Should show badges with target screen titles
      expect(screen.getByText("→ Dashboard")).toBeInTheDocument()
      expect(screen.getByText("→ Settings")).toBeInTheDocument()
    })

    it("should show badge with target screen title from config", () => {
      render(
        <Viewer
          screenId="dashboard"
          screenTitle="Dashboard"
          component={SingleNavScreen}
          onClose={vi.fn()}
          onNavigate={vi.fn()}
          config={navConfig}
        />
      )
      expect(screen.getByText("→ Login")).toBeInTheDocument()
    })

    it("should call onNavigate when a data-df-navigate element is clicked", () => {
      const onNavigate = vi.fn()
      render(
        <Viewer
          screenId="login"
          screenTitle="Login"
          component={NavScreen}
          onClose={vi.fn()}
          onNavigate={onNavigate}
          config={navConfig}
        />
      )
      fireEvent.click(screen.getByText("Go to Dashboard"))
      expect(onNavigate).toHaveBeenCalledWith("dashboard")
    })

    it("should call onNavigate for anchor elements with data-df-navigate", () => {
      const onNavigate = vi.fn()
      render(
        <Viewer
          screenId="login"
          screenTitle="Login"
          component={NavScreen}
          onClose={vi.fn()}
          onNavigate={onNavigate}
          config={navConfig}
        />
      )
      fireEvent.click(screen.getByText("Settings"))
      expect(onNavigate).toHaveBeenCalledWith("settings")
    })

    it("should not render badges when config is not provided", () => {
      render(
        <Viewer
          screenId="login"
          screenTitle="Login"
          component={NavScreen}
          onClose={vi.fn()}
        />
      )
      expect(screen.queryByText("→ Dashboard")).not.toBeInTheDocument()
      expect(screen.queryByText("→ Settings")).not.toBeInTheDocument()
    })

    it("should show screen ID in badge when target screen is not in config", () => {
      const partialConfig: DesignFlowConfig = {
        screens: {
          login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 } },
        },
        edges: [],
      }
      render(
        <Viewer
          screenId="login"
          screenTitle="Login"
          component={NavScreen}
          onClose={vi.fn()}
          onNavigate={vi.fn()}
          config={partialConfig}
        />
      )
      // dashboard is not in partialConfig, so badge should fall back to the ID
      expect(screen.getByText("→ dashboard")).toBeInTheDocument()
    })
  })
})
