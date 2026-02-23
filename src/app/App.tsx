import { useState } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { Canvas } from "./Canvas"
import { Viewer } from "./Viewer"
import { DEFAULT_CANVAS_SETTINGS } from "../types"
import type { DesignFlowConfig, EdgeConfig, CanvasSettings } from "../types"
import "@xyflow/react/dist/style.css"

const DF_SETTINGS_KEY = "df-appearance"

function getInitialSettings(): CanvasSettings {
  try {
    const stored = localStorage.getItem(DF_SETTINGS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && typeof parsed === "object" && "appearance" in parsed) {
        return { ...DEFAULT_CANVAS_SETTINGS, ...parsed }
      }
    }
  } catch {
    // localStorage unavailable or invalid JSON
  }
  return { ...DEFAULT_CANVAS_SETTINGS }
}

interface AppProps {
  config: DesignFlowConfig
  screens: Record<string, React.ComponentType>
  inferredEdges?: EdgeConfig[]
}

export function App({ config, screens, inferredEdges }: AppProps) {
  const [viewingScreen, setViewingScreen] = useState<string | null>(null)
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null)
  const [settings, setSettings] = useState<CanvasSettings>(getInitialSettings)

  const viewingConfig = viewingScreen ? config.screens[viewingScreen] : null

  const handleCloseViewer = () => {
    setFocusNodeId(viewingScreen)
    setViewingScreen(null)
  }

  const handleSettingsChange = (newSettings: CanvasSettings) => {
    setSettings(newSettings)
    try {
      localStorage.setItem(DF_SETTINGS_KEY, JSON.stringify(newSettings))
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
          settings={settings}
          onSettingsChange={handleSettingsChange}
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
