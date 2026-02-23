import type { DesignFlowTheme } from "../types"

function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

export function generateThemeCSS(theme: Partial<DesignFlowTheme>): string {
  const props: string[] = []

  if (theme.colors) {
    for (const [key, value] of Object.entries(theme.colors)) {
      props.push(`  --df-${camelToKebab(key)}: ${value};`)
    }
  }

  if (theme.radius) {
    for (const [key, value] of Object.entries(theme.radius)) {
      props.push(`  --df-radius-${camelToKebab(key)}: ${value};`)
    }
  }

  if (theme.spacing) {
    for (const [key, value] of Object.entries(theme.spacing)) {
      props.push(`  --df-spacing-${camelToKebab(key)}: ${value};`)
    }
  }

  if (theme.typography) {
    const { fontFamily, heading, body } = theme.typography
    if (fontFamily) {
      props.push(`  --df-font-family: ${fontFamily};`)
    }
    if (heading) {
      props.push(`  --df-heading-weight: ${heading.weight};`)
      if (heading.sizes) {
        for (const [key, value] of Object.entries(heading.sizes)) {
          props.push(`  --df-heading-${camelToKebab(key)}: ${value};`)
        }
      }
    }
    if (body) {
      props.push(`  --df-body-weight: ${body.weight};`)
      if (body.sizes) {
        for (const [key, value] of Object.entries(body.sizes)) {
          props.push(`  --df-body-${camelToKebab(key)}: ${value};`)
        }
      }
    }
  }

  if (theme.shadows) {
    for (const [key, value] of Object.entries(theme.shadows)) {
      props.push(`  --df-shadow-${camelToKebab(key)}: ${value};`)
    }
  }

  return `:root {\n${props.join("\n")}\n}`
}

export function generateThemeFile(theme: DesignFlowTheme): string {
  return `import type { DesignFlowTheme } from "designflow"

const theme: DesignFlowTheme = ${JSON.stringify(theme, null, 2)}

export default theme
`
}

export function generateTailwindConfig(theme: DesignFlowTheme): string {
  const colors: Record<string, string> = {}
  for (const [key, value] of Object.entries(theme.colors)) {
    colors[camelToKebab(key)] = value
  }

  const spacing: Record<string, string> = {}
  for (const [key, value] of Object.entries(theme.spacing)) {
    spacing[key] = value
  }

  const borderRadius: Record<string, string> = {}
  for (const [key, value] of Object.entries(theme.radius)) {
    borderRadius[key] = value
  }

  const config = {
    content: ["./screens/**/*.tsx"],
    theme: {
      extend: {
        colors,
        spacing,
        borderRadius,
        fontFamily: {
          sans: [theme.typography.fontFamily],
        },
        boxShadow: { ...theme.shadows },
      },
    },
    plugins: [],
  }

  return `import type { Config } from "tailwindcss"

const config: Config = ${JSON.stringify(config, null, 2)}

export default config
`
}
