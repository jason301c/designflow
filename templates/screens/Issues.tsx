import { useState } from "react"

const issues = [
  { number: 347, title: "OAuth2 callback fails on mobile Safari", labels: [{ name: "bug", color: "var(--df-error)" }, { name: "auth", color: "var(--df-secondary)" }], author: "mikerivera", time: "2h ago", comments: 8, assignee: "OS" },
  { number: 345, title: "Add dark mode support to settings panel", labels: [{ name: "enhancement", color: "var(--df-info)" }, { name: "ui", color: "var(--df-warning)" }], author: "sarahchen", time: "5h ago", comments: 3, assignee: "SC" },
  { number: 342, title: "Migrate database to PostgreSQL 16", labels: [{ name: "infra", color: "var(--df-surface-alt)" }], author: "octocat", time: "1d ago", comments: 12, assignee: null },
  { number: 339, title: "Rate limiting returns wrong status code", labels: [{ name: "bug", color: "var(--df-error)" }, { name: "api", color: "var(--df-info)" }], author: "jordanlee", time: "2d ago", comments: 5, assignee: "JL" },
  { number: 335, title: "Add localization for Japanese and Korean", labels: [{ name: "i18n", color: "var(--df-success)" }, { name: "enhancement", color: "var(--df-info)" }], author: "pattaylor", time: "3d ago", comments: 7, assignee: "PT" },
  { number: 331, title: "Upgrade React to v19", labels: [{ name: "deps", color: "var(--df-warning)" }], author: "alexkim", time: "4d ago", comments: 15, assignee: "AK" },
  { number: 328, title: "Performance regression in chart rendering", labels: [{ name: "bug", color: "var(--df-error)" }, { name: "perf", color: "var(--df-secondary)" }], author: "octocat", time: "5d ago", comments: 9, assignee: "OS" },
]

export default function Issues() {
  const [filter, setFilter] = useState<"open" | "closed">("open")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "comments">("newest")

  const sortedIssues = [...issues].sort((a, b) => {
    if (sortBy === "oldest") return a.number - b.number
    if (sortBy === "comments") return b.comments - a.comments
    return b.number - a.number
  })

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
          background: "var(--df-surface)",
          borderBottom: "1px solid var(--df-border)",
          padding: "var(--df-spacing-sm) var(--df-spacing-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-sm)" }}>
          <button
            style={{
              color: "var(--df-text)",
              fontSize: "0.875rem",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              padding: 0,
            }}
          >
            &#9776;
          </button>
          <span style={{ color: "var(--df-text)", fontWeight: 600, fontSize: "0.875rem" }}>GH</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-sm)" }}>
          <button
            data-df-navigate="notifications"
            style={{
              color: "var(--df-text-muted)",
              fontSize: "0.875rem",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              padding: 0,
            }}
          >
            &#128276;
          </button>
          <button
            data-df-navigate="profile"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--df-radius-full)",
              background: "var(--df-secondary)",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            OS
          </button>
        </div>
      </nav>

      <div style={{ padding: "var(--df-spacing-md)" }}>
        {/* Repo breadcrumb */}
        <p
          style={{
            color: "var(--df-text-muted)",
            fontSize: "10px",
            margin: 0,
            marginBottom: "var(--df-spacing-sm)",
          }}
        >
          octocat /{" "}
          <span
            data-df-navigate="repo"
            style={{ color: "var(--df-text)", fontWeight: 600, cursor: "pointer" }}
          >
            react-starter
          </span>
        </p>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--df-spacing-md)",
          }}
        >
          <h1 style={{ color: "var(--df-text)", fontSize: "1.125rem", fontWeight: 600, margin: 0 }}>
            Issues
          </h1>
          <button
            style={{
              background: "var(--df-primary)",
              color: "#fff",
              borderRadius: "var(--df-radius-md)",
              padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
              fontSize: "0.75rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            New issue
          </button>
        </div>

        {/* Filter bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--df-spacing-md)",
            background: "var(--df-surface)",
            border: "1px solid var(--df-border)",
            borderRadius: "var(--df-radius-lg)",
            padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--df-spacing-sm)" }}>
            <button
              onClick={() => setFilter("open")}
              style={{
                fontSize: "0.75rem",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: filter === "open" ? "var(--df-text)" : "var(--df-text-muted)",
                fontWeight: filter === "open" ? 700 : 400,
                padding: 0,
              }}
            >
              ● 42 Open
            </button>
            <button
              onClick={() => setFilter("closed")}
              style={{
                fontSize: "0.75rem",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: filter === "closed" ? "var(--df-text)" : "var(--df-text-muted)",
                fontWeight: filter === "closed" ? 700 : 400,
                padding: 0,
              }}
            >
              ✓ 891 Closed
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "comments")}
            style={{
              background: "var(--df-surface)",
              border: "1px solid var(--df-border)",
              borderRadius: "var(--df-radius-md)",
              padding: "2px var(--df-spacing-xs)",
              fontSize: "10px",
              color: "var(--df-text)",
              cursor: "pointer",
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="comments">Comments</option>
          </select>
        </div>

        {/* Issue list */}
        <div
          style={{
            background: "var(--df-surface)",
            border: "1px solid var(--df-border)",
            borderRadius: "var(--df-radius-lg)",
            overflow: "hidden",
          }}
        >
          {sortedIssues.map((issue, idx) => (
            <div
              key={issue.number}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--df-spacing-xs)",
                padding: "var(--df-spacing-sm)",
                borderBottom:
                  idx < sortedIssues.length - 1 ? "1px solid var(--df-border)" : "none",
              }}
            >
              {/* Status dot */}
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "var(--df-radius-full)",
                  background: "var(--df-success)",
                  marginTop: 3,
                  flexShrink: 0,
                }}
              />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "var(--df-spacing-xs)",
                  }}
                >
                  <span style={{ color: "var(--df-text)", fontSize: "0.75rem", fontWeight: 600 }}>
                    {issue.title}
                  </span>
                  {issue.labels.map((label) => (
                    <span
                      key={label.name}
                      style={{
                        background: label.color,
                        color: label.color === "var(--df-surface-alt)" ? "var(--df-text)" : "#fff",
                        fontSize: "9px",
                        padding: "1px 5px",
                        borderRadius: "var(--df-radius-full)",
                        fontWeight: 500,
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    color: "var(--df-text-muted)",
                    fontSize: "10px",
                    margin: 0,
                    marginTop: 2,
                  }}
                >
                  #{issue.number} · {issue.time} · {issue.author}
                </p>
              </div>

              {/* Right side */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--df-spacing-xs)",
                  flexShrink: 0,
                }}
              >
                {issue.comments > 0 && (
                  <span style={{ color: "var(--df-text-muted)", fontSize: "10px" }}>
                    💬 {issue.comments}
                  </span>
                )}
                {issue.assignee && (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "var(--df-radius-full)",
                      background: "var(--df-surface-alt)",
                      color: "var(--df-text-muted)",
                      fontSize: "8px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {issue.assignee}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--df-spacing-sm)",
            marginTop: "var(--df-spacing-md)",
          }}
        >
          <button
            style={{
              border: "1px solid var(--df-border)",
              background: "var(--df-surface)",
              color: "var(--df-text-muted)",
              borderRadius: "var(--df-radius-md)",
              padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            Previous
          </button>
          <span style={{ color: "var(--df-text-muted)", fontSize: "10px" }}>1 of 6</span>
          <button
            style={{
              border: "1px solid var(--df-border)",
              background: "var(--df-surface)",
              color: "var(--df-text)",
              borderRadius: "var(--df-radius-md)",
              padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
