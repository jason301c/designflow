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
        <Canvas
          config={config}
          screens={screens}
          onScreenSelect={setViewingScreen}
          focusNodeId={focusNodeId}
          inferredEdges={inferredEdges}
          onThemeToggle={theme ? () => setIsThemePanelOpen(!isThemePanelOpen) : undefined}
        />
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
        {isThemePanelOpen && theme && (
          <ThemePanel theme={theme} onClose={() => setIsThemePanelOpen(false)} />
        )}
      </div>
    </ReactFlowProvider>
  )
}
