import { ReactFlow, MiniMap, Background, BackgroundVariant, useNodesState, useEdgesState, useReactFlow } from "@xyflow/react"
import type { Node, Edge } from "@xyflow/react"
import { useCallback, useEffect, useState, type ComponentType } from "react"
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
  projectName?: string
}

function configToNodes(
  config: DesignFlowConfig,
  onScreenSelect: (id: string) => void,
  screens?: Record<string, ComponentType>,
  accentColor?: string,
  colorScheme?: "light" | "dark",
  projectName?: string,
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
      color: screen.color,
      accentColor,
      colorScheme,
      projectName,
    },
  }))
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`
}

function pickHandles(
  positions: Record<string, { x: number; y: number }>,
  fromId: string,
  toId: string,
): { sourceHandle: string; targetHandle: string } {
  const fromPos = positions[fromId]
  const toPos = positions[toId]
  if (!fromPos || !toPos) return { sourceHandle: "source-right", targetHandle: "target-left" }

  const dx = toPos.x - fromPos.x
  const dy = toPos.y - fromPos.y

  if (Math.abs(dx) >= Math.abs(dy)) {
    // Horizontal dominant
    if (dx >= 0) return { sourceHandle: "source-right", targetHandle: "target-left" }
    return { sourceHandle: "source-left", targetHandle: "target-right" }
  } else {
    // Vertical dominant
    if (dy >= 0) return { sourceHandle: "source-bottom", targetHandle: "target-top" }
    return { sourceHandle: "source-top", targetHandle: "target-bottom" }
  }
}

function getPositions(config: DesignFlowConfig, nodeOverrides?: Record<string, { x: number; y: number }>): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}
  for (const [id, screen] of Object.entries(config.screens)) {
    positions[id] = nodeOverrides?.[id] ?? screen.position
  }
  return positions
}

function configToEdges(config: DesignFlowConfig, inferredEdges?: EdgeConfig[], settings?: CanvasSettings, nodePositions?: Record<string, { x: number; y: number }>): Edge[] {
  const positions = nodePositions ?? getPositions(config)
  const seenPairs = new Set<string>()

  const explicitEdges: Edge[] = (config.edges ?? [])
    .filter((edge) => {
      const key = pairKey(edge.from, edge.to)
      if (seenPairs.has(key)) return false
      seenPairs.add(key)
      return true
    })
    .map((edge) => {
      const handles = pickHandles(positions, edge.from, edge.to)
      return {
        id: `${edge.from}-${edge.to}`,
        type: "flow",
        source: edge.from,
        target: edge.to,
        ...handles,
        data: { label: edge.label, accentColor: settings?.accentColor, lineStyle: settings?.lineStyle },
      }
    })

  if (!inferredEdges?.length) return explicitEdges

  const inferred: Edge[] = inferredEdges
    .filter((e) => {
      const key = pairKey(e.from, e.to)
      if (seenPairs.has(key)) return false
      seenPairs.add(key)
      return true
    })
    .map((edge) => {
      const handles = pickHandles(positions, edge.from, edge.to)
      return {
        id: `inferred-${edge.from}-${edge.to}`,
        type: "flow",
        source: edge.from,
        target: edge.to,
        ...handles,
        data: { label: edge.label, inferred: true, accentColor: settings?.accentColor, lineStyle: settings?.lineStyle },
      }
    })

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

export function Canvas({ config, screens, onScreenSelect, focusNodeId, inferredEdges, settings, onSettingsChange, projectName }: CanvasProps) {
  const initialNodes = configToNodes(config, onScreenSelect, screens, settings?.accentColor, settings?.appearance, projectName)
  const initialEdges = configToEdges(config, inferredEdges, settings)

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setEdges(configToEdges(config, inferredEdges, settings))
    setNodes((prev) => prev.map((node) => ({
      ...node,
      data: {
        ...node.data,
        accentColor: settings?.accentColor,
        colorScheme: settings?.appearance,
        projectName,
      },
    })))
  }, [settings?.accentColor, settings?.lineStyle, settings?.appearance])

  const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
    fetch("/__designflow/update-positions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        positions: { [node.id]: { x: node.position.x, y: node.position.y } },
      }),
    })
    // Recalculate edges with updated node positions
    setNodes((currentNodes) => {
      const livePositions: Record<string, { x: number; y: number }> = {}
      for (const n of currentNodes) {
        livePositions[n.id] = n.position
      }
      setEdges(configToEdges(config, inferredEdges, settings, livePositions))
      return currentNodes
    })
  }, [config, inferredEdges, settings, setEdges, setNodes])

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
        proOptions={{ hideAttribution: true }}
        onInit={(instance) => instance.fitView()}
      >
        <FocusHandler focusNodeId={focusNodeId} />
        <MiniMap pannable zoomable />
        {settings && settings.backgroundStyle !== "blank" && (
          <Background
            variant={bgVariantMap[settings.backgroundStyle]}
            color={isDarkCanvas ? "#222" : "#e2e8f0"}
            size={settings.backgroundStyle === "dots" ? 2 : undefined}
            gap={settings.backgroundStyle === "dots" ? 16 : undefined}
            style={{ opacity: settings.backgroundStyle === "dots" ? 0.7 : 0.4 }}
          />
        )}
        <Toolbar settings={settings} onSettingsChange={onSettingsChange} projectName={projectName} />
        <LogoBadge dark={isDarkCanvas} />
      </ReactFlow>
    </div>
  )
}

function LogoBadge({ dark }: { dark?: boolean }) {
  const [aboutOpen, setAboutOpen] = useState(false)

  useEffect(() => {
    if (!aboutOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAboutOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [aboutOpen])

  const pillBg = dark ? "#1e1e1e" : "#fff"
  const pillBorder = `1px solid ${dark ? "#333" : "#e2e8f0"}`
  const pillColor = dark ? "#e2e8f0" : "#334155"

  return (
    <>
      <div
        data-testid="logo-badge"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          background: pillBg,
          border: pillBorder,
          borderRadius: 9999,
          padding: "6px 6px 6px 14px",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: pillColor,
          userSelect: "none",
        }}
      >
        <a
          href="https://designflow.cc"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
        >
          <span style={{ opacity: 0.5, marginRight: 1 }}>design</span>
          <span>flow</span>
        </a>
        <div style={{ width: 1, height: 16, background: dark ? "#444" : "#e2e8f0", margin: "0 8px" }} />
        <button
          data-testid="about-button"
          onClick={() => setAboutOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            padding: "2px 8px",
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 500,
            color: pillColor,
            cursor: "pointer",
            opacity: 1,
          }}
        >
          About
        </button>
        <div style={{ width: 1, height: 16, background: dark ? "#444" : "#e2e8f0" }} />
        <a
          href="https://github.com/jason301c/designflow"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contribute via GitHub"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "2px 8px",
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 500,
            color: pillColor,
            textDecoration: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Contribute
        </a>
      </div>

      {aboutOpen && (
        <div
          data-testid="about-modal-overlay"
          onClick={() => setAboutOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            data-testid="about-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: dark ? "#1e1e1e" : "#fff",
              border: `1px solid ${dark ? "#333" : "#e2e8f0"}`,
              borderRadius: 16,
              padding: "32px 36px",
              maxWidth: 480,
              width: "90%",
              color: dark ? "#e2e8f0" : "#1e293b",
              boxShadow: dark
                ? "0 24px 48px rgba(0, 0, 0, 0.6)"
                : "0 24px 48px rgba(0, 0, 0, 0.15)",
            }}
          >
            {/* Logo */}
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 20 }}>
              <span style={{ opacity: 0.5 }}>design</span>
              <span>flow</span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 20px", opacity: 0.85 }}>
              An infinite canvas where every screen is a real React component.
              Visualize flows, then eject into production routing code.
            </p>

            {/* Motivation */}
            <div style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.7, marginBottom: 24 }}>
              <p style={{ margin: "0 0 10px", fontWeight: 600, opacity: 1 }}>Why this exists</p>
              <p style={{ margin: "0 0 10px" }}>
                AI lets anyone generate working React screens in seconds.
                Existing solutions still introduce gaps between the human,
                the mockup, and the frontend.
              </p>
              <p style={{ margin: 0 }}>
                DesignFlow is where you lay those screens out, draw the flows
                between them, and export the whole thing as code.
              </p>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: `1px solid ${dark ? "#333" : "#e2e8f0"}`,
                paddingTop: 16,
                fontSize: 12,
                opacity: 0.5,
              }}
            >
              <span>MIT License</span>
              <span>designflow.cc</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
