import { useReactFlow } from "@xyflow/react"
import type { CanvasAppearance } from "../types"

interface ToolbarProps {
  appearance?: CanvasAppearance
  onAppearanceChange?: (appearance: CanvasAppearance) => void
}

export function Toolbar({ appearance, onAppearanceChange }: ToolbarProps) {
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
        borderRadius: 9999,
        padding: "4px 6px",
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
      {onAppearanceChange && (
        <>
          <div style={{ width: 1, height: 18, background: "#e2e8f0" }} />
          <button
            aria-label="Appearance"
            onClick={() => onAppearanceChange(appearance === "dark" ? "light" : "dark")}
            style={btnStyle}
          >
            {appearance === "dark" ? "\u263E" : "\u2600"}
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
