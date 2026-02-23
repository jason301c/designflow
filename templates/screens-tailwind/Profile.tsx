import { useState } from "react"

const pinnedRepos = [
  { name: "react-starter", desc: "Modern React starter template with TypeScript and Vite", lang: "TypeScript", langColor: "bg-info", stars: "1.2k", forks: 156 },
  { name: "api-toolkit", desc: "REST & GraphQL API utilities for Node.js", lang: "TypeScript", langColor: "bg-info", stars: "847", forks: 92 },
  { name: "dotfiles", desc: "My development environment configs", lang: "Shell", langColor: "bg-success", stars: "234", forks: 45 },
  { name: "design-system", desc: "Component library for modern web apps", lang: "TypeScript", langColor: "bg-info", stars: "567", forks: 78 },
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

const contributionLevelClass = (level: number) => {
  switch (level) {
    case 0: return "bg-surface-alt"
    case 1: return "bg-success opacity-25"
    case 2: return "bg-success opacity-50"
    case 3: return "bg-success opacity-75"
    case 4: return "bg-success opacity-100"
    default: return "bg-surface-alt"
  }
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"overview" | "repos" | "stars">("overview")

  return (
    <div className="bg-background min-h-screen font-sans">
      {/* Nav bar */}
      <nav className="bg-surface border-b border-border p-sm flex items-center justify-between px-md">
        <div className="flex items-center gap-sm">
          <button className="text-text text-sm cursor-pointer bg-transparent border-0">&#9776;</button>
          <span className="text-text font-semibold text-sm">GH</span>
        </div>
        <div className="flex items-center gap-sm">
          <button data-df-navigate="notifications" className="text-text bg-transparent border-0 cursor-pointer text-sm">&#128276;</button>
          <div className="size-7 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-semibold">OS</div>
        </div>
      </nav>

      <div className="p-md">
        {/* Profile header — stacked for mobile */}
        <div className="flex items-start gap-md mb-md">
          <div className="size-16 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <span className="text-white text-xl font-bold">OS</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-text text-base font-bold m-0">The Octocat</h1>
            <p className="text-text-muted text-xs m-0">octocat</p>
            <p className="text-text text-xs mt-xs m-0 leading-relaxed">
              Open source enthusiast. Building tools for developers. Staff Engineer @acme-corp
            </p>
          </div>
        </div>

        {/* Edit profile button */}
        <button className="bg-transparent border border-border rounded-md py-xs text-xs cursor-pointer text-text w-full mb-md">
          Edit profile
        </button>

        {/* Stats row */}
        <p className="text-text-muted text-xs m-0 mb-sm">
          <span className="text-text font-bold">284</span> followers
          {" · "}
          <span className="text-text font-bold">12</span> following
          {" · "}
          <span className="text-text font-bold">47</span> repos
        </p>

        {/* Details */}
        <div className="flex flex-wrap gap-x-md gap-y-xs text-xs text-text-muted mb-md">
          <span>🏢 <span className="text-text">Acme Corp</span></span>
          <span>📍 <span className="text-text">San Francisco, CA</span></span>
          <span>🔗 <span className="text-primary">octocat.dev</span></span>
          <span>📅 <span className="text-text">Joined Jan 2019</span></span>
        </div>

        {/* Tab bar */}
        <div className="flex gap-sm border-b border-border mb-md overflow-x-auto">
          {([
            { key: "overview" as const, label: "Overview", count: null },
            { key: "repos" as const, label: "Repos", count: 47 },
            { key: "stars" as const, label: "Stars", count: 234 },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`bg-transparent border-0 pb-sm pt-xs px-xs cursor-pointer text-xs font-medium whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-text border-b-2 border-b-primary"
                  : "text-text-muted"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-1 bg-surface-alt text-text-muted rounded-full px-xs py-[1px] text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div>
            {/* Pinned Repositories */}
            <h2 className="text-text text-xs font-medium m-0 mb-sm flex items-center gap-xs">
              📌 Pinned
            </h2>
            <div className="flex flex-col gap-sm mb-md">
              {pinnedRepos.map((repo, i) => (
                <div
                  key={repo.name}
                  className="bg-surface border border-border rounded-lg p-sm"
                >
                  <a
                    className="text-primary text-xs font-semibold cursor-pointer"
                    {...(i === 0 ? { "data-df-navigate": "repo" } : {})}
                  >
                    {repo.name}
                  </a>
                  <p className="text-text-muted text-[10px] m-0 mt-xs leading-relaxed">{repo.desc}</p>
                  <div className="flex items-center gap-md mt-xs text-[10px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <span className={`size-2 rounded-full ${repo.langColor} inline-block`} />
                      {repo.lang}
                    </span>
                    <span>★ {repo.stars}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Contribution Graph */}
            <div className="bg-surface border border-border rounded-lg p-sm">
              <h3 className="text-text text-xs font-medium m-0 mb-sm">
                742 contributions in the last year
              </h3>

              {/* Month labels */}
              <div className="flex mb-[2px]">
                {monthLabels.map((month) => (
                  <span key={month} className="text-text-muted text-[7px]" style={{ width: `${100 / 12}%` }}>
                    {month}
                  </span>
                ))}
              </div>

              {/* Grid */}
              <div className="flex gap-[1px] overflow-hidden">
                {contributions.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[1px]">
                    {week.map((level, di) => (
                      <div key={di} className={`size-[5px] rounded-[1px] ${contributionLevelClass(level)}`} />
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-[2px] mt-xs text-[7px] text-text-muted">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div key={level} className={`size-[5px] rounded-[1px] ${contributionLevelClass(level)}`} />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "repos" && (
          <div className="flex flex-col gap-sm">
            {pinnedRepos.map((repo) => (
              <div key={repo.name} className="bg-surface border border-border rounded-lg p-sm">
                <span className="text-primary text-xs font-semibold">{repo.name}</span>
                <p className="text-text-muted text-[10px] m-0 mt-xs">{repo.desc}</p>
                <div className="flex items-center gap-md mt-xs text-[10px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <span className={`size-2 rounded-full ${repo.langColor} inline-block`} />
                    {repo.lang}
                  </span>
                  <span>★ {repo.stars}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "stars" && (
          <div className="flex flex-col gap-sm">
            {[
              { name: "vercel/next.js", desc: "The React Framework", lang: "JavaScript", langColor: "bg-warning", stars: "124k" },
              { name: "tailwindlabs/tailwindcss", desc: "A utility-first CSS framework", lang: "TypeScript", langColor: "bg-info", stars: "82k" },
              { name: "facebook/react", desc: "A JavaScript library for building UIs", lang: "JavaScript", langColor: "bg-warning", stars: "228k" },
            ].map((repo) => (
              <div key={repo.name} className="bg-surface border border-border rounded-lg p-sm">
                <span className="text-primary text-xs font-semibold">{repo.name}</span>
                <p className="text-text-muted text-[10px] m-0 mt-xs">{repo.desc}</p>
                <div className="flex items-center gap-md mt-xs text-[10px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <span className={`size-2 rounded-full ${repo.langColor} inline-block`} />
                    {repo.lang}
                  </span>
                  <span>★ {repo.stars}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
