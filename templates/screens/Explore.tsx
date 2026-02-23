import { useState } from "react"

const trendingRepos = [
  {
    rank: 1,
    owner: "vercel",
    name: "next.js",
    desc: "The React Framework for the Web",
    lang: "TypeScript",
    langColor: "var(--df-info)",
    stars: "128k",
    todayStars: 342,
  },
  {
    rank: 2,
    owner: "denoland",
    name: "deno",
    desc: "A modern runtime for JS and TS",
    lang: "Rust",
    langColor: "var(--df-error)",
    stars: "97.8k",
    todayStars: 287,
  },
  {
    rank: 3,
    owner: "anthropics",
    name: "claude-sdk",
    desc: "Official SDK for the Claude API",
    lang: "TypeScript",
    langColor: "var(--df-info)",
    stars: "12.4k",
    todayStars: 256,
  },
  {
    rank: 4,
    owner: "tailwindlabs",
    name: "tailwindcss",
    desc: "A utility-first CSS framework",
    lang: "TypeScript",
    langColor: "var(--df-info)",
    stars: "85.2k",
    todayStars: 198,
  },
  {
    rank: 5,
    owner: "rustlang",
    name: "rust",
    desc: "Empowering everyone to build reliable software",
    lang: "Rust",
    langColor: "var(--df-error)",
    stars: "99.1k",
    todayStars: 175,
  },
]

const trendingDevs = [
  { rank: 1, avatar: "OS", username: "octocat", name: "The Octocat", repo: "react-starter" },
  { rank: 2, avatar: "SC", username: "sarahchen", name: "Sarah Chen", repo: "go-microservice" },
  { rank: 3, avatar: "MR", username: "mikerivera", name: "Mike Rivera", repo: "ml-pipeline" },
]

const topics = ["react", "machine-learning", "devtools", "web3", "rust", "ai", "typescript", "cloud"]

