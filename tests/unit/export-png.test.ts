import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// Mock html-to-image
const mockToPng = vi.fn()
vi.mock("html-to-image", () => ({
  toPng: (...args: any[]) => mockToPng(...args),
}))

// Mock @xyflow/react utilities
const mockGetNodesBounds = vi.fn()
const mockGetViewportForBounds = vi.fn()
vi.mock("@xyflow/react", () => ({
  getNodesBounds: (...args: any[]) => mockGetNodesBounds(...args),
  getViewportForBounds: (...args: any[]) => mockGetViewportForBounds(...args),
}))

import { exportCanvasPng, exportScreenPng, slugify } from "../../src/app/export-png"

describe("slugify", () => {
  it("should lowercase and replace spaces with hyphens", () => {
    expect(slugify("My Cool App")).toBe("my-cool-app")
  })

  it("should strip non-alphanumeric characters", () => {
    expect(slugify("App (v2.0)!")).toBe("app-v2-0")
  })

  it("should trim leading/trailing hyphens", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world")
  })

  it("should collapse multiple hyphens", () => {
    expect(slugify("a---b")).toBe("a-b")
  })
})

describe("exportCanvasPng", () => {
  let mockViewportEl: HTMLDivElement
  let mockAnchor: { click: ReturnType<typeof vi.fn>; href: string; download: string; style: any }
  let revokeURLSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    // Set up DOM element
    mockViewportEl = document.createElement("div")
    mockViewportEl.classList.add("react-flow__viewport")
    document.body.appendChild(mockViewportEl)

    // Mock URL.createObjectURL / revokeObjectURL
    revokeURLSpy = vi.fn()
    globalThis.URL.createObjectURL = vi.fn(() => "blob:mock-url")
    globalThis.URL.revokeObjectURL = revokeURLSpy

    // Mock anchor
    mockAnchor = { click: vi.fn(), href: "", download: "", style: {} }
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") return mockAnchor as any
      return document.createElement.call(document, tag)
    })

    // Default mock returns
    mockGetNodesBounds.mockReturnValue({ x: 0, y: 0, width: 1000, height: 800 })
    mockGetViewportForBounds.mockReturnValue({ x: -50, y: -30, zoom: 0.8 })
    mockToPng.mockResolvedValue("data:image/png;base64,mockdata")
  })

  afterEach(() => {
    document.body.innerHTML = ""
    vi.restoreAllMocks()
  })

  it("should call getNodesBounds with nodes from getNodes", async () => {
    const mockNodes = [{ id: "a" }, { id: "b" }]
    const getNodes = vi.fn(() => mockNodes)

    await exportCanvasPng(getNodes)

    expect(mockGetNodesBounds).toHaveBeenCalledWith(mockNodes)
  })

  it("should call getViewportForBounds with correct dimensions", async () => {
    const getNodes = vi.fn(() => [{ id: "a" }])
    mockGetNodesBounds.mockReturnValue({ x: 10, y: 20, width: 500, height: 400 })

    await exportCanvasPng(getNodes)

    expect(mockGetViewportForBounds).toHaveBeenCalledWith(
      { x: 10, y: 20, width: 500, height: 400 },
      2048,
      1536,
      0.5,
      2,
      0.1,
    )
  })

  it("should call toPng with viewport element and correct options", async () => {
    const getNodes = vi.fn(() => [{ id: "a" }])
    mockGetViewportForBounds.mockReturnValue({ x: -100, y: -50, zoom: 0.75 })

    await exportCanvasPng(getNodes)

    expect(mockToPng).toHaveBeenCalledWith(mockViewportEl, {
      backgroundColor: "#ffffff",
      width: 2048,
      height: 1536,
      style: {
        width: "2048px",
        height: "1536px",
        transform: `translate(${-100}px, ${-50}px) scale(${0.75})`,
      },
    })
  })

  it("should download with default filename when no project name", async () => {
    const getNodes = vi.fn(() => [{ id: "a" }])

    await exportCanvasPng(getNodes)

    expect(mockAnchor.download).toBe("designflow-canvas.png")
    expect(mockAnchor.click).toHaveBeenCalled()
  })

  it("should use slugified project name in filename", async () => {
    const getNodes = vi.fn(() => [{ id: "a" }])

    await exportCanvasPng(getNodes, { projectName: "My Cool App" })

    expect(mockAnchor.download).toBe("my-cool-app-canvas.png")
  })

  it("should handle missing viewport element gracefully", async () => {
    document.body.innerHTML = "" // remove the viewport el
    const getNodes = vi.fn(() => [{ id: "a" }])

    // Should not throw
    await exportCanvasPng(getNodes)

    expect(mockToPng).not.toHaveBeenCalled()
  })

  it("should respect background color option", async () => {
    const getNodes = vi.fn(() => [{ id: "a" }])

    await exportCanvasPng(getNodes, { backgroundColor: "#000000" })

    expect(mockToPng).toHaveBeenCalledWith(
      mockViewportEl,
      expect.objectContaining({ backgroundColor: "#000000" }),
    )
  })
})

describe("exportScreenPng", () => {
  let mockContentEl: HTMLDivElement
  let mockAnchor: { click: ReturnType<typeof vi.fn>; href: string; download: string; style: any }

  beforeEach(() => {
    vi.clearAllMocks()

    // Set up DOM: wrapper > thumbnail > color-scheme wrapper > full-res content
    const wrapper = document.createElement("div")
    wrapper.setAttribute("data-df-screen-id", "login")
    const thumbnail = document.createElement("div")
    thumbnail.setAttribute("data-testid", "screen-thumbnail")
    const colorSchemeWrapper = document.createElement("div")
    colorSchemeWrapper.setAttribute("data-df-color-scheme", "light")
    mockContentEl = document.createElement("div")
    mockContentEl.setAttribute("data-df-screen-content", "")
    mockContentEl.style.width = "1440px"
    mockContentEl.style.height = "900px"
    mockContentEl.style.transform = "scale(0.29)"
    colorSchemeWrapper.appendChild(mockContentEl)
    thumbnail.appendChild(colorSchemeWrapper)
    wrapper.appendChild(thumbnail)
    document.body.appendChild(wrapper)

    // Mock anchor
    mockAnchor = { click: vi.fn(), href: "", download: "", style: {} }
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") return mockAnchor as any
      return document.createElement.call(document, tag)
    })

    mockToPng.mockResolvedValue("data:image/png;base64,screendata")
  })

  afterEach(() => {
    document.body.innerHTML = ""
    vi.restoreAllMocks()
  })

  it("should find the full-resolution content element by data-df-screen-id", async () => {
    await exportScreenPng("login")

    expect(mockToPng).toHaveBeenCalledWith(mockContentEl, expect.any(Object))
  })

  it("should capture at full resolution with transform removed", async () => {
    await exportScreenPng("login")

    expect(mockToPng).toHaveBeenCalledWith(mockContentEl, {
      width: 1440,
      height: 900,
      style: {
        transform: "none",
      },
    })
  })

  it("should download with default filename when no project name", async () => {
    await exportScreenPng("login")

    expect(mockAnchor.download).toBe("designflow-login.png")
    expect(mockAnchor.click).toHaveBeenCalled()
  })

  it("should use slugified project name in filename", async () => {
    await exportScreenPng("login", "My Cool App")

    expect(mockAnchor.download).toBe("my-cool-app-login.png")
  })

  it("should handle missing screen element gracefully", async () => {
    document.body.innerHTML = "" // remove elements

    // Should not throw
    await exportScreenPng("nonexistent")

    expect(mockToPng).not.toHaveBeenCalled()
  })
})
