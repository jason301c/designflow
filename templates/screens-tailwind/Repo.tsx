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
  { name: "TypeScript", pct: 68, colorClass: "bg-info" },
  { name: "CSS", pct: 22, colorClass: "bg-warning" },
  { name: "HTML", pct: 10, colorClass: "bg-error" },
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
    <div className="bg-background min-h-screen font-sans">
      {/* Nav bar */}
      <nav className="flex items-center justify-between bg-surface border-b border-border px-md py-sm">
        <div className="flex items-center gap-sm">
          <div className="bg-primary text-white font-bold text-xs rounded-md w-7 h-7 flex items-center justify-center">
            GH
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <button
            data-df-navigate="notifications"
            className="relative bg-surface border border-border rounded-md p-xs cursor-pointer text-text"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16a2 2 0 002-2H6a2 2 0 002 2zM8 1.918l-.797.161A4.002 4.002 0 004 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 00-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 111.99 0A5.002 5.002 0 0113 6c0 .88.32 4.2 1.22 6z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full" />
          </button>
          <button
            data-df-navigate="profile"
            className="w-7 h-7 rounded-full bg-secondary text-white text-xs font-semibold flex items-center justify-center border-0 cursor-pointer"
          >
            OS
          </button>
        </div>
      </nav>

      <div className="p-md">
        {/* Repo header */}
        <div className="mb-md">
          <div className="flex items-center gap-xs mb-xs">
            <span data-df-navigate="profile" className="text-primary cursor-pointer text-xs">octocat</span>
            <span className="text-text-muted text-xs">/</span>
            <span className="text-text font-semibold text-xs">react-starter</span>
            <span className="bg-surface-alt text-text-muted text-[10px] rounded-full py-[1px] px-xs border border-border ml-xs">
              Public
            </span>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-xs">
            <button className="flex items-center gap-xs bg-surface border border-border rounded-md py-[3px] px-sm text-xs text-text cursor-pointer">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-text-muted">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              Star
              <span className="text-text-muted text-[10px]">1.2k</span>
            </button>
            <button className="flex items-center gap-xs bg-surface border border-border rounded-md py-[3px] px-sm text-xs text-text cursor-pointer">
              Fork
              <span className="text-text-muted text-[10px]">156</span>
            </button>
            <button className="flex items-center gap-xs bg-surface border border-border rounded-md py-[3px] px-sm text-xs text-text cursor-pointer">
              Watch
              <span className="text-text-muted text-[10px]">23</span>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-sm border-b border-border mb-md overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              {...(tab.navigate ? { "data-df-navigate": tab.navigate } : {})}
              className={`pb-sm px-xs border-b-2 cursor-pointer bg-transparent text-xs whitespace-nowrap flex items-center gap-xs ${
                activeTab === tab.id
                  ? "text-text font-semibold border-primary"
                  : "text-text-muted border-transparent"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="bg-surface-alt text-text-muted text-[10px] rounded-full py-[1px] px-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Branch selector + code button */}
        <div className="flex items-center gap-xs mb-sm">
          <div className="relative flex-1">
            <button
              onClick={() => setBranchOpen(!branchOpen)}
              className="flex items-center gap-xs bg-surface border border-border rounded-md py-xs px-sm text-xs text-text cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-text-muted">
                <path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
              </svg>
              main
              <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor" className="text-text-muted">
                <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z" />
              </svg>
            </button>
            {branchOpen && (
              <div className="absolute top-full left-0 mt-xs bg-surface border border-border rounded-md shadow-md z-10 w-44">
                <div className="p-xs border-b border-border">
                  <input type="text" placeholder="Find a branch..." className="w-full bg-background border border-border rounded-md py-xs px-xs text-xs text-text" />
                </div>
                <div className="py-xs">
                  {["main", "develop", "feature/auth", "fix/typos"].map((branch) => (
                    <button key={branch} onClick={() => setBranchOpen(false)} className="w-full text-left px-sm py-xs text-xs text-text cursor-pointer bg-transparent border-0">
                      {branch === "main" && <span className="mr-xs text-success">&#10003;</span>}
                      {branch}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="bg-primary text-white rounded-md py-xs px-sm text-xs font-semibold cursor-pointer border-0">
            Code ▾
          </button>
        </div>

        {/* Latest commit */}
        <div className="bg-surface rounded-t-lg border border-border p-sm flex items-center gap-xs">
          <div className="w-5 h-5 rounded-full bg-secondary text-white text-[9px] font-semibold flex items-center justify-center shrink-0">
            OS
          </div>
          <span className="text-text text-xs font-semibold truncate">octocat</span>
          <span className="text-text-muted text-xs truncate flex-1">Update README</span>
          <span className="text-text-muted text-[10px] font-mono shrink-0">a1b2c3d</span>
        </div>

        {/* File list */}
        <div className="border-x border-b border-border rounded-b-lg overflow-hidden">
          {files.map((file, i) => (
            <div
              key={file.name}
              className={`flex items-center px-sm py-xs text-xs ${
                i < files.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="w-5 shrink-0 text-text-muted">
                {file.type === "dir" ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-primary">
                    <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-text-muted">
                    <path d="M3.75 1.5a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 00.25-.25V4.664a.25.25 0 00-.073-.177l-2.914-2.914a.25.25 0 00-.177-.073H3.75zM2 1.75C2 .784 2.784 0 3.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0112.25 16h-8.5A1.75 1.75 0 012 14.25V1.75z" />
                  </svg>
                )}
              </span>
              <span className={`flex-1 truncate ${file.type === "dir" ? "text-primary" : "text-text"}`}>
                {file.name}
              </span>
              <span className="text-text-muted text-[10px] shrink-0 ml-sm">{file.time}</span>
            </div>
          ))}
        </div>

        {/* About section */}
        <div className="mt-md bg-surface border border-border rounded-lg p-md">
          <h3 className="text-text font-semibold text-xs mb-sm">About</h3>
          <p className="text-text-muted text-xs mb-sm leading-relaxed">
            A modern React starter template with TypeScript, Vite, and Tailwind CSS.
          </p>
          <a className="text-primary text-xs cursor-pointer">react-starter.dev</a>
          <div className="flex flex-wrap gap-xs mt-sm">
            {topics.map((topic) => (
              <span key={topic} className="bg-surface-alt text-primary text-[10px] rounded-full py-[1px] px-xs">
                {topic}
              </span>
            ))}
          </div>
          {/* Stats */}
          <div className="flex gap-md mt-sm text-xs text-text-muted">
            <span>★ <span className="text-text font-semibold">1.2k</span></span>
            <span>⑂ <span className="text-text font-semibold">156</span></span>
            <span>◉ <span className="text-text font-semibold">23</span></span>
          </div>
          {/* Languages bar */}
          <div className="mt-sm">
            <div className="flex h-1.5 rounded-full overflow-hidden mb-xs">
              {languages.map((lang, i) => (
                <div
                  key={lang.name}
                  className={`${lang.colorClass} ${i === 0 ? "rounded-l-full" : ""} ${i === languages.length - 1 ? "rounded-r-full" : ""}`}
                  style={{ width: `${lang.pct}%` }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-sm text-[10px]">
              {languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-xs">
                  <span className={`w-2 h-2 rounded-full ${lang.colorClass}`} />
                  <span className="text-text">{lang.name}</span>
                  <span className="text-text-muted">{lang.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* README preview */}
        <div className="mt-md border border-border rounded-lg overflow-hidden">
          <div className="bg-surface border-b border-border px-md py-sm flex items-center gap-xs text-xs">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-text-muted">
              <path d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm7.251 10.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574zM8.755 4.75l-.004 7.322a3.752 3.752 0 011.992-.572H14.5v-9h-3.495a2.25 2.25 0 00-2.25 2.25z" />
            </svg>
            <span className="text-text font-semibold">README.md</span>
          </div>
          <div className="p-md">
            <h1 className="text-text text-lg font-semibold mb-sm">React Starter</h1>
            <p className="text-text-muted text-xs mb-md leading-relaxed">
              A modern React starter template with TypeScript, Vite, and Tailwind CSS pre-configured.
            </p>
            <h2 className="text-text text-sm font-semibold mb-xs">Getting Started</h2>
            <div className="bg-surface-alt rounded-md p-sm font-mono text-[10px] text-text mb-md overflow-x-auto">
              <div>npx degit octocat/react-starter my-app</div>
              <div>cd my-app && npm install</div>
              <div>npm run dev</div>
            </div>
            <h2 className="text-text text-sm font-semibold mb-xs">Features</h2>
            <ul className="text-text-muted text-xs list-disc pl-md flex flex-col gap-[2px]">
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
