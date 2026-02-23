import { useState } from "react"

const files = [
  { type: "dir" as const, name: ".github", message: "Update CI config", time: "3d" },
  { type: "dir" as const, name: "src", message: "Refactor hooks", time: "1d" },
  { type: "dir" as const, name: "public", message: "Add favicon", time: "2w" },
  { type: "file" as const, name: ".gitignore", message: "Initial commit", time: "3mo" },
  { type: "file" as const, name: "package.json", message: "Bump deps", time: "5d" },
  { type: "file" as const, name: "README.md", message: "Update README", time: "2d" },
  { type: "file" as const, name: "tsconfig.json", message: "Add strict mode", time: "1w" },
  { type: "file" as const, name: "vite.config.ts", message: "Configure proxy", time: "4d" },
]

const topics = ["react", "typescript", "vite", "tailwind", "starter"]

const languages = [
  { name: "TypeScript", pct: 68, color: "var(--df-info)" },
  { name: "CSS", pct: 22, color: "var(--df-warning)" },
  { name: "HTML", pct: 10, color: "var(--df-error)" },
]

export default function Repo() {
  const [activeTab, setActiveTab] = useState<"code" | "issues" | "prs" | "actions">("code")
  const [branchOpen, setBranchOpen] = useState(false)

  const tabs = [
    { id: "code" as const, label: "Code", count: null, navigate: null },
    { id: "issues" as const, label: "Issues", count: 42, navigate: "issues" },
    { id: "prs" as const, label: "PRs", count: 7, navigate: "pullrequest" },
    { id: "actions" as const, label: "Actions", count: null, navigate: null },
  ]

  return (
    <div
      style={{
        background: "var(--df-background)",
        minHeight: "100vh",
        fontFamily: "var(--df-font-family)",
      }}
    >
      {/* Nav bar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--df-surface)",
          borderBottom: "1px solid var(--df-border)",
          padding: "var(--df-spacing-sm) var(--df-spacing-md)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-sm)" }}>
          <div
            style={{
              background: "var(--df-primary)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "12px",
              borderRadius: "var(--df-radius-md)",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            GH
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-sm)" }}>
          <button
            data-df-navigate="notifications"
            style={{
              position: "relative",
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-md)",
              padding: "var(--df-spacing-xs)",
              cursor: "pointer",
              color: "var(--df-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16a2 2 0 002-2H6a2 2 0 002 2zM8 1.918l-.797.161A4.002 4.002 0 004 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 00-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 111.99 0A5.002 5.002 0 0113 6c0 .88.32 4.2 1.22 6z" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 8,
                height: 8,
                background: "var(--df-error)",
                borderRadius: "var(--df-radius-full)",
              }}
            />
          </button>
          <button
            data-df-navigate="profile"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--df-radius-full)",
              background: "var(--df-secondary)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            OS
          </button>
        </div>
      </nav>

      <div style={{ padding: "var(--df-spacing-md)" }}>
        {/* Repo header */}
        <div style={{ marginBottom: "var(--df-spacing-md)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--df-spacing-xs)",
              marginBottom: "var(--df-spacing-xs)",
            }}
          >
            <span
              data-df-navigate="profile"
              style={{
                color: "var(--df-primary)",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              octocat
            </span>
            <span style={{ color: "var(--df-text-muted)", fontSize: "12px" }}>/</span>
            <span style={{ color: "var(--df-text)", fontWeight: 600, fontSize: "12px" }}>
              react-starter
            </span>
            <span
              style={{
                background: "var(--df-surface-alt)",
                color: "var(--df-text-muted)",
                fontSize: "10px",
                borderRadius: "var(--df-radius-full)",
                padding: "1px var(--df-spacing-xs)",
                border: "1px solid var(--df-border)",
                marginLeft: "var(--df-spacing-xs)",
              }}
            >
              Public
            </span>
          </div>
          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-xs)" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                background: "var(--df-surface)",
                border: "1px solid var(--df-border)",
                borderRadius: "var(--df-radius-md)",
                padding: "3px var(--df-spacing-sm)",
                fontSize: "12px",
                color: "var(--df-text)",
                cursor: "pointer",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="currentColor"
                style={{ color: "var(--df-text-muted)" }}
              >
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              Star
              <span style={{ color: "var(--df-text-muted)", fontSize: "10px" }}>1.2k</span>
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                background: "var(--df-surface)",
                border: "1px solid var(--df-border)",
                borderRadius: "var(--df-radius-md)",
                padding: "3px var(--df-spacing-sm)",
                fontSize: "12px",
                color: "var(--df-text)",
                cursor: "pointer",
              }}
            >
              Fork
              <span style={{ color: "var(--df-text-muted)", fontSize: "10px" }}>156</span>
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                background: "var(--df-surface)",
                border: "1px solid var(--df-border)",
                borderRadius: "var(--df-radius-md)",
                padding: "3px var(--df-spacing-sm)",
                fontSize: "12px",
                color: "var(--df-text)",
                cursor: "pointer",
              }}
            >
              Watch
              <span style={{ color: "var(--df-text-muted)", fontSize: "10px" }}>23</span>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--df-spacing-sm)",
            borderBottom: "1px solid var(--df-border)",
            marginBottom: "var(--df-spacing-md)",
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              {...(tab.navigate ? { "data-df-navigate": tab.navigate } : {})}
              style={{
                paddingBottom: "var(--df-spacing-sm)",
                paddingLeft: "var(--df-spacing-xs)",
                paddingRight: "var(--df-spacing-xs)",
                borderBottom: activeTab === tab.id
                  ? "2px solid var(--df-primary)"
                  : "2px solid transparent",
                cursor: "pointer",
                background: "transparent",
                fontSize: "12px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                color: activeTab === tab.id ? "var(--df-text)" : "var(--df-text-muted)",
                fontWeight: activeTab === tab.id ? 600 : 400,
                border: "none",
                borderBottomWidth: "2px",
                borderBottomStyle: "solid",
                borderBottomColor: activeTab === tab.id ? "var(--df-primary)" : "transparent",
              }}
            >
              {tab.label}
              {tab.count !== null && (
                <span
                  style={{
                    background: "var(--df-surface-alt)",
                    color: "var(--df-text-muted)",
                    fontSize: "10px",
                    borderRadius: "var(--df-radius-full)",
                    padding: "1px var(--df-spacing-xs)",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Branch selector + code button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--df-spacing-xs)",
            marginBottom: "var(--df-spacing-sm)",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <button
              onClick={() => setBranchOpen(!branchOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                background: "var(--df-surface)",
                border: "1px solid var(--df-border)",
                borderRadius: "var(--df-radius-md)",
                padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
                fontSize: "12px",
                color: "var(--df-text)",
                cursor: "pointer",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="currentColor"
                style={{ color: "var(--df-text-muted)" }}
              >
                <path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
              </svg>
              main
              <svg
                width="8"
                height="8"
                viewBox="0 0 16 16"
                fill="currentColor"
                style={{ color: "var(--df-text-muted)" }}
              >
                <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z" />
              </svg>
            </button>
            {branchOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: "var(--df-spacing-xs)",
                  background: "var(--df-surface)",
                  border: "1px solid var(--df-border)",
                  borderRadius: "var(--df-radius-md)",
                  boxShadow: "var(--df-shadow-md)",
                  zIndex: 10,
                  width: 176,
                }}
              >
                <div
                  style={{
                    padding: "var(--df-spacing-xs)",
                    borderBottom: "1px solid var(--df-border)",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Find a branch..."
                    style={{
                      width: "100%",
                      background: "var(--df-background)",
                      border: "1px solid var(--df-border)",
                      borderRadius: "var(--df-radius-md)",
                      padding: "var(--df-spacing-xs)",
                      fontSize: "12px",
                      color: "var(--df-text)",
                      fontFamily: "var(--df-font-family)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ padding: "var(--df-spacing-xs) 0" }}>
                  {["main", "develop", "feature/auth", "fix/typos"].map((branch) => (
                    <button
                      key={branch}
                      onClick={() => setBranchOpen(false)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
                        fontSize: "12px",
                        color: "var(--df-text)",
                        cursor: "pointer",
                        background: "transparent",
                        border: "none",
                        fontFamily: "var(--df-font-family)",
                      }}
                    >
                      {branch === "main" && (
                        <span style={{ marginRight: "var(--df-spacing-xs)", color: "var(--df-success)" }}>
                          &#10003;
                        </span>
                      )}
                      {branch}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            style={{
              background: "var(--df-primary)",
              color: "#fff",
              borderRadius: "var(--df-radius-md)",
              padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              fontFamily: "var(--df-font-family)",
            }}
          >
            Code &#9662;
          </button>
        </div>

        {/* Latest commit */}
        <div
          style={{
            background: "var(--df-surface)",
            borderTopLeftRadius: "var(--df-radius-lg)",
            borderTopRightRadius: "var(--df-radius-lg)",
            border: "1px solid var(--df-border)",
            padding: "var(--df-spacing-sm)",
            display: "flex",
            alignItems: "center",
            gap: "var(--df-spacing-xs)",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "var(--df-radius-full)",
              background: "var(--df-secondary)",
              color: "#fff",
              fontSize: "9px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            OS
          </div>
          <span
            style={{
              color: "var(--df-text)",
              fontSize: "12px",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            octocat
          </span>
          <span
            style={{
              color: "var(--df-text-muted)",
              fontSize: "12px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            Update README
          </span>
          <span
            style={{
              color: "var(--df-text-muted)",
              fontSize: "10px",
              fontFamily: "monospace",
              flexShrink: 0,
            }}
          >
            a1b2c3d
          </span>
        </div>

        {/* File list */}
        <div
          style={{
            borderLeft: "1px solid var(--df-border)",
            borderRight: "1px solid var(--df-border)",
            borderBottom: "1px solid var(--df-border)",
            borderBottomLeftRadius: "var(--df-radius-lg)",
            borderBottomRightRadius: "var(--df-radius-lg)",
            overflow: "hidden",
          }}
        >
          {files.map((file, i) => (
            <div
              key={file.name}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
                fontSize: "12px",
                borderBottom:
                  i < files.length - 1 ? "1px solid var(--df-border)" : "none",
              }}
            >
              <span style={{ width: 20, flexShrink: 0, color: "var(--df-text-muted)" }}>
                {file.type === "dir" ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    style={{ color: "var(--df-primary)" }}
                  >
                    <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    style={{ color: "var(--df-text-muted)" }}
                  >
                    <path d="M3.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V4.664a.25.25 0 00-.073-.177l-2.914-2.914a.25.25 0 00-.177-.073H3.75zM2 1.75C2 .784 2.784 0 3.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0112.25 16h-8.5A1.75 1.75 0 012 14.25V1.75z" />
                  </svg>
                )}
              </span>
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: file.type === "dir" ? "var(--df-primary)" : "var(--df-text)",
                }}
              >
                {file.name}
              </span>
              <span
                style={{
                  color: "var(--df-text-muted)",
                  fontSize: "10px",
                  flexShrink: 0,
                  marginLeft: "var(--df-spacing-sm)",
                }}
              >
                {file.time}
              </span>
            </div>
          ))}
        </div>

        {/* About section */}
        <div
          style={{
            marginTop: "var(--df-spacing-md)",
            background: "var(--df-surface)",
            border: "1px solid var(--df-border)",
            borderRadius: "var(--df-radius-lg)",
            padding: "var(--df-spacing-md)",
          }}
        >
          <h3
            style={{
              color: "var(--df-text)",
              fontWeight: 600,
              fontSize: "12px",
              marginBottom: "var(--df-spacing-sm)",
              marginTop: 0,
            }}
          >
            About
          </h3>
          <p
            style={{
              color: "var(--df-text-muted)",
              fontSize: "12px",
              marginBottom: "var(--df-spacing-sm)",
              lineHeight: 1.6,
              marginTop: 0,
            }}
          >
            A modern React starter template with TypeScript, Vite, and Tailwind CSS.
          </p>
          <a
            style={{
              color: "var(--df-primary)",
              fontSize: "12px",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            react-starter.dev
          </a>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--df-spacing-xs)",
              marginTop: "var(--df-spacing-sm)",
            }}
          >
            {topics.map((topic) => (
              <span
                key={topic}
                style={{
                  background: "var(--df-surface-alt)",
                  color: "var(--df-primary)",
                  fontSize: "10px",
                  borderRadius: "var(--df-radius-full)",
                  padding: "1px var(--df-spacing-xs)",
                }}
              >
                {topic}
              </span>
            ))}
          </div>
          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "var(--df-spacing-md)",
              marginTop: "var(--df-spacing-sm)",
              fontSize: "12px",
              color: "var(--df-text-muted)",
            }}
          >
            <span>
              &#9733;{" "}
              <span style={{ color: "var(--df-text)", fontWeight: 600 }}>1.2k</span>
            </span>
            <span>
              &#9095;{" "}
              <span style={{ color: "var(--df-text)", fontWeight: 600 }}>156</span>
            </span>
            <span>
              &#9673;{" "}
              <span style={{ color: "var(--df-text)", fontWeight: 600 }}>23</span>
            </span>
          </div>
          {/* Languages bar */}
          <div style={{ marginTop: "var(--df-spacing-sm)" }}>
            <div
              style={{
                display: "flex",
                height: 6,
                borderRadius: "var(--df-radius-full)",
                overflow: "hidden",
                marginBottom: "var(--df-spacing-xs)",
              }}
            >
              {languages.map((lang, i) => (
                <div
                  key={lang.name}
                  style={{
                    background: lang.color,
                    width: `${lang.pct}%`,
                    borderTopLeftRadius: i === 0 ? "var(--df-radius-full)" : 0,
                    borderBottomLeftRadius: i === 0 ? "var(--df-radius-full)" : 0,
                    borderTopRightRadius:
                      i === languages.length - 1 ? "var(--df-radius-full)" : 0,
                    borderBottomRightRadius:
                      i === languages.length - 1 ? "var(--df-radius-full)" : 0,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--df-spacing-sm)",
                fontSize: "10px",
              }}
            >
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--df-spacing-xs)",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "var(--df-radius-full)",
                      background: lang.color,
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: "var(--df-text)" }}>{lang.name}</span>
                  <span style={{ color: "var(--df-text-muted)" }}>{lang.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* README preview */}
        <div
          style={{
            marginTop: "var(--df-spacing-md)",
            border: "1px solid var(--df-border)",
            borderRadius: "var(--df-radius-lg)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "var(--df-surface)",
              borderBottom: "1px solid var(--df-border)",
              padding: "var(--df-spacing-sm) var(--df-spacing-md)",
              display: "flex",
              alignItems: "center",
              gap: "var(--df-spacing-xs)",
              fontSize: "12px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              style={{ color: "var(--df-text-muted)" }}
            >
              <path d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm7.251 10.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574zM8.755 4.75l-.004 7.322a3.752 3.752 0 011.992-.572H14.5v-9h-3.495a2.25 2.25 0 00-2.25 2.25z" />
            </svg>
            <span style={{ color: "var(--df-text)", fontWeight: 600 }}>README.md</span>
          </div>
          <div style={{ padding: "var(--df-spacing-md)" }}>
            <h1
              style={{
                color: "var(--df-text)",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "var(--df-spacing-sm)",
                marginTop: 0,
              }}
            >
              React Starter
            </h1>
            <p
              style={{
                color: "var(--df-text-muted)",
                fontSize: "12px",
                marginBottom: "var(--df-spacing-md)",
                lineHeight: 1.6,
                marginTop: 0,
              }}
            >
              A modern React starter template with TypeScript, Vite, and Tailwind CSS
              pre-configured.
            </p>
            <h2
              style={{
                color: "var(--df-text)",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "var(--df-spacing-xs)",
                marginTop: 0,
              }}
            >
              Getting Started
            </h2>
            <div
              style={{
                background: "var(--df-surface-alt)",
                borderRadius: "var(--df-radius-md)",
                padding: "var(--df-spacing-sm)",
                fontFamily: "monospace",
                fontSize: "10px",
                color: "var(--df-text)",
                marginBottom: "var(--df-spacing-md)",
                overflowX: "auto",
              }}
            >
              <div>npx degit octocat/react-starter my-app</div>
              <div>cd my-app && npm install</div>
              <div>npm run dev</div>
            </div>
            <h2
              style={{
                color: "var(--df-text)",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "var(--df-spacing-xs)",
                marginTop: 0,
              }}
            >
              Features
            </h2>
            <ul
              style={{
                color: "var(--df-text-muted)",
                fontSize: "12px",
                paddingLeft: "var(--df-spacing-md)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              <li>React 18 with TypeScript</li>
              <li>Vite for lightning-fast HMR</li>
              <li>Tailwind CSS with custom theme</li>
              <li>ESLint and Prettier pre-configured</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
