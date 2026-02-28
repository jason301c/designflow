import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createServer } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { designflowPlugin } from "../runtime/vite-plugin"
import { buildCoreAliases, linkFilesystemDeps } from "./resolve"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface DevOptions {
  dir: string
  port: number
}

export function buildDevHtml(opts: { hasStylesCSS: boolean; projectName?: string; exportMode?: boolean }): string {
  const stylesLink = opts.hasStylesCSS
    ? `\n  <link rel="stylesheet" href="/styles.css" />`
    : ""
  const title = opts.projectName ? `${opts.projectName} — DesignFlow` : "DesignFlow"

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%234488ff'/><text x='16' y='22' font-size='18' font-weight='700' fill='white' text-anchor='middle' font-family='system-ui'>df</text></svg>" />
  <style>
    @layer base {
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: Inter, system-ui, sans-serif; }
    }
  </style>${stylesLink}
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import "virtual:designflow/theme"
    import { createRoot } from "react-dom/client"
    import { createElement } from "react"
    import { App } from "/@designflow/app"
    import config from "/flows.ts"
    import screensModule from "virtual:designflow/screens"
    import inferredEdgesModule from "virtual:designflow/inferred-edges"

    const screens = screensModule.default || screensModule
    const inferredEdges = inferredEdgesModule.default || inferredEdgesModule
    const root = createRoot(document.getElementById("root"))
    root.render(createElement(App, { config: config.default || config, screens, inferredEdges${opts.exportMode ? ", exportMode: true" : ""} }))
  </script>
</body>
</html>`
}

export async function runDev(options: DevOptions): Promise<void> {
  const { dir, port } = options
  const resolvedDir = path.resolve(dir)

  // Validate wireframes directory exists
  if (!fs.existsSync(resolvedDir)) {
    throw new Error(
      `Wireframes directory not found: ${resolvedDir}\nRun "designflow init --dir ${dir}" first.`,
    )
  }

  // Resolve package root — ../from dist/, ../../ from src/cli/
  let pkgRoot = path.resolve(__dirname, "..")
  if (!fs.existsSync(path.join(pkgRoot, "package.json"))) {
    pkgRoot = path.resolve(__dirname, "../..")
  }
  const appPath = path.resolve(pkgRoot, "src/app/App").replace(/\\/g, "/")

  // Auto-detect styles.css for Tailwind support
  const hasStylesCSS = fs.existsSync(path.join(resolvedDir, "styles.css"))

  // Extract project name from flows.ts
  let projectName: string | undefined
  const flowsPath = path.join(resolvedDir, "flows.ts")
  if (fs.existsSync(flowsPath)) {
    const flowsContent = fs.readFileSync(flowsPath, "utf-8")
    const nameMatch = flowsContent.match(/name:\s*["']([^"']+)["']/)
    if (nameMatch) projectName = nameMatch[1]
  }

  const html = buildDevHtml({ hasStylesCSS, projectName })

  // Map core packages to designflow's bundled copies so user-installed
  // packages in wireframes/node_modules don't cause duplicate React, etc.
  const coreAliases = buildCoreAliases()

  // Create per-package symlinks for deps that non-Vite resolvers need
  // from the filesystem (e.g. tailwindcss for @tailwindcss/vite)
  const cleanupDeps = linkFilesystemDeps(resolvedDir)
  process.on("exit", cleanupDeps)
  process.on("SIGINT", () => { cleanupDeps(); process.exit() })
  process.on("SIGTERM", () => { cleanupDeps(); process.exit() })

  const server = await createServer({
    root: resolvedDir,
    esbuild: {
      jsx: "automatic",
    },
    resolve: {
      alias: coreAliases,
    },
    plugins: [
      tailwindcss(),
      designflowPlugin({ dir: resolvedDir }),
      {
        name: "designflow-html",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === "/" || req.url === "/index.html") {
              // Transform HTML through Vite's plugin pipeline
              const transformed = await server.transformIndexHtml(
                req.url,
                html,
              )
              res.statusCode = 200
              res.setHeader("Content-Type", "text/html")
              res.end(transformed)
              return
            }
            next()
          })
        },
        resolveId(id) {
          if (id === "/@designflow/app") return "\0@designflow/app"
        },
        load(id) {
          if (id === "\0@designflow/app") {
            return `export { App } from "${appPath}"`
          }
        },
      },
    ],
    // Pre-bundle CJS deps that @xyflow/react and react need
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@xyflow/react",
        "@xyflow/system",
        "use-sync-external-store/shim/with-selector",
      ],
    },
    server: {
      port,
      fs: {
        allow: [resolvedDir, pkgRoot, ...Object.values(coreAliases)],
      },
    },
  })

  await server.listen()
  server.printUrls()
}
