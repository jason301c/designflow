import { ReactFlow, useNodesState, useEdgesState, useReactFlow } from "@xyflow/react"
import type { Node, Edge } from "@xyflow/react"
import { useEffect, type ComponentType } from "react"
import { ScreenNode } from "./ScreenNode"
import { FlowEdge } from "./FlowEdge"
import type { DesignFlowConfig } from "../types"

const nodeTypes = { screen: ScreenNode }
const edgeTypes = { flow: FlowEdge }

interface CanvasProps {
  config: DesignFlowConfig
  screens?: Record<string, ComponentType>
  onScreenSelect: (screenId: string) => void
  focusNodeId?: string | null
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

export function Canvas({ config, screens, onScreenSelect, focusNodeId }: CanvasProps) {
  const initialNodes = configToNodes(config, onScreenSelect, screens)
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
      >
        <FocusHandler focusNodeId={focusNodeId} />
      </ReactFlow>
    </div>
  )
}
