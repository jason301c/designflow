import React, { useState } from "react"
import { Handle, Position } from "@xyflow/react"
import type { NodeProps, Node } from "@xyflow/react"
import type { ComponentType } from "react"
import type { Viewport, ColorScheme } from "../types"
import { getScreenResolution } from "../types"

export type ScreenNodeData = {
  title: string
  screenId: string
  onSelect: (screenId: string) => void
  component?: ComponentType
  viewport?: Viewport
  colorScheme?: ColorScheme
  accentColor?: string
}

export type ScreenNodeType = Node<ScreenNodeData, "screen">

const MAX_THUMBNAIL_DIM = 420

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

export function ScreenNode({ data }: NodeProps<ScreenNodeType>) {
  const ScreenComponent = data.component
  const [activeViewport, setActiveViewport] = useState<Viewport>(data.viewport ?? "desktop")
  const [activeColorScheme, setActiveColorScheme] = useState<ColorScheme>(data.colorScheme ?? "light")
  const { width: fullWidth, height: fullHeight } = getScreenResolution(activeViewport)
  const scale = MAX_THUMBNAIL_DIM / Math.max(fullWidth, fullHeight)
  const thumbnailWidth = Math.round(fullWidth * scale)
  const thumbnailHeight = Math.round(fullHeight * scale)
  const isDark = activeColorScheme === "dark"
  const hasAccent = !!data.accentColor
  const pillTextColor = hasAccent ? "#fff" : "#334155"

  return (
    <div
      onDoubleClick={() => data.onSelect(data.screenId)}
      style={{ cursor: "pointer" }}
    >
      <Handle type="target" position={Position.Left} id="target-left" />

      {/* Pill bar with title and controls */}
      <div
        data-testid="node-controls"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          marginBottom: "6px",
          background: hasAccent ? data.accentColor! : "#fff",
          border: hasAccent ? "none" : "1px solid #e2e8f0",
          borderRadius: 9999,
        }}
      >
        <span
          data-testid="node-title"
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: hasAccent ? "#fff" : "#0f172a",
            whiteSpace: "nowrap",
            marginRight: "2px",
          }}
        >
          {data.title}
        </span>

        <div style={{ width: 1, height: 14, background: hasAccent ? "rgba(255,255,255,0.3)" : "#e2e8f0" }} />

        {/* Viewport dropdown */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span style={{ color: pillTextColor, display: "flex", pointerEvents: "none" }}>
            {viewportIcons[activeViewport]()}
          </span>
          <select
            data-testid="viewport-select"
            value={activeViewport}
            onChange={(e) => setActiveViewport(e.target.value as Viewport)}
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

        <div style={{ width: 1, height: 14, background: hasAccent ? "rgba(255,255,255,0.3)" : "#e2e8f0" }} />

        {/* Color scheme toggle */}
        <label
          data-testid="color-scheme-toggle"
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
            style={{
              opacity: 0,
              width: 0,
              height: 0,
              position: "absolute",
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 9999,
              background: isDark ? (hasAccent ? "rgba(255,255,255,0.4)" : "#64748b") : (hasAccent ? "rgba(255,255,255,0.25)" : "#cbd5e1"),
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
      </div>

      {/* Preview rectangle */}
      <div
        data-testid="screen-thumbnail"
        style={{
          width: `${thumbnailWidth}px`,
          height: `${thumbnailHeight}px`,
          background: isDark ? "#0f172a" : "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 0,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {ScreenComponent ? (
          <div
            style={{ colorScheme: activeColorScheme }}
            className={isDark ? "dark" : ""}
            data-df-color-scheme={activeColorScheme}
          >
            <div
              style={{
                width: `${fullWidth}px`,
                height: `${fullHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            >
              <ScreenComponent />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#94a3b8",
              fontSize: "12px",
            }}
          >
            No preview
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="source-right" />
    </div>
  )
}
