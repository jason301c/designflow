import { useState } from "react"

const issues = [
  { number: 347, title: "OAuth2 callback fails on mobile Safari", labels: [{ name: "bug", color: "bg-error" }, { name: "auth", color: "bg-secondary" }], author: "mikerivera", time: "2h ago", comments: 8, assignee: "OS" },
  { number: 345, title: "Add dark mode support to settings panel", labels: [{ name: "enhancement", color: "bg-info" }, { name: "ui", color: "bg-warning" }], author: "sarahchen", time: "5h ago", comments: 3, assignee: "SC" },
  { number: 342, title: "Migrate database to PostgreSQL 16", labels: [{ name: "infra", color: "bg-surface-alt text-text" }], author: "octocat", time: "1d ago", comments: 12, assignee: null },
  { number: 339, title: "Rate limiting returns wrong status code", labels: [{ name: "bug", color: "bg-error" }, { name: "api", color: "bg-info" }], author: "jordanlee", time: "2d ago", comments: 5, assignee: "JL" },
  { number: 335, title: "Add localization for Japanese and Korean", labels: [{ name: "i18n", color: "bg-success" }, { name: "enhancement", color: "bg-info" }], author: "pattaylor", time: "3d ago", comments: 7, assignee: "PT" },
  { number: 331, title: "Upgrade React to v19", labels: [{ name: "deps", color: "bg-warning" }], author: "alexkim", time: "4d ago", comments: 15, assignee: "AK" },
  { number: 328, title: "Performance regression in chart rendering", labels: [{ name: "bug", color: "bg-error" }, { name: "perf", color: "bg-secondary" }], author: "octocat", time: "5d ago", comments: 9, assignee: "OS" },
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
    <div className="bg-background min-h-screen font-sans">
      {/* Nav bar */}
      <nav className="bg-surface border-b border-border p-sm flex items-center justify-between px-md">
        <div className="flex items-center gap-sm">
          <button className="text-text text-sm cursor-pointer bg-transparent border-none">&#9776;</button>
          <span className="text-text font-semibold text-sm">GH</span>
        </div>
        <div className="flex items-center gap-sm">
          <button data-df-navigate="notifications" className="text-text-muted text-sm cursor-pointer bg-transparent border-none">&#128276;</button>
          <button data-df-navigate="profile" className="size-7 rounded-full bg-secondary text-white text-xs font-semibold border-none cursor-pointer flex items-center justify-center">OS</button>
        </div>
      </nav>

      <div className="p-md">
        {/* Repo context */}
        <p className="text-text-muted text-[10px] m-0 mb-sm">
          octocat / <span data-df-navigate="repo" className="text-text font-semibold cursor-pointer">react-starter</span>
        </p>

        {/* Header */}
        <div className="flex items-center justify-between mb-md">
          <h1 className="text-text text-lg font-semibold m-0">Issues</h1>
          <button className="bg-primary text-white rounded-md py-xs px-sm text-xs font-medium border-none cursor-pointer">New issue</button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-md bg-surface border border-border rounded-lg p-xs px-sm">
          <div className="flex items-center gap-sm">
            <button
              onClick={() => setFilter("open")}
              className={`text-xs border-none bg-transparent cursor-pointer ${filter === "open" ? "text-text font-bold" : "text-text-muted"}`}
            >
              ● 42 Open
            </button>
            <button
              onClick={() => setFilter("closed")}
              className={`text-xs border-none bg-transparent cursor-pointer ${filter === "closed" ? "text-text font-bold" : "text-text-muted"}`}
            >
              ✓ 891 Closed
            </button>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "comments")}
            className="bg-surface border border-border rounded-md py-[2px] px-xs text-[10px] text-text cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="comments">Comments</option>
          </select>
        </div>

        {/* Issue list */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          {sortedIssues.map((issue, idx) => (
            <div
              key={issue.number}
              className={`flex items-start gap-xs py-sm px-sm ${
                idx < sortedIssues.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* Status dot */}
              <div className="size-3 rounded-full bg-success mt-[3px] shrink-0" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-xs">
                  <span className="text-text text-xs font-semibold">{issue.title}</span>
                  {issue.labels.map((label) => (
                    <span key={label.name} className={`${label.color} text-white text-[9px] px-[5px] py-[1px] rounded-full font-medium`}>
                      {label.name}
                    </span>
                  ))}
                </div>
                <p className="text-text-muted text-[10px] m-0 mt-[2px]">
                  #{issue.number} · {issue.time} · {issue.author}
                </p>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-xs shrink-0">
                {issue.comments > 0 && (
                  <span className="text-text-muted text-[10px]">💬 {issue.comments}</span>
                )}
                {issue.assignee && (
                  <div className="size-5 rounded-full bg-surface-alt text-text-muted text-[8px] font-semibold flex items-center justify-center">
                    {issue.assignee}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-sm mt-md">
          <button className="border border-border bg-surface text-text-muted rounded-md py-xs px-sm text-xs cursor-pointer">Previous</button>
          <span className="text-text-muted text-[10px]">1 of 6</span>
          <button className="border border-border bg-surface text-text rounded-md py-xs px-sm text-xs cursor-pointer">Next</button>
        </div>
      </div>
    </div>
  )
}
