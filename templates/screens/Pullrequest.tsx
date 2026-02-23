import { useState } from "react"

export default function PullRequest() {
  const [activeTab, setActiveTab] = useState<"conversation" | "commits" | "files">("conversation")

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
          padding: `var(--df-spacing-sm) var(--df-spacing-md)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-sm)" }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: "var(--df-primary)",
              color: "#fff",
              borderRadius: "var(--df-radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            GH
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-sm)" }}>
          <button
            data-df-navigate="notifications"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--df-radius-md)",
              background: "var(--df-surface-alt)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--df-text-muted)",
              fontSize: 12,
              border: "1px solid var(--df-border)",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.9A4.5 4.5 0 0 0 3.5 6.4c0 .8-.2 3.1-1 4.6h11c-.8-1.5-1-3.8-1-4.6A4.5 4.5 0 0 0 8 1.9z" />
            </svg>
          </button>
          <button
            data-df-navigate="profile"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--df-radius-full)",
              background: "var(--df-primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            OS
          </button>
        </div>
      </nav>

      <div style={{ padding: "var(--df-spacing-md)" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--df-spacing-xs)",
            fontSize: 12,
            marginBottom: "var(--df-spacing-sm)",
          }}
        >
          <span style={{ color: "var(--df-text-muted)" }}>octocat</span>
          <span style={{ color: "var(--df-text-muted)" }}>/</span>
          <a
            data-df-navigate="repo"
            style={{ color: "var(--df-primary)", fontWeight: 500, cursor: "pointer" }}
          >
            react-starter
          </a>
        </div>

        {/* PR Title */}
        <h1
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--df-text)",
            lineHeight: 1.3,
            marginTop: 0,
            marginBottom: "var(--df-spacing-xs)",
          }}
        >
          Refactor authentication to use OAuth2 providers
          <span
            style={{
              color: "var(--df-text-muted)",
              fontWeight: 300,
              marginLeft: "var(--df-spacing-xs)",
            }}
          >
            #347
          </span>
        </h1>

        {/* Status + meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--df-spacing-xs)",
            flexWrap: "wrap",
            marginBottom: "var(--df-spacing-md)",
          }}
        >
          <span
            style={{
              background: "var(--df-success)",
              color: "#fff",
              fontSize: 10,
              borderRadius: "var(--df-radius-full)",
              padding: "1px var(--df-spacing-xs)",
              fontWeight: 600,
            }}
          >
            Open
          </span>
          <span style={{ fontSize: 12, color: "var(--df-text-muted)" }}>
            <span style={{ fontWeight: 600, color: "var(--df-text)" }}>octocat</span>
            {" "}→ merge into{" "}
            <code
              style={{
                background: "var(--df-surface-alt)",
                borderRadius: "var(--df-radius-md)",
                padding: "1px var(--df-spacing-xs)",
                fontSize: 10,
                fontFamily: "monospace",
                color: "var(--df-text)",
              }}
            >
              main
            </code>
            {" "}from{" "}
            <code
              style={{
                background: "var(--df-surface-alt)",
                borderRadius: "var(--df-radius-md)",
                padding: "1px var(--df-spacing-xs)",
                fontSize: 10,
                fontFamily: "monospace",
                color: "var(--df-text)",
              }}
            >
              feature/oauth2
            </code>
          </span>
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
          {([
            { id: "conversation" as const, label: "Conversation", count: null },
            { id: "commits" as const, label: "Commits", count: 4 },
            { id: "files" as const, label: "Files", count: 12 },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                paddingBottom: "var(--df-spacing-sm)",
                paddingLeft: "var(--df-spacing-xs)",
                paddingRight: "var(--df-spacing-xs)",
                paddingTop: 0,
                fontSize: 12,
                fontWeight: 500,
                borderBottom: activeTab === tab.id
                  ? "2px solid var(--df-primary)"
                  : "2px solid transparent",
                color: activeTab === tab.id ? "var(--df-text)" : "var(--df-text-muted)",
                background: "transparent",
                border: "none",
                borderBottomStyle: "solid",
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.id ? "var(--df-primary)" : "transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                fontFamily: "var(--df-font-family)",
              }}
            >
              {tab.label}
              {tab.count !== null && (
                <span
                  style={{
                    background: "var(--df-surface-alt)",
                    color: "var(--df-text-muted)",
                    fontSize: 10,
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

        {/* Sidebar info (compact, horizontal on mobile) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--df-spacing-sm)",
            marginBottom: "var(--df-spacing-md)",
          }}
        >
          {/* Labels */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-xs)" }}>
            <span
              style={{
                background: "var(--df-info)",
                color: "#fff",
                fontSize: 10,
                borderRadius: "var(--df-radius-full)",
                padding: "1px var(--df-spacing-xs)",
                fontWeight: 500,
              }}
            >
              enhancement
            </span>
            <span
              style={{
                background: "var(--df-secondary)",
                color: "#fff",
                fontSize: 10,
                borderRadius: "var(--df-radius-full)",
                padding: "1px var(--df-spacing-xs)",
                fontWeight: 500,
              }}
            >
              auth
            </span>
            <span
              style={{
                background: "var(--df-error)",
                color: "#fff",
                fontSize: 10,
                borderRadius: "var(--df-radius-full)",
                padding: "1px var(--df-spacing-xs)",
                fontWeight: 500,
              }}
            >
              priority: high
            </span>
          </div>
        </div>

        {/* Reviewers + milestone compact bar */}
        <div
          style={{
            background: "var(--df-surface)",
            border: "1px solid var(--df-border)",
            borderRadius: "var(--df-radius-lg)",
            padding: "var(--df-spacing-sm)",
            marginBottom: "var(--df-spacing-md)",
          }}
        >
          {/* Reviewers row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              marginBottom: "var(--df-spacing-sm)",
            }}
          >
            <span style={{ color: "var(--df-text-muted)", fontWeight: 500 }}>Reviewers</span>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-sm)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-xs)" }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "var(--df-radius-full)",
                    background: "var(--df-success)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  SC
                </span>
                <span style={{ color: "var(--df-success)", fontSize: 10 }}>✓</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-xs)" }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "var(--df-radius-full)",
                    background: "var(--df-warning)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  MR
                </span>
                <span style={{ color: "var(--df-warning)", fontSize: 10 }}>●</span>
              </span>
            </div>
          </div>

          {/* Milestone row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              marginBottom: "var(--df-spacing-sm)",
            }}
          >
            <span style={{ color: "var(--df-text-muted)", fontWeight: 500 }}>Milestone</span>
            <span style={{ color: "var(--df-text)", fontSize: 12 }}>v2.0 Release</span>
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "100%",
              height: 6,
              background: "var(--df-surface-alt)",
              borderRadius: "var(--df-radius-full)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "65%",
                height: "100%",
                background: "var(--df-success)",
                borderRadius: "var(--df-radius-full)",
              }}
            />
          </div>

          {/* Linked issues row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              marginTop: "var(--df-spacing-sm)",
            }}
          >
            <span style={{ color: "var(--df-text-muted)", fontWeight: 500 }}>Linked</span>
            <span style={{ color: "var(--df-primary)", fontSize: 12 }}>Closes #298, #312</span>
          </div>
        </div>

        {/* Conversation thread */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--df-spacing-md)" }}>
          {/* PR Description */}
          <div
            style={{
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-lg)",
              overflow: "hidden",
            }}
          >
            {/* Comment header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                padding: `var(--df-spacing-xs) var(--df-spacing-sm)`,
                background: "var(--df-surface-alt)",
                borderBottom: "1px solid var(--df-border)",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "var(--df-radius-full)",
                  background: "var(--df-primary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                OS
              </div>
              <span style={{ fontWeight: 600, fontSize: 12, color: "var(--df-text)" }}>
                octocat
              </span>
              <span style={{ fontSize: 10, color: "var(--df-text-muted)" }}>3h ago</span>
              <span
                style={{
                  marginLeft: "auto",
                  background: "var(--df-surface)",
                  border: "1px solid var(--df-border)",
                  color: "var(--df-text-muted)",
                  fontSize: 10,
                  borderRadius: "var(--df-radius-full)",
                  padding: "1px var(--df-spacing-xs)",
                }}
              >
                Author
              </span>
            </div>

            {/* Comment body */}
            <div
              style={{
                padding: "var(--df-spacing-sm)",
                fontSize: 12,
                color: "var(--df-text)",
                lineHeight: 1.6,
              }}
            >
              <p style={{ margin: 0, marginBottom: "var(--df-spacing-sm)" }}>
                This PR migrates our authentication system from custom JWT to industry-standard
                OAuth2 providers for better security and social login support.
              </p>
              <p style={{ fontWeight: 600, marginTop: 0, marginBottom: "var(--df-spacing-xs)", fontSize: 12 }}>
                Changes:
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "var(--df-spacing-md)",
                  fontSize: 12,
                  color: "var(--df-text-muted)",
                  listStyleType: "disc",
                }}
              >
                <li style={{ marginBottom: 2 }}>Added GitHub and Google OAuth2 providers</li>
                <li style={{ marginBottom: 2 }}>Implemented token refresh flow</li>
                <li style={{ marginBottom: 2 }}>Updated session management</li>
                <li style={{ marginBottom: 2 }}>Added callback URL validation</li>
              </ul>
            </div>

            {/* Reactions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                padding: `var(--df-spacing-xs) var(--df-spacing-sm)`,
                borderTop: "1px solid var(--df-border)",
              }}
            >
              {[
                { emoji: "\uD83D\uDC4D", count: 5 },
                { emoji: "❤️", count: 2 },
                { emoji: "\uD83D\uDE80", count: 1 },
              ].map((reaction) => (
                <span
                  key={reaction.emoji}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--df-spacing-xs)",
                    background: "var(--df-surface-alt)",
                    border: "1px solid var(--df-border)",
                    borderRadius: "var(--df-radius-full)",
                    padding: "1px var(--df-spacing-xs)",
                    fontSize: 10,
                    color: "var(--df-text-muted)",
                  }}
                >
                  {reaction.emoji} {reaction.count}
                </span>
              ))}
            </div>
          </div>

          {/* Comment 2 — sarahchen approved */}
          <div
            style={{
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-lg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                padding: `var(--df-spacing-xs) var(--df-spacing-sm)`,
                background: "var(--df-surface-alt)",
                borderBottom: "1px solid var(--df-border)",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "var(--df-radius-full)",
                  background: "var(--df-success)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                SC
              </div>
              <span style={{ fontWeight: 600, fontSize: 12, color: "var(--df-text)" }}>
                sarahchen
              </span>
              <span style={{ fontSize: 10, color: "var(--df-text-muted)" }}>2h ago</span>
              <span
                style={{
                  marginLeft: "auto",
                  background: "var(--df-success)",
                  color: "#fff",
                  fontSize: 10,
                  borderRadius: "var(--df-radius-full)",
                  padding: "1px var(--df-spacing-xs)",
                  fontWeight: 600,
                }}
              >
                Approved
              </span>
            </div>
            <div
              style={{
                padding: "var(--df-spacing-sm)",
                fontSize: 12,
                color: "var(--df-text)",
                lineHeight: 1.6,
              }}
            >
              Looks great overall! The callback URL validation is solid. Left a few comments on the
              token refresh logic.
            </div>
          </div>

          {/* Comment 3 — mikerivera changes requested */}
          <div
            style={{
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-lg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
                padding: `var(--df-spacing-xs) var(--df-spacing-sm)`,
                background: "var(--df-surface-alt)",
                borderBottom: "1px solid var(--df-border)",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "var(--df-radius-full)",
                  background: "var(--df-warning)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                MR
              </div>
              <span style={{ fontWeight: 600, fontSize: 12, color: "var(--df-text)" }}>
                mikerivera
              </span>
              <span style={{ fontSize: 10, color: "var(--df-text-muted)" }}>45m ago</span>
              <span
                style={{
                  marginLeft: "auto",
                  background: "var(--df-warning)",
                  color: "#fff",
                  fontSize: 10,
                  borderRadius: "var(--df-radius-full)",
                  padding: "1px var(--df-spacing-xs)",
                  fontWeight: 600,
                }}
              >
                Changes requested
              </span>
            </div>
            <div
              style={{
                padding: "var(--df-spacing-sm)",
                fontSize: 12,
                color: "var(--df-text)",
                lineHeight: 1.6,
              }}
            >
              Can we add error handling for the case where the provider returns an invalid scope?
              Seen this with enterprise GitHub setups.
            </div>
          </div>

          {/* Review banner */}
          <div
            style={{
              background: "var(--df-surface-alt)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-lg)",
              padding: `var(--df-spacing-xs) var(--df-spacing-sm)`,
              display: "flex",
              alignItems: "center",
              gap: "var(--df-spacing-xs)",
            }}
          >
            <span style={{ color: "var(--df-warning)", fontSize: 12 }}>●</span>
            <span style={{ fontSize: 12, color: "var(--df-text)" }}>
              <span style={{ fontWeight: 600 }}>mikerivera</span> requested changes — 2 comments
            </span>
          </div>

          {/* Comment box */}
          <div
            style={{
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-lg)",
              padding: "var(--df-spacing-sm)",
            }}
          >
            <textarea
              placeholder="Leave a comment..."
              style={{
                width: "100%",
                background: "var(--df-background)",
                border: "1px solid var(--df-border)",
                borderRadius: "var(--df-radius-md)",
                padding: "var(--df-spacing-sm)",
                fontSize: 12,
                color: "var(--df-text)",
                resize: "none",
                minHeight: 60,
                boxSizing: "border-box",
                fontFamily: "var(--df-font-family)",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "var(--df-spacing-xs)",
                marginTop: "var(--df-spacing-xs)",
              }}
            >
              <button
                style={{
                  padding: `var(--df-spacing-xs) var(--df-spacing-sm)`,
                  fontSize: 10,
                  fontWeight: 500,
                  border: "1px solid var(--df-border)",
                  borderRadius: "var(--df-radius-md)",
                  color: "var(--df-text)",
                  background: "var(--df-surface)",
                  cursor: "pointer",
                  fontFamily: "var(--df-font-family)",
                }}
              >
                Comment
              </button>
              <button
                style={{
                  padding: `var(--df-spacing-xs) var(--df-spacing-sm)`,
                  fontSize: 10,
                  fontWeight: 500,
                  borderRadius: "var(--df-radius-md)",
                  background: "var(--df-success)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--df-font-family)",
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
