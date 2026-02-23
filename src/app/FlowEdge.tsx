import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "@xyflow/react"
import type { EdgeProps, Edge } from "@xyflow/react"
import type { LineStyle } from "../types"

export type FlowEdgeData = {
  label?: string
  inferred?: boolean
  accentColor?: string
  lineStyle?: LineStyle
}

export type FlowEdgeType = Edge<FlowEdgeData, "flow">

const dashMap: Record<LineStyle, string | undefined> = {
  solid: undefined,
  dashed: "6 3",
  dotted: "2 2",
}

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
  const accentColor = data?.accentColor ?? "#94a3b8"
  const lineStyle = data?.lineStyle ?? "solid"

  const edgeStyle = isInferred
    ? { stroke: accentColor, strokeWidth: 1.5, strokeDasharray: dashMap[lineStyle] ?? "6 3", opacity: 0.4 }
    : { stroke: accentColor, strokeWidth: 1.5, strokeDasharray: dashMap[lineStyle] }

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
