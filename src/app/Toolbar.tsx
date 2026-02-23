import { useState, useEffect, useRef } from "react"
import { useReactFlow } from "@xyflow/react"
import { ACCENT_COLORS } from "../types"
import type { CanvasSettings, BackgroundStyle, LineStyle } from "../types"

interface ToolbarProps {
  settings?: CanvasSettings
  onSettingsChange?: (settings: CanvasSettings) => void
}

export function Toolbar({ settings, onSettingsChange }: ToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", handleKey)
    document.addEventListener("mousedown", handleClick)
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.removeEventListener("mousedown", handleClick)
    }
  }, [open])

  const update = (patch: Partial<CanvasSettings>) => {
    if (settings && onSettingsChange) {
      onSettingsChange({ ...settings, ...patch })
    }
  }

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
      {onSettingsChange && settings && (
        <>
          <div style={{ width: 1, height: 18, background: "#e2e8f0" }} />
          <div ref={popoverRef} style={{ position: "relative" }}>
            <button
              aria-label="Settings"
              onClick={() => setOpen((o) => !o)}
              style={btnStyle}
            >
              ⚙
            </button>
            {open && (
              <div
                data-testid="settings-popover"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 12,
                  width: 220,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  fontSize: 12,
                }}
              >
                {/* Appearance */}
                <div style={{ display: "flex", gap: 4 }}>
                  <ToggleButton
                    label="Light"
                    icon="☀"
                    active={settings.appearance === "light"}
                    onClick={() => update({ appearance: "light" })}
                  />
                  <ToggleButton
                    label="Dark"
                    icon="☾"
                    active={settings.appearance === "dark"}
                    onClick={() => update({ appearance: "dark" })}
                  />
                </div>

                {/* Accent colors */}
                <div style={{ display: "flex", gap: 6 }}>
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      data-testid={`accent-${color}`}
                      onClick={() => update({ accentColor: color })}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: color,
                        border: settings.accentColor === color ? "2px solid #1e293b" : "2px solid transparent",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

                {/* Background style */}
                <div style={{ display: "flex", gap: 4 }}>
                  {(["grid", "dots", "blank"] as BackgroundStyle[]).map((bg) => (
                    <ToggleButton
                      key={bg}
                      label={bg.charAt(0).toUpperCase() + bg.slice(1)}
                      active={settings.backgroundStyle === bg}
                      onClick={() => update({ backgroundStyle: bg })}
                    />
                  ))}
                </div>

                {/* Line style */}
                <div style={{ display: "flex", gap: 4 }}>
                  {(["solid", "dashed", "dotted"] as LineStyle[]).map((ls) => (
                    <ToggleButton
                      key={ls}
                      label={ls.charAt(0).toUpperCase() + ls.slice(1)}
                      active={settings.lineStyle === ls}
                      onClick={() => update({ lineStyle: ls })}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function ToggleButton({ label, icon, active, onClick }: { label: string; icon?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        ...btnStyle,
        background: active ? "#e2e8f0" : "transparent",
        fontWeight: active ? 600 : 400,
        flex: 1,
      }}
    >
      {icon ? `${icon} ${label}` : label}
    </button>
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
