import { ReactFlow, MiniMap, Background, BackgroundVariant, useNodesState, useEdgesState, useReactFlow } from "@xyflow/react"
import type { Node, Edge } from "@xyflow/react"
import { useCallback, useEffect, type ComponentType } from "react"
import { ScreenNode } from "./ScreenNode"
import { FlowEdge } from "./FlowEdge"
import { Toolbar } from "./Toolbar"
import type { DesignFlowConfig, EdgeConfig, CanvasSettings } from "../types"

const nodeTypes = { screen: ScreenNode }
const edgeTypes = { flow: FlowEdge }

interface CanvasProps {
  config: DesignFlowConfig
  screens?: Record<string, ComponentType>
  onScreenSelect: (screenId: string) => void
  focusNodeId?: string | null
  inferredEdges?: EdgeConfig[]
  settings?: CanvasSettings
  onSettingsChange?: (settings: CanvasSettings) => void
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

function pairKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`
}

function configToEdges(config: DesignFlowConfig, inferredEdges?: EdgeConfig[], settings?: CanvasSettings): Edge[] {
  const seenPairs = new Set<string>()

  const explicitEdges: Edge[] = (config.edges ?? [])
    .filter((edge) => {
      const key = pairKey(edge.from, edge.to)
      if (seenPairs.has(key)) return false
      seenPairs.add(key)
      return true
    })
    .map((edge) => ({
      id: `${edge.from}-${edge.to}`,
      type: "flow",
      source: edge.from,
      target: edge.to,
      sourceHandle: "source-right",
      targetHandle: "target-left",
      data: { label: edge.label, accentColor: settings?.accentColor, lineStyle: settings?.lineStyle },
    }))

  if (!inferredEdges?.length) return explicitEdges

  const inferred: Edge[] = inferredEdges
    .filter((e) => {
      const key = pairKey(e.from, e.to)
      if (seenPairs.has(key)) return false
      seenPairs.add(key)
      return true
    })
    .map((edge) => ({
      id: `inferred-${edge.from}-${edge.to}`,
      type: "flow",
      source: edge.from,
      target: edge.to,
      sourceHandle: "source-right",
      targetHandle: "target-left",
      data: { label: edge.label, inferred: true, accentColor: settings?.accentColor, lineStyle: settings?.lineStyle },
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

const bgVariantMap = {
  grid: BackgroundVariant.Lines,
  dots: BackgroundVariant.Dots,
}

export function Canvas({ config, screens, onScreenSelect, focusNodeId, inferredEdges, settings, onSettingsChange }: CanvasProps) {
  const initialNodes = configToNodes(config, onScreenSelect, screens)
  const initialEdges = configToEdges(config, inferredEdges, settings)

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

  const isDarkCanvas = settings?.appearance === "dark"

  return (
    <div style={{ width: "100%", height: "100vh", background: isDarkCanvas ? "#000000" : undefined }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{}}
        onInit={(instance) => instance.fitView()}
      >
        <FocusHandler focusNodeId={focusNodeId} />
        <MiniMap pannable zoomable />
        {settings && settings.backgroundStyle !== "blank" && (
          <Background
            variant={bgVariantMap[settings.backgroundStyle]}
            color={isDarkCanvas ? "#222" : "#e2e8f0"}
            style={{ opacity: 0.4 }}
          />
        )}
        <Toolbar settings={settings} onSettingsChange={onSettingsChange} />
      </ReactFlow>
    </div>
  )
}
