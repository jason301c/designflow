export type Viewport = "desktop" | "tablet" | "mobile"
export type ColorScheme = "light" | "dark"
export type CanvasAppearance = "light" | "dark"

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
