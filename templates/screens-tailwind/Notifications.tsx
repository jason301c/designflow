import { useState } from "react"

type NotificationItem = {
  id: number
  type: string
  title: string
  number?: number
  time: string
  unread: boolean
  navigate?: string
}

type NotificationGroup = {
  repo: string
  items: NotificationItem[]
}

const notificationGroups: NotificationGroup[] = [
  {
    repo: "octocat/react-starter",
    items: [
      { id: 1, type: "PR", title: "Refactor authentication to use OAuth2", number: 347, time: "3h ago", unread: true, navigate: "pullrequest" },
      { id: 2, type: "Issue", title: "OAuth2 callback fails on mobile Safari", number: 347, time: "5h ago", unread: true, navigate: "issues" },
      { id: 3, type: "CI", title: "CI passed on feature/oauth2", time: "6h ago", unread: false },
    ],
  },
  {
    repo: "octocat/api-toolkit",
    items: [
      { id: 4, type: "@", title: "@octocat mentioned you in Add rate limiting", number: 89, time: "1d ago", unread: true },
      { id: 5, type: "Review", title: "Review requested on Fix pagination", number: 92, time: "2d ago", unread: false },
    ],
  },
  {
    repo: "octocat/design-system",
    items: [
      { id: 6, type: "v", title: "v3.2.0 released", time: "3d ago", unread: false },
      { id: 7, type: "Issue", title: "Button component needs hover state", number: 45, time: "4d ago", unread: false },
    ],
  },
]

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "participating" | "mentions">("all")
  const [unreadOnly, setUnreadOnly] = useState(false)

  const filters = [
    { key: "all" as const, label: "All" },
    { key: "participating" as const, label: "Participating" },
    { key: "mentions" as const, label: "Mentions" },
  ]

  const filteredGroups = notificationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !unreadOnly || item.unread),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="p-md bg-background min-h-screen font-sans">
      {/* A. Mobile Header */}
      <div className="flex items-center justify-between mb-md">
        <button className="w-8 h-8 flex items-center justify-center text-text text-lg">
          &#9776;
        </button>
        <h1 className="text-lg font-semibold text-text">Notifications</h1>
        <button className="w-8 h-8 flex items-center justify-center text-text-muted text-lg">
          &#9881;
        </button>
      </div>

      {/* B. Filter Pills */}
      <div className="flex gap-sm overflow-x-auto mb-md">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={
              filter === f.key
                ? "bg-primary text-white rounded-full py-xs px-md text-xs font-medium border-none whitespace-nowrap"
                : "bg-surface border border-border text-text rounded-full py-xs px-md text-xs whitespace-nowrap"
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Unread Toggle */}
      <div className="flex items-center justify-between mb-lg">
        <span className="text-sm text-text">Only show unread</span>
        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={`w-10 h-5 rounded-full relative transition-colors ${
            unreadOnly ? "bg-primary" : "bg-surface-alt"
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
              unreadOnly ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* C. Notification Groups */}
      <div className="flex flex-col gap-md">
        {filteredGroups.map((group) => (
          <div key={group.repo}>
            {/* Repo header */}
            <div className="border-t border-border pt-sm mb-sm">
              <span className="text-text text-sm font-semibold">{group.repo}</span>
            </div>

            {/* Notification items */}
            <div className="flex flex-col">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="py-sm px-md flex items-start gap-sm"
                  {...(item.navigate ? { "data-df-navigate": item.navigate } : {})}
                >
                  {/* Type badge */}
                  <span className="text-xs bg-surface-alt text-text-muted rounded px-[6px] py-[1px] mt-[2px] shrink-0">
                    {item.type}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${
                        item.unread ? "font-semibold text-text" : "text-text"
                      }`}
                    >
                      {item.title}
                      {item.number != null && (
                        <span className="text-text-muted font-normal"> #{item.number}</span>
                      )}
                    </p>
                    <p className="text-xs text-text-muted mt-[2px]">{item.time}</p>
                  </div>

                  {/* Unread dot */}
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-[6px]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* D. Footer */}
      <button className="w-full mt-lg py-sm px-md text-sm font-medium text-text border border-border rounded-md bg-surface hover:bg-surface-alt transition-colors">
        Mark all as read
      </button>
    </div>
  )
}
