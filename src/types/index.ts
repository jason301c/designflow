export type Viewport = "desktop" | "tablet" | "mobile"

export const VIEWPORT_RESOLUTIONS: Record<Viewport, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
}

export function getScreenResolution(
  viewport?: Viewport,
  resolution?: { width: number; height: number },
): { width: number; height: number } {
  if (resolution) return resolution
  return VIEWPORT_RESOLUTIONS[viewport ?? "desktop"]
}

export interface ScreenConfig {
  title: string
  file: string
  position: { x: number; y: number }
  viewport?: Viewport
  resolution?: { width: number; height: number }
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

export interface DesignFlowTheme {
  colors: {
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
  radius: {
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }
  typography: {
    fontFamily: string
    heading: {
      weight: number
      sizes: { h1: string; h2: string; h3: string; h4: string }
    }
    body: {
      weight: number
      sizes: { base: string; sm: string; xs: string }
    }
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
}
