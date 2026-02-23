import { useState, useEffect, useRef } from "react"
import { useReactFlow } from "@xyflow/react"
import { ACCENT_COLORS } from "../types"
import type { CanvasSettings, BackgroundStyle, LineStyle } from "../types"
import { exportCanvasPng } from "./export-png"

interface ToolbarProps {
  settings?: CanvasSettings
  onSettingsChange?: (settings: CanvasSettings) => void
  projectName?: string
}

export function Toolbar({ settings, onSettingsChange, projectName }: ToolbarProps) {
  const { zoomIn, zoomOut, fitView, getNodes } = useReactFlow()
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

  const isDark = settings?.appearance === "dark"

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
        background: isDark ? "#1e1e1e" : "#fff",
        border: `1px solid ${isDark ? "#333" : "#e2e8f0"}`,
        borderRadius: 9999,
        padding: "6px 10px",
        fontSize: 13,
      }}
    >
      <button aria-label="Zoom in" onClick={() => zoomIn()} style={{ ...btnStyle, color: isDark ? "#e2e8f0" : "#334155" }}>
        +
      </button>
      <button aria-label="Zoom out" onClick={() => zoomOut()} style={{ ...btnStyle, color: isDark ? "#e2e8f0" : "#334155" }}>
        −
      </button>
      <button aria-label="Fit view" onClick={() => fitView()} style={{ ...btnStyle, color: isDark ? "#e2e8f0" : "#334155" }}>
        ⊞
      </button>
      <button
        data-testid="export-canvas-png"
        aria-label="Export canvas as PNG"
        onClick={() => exportCanvasPng(getNodes, { backgroundColor: isDark ? "#000000" : "#ffffff", projectName })}
        style={{ ...btnStyle, color: isDark ? "#e2e8f0" : "#334155" }}
      >
        ⤓
      </button>
      {onSettingsChange && settings && (
        <>
          <div style={{ width: 1, height: 16, background: isDark ? "#444" : "#e2e8f0" }} />
          <div ref={popoverRef} style={{ position: "relative" }}>
            <button
              aria-label="Settings"
              onClick={() => setOpen((o) => !o)}
              style={{ ...btnStyle, color: isDark ? "#e2e8f0" : "#334155" }}
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
                  background: isDark ? "#1e1e1e" : "#fff",
                  border: `1px solid ${isDark ? "#333" : "#e2e8f0"}`,
                  borderRadius: 8,
                  padding: 12,
                  width: 220,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.1)",
                  fontSize: 12,
                  color: isDark ? "#e2e8f0" : undefined,
                }}
              >
                {/* Appearance */}
                <div style={{ display: "flex", gap: 4 }}>
                  <ToggleButton
                    label="Light"
                    icon="☀"
                    active={settings.appearance === "light"}
                    dark={isDark}
                    onClick={() => update({ appearance: "light" })}
                  />
                  <ToggleButton
                    label="Dark"
                    icon="☾"
                    active={settings.appearance === "dark"}
                    dark={isDark}
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
                        border: settings.accentColor === color ? `2px solid ${isDark ? "#e2e8f0" : "#1e293b"}` : "2px solid transparent",
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
                      dark={isDark}
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
                      dark={isDark}
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

const btnStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "2px 6px",
  borderRadius: 9999,
  fontSize: 14,
  lineHeight: 1,
  color: "#334155",
}

const popoverBtnStyle: React.CSSProperties = {
  ...btnStyle,
  fontSize: 11,
  padding: "4px 8px",
}

function ToggleButton({ label, icon, active, dark, onClick }: { label: string; icon?: string; active: boolean; dark?: boolean; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        ...popoverBtnStyle,
        background: active ? (dark ? "#333" : "#e2e8f0") : "transparent",
        fontWeight: active ? 600 : 400,
        color: dark ? "#e2e8f0" : "#334155",
        flex: 1,
      }}
    >
      {icon ? `${icon} ${label}` : label}
    </button>
  )
}
