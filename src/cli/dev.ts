import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createServer } from "vite"
import { designflowPlugin } from "../runtime/vite-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface DevOptions {
  dir: string
  port: number
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

  // Resolve paths for the App component and package root
  const pkgRoot = path.resolve(__dirname, "../..")
  const appPath = path.resolve(__dirname, "../app/App").replace(/\\/g, "/")

  // Create the index.html content that loads the canvas app
  // Use paths relative to Vite root (the wireframes dir) and virtual modules
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DesignFlow</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Inter, system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import "virtual:designflow/theme"
    import { createRoot } from "react-dom/client"
    import { createElement } from "react"
    import { App } from "/@designflow/app"
    import config from "/flows.ts"
    import themeObj from "/designflow.theme.ts"
    import screensModule from "virtual:designflow/screens"
    import inferredEdgesModule from "virtual:designflow/inferred-edges"

    const screens = screensModule.default || screensModule
    const inferredEdges = inferredEdgesModule.default || inferredEdgesModule
    const theme = themeObj.default || themeObj
    const root = createRoot(document.getElementById("root"))
    root.render(createElement(App, { config: config.default || config, screens, inferredEdges, theme }))
  </script>
</body>
</html>`

  const server = await createServer({
    root: resolvedDir,
    plugins: [
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
    server: {
      port,
      fs: {
        allow: [resolvedDir, pkgRoot],
      },
    },
  })

  await server.listen()
  server.printUrls()
}
