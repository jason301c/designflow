import fs from "fs"
import os from "os"
import path from "path"
import { fileURLToPath } from "url"
import { build } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { designflowPlugin } from "../runtime/vite-plugin"
import { buildDevHtml } from "./dev"
import { buildCoreAliases, linkFilesystemDeps } from "./resolve"
import type { Plugin } from "vite"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface ExportOptions {
  dir: string
  output: string
  /** Suppress console output (used when called from dev server endpoint) */
  silent?: boolean
}

/**
 * Inlines public/ assets referenced as "/filename.ext" into data URIs.
 */
function inlinePublicAssets(html: string, publicDir: string): string {
  return html.replace(/(["'])\/([\w.-]+\.\w+)\1/g, (match, quote, filename) => {
    const filePath = path.join(publicDir, filename)
    if (!fs.existsSync(filePath)) return match
    const ext = path.extname(filename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
      ".ico": "image/x-icon",
    }
    const mime = mimeTypes[ext]
    if (!mime) return match
    const data = fs.readFileSync(filePath)
    const b64 = data.toString("base64")
    return `${quote}data:${mime};base64,${b64}${quote}`
  })
}

/**
 * Vite plugin that inlines all JS/CSS chunks and public assets into the HTML for a single-file export.
 */
function singleFilePlugin(publicDir: string): Plugin {
  return {
    name: "designflow-singlefile",
    enforce: "post",
    generateBundle(_options, bundle) {
      // Find the HTML asset
      let htmlKey: string | undefined
      for (const key of Object.keys(bundle)) {
        if (key.endsWith(".html")) {
          htmlKey = key
          break
        }
      }
      if (!htmlKey) return

      const htmlAsset = bundle[htmlKey]
      if (htmlAsset.type !== "asset") return
      let html = htmlAsset.source as string

      // Collect all CSS and JS from bundle
      const cssBlocks: string[] = []
      const jsBlocks: string[] = []

      for (const [key, item] of Object.entries(bundle)) {
        if (item.type === "asset" && key.endsWith(".css")) {
          cssBlocks.push(item.source as string)
          delete bundle[key]
        } else if (item.type === "chunk" && key.endsWith(".js")) {
          jsBlocks.push(item.code)
          delete bundle[key]
        }
      }

      // Strip existing script and link tags referencing assets
      html = html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, "")
      html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/g, "")

      // Inline public assets as data URIs (before JS injection to avoid mangling JS strings)
      html = inlinePublicAssets(html, publicDir)

      // Use lastIndexOf for injection points to avoid matching tags inside JS string literals
      // Inject inlined CSS before </head>
      if (cssBlocks.length > 0) {
        const cssInlined = cssBlocks.map(css => `<style>${css}</style>`).join("\n")
        const headIdx = html.lastIndexOf("</head>")
        if (headIdx !== -1) {
          html = html.slice(0, headIdx) + cssInlined + "\n" + html.slice(headIdx)
        }
      }

      // Inject inlined JS before </body>, escaping closing tags and inlining public assets in JS
      if (jsBlocks.length > 0) {
        const jsInlined = jsBlocks
          .map(js => {
            // Inline public assets referenced in JS (e.g. src="/github.svg" in React components)
            let processed = inlinePublicAssets(js, publicDir)
            processed = processed
              .replace(/<\/script/gi, "<\\/script")
              .replace(/<\/body/gi, "<\\/body")
              .replace(/<\/head/gi, "<\\/head")
            return `<script type="module">${processed}</script>`
          })
          .join("\n")
        const bodyIdx = html.lastIndexOf("</body>")
        if (bodyIdx !== -1) {
          html = html.slice(0, bodyIdx) + jsInlined + "\n" + html.slice(bodyIdx)
        }
      }

      htmlAsset.source = html
    },
  }
}

export async function runExport(options: ExportOptions): Promise<void> {
  const { dir, output, silent } = options
  const resolvedDir = path.resolve(dir)

  // Validate wireframes directory exists
  if (!fs.existsSync(resolvedDir)) {
    throw new Error(
      `Wireframes directory not found: ${resolvedDir}\nRun "designflow init --dir ${dir}" first.`,
    )
  }

  // Resolve package root
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

  const html = buildDevHtml({ hasStylesCSS, projectName, exportMode: true })

  // Map core packages to designflow's bundled copies
  const coreAliases = buildCoreAliases()

  // Create per-package symlinks for deps that non-Vite resolvers need
  const cleanupDeps = linkFilesystemDeps(resolvedDir)

  // Use a temp dir for both the input HTML and build output
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "designflow-export-"))

  // Write index.html to wireframes dir temporarily (Vite needs it as root-relative input)
  const wireframesHtml = path.join(resolvedDir, "index.html")
  const hadExistingHtml = fs.existsSync(wireframesHtml)
  fs.writeFileSync(wireframesHtml, html)

  try {
    await build({
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
          resolveId(id) {
            if (id === "/@designflow/app") return "\0@designflow/app"
          },
          load(id) {
            if (id === "\0@designflow/app") {
              return `export { App } from "${appPath}"`
            }
          },
        },
        singleFilePlugin(path.join(resolvedDir, "public")),
      ],
      build: {
        outDir: tmpDir,
        emptyOutDir: true,
        assetsInlineLimit: Number.MAX_SAFE_INTEGER,
        rollupOptions: {
          input: wireframesHtml,
          onwarn(warning, defaultHandler) {
            // Suppress "use client" directive warnings from @xyflow/react
            if (warning.code === "MODULE_LEVEL_DIRECTIVE") return
            defaultHandler(warning)
          },
        },
      },
      logLevel: silent ? "silent" : "warn",
    })

    // Find the output HTML
    const builtHtml = path.join(tmpDir, "index.html")
    if (fs.existsSync(builtHtml)) {
      const outputPath = path.resolve(output)
      const outputDir = path.dirname(outputPath)
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
      fs.copyFileSync(builtHtml, outputPath)
      if (!silent) {
        console.log(`\n  Exported to ${outputPath}\n`)
      }
    } else {
      throw new Error("Build completed but output HTML not found")
    }
  } finally {
    // Clean up the temp index.html from wireframes dir
    if (!hadExistingHtml && fs.existsSync(wireframesHtml)) {
      try { fs.unlinkSync(wireframesHtml) } catch {}
    }
    cleanupDeps()
    try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch {}
  }
}
