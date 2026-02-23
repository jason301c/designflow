import { Handle, Position } from "@xyflow/react"
import type { NodeProps, Node } from "@xyflow/react"
import type { ComponentType } from "react"

export type ScreenNodeData = {
  title: string
  screenId: string
  onSelect: (screenId: string) => void
  component?: ComponentType
}

export type ScreenNodeType = Node<ScreenNodeData, "screen">

const THUMBNAIL_WIDTH = 280
const THUMBNAIL_HEIGHT = 160
const SCALE = 0.25
const FULL_WIDTH = THUMBNAIL_WIDTH / SCALE   // 1120px
const FULL_HEIGHT = THUMBNAIL_HEIGHT / SCALE  // 640px

export function ScreenNode({ data }: NodeProps<ScreenNodeType>) {
  const ScreenComponent = data.component

  return (
    <div
      onDoubleClick={() => data.onSelect(data.screenId)}
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "8px",
        width: `${THUMBNAIL_WIDTH}px`,
        cursor: "pointer",
      }}
    >
      <Handle type="target" position={Position.Top} />
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
        data-testid="screen-thumbnail"
        style={{
          width: `${THUMBNAIL_WIDTH}px`,
          height: `${THUMBNAIL_HEIGHT}px`,
          background: "#f8fafc",
          borderRadius: "4px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {ScreenComponent && (
          <div
            style={{
              width: `${FULL_WIDTH}px`,
              height: `${FULL_HEIGHT}px`,
              transform: `scale(${SCALE})`,
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
          >
            <ScreenComponent />
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
