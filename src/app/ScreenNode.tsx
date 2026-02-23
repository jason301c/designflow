import { useState } from "react"
import { Handle, Position } from "@xyflow/react"
import type { NodeProps, Node } from "@xyflow/react"
import type { ComponentType } from "react"
import type { Viewport } from "../types"
import { getScreenResolution } from "../types"

export type ScreenNodeData = {
  title: string
  screenId: string
  onSelect: (screenId: string) => void
  component?: ComponentType
  viewport?: Viewport
}

export type ScreenNodeType = Node<ScreenNodeData, "screen">

const MAX_THUMBNAIL_DIM = 420

const viewportLabels: { key: Viewport; label: string }[] = [
  { key: "desktop", label: "D" },
  { key: "tablet", label: "T" },
  { key: "mobile", label: "M" },
]

export function ScreenNode({ data }: NodeProps<ScreenNodeType>) {
  const ScreenComponent = data.component
  const [activeViewport, setActiveViewport] = useState<Viewport>(data.viewport ?? "desktop")
  const { width: fullWidth, height: fullHeight } = getScreenResolution(activeViewport)
  const scale = MAX_THUMBNAIL_DIM / Math.max(fullWidth, fullHeight)
  const thumbnailWidth = Math.round(fullWidth * scale)
  const thumbnailHeight = Math.round(fullHeight * scale)

  return (
    <div
      onDoubleClick={() => data.onSelect(data.screenId)}
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "8px",
        cursor: "pointer",
      }}
    >
      <Handle type="target" position={Position.Left} id="target-left" />
      <div
        style={{
          padding: "4px 8px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#0f172a",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "8px",
        }}
      >
        {data.title}
      </div>
      <div
        data-testid="viewport-toggle"
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "8px",
          padding: "0 4px",
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
      <div
        data-testid="screen-thumbnail"
        style={{
          width: `${thumbnailWidth}px`,
          height: `${thumbnailHeight}px`,
          background: "#f8fafc",
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {ScreenComponent ? (
          <>
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
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                fontSize: "9px",
                color: "#94a3b8",
                background: "rgba(255,255,255,0.85)",
                padding: "1px 4px",
                borderRadius: "2px",
                lineHeight: 1.2,
              }}
            >
              {fullWidth}&times;{fullHeight}
            </div>
          </>
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
