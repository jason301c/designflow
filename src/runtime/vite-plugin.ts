import type { Plugin } from "vite"
import type { IncomingMessage, ServerResponse } from "http"
import os from "os"
import path from "path"
import { fileURLToPath } from "url"
import { existsSync } from "fs"
import fs from "fs/promises"
import { scanScreens, extractNavigationTargets } from "./screen-scanner"
import { updateScreenPosition, updateScreenViewport, updateScreenColor, writeFlowConfig } from "./flow-writer"
// Lazy import to avoid loading vite build API in test environments
let _runExport: typeof import("../cli/export").runExport | undefined
import type { DesignFlowConfig } from "../types"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Package root — ../ from dist/, ../../ from src/runtime/
let __pkgRoot = path.resolve(__dirname, "..")
if (!existsSync(path.join(__pkgRoot, "package.json"))) {
  __pkgRoot = path.resolve(__dirname, "../..")
}

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
  let suppressNextFlowsReload = false

  return {
    name: "designflow",

    handleHotUpdate({ file }) {
      const flowsPath = path.resolve(dir, "flows.ts")
      if (file === flowsPath && suppressNextFlowsReload) {
        suppressNextFlowsReload = false
        return []
      }
    },

    resolveId(id: string) {
      if (id === VIRTUAL_THEME) return RESOLVED_THEME
      if (id === VIRTUAL_SCREENS) return RESOLVED_SCREENS
      if (id === VIRTUAL_INFERRED_EDGES) return RESOLVED_INFERRED_EDGES
      return undefined
    },

    async load(id: string) {
      if (id === RESOLVED_THEME) {
        const themePath = path.resolve(dir, "designflow.theme.ts").replace(/\\/g, "/")
        const themeLoaderPath = path.resolve(__pkgRoot, "src/runtime/theme-loader").replace(/\\/g, "/")
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

    configureServer(server) {
      const screensDir = path.resolve(dir, "screens")
      const themePath = path.resolve(dir, "designflow.theme.ts")
      const flowsPath = path.resolve(dir, "flows.ts")

      server.watcher.add([screensDir, themePath])
      // Prevent page reload when export writes a temp index.html
      server.watcher.unwatch(path.resolve(dir, "index.html"))

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

        // Helper: load flows.ts config via Vite's SSR transform (handles .ts files)
      async function loadFlowsConfig(): Promise<DesignFlowConfig> {
        // Invalidate cached module so we always get fresh content
        const mods = server.moduleGraph.getModulesByFile(flowsPath)
        if (mods) {
          for (const m of mods) server.moduleGraph.invalidateModule(m)
        }
        const flowsModule = await server.ssrLoadModule(flowsPath)
        return flowsModule.default
      }

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

            let config = await loadFlowsConfig()

            // Update each position
            for (const [screenId, position] of Object.entries(positions)) {
              config = updateScreenPosition(config, screenId, position)
            }

            // Write back to flows.ts (suppress HMR reload for this save)
            suppressNextFlowsReload = true
            await writeFlowConfig(flowsPath, config)

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })

      // API middleware for viewport persistence
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url !== "/__designflow/update-viewport" || req.method !== "POST") {
          return next()
        }

        let body = ""
        req.on("data", (chunk: Buffer) => { body += chunk.toString() })
        req.on("end", async () => {
          try {
            const { screenId, viewport } = JSON.parse(body) as {
              screenId: string
              viewport: string
            }

            let config = await loadFlowsConfig()
            config = updateScreenViewport(config, screenId, viewport)

            suppressNextFlowsReload = true
            await writeFlowConfig(flowsPath, config)

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })

      // API middleware for color persistence
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url !== "/__designflow/update-color" || req.method !== "POST") {
          return next()
        }

        let body = ""
        req.on("data", (chunk: Buffer) => { body += chunk.toString() })
        req.on("end", async () => {
          try {
            const { screenId, color } = JSON.parse(body) as {
              screenId: string
              color: string
            }

            let config = await loadFlowsConfig()
            config = updateScreenColor(config, screenId, color)

            suppressNextFlowsReload = true
            await writeFlowConfig(flowsPath, config)

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })

      // API middleware for static HTML export
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url !== "/__designflow/export" || req.method !== "POST") {
          return next()
        }

        ;(async () => {
          // Export to project root (parent of wireframes dir)
          const projectRoot = path.dirname(path.resolve(dir))
          const outputPath = path.join(projectRoot, "designflow.html")

          if (!_runExport) {
            const mod = await import("../cli/export")
            _runExport = mod.runExport
          }
          await _runExport({ dir, output: outputPath, silent: true })

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ ok: true, path: outputPath }))
        })().catch((err: any) => {
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: String(err) }))
        })
      })

      // API middleware for cloud sharing
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url !== "/__designflow/share" || req.method !== "POST") {
          return next()
        }

        let body = ""
        req.on("data", (chunk: Buffer) => { body += chunk.toString() })
        req.on("end", () => {
          ;(async () => {
            const { token } = JSON.parse(body) as { token: string }
            if (!token) {
              res.writeHead(400, { "Content-Type": "application/json" })
              res.end(JSON.stringify({ error: "Missing token" }))
              return
            }

            // Export to temp file
            const tmpPath = path.join(os.tmpdir(), `designflow-share-${Date.now()}.html`)

            try {
              if (!_runExport) {
                const mod = await import("../cli/export")
                _runExport = mod.runExport
              }
              await _runExport({ dir, output: tmpPath, silent: true })

              // Read the exported HTML
              const html = await fs.readFile(tmpPath, "utf-8")

              // Extract project name from flows.ts
              const flowsSource = await fs.readFile(path.resolve(dir, "flows.ts"), "utf-8")
              const nameMatch = flowsSource.match(/name:\s*["']([^"']+)["']/)
              const projectName = nameMatch?.[1] || "Untitled"

              // POST to cloud
              const cloudRes = await fetch("https://designflow.cc/api/share", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ html, name: projectName }),
              })

              const data = await cloudRes.json()

              res.writeHead(cloudRes.status, { "Content-Type": "application/json" })
              res.end(JSON.stringify(data))
            } finally {
              // Clean up temp file
              await fs.unlink(tmpPath).catch(() => {})
            }
          })().catch((err: any) => {
            res.writeHead(500, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ error: String(err) }))
          })
        })
      })
    },
  }
}
