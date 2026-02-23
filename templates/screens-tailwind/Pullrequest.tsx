import { useState } from "react"

export default function PullRequest() {
  const [activeTab, setActiveTab] = useState<"conversation" | "commits" | "files">("conversation")

  return (
    <div className="bg-background min-h-screen font-sans">
      {/* Nav bar */}
      <nav className="flex items-center justify-between bg-surface border-b border-border px-md py-sm">
        <div className="flex items-center gap-sm">
          <div className="w-7 h-7 bg-primary text-white rounded-md flex items-center justify-center font-bold text-xs">
            GH
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <button
            data-df-navigate="notifications"
            className="w-7 h-7 rounded-md bg-surface-alt flex items-center justify-center text-text-muted text-xs border border-border cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.9A4.5 4.5 0 0 0 3.5 6.4c0 .8-.2 3.1-1 4.6h11c-.8-1.5-1-3.8-1-4.6A4.5 4.5 0 0 0 8 1.9z" />
            </svg>
          </button>
          <button
            data-df-navigate="profile"
            className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold border-0 cursor-pointer"
          >
            OS
          </button>
        </div>
      </nav>

      <div className="p-md">
        {/* Breadcrumb */}
        <div className="flex items-center gap-xs text-xs mb-sm">
          <span className="text-text-muted">octocat</span>
          <span className="text-text-muted">/</span>
          <a data-df-navigate="repo" className="text-primary font-medium cursor-pointer">react-starter</a>
        </div>

        {/* PR Title */}
        <h1 className="text-sm font-semibold text-text leading-tight mb-xs">
          Refactor authentication to use OAuth2 providers
          <span className="text-text-muted font-light ml-xs">#347</span>
        </h1>

        {/* Status + meta */}
        <div className="flex items-center gap-xs flex-wrap mb-md">
          <span className="bg-success text-white text-[10px] rounded-full py-[1px] px-xs font-semibold">
            Open
          </span>
          <span className="text-xs text-text-muted">
            <span className="font-semibold text-text">octocat</span> → merge into{" "}
            <code className="bg-surface-alt rounded px-xs py-[1px] text-[10px] font-mono text-text">main</code>
            {" "}from{" "}
            <code className="bg-surface-alt rounded px-xs py-[1px] text-[10px] font-mono text-text">feature/oauth2</code>
          </span>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-sm border-b border-border mb-md overflow-x-auto">
          {([
            { id: "conversation" as const, label: "Conversation", count: null },
            { id: "commits" as const, label: "Commits", count: 4 },
            { id: "files" as const, label: "Files", count: 12 },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-sm px-xs text-xs font-medium border-b-2 bg-transparent cursor-pointer whitespace-nowrap flex items-center gap-xs ${
                activeTab === tab.id
                  ? "border-primary text-text"
                  : "border-transparent text-text-muted"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="bg-surface-alt text-text-muted text-[10px] rounded-full px-xs py-[1px]">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Sidebar info (compact, horizontal on mobile) */}
        <div className="flex flex-wrap gap-sm mb-md">
          {/* Labels */}
          <div className="flex items-center gap-xs">
            <span className="bg-info text-white text-[10px] rounded-full px-xs py-[1px] font-medium">enhancement</span>
            <span className="bg-secondary text-white text-[10px] rounded-full px-xs py-[1px] font-medium">auth</span>
            <span className="bg-error text-white text-[10px] rounded-full px-xs py-[1px] font-medium">priority: high</span>
          </div>
        </div>

        {/* Reviewers + milestone compact bar */}
        <div className="bg-surface border border-border rounded-lg p-sm mb-md">
          <div className="flex items-center justify-between text-xs mb-sm">
            <span className="text-text-muted font-medium">Reviewers</span>
            <div className="flex items-center gap-sm">
              <span className="flex items-center gap-xs">
                <span className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[9px] font-bold">SC</span>
                <span className="text-success text-[10px]">✓</span>
              </span>
              <span className="flex items-center gap-xs">
                <span className="w-5 h-5 rounded-full bg-warning text-white flex items-center justify-center text-[9px] font-bold">MR</span>
                <span className="text-warning text-[10px]">●</span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mb-sm">
            <span className="text-text-muted font-medium">Milestone</span>
            <span className="text-text text-xs">v2.0 Release</span>
          </div>
          <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: "65%" }} />
          </div>
          <div className="flex items-center justify-between text-xs mt-sm">
            <span className="text-text-muted font-medium">Linked</span>
            <span className="text-primary text-xs">Closes #298, #312</span>
          </div>
        </div>

        {/* Conversation thread */}
        <div className="flex flex-col gap-md">
          {/* PR Description */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-xs px-sm py-xs bg-surface-alt border-b border-border">
              <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">OS</div>
              <span className="font-semibold text-xs text-text">octocat</span>
              <span className="text-[10px] text-text-muted">3h ago</span>
              <span className="ml-auto bg-surface border border-border text-text-muted text-[10px] rounded-full px-xs py-[1px]">Author</span>
            </div>
            <div className="p-sm text-xs text-text leading-relaxed">
              <p className="mb-sm">
                This PR migrates our authentication system from custom JWT to industry-standard OAuth2 providers for better security and social login support.
              </p>
              <p className="font-semibold mb-xs text-xs">Changes:</p>
              <ul className="list-disc pl-md space-y-[2px] text-xs text-text-muted">
                <li>Added GitHub and Google OAuth2 providers</li>
                <li>Implemented token refresh flow</li>
                <li>Updated session management</li>
                <li>Added callback URL validation</li>
              </ul>
            </div>
            <div className="flex items-center gap-xs px-sm py-xs border-t border-border">
              <span className="flex items-center gap-xs bg-surface-alt border border-border rounded-full px-xs py-[1px] text-[10px] text-text-muted">👍 5</span>
              <span className="flex items-center gap-xs bg-surface-alt border border-border rounded-full px-xs py-[1px] text-[10px] text-text-muted">❤️ 2</span>
              <span className="flex items-center gap-xs bg-surface-alt border border-border rounded-full px-xs py-[1px] text-[10px] text-text-muted">🚀 1</span>
            </div>
          </div>

          {/* Comment 2 — sarahchen approved */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-xs px-sm py-xs bg-surface-alt border-b border-border">
              <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-[9px] font-bold">SC</div>
              <span className="font-semibold text-xs text-text">sarahchen</span>
              <span className="text-[10px] text-text-muted">2h ago</span>
              <span className="ml-auto bg-success text-white text-[10px] rounded-full px-xs py-[1px] font-semibold">Approved</span>
            </div>
            <div className="p-sm text-xs text-text leading-relaxed">
              Looks great overall! The callback URL validation is solid. Left a few comments on the token refresh logic.
            </div>
          </div>

          {/* Comment 3 — mikerivera changes requested */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-xs px-sm py-xs bg-surface-alt border-b border-border">
              <div className="w-5 h-5 rounded-full bg-warning text-white flex items-center justify-center text-[9px] font-bold">MR</div>
              <span className="font-semibold text-xs text-text">mikerivera</span>
              <span className="text-[10px] text-text-muted">45m ago</span>
              <span className="ml-auto bg-warning text-white text-[10px] rounded-full px-xs py-[1px] font-semibold">Changes requested</span>
            </div>
            <div className="p-sm text-xs text-text leading-relaxed">
              Can we add error handling for the case where the provider returns an invalid scope? Seen this with enterprise GitHub setups.
            </div>
          </div>

          {/* Review banner */}
          <div className="bg-surface-alt border border-border rounded-lg px-sm py-xs flex items-center gap-xs">
            <span className="text-warning text-xs">●</span>
            <span className="text-xs text-text">
              <span className="font-semibold">mikerivera</span> requested changes — 2 comments
            </span>
          </div>

          {/* Comment box */}
          <div className="bg-surface border border-border rounded-lg p-sm">
            <textarea
              placeholder="Leave a comment..."
              className="w-full bg-background border border-border rounded-md p-sm text-xs text-text resize-none min-h-[60px] box-border"
            />
            <div className="flex items-center justify-end gap-xs mt-xs">
              <button className="px-sm py-xs text-[10px] font-medium border border-border rounded-md text-text bg-surface cursor-pointer">Comment</button>
              <button className="px-sm py-xs text-[10px] font-medium rounded-md bg-success text-white border-0 cursor-pointer">Approve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
