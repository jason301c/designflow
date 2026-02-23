import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react"
import type { EdgeProps, Edge } from "@xyflow/react"

export type FlowEdgeData = {
  label?: string
}

export type FlowEdgeType = Edge<FlowEdgeData, "flow">

export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<FlowEdgeType>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ strokeDasharray: "5 5", stroke: "#94a3b8", strokeWidth: 1.5 }}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: "11px",
              fontWeight: 500,
              background: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              pointerEvents: "all",
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
