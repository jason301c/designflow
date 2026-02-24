import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import { generateTailwindCSS } from "../runtime/theme-loader"
import { DEFAULT_THEME } from "../runtime/default-theme"

export interface InitOptions {
  dir: string
  tailwind?: boolean
  name?: string
}

export async function runInit(options: InitOptions): Promise<void> {
  const { dir, tailwind = true } = options

  // Check if directory already exists
  try {
    await fs.access(dir)
    throw new Error(`Directory already exists: ${dir}`)
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err
  }

  // Find templates directory — ../templates from dist/, ../../templates from src/cli/
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  let templatesDir = path.resolve(__dirname, "../templates")
  try { await fs.access(templatesDir) } catch { templatesDir = path.resolve(__dirname, "../../templates") }

  // Create directory structure
  await fs.mkdir(path.join(dir, "screens"), { recursive: true })
  await fs.mkdir(path.join(dir, "public"), { recursive: true })

  // Copy template files
  const screenDir = tailwind ? "screens-tailwind" : "screens"
  // Discover screen files dynamically from the template directory
  const screenFiles = (await fs.readdir(path.join(templatesDir, screenDir)))
    .filter((f) => f.endsWith(".tsx"))
  const filesToCopy = [
    ...screenFiles.map((f) => ({ src: `${screenDir}/${f}`, dest: `screens/${f}` })),
    { src: "flows.ts", dest: "flows.ts" },
    { src: "designflow.theme.ts", dest: "designflow.theme.ts" },
    { src: "CLAUDE.md", dest: "CLAUDE.md" },
    { src: "AGENTS.md", dest: "AGENTS.md" },
    { src: "README.md", dest: "README.md" },
    { src: "public/github.svg", dest: "public/github.svg" },
  ]

  for (const file of filesToCopy) {
    const srcPath = path.join(templatesDir, file.src)
    const destPath = path.join(dir, file.dest)
    await fs.copyFile(srcPath, destPath)
  }

  // Replace project name in flows.ts if --name was provided
  if (options.name) {
    const flowsPath = path.join(dir, "flows.ts")
    const flowsContent = await fs.readFile(flowsPath, "utf-8")
    await fs.writeFile(flowsPath, flowsContent.replace("My Designflow Project", options.name))
  }

  // Generate styles.css with Tailwind v4 @theme block if requested
  if (tailwind) {
    await fs.writeFile(path.join(dir, "styles.css"), generateTailwindCSS(DEFAULT_THEME))
  }
}