export default function Explore() {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today")

  return (
    <div
      style={{
        padding: "var(--df-spacing-md)",
        background: "var(--df-background)",
        minHeight: "100vh",
        fontFamily: "var(--df-font-family)",
        boxSizing: "border-box",
      }}
    >
      {/* A. Search Bar */}
      <input
        type="text"
        placeholder="Search repositories, users..."
        style={{
          width: "100%",
          background: "var(--df-surface)",
          border: "1px solid var(--df-border)",
          borderRadius: "var(--df-radius-full)",
          padding: "var(--df-spacing-sm) var(--df-spacing-md)",
          fontSize: "0.875rem",
          color: "var(--df-text)",
          marginBottom: "var(--df-spacing-md)",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      {/* B. Explore Heading */}
      <h1
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "var(--df-text)",
          margin: "0 0 var(--df-spacing-md) 0",
        }}
      >
        Explore
      </h1>

      {/* C. Topic Tags */}
      <div
        style={{
          overflowX: "auto",
          display: "flex",
          gap: "var(--df-spacing-xs)",
          paddingBottom: "var(--df-spacing-sm)",
          marginBottom: "var(--df-spacing-md)",
        }}
      >
        {topics.map((topic) => (
          <span
            key={topic}
            style={{
              background: "var(--df-surface-alt)",
              color: "var(--df-primary)",
              fontSize: "0.75rem",
              borderRadius: "var(--df-radius-full)",
              padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {topic}
          </span>
        ))}
      </div>

      {/* D. Trending Repositories Section */}
      <div style={{ marginBottom: "var(--df-spacing-lg)" }}>
        <h2
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--df-text)",
            margin: "0 0 var(--df-spacing-sm) 0",
          }}
        >
          Trending
        </h2>

        {/* Time range pills */}
        <div
          style={{
            display: "flex",
            gap: "var(--df-spacing-xs)",
            marginBottom: "var(--df-spacing-sm)",
          }}
        >
          {(
            [
              { key: "today", label: "Today" },
              { key: "week", label: "This week" },
              { key: "month", label: "This month" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              style={{
                borderRadius: "var(--df-radius-full)",
                padding: "var(--df-spacing-xs) var(--df-spacing-md)",
                fontSize: "0.75rem",
                cursor: "pointer",
                border: timeRange === key ? "none" : "1px solid var(--df-border)",
                background: timeRange === key ? "var(--df-primary)" : "var(--df-surface)",
                color: timeRange === key ? "#fff" : "var(--df-text)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Language filter button */}
        <button
          style={{
            background: "var(--df-surface)",
            border: "1px solid var(--df-border)",
            borderRadius: "var(--df-radius-md)",
            padding: "var(--df-spacing-xs) var(--df-spacing-sm)",
            fontSize: "0.75rem",
            color: "var(--df-text-muted)",
            marginBottom: "var(--df-spacing-md)",
            cursor: "pointer",
          }}
        >
          All languages &#9662;
        </button>

        {/* Trending repo cards */}
        <div>
          {trendingRepos.map((repo) => (
            <div
              key={repo.rank}
              style={{
                borderBottom: "1px solid var(--df-border)",
                padding: "var(--df-spacing-md) 0",
              }}
            >
              {/* Row 1: Rank, owner/name, star button */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    color: "var(--df-text-muted)",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    marginRight: "var(--df-spacing-md)",
                    width: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  {repo.rank}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ color: "var(--df-text-muted)", fontSize: "0.875rem" }}>
                    {repo.owner}
                  </span>
                  <span style={{ color: "var(--df-text-muted)", fontSize: "0.875rem" }}>
                    {" / "}
                  </span>
                  {repo.rank === 1 ? (
                    <span
                      data-df-navigate="repo"
                      style={{
                        color: "var(--df-primary)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {repo.name}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "var(--df-primary)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                      }}
                    >
                      {repo.name}
                    </span>
                  )}
                </div>
                <button
                  style={{
                    background: "var(--df-surface)",
                    border: "1px solid var(--df-border)",
                    borderRadius: "var(--df-radius-md)",
                    padding: "2px var(--df-spacing-sm)",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    color: "var(--df-text)",
                    flexShrink: 0,
                  }}
                >
                  Star
                </button>
              </div>

              {/* Row 2: Description */}
              <div style={{ marginLeft: "calc(1.5rem + var(--df-spacing-md))" }}>
                <p
                  style={{
                    color: "var(--df-text-muted)",
                    fontSize: "0.75rem",
                    margin: "4px 0 0 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {repo.desc}
                </p>
              </div>

              {/* Row 3: Language, stars, today stars */}
              <div
                style={{
                  marginLeft: "calc(1.5rem + var(--df-spacing-md))",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--df-spacing-sm)",
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--df-spacing-xs)",
                    fontSize: "0.75rem",
                    color: "var(--df-text-muted)",
                  }}
                >
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
                <span style={{ fontSize: "0.75rem", color: "var(--df-text-muted)" }}>
                  &#9733; {repo.stars}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--df-text-muted)" }}>
                  &#9733; {repo.todayStars} today
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E. Trending Developers Section */}
      <div style={{ marginTop: "var(--df-spacing-lg)", marginBottom: "var(--df-spacing-md)" }}>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--df-text)",
            margin: "0 0 var(--df-spacing-md) 0",
          }}
        >
          Trending developers
        </h2>

        {trendingDevs.map((dev) => (
          <div
            key={dev.rank}
            style={{
              padding: "var(--df-spacing-sm) 0",
              borderBottom: "1px solid var(--df-border)",
              display: "flex",
              alignItems: "center",
              gap: "var(--df-spacing-sm)",
            }}
          >
            {/* Rank */}
            <span
              style={{
                color: "var(--df-text-muted)",
                fontSize: "0.875rem",
                fontWeight: 700,
                width: "1.25rem",
                flexShrink: 0,
              }}
            >
              {dev.rank}
            </span>

            {/* Avatar circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--df-radius-full)",
                background: "var(--df-surface-alt)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--df-text-muted)",
                fontSize: "0.75rem",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {dev.avatar}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "var(--df-text)", fontSize: "0.875rem", fontWeight: 700, margin: 0 }}>
                {dev.username}
              </p>
              <p style={{ color: "var(--df-text-muted)", fontSize: "0.75rem", margin: 0 }}>
                {dev.name}
              </p>
              <p
                style={{
                  color: "var(--df-primary)",
                  fontSize: "0.75rem",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {dev.repo}
              </p>
            </div>

            {/* Follow button */}
            <button
              style={{
                background: "var(--df-surface)",
                border: "1px solid var(--df-border)",
                borderRadius: "var(--df-radius-md)",
                padding: "2px var(--df-spacing-sm)",
                fontSize: "0.75rem",
                cursor: "pointer",
                color: "var(--df-text)",
                flexShrink: 0,
              }}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
