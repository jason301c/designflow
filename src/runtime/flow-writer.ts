import fs from "fs/promises"
import type { DesignFlowConfig } from "../types"

export function updateScreenPosition(
  config: DesignFlowConfig,
  screenId: string,
  position: { x: number; y: number },
): DesignFlowConfig {
  if (!config.screens[screenId]) return config

  return {
    ...config,
    screens: {
      ...config.screens,
      [screenId]: {
        ...config.screens[screenId],
        position,
      },
    },
  }
}

export function updateScreenViewport(
  config: DesignFlowConfig,
  screenId: string,
  viewport: string,
): DesignFlowConfig {
  if (!config.screens[screenId]) return config

  return {
    ...config,
    screens: {
      ...config.screens,
      [screenId]: {
        ...config.screens[screenId],
        viewport: viewport as any,
      },
    },
  }
}

export function serializeFlowConfig(config: DesignFlowConfig): string {
  const screenEntries = Object.entries(config.screens)
    .map(([id, screen]) => {
      const fields = [
        `      title: "${screen.title}"`,
        `      file: "${screen.file}"`,
        `      position: { x: ${screen.position.x}, y: ${screen.position.y} }`,
      ]
      if (screen.viewport) {
        fields.push(`      viewport: "${screen.viewport}"`)
      }
      return `    ${id}: {\n${fields.join(",\n")},\n    }`
    })
    .join(",\n")

  const edgeEntries = (config.edges || [])
    .map((edge) => {
      const fields = [`from: "${edge.from}"`, `to: "${edge.to}"`]
      if (edge.label) fields.push(`label: "${edge.label}"`)
      return `    { ${fields.join(", ")} }`
    })
    .join(",\n")

  return `import type { DesignFlowConfig } from "designflow"

const config: DesignFlowConfig = {
  screens: {
${screenEntries},
  },

  edges: [
${edgeEntries},
  ],
}

export default config
`
}

export async function writeFlowConfig(filePath: string, config: DesignFlowConfig): Promise<void> {
  const source = serializeFlowConfig(config)
  await fs.writeFile(filePath, source, "utf-8")
}
