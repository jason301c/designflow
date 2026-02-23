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
  const { dir, tailwind = false } = options

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

  // Copy template files
  const screenDir = tailwind ? "screens-tailwind" : "screens"
  const filesToCopy = [
    { src: `${screenDir}/Login.tsx`, dest: "screens/Login.tsx" },
    { src: `${screenDir}/Dashboard.tsx`, dest: "screens/Dashboard.tsx" },
    { src: `${screenDir}/Profile.tsx`, dest: "screens/Profile.tsx" },
    { src: `${screenDir}/Settings.tsx`, dest: "screens/Settings.tsx" },
    { src: `${screenDir}/Notifications.tsx`, dest: "screens/Notifications.tsx" },
    { src: "flows.ts", dest: "flows.ts" },
    { src: "designflow.theme.ts", dest: "designflow.theme.ts" },
    { src: "CLAUDE.md", dest: "CLAUDE.md" },
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
