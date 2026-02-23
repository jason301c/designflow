import { useState } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { Canvas } from "./Canvas"
import { Viewer } from "./Viewer"
import type { DesignFlowConfig } from "../types"
import "@xyflow/react/dist/style.css"

interface AppProps {
  config: DesignFlowConfig
  screens: Record<string, React.ComponentType>
}

export function App({ config, screens }: AppProps) {
  const [viewingScreen, setViewingScreen] = useState<string | null>(null)

  const viewingConfig = viewingScreen ? config.screens[viewingScreen] : null

  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <Canvas config={config} onScreenSelect={setViewingScreen} />
        {viewingScreen && viewingConfig && screens[viewingScreen] && (
          <Viewer
            screenId={viewingScreen}
            screenTitle={viewingConfig.title}
            component={screens[viewingScreen]}
            onClose={() => setViewingScreen(null)}
          />
        )}
      </div>
    </ReactFlowProvider>
  )
}
