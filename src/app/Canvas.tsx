import { ReactFlow, useNodesState, useEdgesState } from "@xyflow/react"
import type { Node, Edge } from "@xyflow/react"
import { ScreenNode } from "./ScreenNode"
import { FlowEdge } from "./FlowEdge"
import type { DesignFlowConfig } from "../types"

const nodeTypes = { screen: ScreenNode }
const edgeTypes = { flow: FlowEdge }

interface CanvasProps {
  config: DesignFlowConfig
  onScreenSelect: (screenId: string) => void
}

function configToNodes(
  config: DesignFlowConfig,
  onScreenSelect: (id: string) => void,
): Node[] {
  return Object.entries(config.screens).map(([id, screen]) => ({
    id,
    type: "screen",
    position: screen.position,
    data: {
      title: screen.title,
      screenId: id,
      onSelect: onScreenSelect,
    },
  }))
}

function configToEdges(config: DesignFlowConfig): Edge[] {
  if (!config.edges) return []
  return config.edges.map((edge) => ({
    id: `${edge.from}-${edge.to}`,
    type: "flow",
    source: edge.from,
    target: edge.to,
    data: { label: edge.label },
  }))
}

export function Canvas({ config, onScreenSelect }: CanvasProps) {
  const initialNodes = configToNodes(config, onScreenSelect)
  const initialEdges = configToEdges(config)

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      />
    </div>
  )
}
