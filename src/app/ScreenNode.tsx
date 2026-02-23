import { useState } from "react"
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
}

export type ScreenNodeType = Node<ScreenNodeData, "screen">

const MAX_THUMBNAIL_DIM = 420

const viewportLabels: { key: Viewport; label: string }[] = [
  { key: "desktop", label: "D" },
  { key: "tablet", label: "T" },
  { key: "mobile", label: "M" },
]

const colorSchemeLabels: { key: ColorScheme; label: string }[] = [
  { key: "light", label: "\u2600" },
  { key: "dark", label: "\u263E" },
]

export function ScreenNode({ data }: NodeProps<ScreenNodeType>) {
  const ScreenComponent = data.component
  const [activeViewport, setActiveViewport] = useState<Viewport>(data.viewport ?? "desktop")
  const [activeColorScheme, setActiveColorScheme] = useState<ColorScheme>(data.colorScheme ?? "light")
  const { width: fullWidth, height: fullHeight } = getScreenResolution(activeViewport)
  const scale = MAX_THUMBNAIL_DIM / Math.max(fullWidth, fullHeight)
  const thumbnailWidth = Math.round(fullWidth * scale)
  const thumbnailHeight = Math.round(fullHeight * scale)
  const isDark = activeColorScheme === "dark"

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
          gap: "4px",
          padding: "4px 10px",
          marginBottom: "6px",
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 9999,
        }}
      >
        <span
          data-testid="node-title"
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#0f172a",
            whiteSpace: "nowrap",
            marginRight: "4px",
          }}
        >
          {data.title}
        </span>
        <div style={{ width: 1, height: 14, background: "#e2e8f0" }} />
        <div
          data-testid="viewport-toggle"
          style={{
            display: "flex",
            gap: "4px",
          }}
        >
          {viewportLabels.map(({ key, label }) => (
            <button
              key={key}
              aria-label={key}
              data-active={String(activeViewport === key)}
              onClick={() => setActiveViewport(key)}
              style={{
                border: "1px solid #e2e8f0",
                background: activeViewport === key ? "#f1f5f9" : "transparent",
                fontWeight: activeViewport === key ? 600 : 400,
                cursor: "pointer",
                padding: "2px 8px",
                borderRadius: 9999,
                fontSize: 10,
                lineHeight: 1.4,
                color: "#334155",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ width: 1, height: 14, background: "#e2e8f0" }} />
        <div
          data-testid="color-scheme-toggle"
          style={{
            display: "flex",
            gap: "4px",
          }}
        >
          {colorSchemeLabels.map(({ key, label }) => (
            <button
              key={key}
              aria-label={key}
              data-active={String(activeColorScheme === key)}
              onClick={() => setActiveColorScheme(key)}
              style={{
                border: "1px solid #e2e8f0",
                background: activeColorScheme === key ? "#f1f5f9" : "transparent",
                fontWeight: activeColorScheme === key ? 600 : 400,
                cursor: "pointer",
                padding: "2px 8px",
                borderRadius: 9999,
                fontSize: 10,
                lineHeight: 1.4,
                color: "#334155",
              }}
            >
              {label}
            </button>
          ))}
        </div>
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
