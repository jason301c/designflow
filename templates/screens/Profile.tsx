import { useState } from "react"

const pinnedRepos = [
  { name: "react-starter", desc: "Modern React starter template with TypeScript and Vite", lang: "TypeScript", langColor: "var(--df-info)", stars: "1.2k", forks: 156 },
  { name: "api-toolkit", desc: "REST & GraphQL API utilities for Node.js", lang: "TypeScript", langColor: "var(--df-info)", stars: "847", forks: 92 },
  { name: "dotfiles", desc: "My development environment configs", lang: "Shell", langColor: "var(--df-success)", stars: "234", forks: 45 },
  { name: "design-system", desc: "Component library for modern web apps", lang: "TypeScript", langColor: "var(--df-info)", stars: "567", forks: 78 },
]

const starredRepos = [
  { name: "vercel/next.js", desc: "The React Framework", lang: "JavaScript", langColor: "var(--df-warning)", stars: "124k" },
  { name: "tailwindlabs/tailwindcss", desc: "A utility-first CSS framework", lang: "TypeScript", langColor: "var(--df-info)", stars: "82k" },
  { name: "facebook/react", desc: "A JavaScript library for building UIs", lang: "JavaScript", langColor: "var(--df-warning)", stars: "228k" },
]

// Generate a fixed contribution grid
const contributions: number[][] = []
for (let week = 0; week < 52; week++) {
  const days: number[] = []
  for (let day = 0; day < 7; day++) {
    const v = (week * 7 + day * 13 + 7) % 10
    days.push(v < 3 ? 0 : v < 5 ? 1 : v < 7 ? 2 : v < 9 ? 3 : 4)
  }
  contributions.push(days)
}

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function contributionColor(level: number): string {
  switch (level) {
    case 0: return "var(--df-surface-alt)"
    case 1: return "color-mix(in srgb, var(--df-success) 25%, transparent)"
    case 2: return "color-mix(in srgb, var(--df-success) 50%, transparent)"
    case 3: return "color-mix(in srgb, var(--df-success) 75%, transparent)"
    case 4: return "var(--df-success)"
    default: return "var(--df-surface-alt)"
  }
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"overview" | "repos" | "stars">("overview")

  const tabs: { key: "overview" | "repos" | "stars"; label: string; count: number | null }[] = [
    { key: "overview", label: "Overview", count: null },
    { key: "repos", label: "Repos", count: 47 },
    { key: "stars", label: "Stars", count: 234 },
  ]

  return (
    <div
      style={{
        background: "var(--df-background)",
        minHeight: "100vh",
        fontFamily: "var(--df-font-family)",
        color: "var(--df-text)",
      }}
    >
      {/* Nav bar */}
      <nav
        style={{
          background: "var(--df-surface)",
          borderBottom: "1px solid var(--df-border)",
          padding: `var(--df-spacing-sm) var(--df-spacing-md)`,
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
              color: "var(--df-text)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              padding: 0,
            }}
          >
            &#128276;
          </button>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--df-radius-full)",
              background: "var(--df-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            OS
          </div>
        </div>
      </nav>

      <div style={{ padding: "var(--df-spacing-md)" }}>
        {/* Profile header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--df-spacing-md)",
            marginBottom: "var(--df-spacing-md)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--df-radius-full)",
              background: "var(--df-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700 }}>OS</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ color: "var(--df-text)", fontSize: "1rem", fontWeight: 700, margin: 0 }}>
              The Octocat
            </h1>
            <p style={{ color: "var(--df-text-muted)", fontSize: "0.75rem", margin: 0 }}>
              octocat
            </p>
            <p
              style={{
                color: "var(--df-text)",
                fontSize: "0.75rem",
                marginTop: "var(--df-spacing-xs)",
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                lineHeight: 1.6,
              }}
            >
              Open source enthusiast. Building tools for developers. Staff Engineer @acme-corp
            </p>
          </div>
        </div>

        {/* Edit profile button */}
        <button
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid var(--df-border)",
            borderRadius: "var(--df-radius-md)",
            padding: `var(--df-spacing-xs) 0`,
            fontSize: "0.75rem",
            cursor: "pointer",
            color: "var(--df-text)",
            marginBottom: "var(--df-spacing-md)",
            fontFamily: "var(--df-font-family)",
          }}
        >
          Edit profile
        </button>

        {/* Stats row */}
        <p
          style={{
            color: "var(--df-text-muted)",
            fontSize: "0.75rem",
            margin: 0,
            marginBottom: "var(--df-spacing-sm)",
          }}
        >
          <span style={{ color: "var(--df-text)", fontWeight: 700 }}>284</span> followers
          {" \u00B7 "}
          <span style={{ color: "var(--df-text)", fontWeight: 700 }}>12</span> following
          {" \u00B7 "}
          <span style={{ color: "var(--df-text)", fontWeight: 700 }}>47</span> repos
        </p>

        {/* Details */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: "var(--df-spacing-md)",
            rowGap: "var(--df-spacing-xs)",
            fontSize: "0.75rem",
            color: "var(--df-text-muted)",
            marginBottom: "var(--df-spacing-md)",
          }}
        >
          <span>
            \uD83C\uDFE2 <span style={{ color: "var(--df-text)" }}>Acme Corp</span>
          </span>
          <span>
            \uD83D\uDCCD <span style={{ color: "var(--df-text)" }}>San Francisco, CA</span>
          </span>
          <span>
            \uD83D\uDD17 <span style={{ color: "var(--df-primary)" }}>octocat.dev</span>
          </span>
          <span>
            \uD83D\uDCC5 <span style={{ color: "var(--df-text)" }}>Joined Jan 2019</span>
          </span>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            gap: "var(--df-spacing-sm)",
            borderBottom: "1px solid var(--df-border)",
            marginBottom: "var(--df-spacing-md)",
            overflowX: "auto",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab.key ? "2px solid var(--df-primary)" : "2px solid transparent",
                paddingBottom: "var(--df-spacing-sm)",
                paddingTop: "var(--df-spacing-xs)",
                paddingLeft: "var(--df-spacing-xs)",
                paddingRight: "var(--df-spacing-xs)",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                color: activeTab === tab.key ? "var(--df-text)" : "var(--df-text-muted)",
                fontFamily: "var(--df-font-family)",
              }}
            >
              {tab.label}
              {tab.count !== null && (
                <span
                  style={{
                    marginLeft: 4,
                    background: "var(--df-surface-alt)",
                    color: "var(--df-text-muted)",
                    borderRadius: "var(--df-radius-full)",
                    padding: "1px var(--df-spacing-xs)",
                    fontSize: "10px",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div>
            {/* Pinned Repositories */}
            <h2
              style={{
                color: "var(--df-text)",
                fontSize: "0.75rem",
                fontWeight: 500,
                margin: 0,
                marginBottom: "var(--df-spacing-sm)",
                display: "flex",
                alignItems: "center",
                gap: "var(--df-spacing-xs)",
              }}
            >
              \uD83D\uDCCC Pinned
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--df-spacing-sm)",
                marginBottom: "var(--df-spacing-md)",
              }}
            >
              {pinnedRepos.map((repo, i) => (
                <div
                  key={repo.name}
                  style={{
                    background: "var(--df-surface)",
                    border: "1px solid var(--df-border)",
                    borderRadius: "var(--df-radius-lg)",
                    padding: "var(--df-spacing-sm)",
                  }}
                >
                  <a
                    style={{
                      color: "var(--df-primary)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                    {...(i === 0 ? { "data-df-navigate": "repo" } : {})}
                  >
                    {repo.name}
                  </a>
                  <p
                    style={{
                      color: "var(--df-text-muted)",
                      fontSize: "10px",
                      margin: 0,
                      marginTop: "var(--df-spacing-xs)",
                      lineHeight: 1.6,
                    }}
                  >
                    {repo.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--df-spacing-md)",
                      marginTop: "var(--df-spacing-xs)",
                      fontSize: "10px",
                      color: "var(--df-text-muted)",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "var(--df-radius-full)",
                          background: repo.langColor,
                          display: "inline-block",
                        }}
                      />
                      {repo.lang}
                    </span>
                    <span>{"\u2605"} {repo.stars}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Contribution Graph */}
            <div
              style={{
                background: "var(--df-surface)",
                border: "1px solid var(--df-border)",
                borderRadius: "var(--df-radius-lg)",
                padding: "var(--df-spacing-sm)",
              }}
            >
              <h3
                style={{
                  color: "var(--df-text)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  margin: 0,
                  marginBottom: "var(--df-spacing-sm)",
                }}
              >
                742 contributions in the last year
              </h3>

              {/* Month labels */}
              <div style={{ display: "flex", marginBottom: 2 }}>
                {monthLabels.map((month) => (
                  <span
                    key={month}
                    style={{
                      color: "var(--df-text-muted)",
                      fontSize: "7px",
                      width: `${100 / 12}%`,
                    }}
                  >
                    {month}
                  </span>
                ))}
              </div>

              {/* Grid */}
              <div style={{ display: "flex", gap: 1, overflow: "hidden" }}>
                {contributions.map((week, wi) => (
                  <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {week.map((level, di) => (
                      <div
                        key={di}
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 1,
                          background: contributionColor(level),
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 2,
                  marginTop: "var(--df-spacing-xs)",
                  fontSize: "7px",
                  color: "var(--df-text-muted)",
                }}
              >
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 1,
                      background: contributionColor(level),
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "repos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--df-spacing-sm)" }}>
            {pinnedRepos.map((repo) => (
              <div
                key={repo.name}
                style={{
                  background: "var(--df-surface)",
                  border: "1px solid var(--df-border)",
                  borderRadius: "var(--df-radius-lg)",
                  padding: "var(--df-spacing-sm)",
                }}
              >
                <span
                  style={{
                    color: "var(--df-primary)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {repo.name}
                </span>
                <p
                  style={{
                    color: "var(--df-text-muted)",
                    fontSize: "10px",
                    margin: 0,
                    marginTop: "var(--df-spacing-xs)",
                  }}
                >
                  {repo.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--df-spacing-md)",
                    marginTop: "var(--df-spacing-xs)",
                    fontSize: "10px",
                    color: "var(--df-text-muted)",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "var(--df-radius-full)",
                        background: repo.langColor,
                        display: "inline-block",
                      }}
                    />
                    {repo.lang}
                  </span>
                  <span>{"\u2605"} {repo.stars}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "stars" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--df-spacing-sm)" }}>
            {starredRepos.map((repo) => (
              <div
                key={repo.name}
                style={{
                  background: "var(--df-surface)",
                  border: "1px solid var(--df-border)",
                  borderRadius: "var(--df-radius-lg)",
                  padding: "var(--df-spacing-sm)",
                }}
              >
                <span
                  style={{
                    color: "var(--df-primary)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {repo.name}
                </span>
                <p
                  style={{
                    color: "var(--df-text-muted)",
                    fontSize: "10px",
                    margin: 0,
                    marginTop: "var(--df-spacing-xs)",
                  }}
                >
                  {repo.desc}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--df-spacing-md)",
                    marginTop: "var(--df-spacing-xs)",
                    fontSize: "10px",
                    color: "var(--df-text-muted)",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "var(--df-radius-full)",
                        background: repo.langColor,
                        display: "inline-block",
                      }}
                    />
                    {repo.lang}
                  </span>
                  <span>{"\u2605"} {repo.stars}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
