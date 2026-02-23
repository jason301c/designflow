import type { DesignFlowConfig } from "designflow"

const config: DesignFlowConfig = {
  name: "My Designflow Project",
  screens: {
    explore: {
      title: "Explore",
      file: "./screens/Explore.tsx",
      position: { x: 0, y: 0 },
      viewport: "mobile",
      color: "#4488ff",
    },
    notifications: {
      title: "Notifications",
      file: "./screens/Notifications.tsx",
      position: { x: 0, y: 520 },
      viewport: "mobile",
      color: "#f76540",
    },
    repo: {
      title: "Repository",
      file: "./screens/Repo.tsx",
      position: { x: 300, y: 0 },
      viewport: "mobile",
      color: "#ffb400",
    },
    pullrequest: {
      title: "Pull Request",
      file: "./screens/Pullrequest.tsx",
      position: { x: 300, y: 520 },
      viewport: "mobile",
      color: "#ef3060",
    },
    profile: {
      title: "Profile",
      file: "./screens/Profile.tsx",
      position: { x: 600, y: 0 },
      viewport: "mobile",
      color: "#ff80ff",
    },
    issues: {
      title: "Issues",
      file: "./screens/Issues.tsx",
      position: { x: 600, y: 520 },
      viewport: "mobile",
      color: "#ffcccc",
    },
  },

  edges: [
    { from: "explore", to: "repo", label: "Repo" },
    { from: "repo", to: "pullrequest", label: "Pull requests" },
    { from: "repo", to: "issues", label: "Issues" },
    { from: "pullrequest", to: "repo", label: "Back to repo" },
    { from: "issues", to: "repo", label: "Back to repo" },
    { from: "repo", to: "profile", label: "Author" },
    { from: "profile", to: "repo", label: "Pinned repo" },
    { from: "notifications", to: "pullrequest", label: "PR notification" },
    { from: "notifications", to: "issues", label: "Issue notification" },
    { from: "profile", to: "notifications", label: "Notifications" },
  ],
}

export default config
