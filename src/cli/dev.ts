import path from "path"
import { createServer } from "vite"
import { designflowPlugin } from "../runtime/vite-plugin"

export interface DevOptions {
  dir: string
  port: number
}

export async function runDev(options: DevOptions): Promise<void> {
  const { dir, port } = options
  const resolvedDir = path.resolve(dir)

  // Create the index.html content that loads the canvas app
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
    import { createRoot } from "react-dom/client"
    import { createElement } from "react"
    import { App } from "/@designflow/app"
    import config from "${path.join(resolvedDir, "flows.ts")}"
    import screens from "virtual:designflow/screens"

    const root = createRoot(document.getElementById("root"))
    root.render(createElement(App, { config: config.default || config, screens }))
  </script>
</body>
</html>`

  const server = await createServer({
    root: resolvedDir,
    server: { port },
    plugins: [
      designflowPlugin({ dir: resolvedDir }),
      {
        name: "designflow-html",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/" || req.url === "/index.html") {
              res.statusCode = 200
              res.setHeader("Content-Type", "text/html")
              res.end(html)
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
            // Re-export the App component from the designflow package
            const appPath = path.resolve(__dirname, "../app/App")
            return `export { App } from "${appPath}"`
          }
        },
      },
    ],
  })

  await server.listen()
  server.printUrls()
}
