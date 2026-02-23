import { useState } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { Canvas } from "./Canvas"
import { Viewer } from "./Viewer"
import type { DesignFlowConfig, EdgeConfig, CanvasAppearance } from "../types"
import "@xyflow/react/dist/style.css"

const DF_APPEARANCE_KEY = "df-appearance"

function getInitialAppearance(): CanvasAppearance {
  try {
    const stored = localStorage.getItem(DF_APPEARANCE_KEY)
    if (stored === "dark" || stored === "light") return stored
  } catch {
    // localStorage unavailable
  }
  return "light"
}

interface AppProps {
  config: DesignFlowConfig
  screens: Record<string, React.ComponentType>
  inferredEdges?: EdgeConfig[]
}

export function App({ config, screens, inferredEdges }: AppProps) {
  const [viewingScreen, setViewingScreen] = useState<string | null>(null)
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null)
  const [appearance, setAppearance] = useState<CanvasAppearance>(getInitialAppearance)

  const viewingConfig = viewingScreen ? config.screens[viewingScreen] : null

  const handleCloseViewer = () => {
    setFocusNodeId(viewingScreen)
    setViewingScreen(null)
  }

  const handleAppearanceChange = (a: CanvasAppearance) => {
    setAppearance(a)
    try {
      localStorage.setItem(DF_APPEARANCE_KEY, a)
    } catch {
      // localStorage unavailable
    }
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
          appearance={appearance}
          onAppearanceChange={handleAppearanceChange}
        />
        {viewingScreen && viewingConfig && screens[viewingScreen] && (
          <Viewer
            screenId={viewingScreen}
            screenTitle={viewingConfig.title}
            component={screens[viewingScreen]}
            onClose={handleCloseViewer}
          />
        )}
      </div>
    </ReactFlowProvider>
  )
}
