import { useState } from "react"

const trendingRepos = [
  {
    rank: 1,
    owner: "vercel",
    name: "next.js",
    desc: "The React Framework for the Web",
    lang: "TypeScript",
    langColor: "bg-info",
    stars: "128k",
    todayStars: 342,
    forks: "26.1k",
  },
  {
    rank: 2,
    owner: "denoland",
    name: "deno",
    desc: "A modern runtime for JavaScript and TypeScript",
    lang: "Rust",
    langColor: "bg-error",
    stars: "97.8k",
    todayStars: 287,
    forks: "5.4k",
  },
  {
    rank: 3,
    owner: "anthropics",
    name: "claude-sdk",
    desc: "Official SDK for the Claude API",
    lang: "TypeScript",
    langColor: "bg-info",
    stars: "12.4k",
    todayStars: 256,
    forks: "1.8k",
  },
  {
    rank: 4,
    owner: "tailwindlabs",
    name: "tailwindcss",
    desc: "A utility-first CSS framework",
    lang: "TypeScript",
    langColor: "bg-info",
    stars: "85.2k",
    todayStars: 198,
    forks: "4.3k",
  },
  {
    rank: 5,
    owner: "rustlang",
    name: "rust",
    desc: "Empowering everyone to build reliable software",
    lang: "Rust",
    langColor: "bg-error",
    stars: "99.1k",
    todayStars: 175,
    forks: "12.7k",
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
  const [language, setLanguage] = useState<"all" | "typescript" | "python" | "rust">("all")

  return (
    <div className="p-md bg-background min-h-screen font-sans">
      {/* A. Search Bar */}
      <input
        type="text"
        placeholder="Search repositories, users..."
        className="w-full bg-surface border border-border rounded-full py-sm px-md text-sm text-text mb-md focus:outline-none focus:border-primary transition-colors"
      />

      {/* B. Explore Header */}
      <h1 className="text-xl font-semibold text-text mb-md">Explore</h1>

      {/* C. Topic Tags */}
      <div className="overflow-x-auto flex gap-xs pb-sm mb-md">
        {topics.map((topic) => (
          <span
            key={topic}
            className="bg-surface-alt text-primary text-xs rounded-full py-xs px-sm whitespace-nowrap cursor-pointer"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* D. Trending Repositories Section */}
      <div className="mb-lg">
        <h2 className="text-lg font-semibold text-text mb-sm">Trending</h2>

        {/* Time range pills */}
        <div className="flex gap-xs mb-sm">
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
              className={`rounded-full py-xs px-md text-xs cursor-pointer border-none ${
                timeRange === key
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Language filter */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as typeof language)}
          className="bg-surface border border-border rounded-md py-xs px-sm text-xs text-text-muted mb-md cursor-pointer appearance-none pr-6"
        >
          <option value="all">All languages &#9662;</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="rust">Rust</option>
        </select>

        {/* Trending repo cards */}
        <div>
          {trendingRepos.map((repo) => (
            <div key={repo.rank} className="border-b border-border py-md">
              {/* Row 1: Rank, owner/name, star button */}
              <div className="flex items-center">
                <span className="text-text-muted text-lg font-bold mr-md w-6 shrink-0">
                  {repo.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-text-muted text-sm">{repo.owner}</span>
                  <span className="text-text-muted text-sm"> / </span>
                  {repo.rank === 1 ? (
                    <span
                      data-df-navigate="repo"
                      className="text-primary text-sm font-bold cursor-pointer hover:underline"
                    >
                      {repo.name}
                    </span>
                  ) : (
                    <span className="text-primary text-sm font-bold">{repo.name}</span>
                  )}
                </div>
                <button className="bg-surface border border-border rounded-md py-[2px] px-sm text-xs cursor-pointer text-text shrink-0">
                  Star
                </button>
              </div>

              {/* Row 2: Description (indented past rank) */}
              <div className="ml-[calc(1.5rem+var(--df-spacing-md))]">
                <p className="text-text-muted text-xs truncate m-0 mt-1">{repo.desc}</p>
              </div>

              {/* Row 3: Language, stars, today stars */}
              <div className="ml-[calc(1.5rem+var(--df-spacing-md))] flex items-center gap-sm mt-1">
                <span className="flex items-center gap-xs text-xs text-text-muted">
                  <span className={`size-2 rounded-full inline-block ${repo.langColor}`} />
                  {repo.lang}
                </span>
                <span className="text-xs text-text-muted">&#9733; {repo.stars}</span>
                <span className="text-xs text-text-muted">
                  &#9733; {repo.todayStars} today
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E. Trending Developers Section */}
      <div className="mt-lg mb-md">
        <h2 className="text-base font-semibold text-text mb-md">Trending developers</h2>

        {trendingDevs.map((dev) => (
          <div key={dev.rank} className="py-sm border-b border-border flex items-center gap-sm">
            {/* Rank */}
            <span className="text-text-muted text-sm font-bold w-5 shrink-0">{dev.rank}</span>

            {/* Avatar */}
            <div className="size-8 rounded-full bg-surface-alt flex items-center justify-center text-text-muted text-xs font-semibold shrink-0">
              {dev.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-text text-sm font-bold m-0">{dev.username}</p>
              <p className="text-text-muted text-xs m-0">{dev.name}</p>
              <p className="text-primary text-xs m-0 truncate">{dev.repo}</p>
            </div>

            {/* Follow button */}
            <button className="bg-surface border border-border rounded-md py-[2px] px-sm text-xs cursor-pointer text-text shrink-0">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
