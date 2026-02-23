import { Handle, Position } from "@xyflow/react"
import type { NodeProps, Node } from "@xyflow/react"

export type ScreenNodeData = {
  title: string
  screenId: string
  onSelect: (screenId: string) => void
}

export type ScreenNodeType = Node<ScreenNodeData, "screen">

export function ScreenNode({ data }: NodeProps<ScreenNodeType>) {
  return (
    <div
      onDoubleClick={() => data.onSelect(data.screenId)}
      style={{
        background: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "8px",
        width: "280px",
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
        style={{
          width: "100%",
          height: "160px",
          background: "#f8fafc",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* Screen thumbnail will be rendered here */}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
