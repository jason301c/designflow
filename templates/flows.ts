import type { DesignFlowConfig } from "designflow"

const config: DesignFlowConfig = {
  name: "My Designflow Project",
  screens: {
    login: {
      title: "Login",
      file: "./screens/Login.tsx",
      position: { x: 0, y: 250 },
      viewport: "mobile",
    },
    dashboard: {
      title: "Dashboard",
      file: "./screens/Dashboard.tsx",
      position: { x: 600, y: 0 },
      viewport: "desktop",
    },
    profile: {
      title: "Profile",
      file: "./screens/Profile.tsx",
      position: { x: 1400, y: -100 },
      viewport: "tablet",
    },
    settings: {
      title: "Settings",
      file: "./screens/Settings.tsx",
      position: { x: 1400, y: 400 },
      viewport: "desktop",
    },
    notifications: {
      title: "Notifications",
      file: "./screens/Notifications.tsx",
      position: { x: 2100, y: 250 },
      viewport: "mobile",
    },
  },

  edges: [
    { from: "login", to: "dashboard", label: "Sign in" },
    { from: "dashboard", to: "settings", label: "Settings" },
    { from: "dashboard", to: "profile", label: "Avatar" },
    { from: "dashboard", to: "notifications", label: "Notifications" },
  ],
}

export default config
