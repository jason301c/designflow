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
  accentColor: "#4488ff",
  backgroundStyle: "grid",
  lineStyle: "solid",
}

export const ACCENT_COLORS = [
  "#4488ff", // blue
  "#ffb400", // yellow
  "#f76540", // orange
  "#ef3060", // red
  "#ff80ff", // fuchsia
  "#ffcccc", // salmon
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

export const DEFAULT_PROJECT_NAME = "My Designflow Project"

export interface DesignFlowConfig {
  name?: string
  screens: Record<string, ScreenConfig>
  edges?: EdgeConfig[]
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  surfaceAlt: string
  border: string
  text: string
  textMuted: string
  textInvert: string
  success: string
  warning: string
  error: string
  info: string
}

export interface DesignFlowTheme {
  colors: ThemeColors
  darkColors?: Partial<ThemeColors>
  radius: Record<string, string>
  spacing: Record<string, string>
  typography: {
    fontFamily: string
    heading: { weight: number; sizes: Record<string, string> }
    body: { weight: number; sizes: Record<string, string> }
  }
  shadows: Record<string, string>
}
