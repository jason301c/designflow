import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "@xyflow/react"
import type { EdgeProps, Edge } from "@xyflow/react"

export type FlowEdgeData = {
  label?: string
  inferred?: boolean
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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const isInferred = data?.inferred === true
  const edgeStyle = isInferred
    ? { stroke: "#cbd5e1", strokeWidth: 1.5, strokeDasharray: "6 3" }
    : { stroke: "#94a3b8", strokeWidth: 1.5 }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={edgeStyle}
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
