import { ReactFlow, MiniMap, useNodesState, useEdgesState, useReactFlow, MarkerType } from "@xyflow/react"
import type { Node, Edge } from "@xyflow/react"
import { useCallback, useEffect, type ComponentType } from "react"
import { ScreenNode } from "./ScreenNode"
import { FlowEdge } from "./FlowEdge"
import { Toolbar } from "./Toolbar"
import type { DesignFlowConfig, EdgeConfig } from "../types"

const nodeTypes = { screen: ScreenNode }
const edgeTypes = { flow: FlowEdge }

interface CanvasProps {
  config: DesignFlowConfig
  screens?: Record<string, ComponentType>
  onScreenSelect: (screenId: string) => void
  focusNodeId?: string | null
  inferredEdges?: EdgeConfig[]
}

function configToNodes(
  config: DesignFlowConfig,
  onScreenSelect: (id: string) => void,
  screens?: Record<string, ComponentType>,
): Node[] {
  return Object.entries(config.screens).map(([id, screen]) => ({
    id,
    type: "screen",
    position: screen.position,
    data: {
      title: screen.title,
      screenId: id,
      onSelect: onScreenSelect,
      component: screens?.[id],
      viewport: screen.viewport,
    },
  }))
}

function configToEdges(config: DesignFlowConfig, inferredEdges?: EdgeConfig[]): Edge[] {
  const explicitEdges: Edge[] = (config.edges ?? []).map((edge) => ({
    id: `${edge.from}-${edge.to}`,
    type: "flow",
    source: edge.from,
    target: edge.to,
    sourceHandle: "source-right",
    targetHandle: "target-left",
    data: { label: edge.label },
  }))

  if (!inferredEdges?.length) return explicitEdges

  const explicitKeys = new Set(
    (config.edges ?? []).map((e) => `${e.from}-${e.to}`)
  )

  const inferred: Edge[] = inferredEdges
    .filter((e) => !explicitKeys.has(`${e.from}-${e.to}`))
    .map((edge) => ({
      id: `inferred-${edge.from}-${edge.to}`,
      type: "flow",
      source: edge.from,
      target: edge.to,
      sourceHandle: "source-right",
      targetHandle: "target-left",
      data: { label: edge.label, inferred: true },
    }))

  return [...explicitEdges, ...inferred]
}

function FocusHandler({ focusNodeId }: { focusNodeId?: string | null }) {
  const { fitView } = useReactFlow()

  useEffect(() => {
    if (focusNodeId) {
      setTimeout(() => {
        fitView({ nodes: [{ id: focusNodeId }], duration: 300, padding: 0.5 })
      }, 50)
    }
  }, [focusNodeId, fitView])

  return null
}

export function Canvas({ config, screens, onScreenSelect, focusNodeId, inferredEdges }: CanvasProps) {
  const initialNodes = configToNodes(config, onScreenSelect, screens)
  const initialEdges = configToEdges(config, inferredEdges)

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
    fetch("/__designflow/update-positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        positions: { [node.id]: { x: node.position.x, y: node.position.y } },
      }),
    })
  }, [])

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
        }}
        fitView
      >
        <FocusHandler focusNodeId={focusNodeId} />
        <MiniMap pannable zoomable />
        <Toolbar />
      </ReactFlow>
    </div>
  )
}
