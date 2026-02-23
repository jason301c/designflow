import { useState } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { Canvas } from "./Canvas"
import { Viewer } from "./Viewer"
import { ThemePanel } from "./ThemePanel"
import type { DesignFlowConfig, DesignFlowTheme, EdgeConfig } from "../types"
import "@xyflow/react/dist/style.css"

interface AppProps {
  config: DesignFlowConfig
  screens: Record<string, React.ComponentType>
  inferredEdges?: EdgeConfig[]
  theme?: DesignFlowTheme
}

export function App({ config, screens, inferredEdges, theme }: AppProps) {
  const [viewingScreen, setViewingScreen] = useState<string | null>(null)
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null)
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false)

  const viewingConfig = viewingScreen ? config.screens[viewingScreen] : null

  const handleCloseViewer = () => {
    setFocusNodeId(viewingScreen)
    setViewingScreen(null)
  }

  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <Canvas config={config} screens={screens} onScreenSelect={setViewingScreen} focusNodeId={focusNodeId} inferredEdges={inferredEdges} />
        {viewingScreen && viewingConfig && screens[viewingScreen] && (
          <Viewer
            screenId={viewingScreen}
            screenTitle={viewingConfig.title}
            component={screens[viewingScreen]}
            onClose={handleCloseViewer}
            onNavigate={setViewingScreen}
            config={config}
          />
        )}
        {theme && (
          <button
            onClick={() => setIsThemePanelOpen(!isThemePanelOpen)}
            aria-label="Theme"
            style={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: 900,
              padding: "8px 16px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "0.875rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            Theme
          </button>
        )}
        {isThemePanelOpen && theme && (
          <ThemePanel theme={theme} onClose={() => setIsThemePanelOpen(false)} />
        )}
      </div>
    </ReactFlowProvider>
  )
}
