import type { Plugin } from "vite"
import path from "path"
import { scanScreens } from "./screen-scanner"

export interface DesignflowPluginOptions {
  dir: string
}

const VIRTUAL_THEME = "virtual:designflow/theme"
const VIRTUAL_SCREENS = "virtual:designflow/screens"
const RESOLVED_THEME = "\0" + VIRTUAL_THEME
const RESOLVED_SCREENS = "\0" + VIRTUAL_SCREENS

export function designflowPlugin(options: DesignflowPluginOptions): Plugin {
  const { dir } = options

  return {
    name: "designflow",

    resolveId(id: string) {
      if (id === VIRTUAL_THEME) return RESOLVED_THEME
      if (id === VIRTUAL_SCREENS) return RESOLVED_SCREENS
      return undefined
    },

    async load(id: string) {
      if (id === RESOLVED_THEME) {
        const themePath = path.resolve(dir, "designflow.theme.ts")
        return `
          import theme from "${themePath}"
          import { generateThemeCSS } from "${path.resolve(__dirname, "theme-loader")}"
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
          .map((s, i) => `import Screen${i} from "${s.filePath}"`)
          .join("\n")
        const entries = screens
          .map((s, i) => `  "${s.id}": Screen${i}`)
          .join(",\n")
        return `${imports}\nexport default {\n${entries}\n}`
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

      server.watcher.add([screensDir, themePath])

      server.watcher.on("change", (changedPath: string) => {
        if (changedPath.startsWith(screensDir) || changedPath === themePath) {
          const themeModule = server.moduleGraph.getModuleById(RESOLVED_THEME)
          const screensModule =
            server.moduleGraph.getModuleById(RESOLVED_SCREENS)

          if (themeModule) {
            server.moduleGraph.invalidateModule(themeModule)
          }
          if (screensModule) {
            server.moduleGraph.invalidateModule(screensModule)
          }

          server.ws.send({ type: "full-reload" })
        }
      })
    },
  }
}
