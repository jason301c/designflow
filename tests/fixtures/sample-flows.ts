import type { DesignFlowConfig } from "../../src/types"

export const sampleConfig: DesignFlowConfig = {
  screens: {
    login: { title: "Login", file: "./screens/Login.tsx", position: { x: 0, y: 0 }, viewport: "mobile" },
    dashboard: { title: "Dashboard", file: "./screens/Dashboard.tsx", position: { x: 450, y: 0 }, viewport: "desktop" },
    settings: { title: "Settings", file: "./screens/Settings.tsx", position: { x: 900, y: 0 } },
  },
  edges: [
    { from: "login", to: "dashboard", label: "Sign in" },
    { from: "dashboard", to: "settings", label: "Gear icon" },
  ],
}
