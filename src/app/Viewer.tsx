import { useEffect, useState, useRef, type ComponentType } from "react"
import type { Viewport, ColorScheme } from "../types"
import { getScreenResolution, ACCENT_COLORS } from "../types"
import { exportScreenPng } from "./export-png"

interface ViewerProps {
  screenId: string
  screenTitle: string
  component: ComponentType
  onClose: () => void
  accentColor?: string
  color?: string
  viewport?: Viewport
  projectName?: string
}

function DesktopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function TabletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  )
}

function MobileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  )
}

const viewportIcons: Record<Viewport, () => React.ReactElement> = {
  desktop: DesktopIcon,
  tablet: TabletIcon,
  mobile: MobileIcon,
}

export function Viewer({ screenId, screenTitle, component: ScreenComponent, onClose, accentColor, color, viewport, projectName }: ViewerProps) {
  const [activeViewport, setActiveViewport] = useState<Viewport>(viewport ?? "desktop")
  const [activeColorScheme, setActiveColorScheme] = useState<ColorScheme>("light")
  const [activeColor, setActiveColor] = useState<string | undefined>(color)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!colorPickerOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as HTMLElement)) {
        setColorPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [colorPickerOpen])

  const handleViewportChange = (vp: Viewport) => {
    setActiveViewport(vp)
    fetch("/__designflow/update-viewport", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screenId, viewport: vp }),
    }).catch(() => {})
  }

  const handleColorChange = (c: string) => {
    setActiveColor(c)
    setColorPickerOpen(false)
    fetch("/__designflow/update-color", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screenId, color: c }),
    }).catch(() => {})
  }

  const pillBg = activeColor ?? accentColor
  const hasPillColor = !!pillBg
  const pillTextColor = hasPillColor ? "#fff" : "#334155"
  const dividerColor = hasPillColor ? "rgba(255,255,255,0.3)" : "#e2e8f0"
  const isDark = activeColorScheme === "dark"
  const { width: vpWidth, height: vpHeight } = getScreenResolution(activeViewport)

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
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px 6px 12px",
          background: hasPillColor ? pillBg! : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          border: hasPillColor ? "none" : "1px solid #e2e8f0",
          borderRadius: 9999,
        }}
      >
        {/* Title */}
        <h2 style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: hasPillColor ? "#fff" : "#0f172a", whiteSpace: "nowrap" }}>
          {screenTitle}
        </h2>

        {/* Color picker */}
        <div ref={colorPickerRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <button
            data-testid="viewer-color-picker-button"
            aria-label="Pick screen color"
            onClick={() => setColorPickerOpen(!colorPickerOpen)}
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.6)",
              background: pillBg ?? "#e2e8f0",
              cursor: "pointer",
              padding: 0,
            }}
          />
          {colorPickerOpen && (
            <div
              data-testid="viewer-color-picker-popover"
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: 6,
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 6,
                display: "flex",
                gap: 4,
                zIndex: 10,
              }}
            >
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: c,
                    border: c === activeColor ? "2px solid #0f172a" : "2px solid transparent",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Viewport selector */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span style={{ color: pillTextColor, display: "flex", pointerEvents: "none" }}>
            {viewportIcons[activeViewport]()}
          </span>
          <select
            data-testid="viewer-viewport-select"
            value={activeViewport}
            onChange={(e) => handleViewportChange(e.target.value as Viewport)}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
              border: "none",
              fontSize: 10,
            }}
          >
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Dark mode toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 10, color: pillTextColor, opacity: isDark ? 0.4 : 1 }}>☀</span>
          <label
            style={{
              position: "relative",
              display: "inline-block",
              width: 28,
              height: 16,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={isDark}
              onChange={() => setActiveColorScheme(isDark ? "light" : "dark")}
              style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 9999,
                background: isDark ? (hasPillColor ? "rgba(255,255,255,0.4)" : "#64748b") : (hasPillColor ? "rgba(255,255,255,0.25)" : "#cbd5e1"),
                transition: "background 0.15s",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: 2,
                left: isDark ? 14 : 2,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.15s",
              }}
            />
          </label>
          <span style={{ fontSize: 10, color: pillTextColor, opacity: isDark ? 1 : 0.4 }}>☾</span>
        </div>

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Save/export button */}
        <button
          data-testid="viewer-export-png"
          aria-label="Export screen as PNG"
          onClick={() => exportScreenPng(screenId, projectName)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "2px 4px",
            fontSize: 12,
            lineHeight: 1,
            color: pillTextColor,
          }}
        >
          ⤓
        </button>

        <div style={{ width: 1, height: 16, background: dividerColor }} />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            color: hasPillColor ? "rgba(255,255,255,0.8)" : "#64748b",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Screen content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: activeViewport === "desktop" ? "stretch" : "flex-start",
          paddingTop: activeViewport === "desktop" ? 0 : 56,
          background: isDark ? "#0f172a" : "white",
        }}
      >
        <div
          data-df-screen-id={screenId}
          style={{
            width: activeViewport === "desktop" ? "100%" : `${vpWidth}px`,
            minHeight: activeViewport === "desktop" ? "100%" : `${vpHeight}px`,
            maxWidth: activeViewport === "desktop" ? undefined : `${vpWidth}px`,
            background: isDark ? "#0f172a" : "white",
          }}
          data-df-color-scheme={activeColorScheme}
          className={isDark ? "dark" : ""}
        >
          <div data-df-screen-content style={{ colorScheme: activeColorScheme }}>
            <ScreenComponent key={screenId} />
          </div>
        </div>
      </div>
    </div>
  )
}
