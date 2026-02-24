import type { DesignFlowConfig } from "designflow"

const config: DesignFlowConfig = {
  name: "My Designflow Project",
  screens: {
    explore: {
      title: "Explore",
      file: "./screens/Explore.tsx",
      position: { x: -390, y: 350 },
      viewport: "mobile",
      color: "#4488ff",
    },
    notifications: {
      title: "Notifications",
      file: "./screens/Notifications.tsx",
      position: { x: 230, y: -20 },
      viewport: "mobile",
      color: "#f76540",
    },
    repo: {
      title: "Repository",
      file: "./screens/Repo.tsx",
      position: { x: -120, y: 350 },
      viewport: "mobile",
      color: "#ffb400",
    },
    pullrequest: {
      title: "Pull Request",
      file: "./screens/Pullrequest.tsx",
      position: { x: 230, y: 610 },
      viewport: "mobile",
      color: "#ef3060",
    },
    profile: {
      title: "Profile",
      file: "./screens/Profile.tsx",
      position: { x: 590, y: -20 },
      viewport: "mobile",
      color: "#ff80ff",
    },
    issues: {
      title: "Issues",
      file: "./screens/Issues.tsx",
      position: { x: 590, y: 610 },
      viewport: "mobile",
      color: "#ffcccc",
    },
    github: {
      title: "GitHub",
      file: "./screens/Github.tsx",
      position: { x: -630, y: 350 },
      viewport: "mobile",
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
