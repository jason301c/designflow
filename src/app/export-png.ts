import { toPng } from "html-to-image"
import { getNodesBounds, getViewportForBounds } from "@xyflow/react"
import type { Node } from "@xyflow/react"

const CANVAS_WIDTH = 2048
const CANVAS_HEIGHT = 1536

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export interface ExportCanvasOptions {
  backgroundColor?: string
  projectName?: string
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = filename
  a.click()
}

export async function exportCanvasPng(
  getNodes: () => Node[],
  options?: ExportCanvasOptions,
) {
  const viewportEl = document.querySelector<HTMLElement>(".react-flow__viewport")
  if (!viewportEl) return

  const nodes = getNodes()
  const bounds = getNodesBounds(nodes)
  const viewport = getViewportForBounds(
    bounds,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    0.5,
    2,
    0.1,
  )

  const dataUrl = await toPng(viewportEl, {
    backgroundColor: options?.backgroundColor ?? "#ffffff",
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    style: {
      width: `${CANVAS_WIDTH}px`,
      height: `${CANVAS_HEIGHT}px`,
      transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
    },
  })

  const prefix = options?.projectName ? slugify(options.projectName) : "designflow"
  downloadDataUrl(dataUrl, `${prefix}-canvas.png`)
}

export async function exportScreenPng(screenId: string, projectName?: string) {
  const wrapper = document.querySelector<HTMLElement>(
    `[data-df-screen-id="${screenId}"]`,
  )
  if (!wrapper) return

  const contentEl = wrapper.querySelector<HTMLElement>("[data-df-screen-content]")
  if (!contentEl) return

  const width = parseInt(contentEl.style.width)
  const height = parseInt(contentEl.style.height)

  const dataUrl = await toPng(contentEl, {
    width,
    height,
    style: {
      transform: "none",
    },
  })

  const prefix = projectName ? slugify(projectName) : "designflow"
  downloadDataUrl(dataUrl, `${prefix}-${screenId}.png`)
}
