import { useEffect, useRef, useState, type ComponentType } from "react"
import type { DesignFlowConfig } from "../types"

interface ViewerProps {
  screenId: string
  screenTitle: string
  component: ComponentType
  onClose: () => void
  onNavigate?: (screenId: string) => void
  config?: DesignFlowConfig
}

interface NavBadge {
  targetId: string
  label: string
  top: number
  left: number
}

export function Viewer({ screenId, screenTitle, component: ScreenComponent, onClose, onNavigate, config }: ViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [badges, setBadges] = useState<NavBadge[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Scan for data-df-navigate elements and create badges
  useEffect(() => {
    if (!contentRef.current || !config) return

    const container = contentRef.current
    const navElements = container.querySelectorAll<HTMLElement>("[data-df-navigate]")
    const newBadges: NavBadge[] = []

    navElements.forEach((el) => {
      const targetId = el.getAttribute("data-df-navigate")
      if (!targetId) return

      const targetTitle = config.screens[targetId]?.title ?? targetId
      const rect = el.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      newBadges.push({
        targetId,
        label: `\u2192 ${targetTitle}`,
        top: rect.top - containerRect.top,
        left: rect.right - containerRect.left + 4,
      })
    })

    setBadges(newBadges)
  }, [screenId, config])

  // Event delegation for navigation clicks
  useEffect(() => {
    if (!contentRef.current || !onNavigate) return

    const container = contentRef.current
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-df-navigate]")
      if (target) {
        e.preventDefault()
        const targetId = target.getAttribute("data-df-navigate")
        if (targetId) onNavigate(targetId)
      }
    }

    container.addEventListener("click", handleClick)
    return () => container.removeEventListener("click", handleClick)
  }, [onNavigate])

  return (
    <div
      data-testid="viewer-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "white",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
          {screenTitle}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            background: "none",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#64748b",
          }}
        >
          Close
        </button>
      </div>

      {/* Screen content */}
      <div
        ref={contentRef}
        style={{
          flex: 1,
          overflow: "auto",
          background: "white",
          position: "relative",
        }}
      >
        <ScreenComponent key={screenId} />
        {badges.map((badge) => (
          <span
            key={badge.targetId}
            style={{
              position: "absolute",
              top: `${badge.top}px`,
              left: `${badge.left}px`,
              fontSize: "11px",
              fontWeight: 500,
              background: "#eff6ff",
              color: "#3b82f6",
              border: "1px solid #bfdbfe",
              borderRadius: "9999px",
              padding: "2px 8px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  )
}
