import { useEffect, type ComponentType } from "react"

interface ViewerProps {
  screenId: string
  screenTitle: string
  component: ComponentType
  onClose: () => void
}

export function Viewer({ screenId, screenTitle, component: ScreenComponent, onClose }: ViewerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div
      data-testid="viewer-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "white",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
          {screenTitle}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "none",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          Close
        </button>
      </div>

      {/* Screen content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "white",
        }}
      >
        <ScreenComponent />
      </div>
    </div>
  )
}
