import { useReactFlow } from "@xyflow/react"

interface ToolbarProps {
  onThemeToggle?: () => void
}

export function Toolbar({ onThemeToggle }: ToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <div
      data-testid="toolbar"
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 10,
        display: "flex",
        gap: 6,
        alignItems: "center",
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "4px 6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        fontSize: 13,
      }}
    >
      <button aria-label="Zoom in" onClick={() => zoomIn()} style={btnStyle}>
        +
      </button>
      <button aria-label="Zoom out" onClick={() => zoomOut()} style={btnStyle}>
        −
      </button>
      <button aria-label="Fit view" onClick={() => fitView()} style={btnStyle}>
        ⊞
      </button>
      {onThemeToggle && (
        <>
          <div style={{ width: 1, height: 18, background: "#e2e8f0" }} />
          <button aria-label="Theme" onClick={onThemeToggle} style={btnStyle}>
            Theme
          </button>
        </>
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "4px 8px",
  borderRadius: 4,
  fontSize: 13,
  lineHeight: 1,
  color: "#334155",
}
