import { useEffect, type ComponentType } from "react"

interface ViewerProps {
  screenId: string
  screenTitle: string
  component: ComponentType
  onClose: () => void
  accentColor?: string
}

export function Viewer({ screenId, screenTitle, component: ScreenComponent, onClose, accentColor }: ViewerProps) {
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
      }}
    >
      {/* Floating pill header */}
      <div
        data-testid="viewer-pill"
        style={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "6px 8px 6px 16px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${accentColor ?? "#e2e8f0"}`,
          borderRadius: 9999,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>
          {screenTitle}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "none",
            border: "1px solid #e2e8f0",
            borderRadius: 9999,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          Close
        </button>
      </div>

      {/* Screen content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "auto",
          background: "white",
        }}
      >
        <ScreenComponent key={screenId} />
      </div>
    </div>
  )
}
