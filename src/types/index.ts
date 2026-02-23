export type Viewport = "desktop" | "tablet" | "mobile"
export type ColorScheme = "light" | "dark"
export type CanvasAppearance = "light" | "dark"
export type BackgroundStyle = "grid" | "dots" | "blank"
export type LineStyle = "solid" | "dashed" | "dotted"

export interface CanvasSettings {
  appearance: CanvasAppearance
  accentColor: string
  backgroundStyle: BackgroundStyle
  lineStyle: LineStyle
}

export const DEFAULT_CANVAS_SETTINGS: CanvasSettings = {
  appearance: "light",
  accentColor: "#2563eb",
  backgroundStyle: "grid",
  lineStyle: "solid",
}

export const ACCENT_COLORS = [
  "#2563eb", // blue (default)
  "#7c3aed", // purple
  "#059669", // green
  "#dc2626", // red
  "#ea580c", // orange
  "#db2777", // pink
]

export const VIEWPORT_RESOLUTIONS: Record<Viewport, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
}

export function getScreenResolution(
  viewport?: Viewport,
): { width: number; height: number } {
  return VIEWPORT_RESOLUTIONS[viewport ?? "desktop"]
}

export interface ScreenConfig {
  title: string
  file: string
  position: { x: number; y: number }
  viewport?: Viewport
}

export interface EdgeConfig {
  from: string
  to: string
  label?: string
  inferred?: boolean
}

export interface DesignFlowConfig {
  screens: Record<string, ScreenConfig>
  edges?: EdgeConfig[]
}
