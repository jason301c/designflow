import type { Plugin } from "vite"
import type { IncomingMessage, ServerResponse } from "http"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs/promises"
import { scanScreens, extractNavigationTargets } from "./screen-scanner"
import { updateScreenPosition, writeFlowConfig } from "./flow-writer"
import { generateThemeFile, generateTailwindConfig } from "./theme-loader"
import type { DesignFlowConfig, DesignFlowTheme } from "../types"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface DesignflowPluginOptions {
  dir: string
}

const VIRTUAL_THEME = "virtual:designflow/theme"
const VIRTUAL_SCREENS = "virtual:designflow/screens"
const VIRTUAL_INFERRED_EDGES = "virtual:designflow/inferred-edges"
const RESOLVED_THEME = "\0" + VIRTUAL_THEME
const RESOLVED_SCREENS = "\0" + VIRTUAL_SCREENS
const RESOLVED_INFERRED_EDGES = "\0" + VIRTUAL_INFERRED_EDGES

export function designflowPlugin(options: DesignflowPluginOptions): Plugin {
  const { dir } = options

  return {
    name: "designflow",

    resolveId(id: string) {
      if (id === VIRTUAL_THEME) return RESOLVED_THEME
      if (id === VIRTUAL_SCREENS) return RESOLVED_SCREENS
      if (id === VIRTUAL_INFERRED_EDGES) return RESOLVED_INFERRED_EDGES
      return undefined
    },

    async load(id: string) {
      if (id === RESOLVED_THEME) {
        const themePath = path.resolve(dir, "designflow.theme.ts").replace(/\\/g, "/")
        const themeLoaderPath = path.resolve(__dirname, "theme-loader").replace(/\\/g, "/")
        return `
          import theme from "${themePath}"
          import { generateThemeCSS } from "${themeLoaderPath}"
          const css = generateThemeCSS(theme)
          const style = document.createElement("style")
          style.setAttribute("data-designflow-theme", "")
          style.textContent = css
          document.head.appendChild(style)
        `
      }

      if (id === RESOLVED_SCREENS) {
        const screensDir = path.resolve(dir, "screens")
        const screens = await scanScreens(screensDir)
        const imports = screens
          .map((s, i) => `import Screen${i} from "${s.filePath.replace(/\\/g, "/")}"`)
          .join("\n")
        const entries = screens
          .map((s, i) => `  "${s.id}": Screen${i}`)
          .join(",\n")
        return `${imports}\nexport default {\n${entries}\n}`
      }

      if (id === RESOLVED_INFERRED_EDGES) {
        const screensDir = path.resolve(dir, "screens")
        const screens = await scanScreens(screensDir)
        const edges: Array<{ from: string; to: string; label: string; inferred: true }> = []

        for (const screen of screens) {
          try {
            const source = await fs.readFile(screen.filePath, "utf-8")
            const targets = extractNavigationTargets(source)
            for (const target of targets) {
              edges.push({ from: screen.id, to: target, label: "navigate", inferred: true })
            }
          } catch {
            // Skip unreadable files
          }
        }

        return `export default ${JSON.stringify(edges)}`
      }

      return undefined
    },

    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "module" },
          children: `import "virtual:designflow/theme"`,
          injectTo: "head" as const,
        },
      ]
    },

    configureServer(server) {
      const screensDir = path.resolve(dir, "screens")
      const themePath = path.resolve(dir, "designflow.theme.ts")
      const flowsPath = path.resolve(dir, "flows.ts")

      server.watcher.add([screensDir, themePath])

      function invalidateAndReload(changedPath: string) {
        if (changedPath.startsWith(screensDir) || changedPath === themePath) {
          const themeModule = server.moduleGraph.getModuleById(RESOLVED_THEME)
          const screensModule =
            server.moduleGraph.getModuleById(RESOLVED_SCREENS)
          const inferredEdgesModule =
            server.moduleGraph.getModuleById(RESOLVED_INFERRED_EDGES)

          if (themeModule) {
            server.moduleGraph.invalidateModule(themeModule)
          }
          if (screensModule) {
            server.moduleGraph.invalidateModule(screensModule)
          }
          if (inferredEdgesModule) {
            server.moduleGraph.invalidateModule(inferredEdgesModule)
          }

          server.ws.send({ type: "full-reload" })
        }
      }

      server.watcher.on("change", invalidateAndReload)
      server.watcher.on("add", invalidateAndReload)
      server.watcher.on("unlink", invalidateAndReload)

      // API middleware for position persistence
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url !== "/__designflow/update-positions" || req.method !== "POST") {
          return next()
        }

        let body = ""
        req.on("data", (chunk: Buffer) => { body += chunk.toString() })
        req.on("end", async () => {
          try {
            const { positions } = JSON.parse(body) as {
              positions: Record<string, { x: number; y: number }>
            }

            // Read current config from flows.ts
            const flowsModule = await import(flowsPath)
            let config: DesignFlowConfig = flowsModule.default

            // Update each position
            for (const [screenId, position] of Object.entries(positions)) {
              config = updateScreenPosition(config, screenId, position)
            }

            // Write back to flows.ts
            await writeFlowConfig(flowsPath, config)

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })

      // API middleware for theme update
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url !== "/__designflow/update-theme" || req.method !== "POST") {
          return next()
        }

        let body = ""
        req.on("data", (chunk: Buffer) => { body += chunk.toString() })
        req.on("end", async () => {
          try {
            const { theme } = JSON.parse(body) as { theme: DesignFlowTheme }
            const fileContent = generateThemeFile(theme)
            await fs.writeFile(themePath, fileContent, "utf-8")

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })

      // API middleware for Tailwind config generation
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url !== "/__designflow/generate-tailwind" || req.method !== "POST") {
          return next()
        }

        let body = ""
        req.on("data", (chunk: Buffer) => { body += chunk.toString() })
        req.on("end", async () => {
          try {
            const { theme } = JSON.parse(body) as { theme: DesignFlowTheme }
            const tailwindConfig = generateTailwindConfig(theme)
            const tailwindPath = path.resolve(dir, "tailwind.config.ts")
            await fs.writeFile(tailwindPath, tailwindConfig, "utf-8")

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })
    },
  }
}
