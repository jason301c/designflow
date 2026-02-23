import type { DesignFlowConfig } from "designflow"

const config: DesignFlowConfig = {
  screens: {
    login: {
      title: "Login",
      file: "./screens/Login.tsx",
      position: { x: 0, y: 200 },
      viewport: "mobile",
    },
    dashboard: {
      title: "Dashboard",
      file: "./screens/Dashboard.tsx",
      position: { x: 600, y: 0 },
      viewport: "desktop",
    },
    settings: {
      title: "Settings",
      file: "./screens/Settings.tsx",
      position: { x: 1200, y: 200 },
    },
  },

  edges: [
    { from: "login", to: "dashboard", label: "Sign in" },
    { from: "dashboard", to: "settings", label: "Gear icon" },
  ],
}

export default config
