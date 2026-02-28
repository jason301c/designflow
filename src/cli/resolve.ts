import fs from "fs"
import path from "path"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

/**
 * Packages aliased via Vite's resolve.alias — always resolve to
 * designflow's bundled copies to prevent duplicates.
 */
const ALIAS_PACKAGES = [
  "react",
  "react-dom",
  "@xyflow/react",
  "@xyflow/system",
  "html-to-image",
  "use-sync-external-store",
] as const

/**
 * Packages that non-Vite resolvers need from the filesystem.
 * @tailwindcss/vite uses enhanced-resolve (not Vite's resolver) to find
 * tailwindcss from the CSS file's directory, so resolve.alias won't help.
 * We create per-package symlinks for these — targeted and non-conflicting
 * with user-installed packages.
 */
const FILESYSTEM_PACKAGES = [
  "tailwindcss",
] as const

/**
 * Walks up from a resolved entry point to find the nearest directory
 * containing package.json.
 */
function findPackageRoot(entryPoint: string): string {
  let dir = path.dirname(entryPoint)
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return dir
    }
    dir = path.dirname(dir)
  }
  throw new Error(`Cannot find package root from ${entryPoint}`)
}

/**
 * Resolves a package name to its root directory. Tries direct resolution
 * first, then falls back to resolving from @xyflow/react's context
 * (needed for @xyflow/system under pnpm strict mode).
 */
function resolvePackageDir(pkg: string): string {
  try {
    return findPackageRoot(require.resolve(pkg))
  } catch {
    // Under pnpm strict mode, transitive deps like @xyflow/system
    // are only resolvable from their parent package's context
    const parentEntry = require.resolve("@xyflow/react")
    const parentRequire = createRequire(parentEntry)
    return findPackageRoot(parentRequire.resolve(pkg))
  }
}

/**
 * Builds a resolve.alias map pointing core packages to absolute paths
 * within designflow's own node_modules. User-installed packages in the
 * wireframes directory resolve normally; these aliases ensure singletons
 * for React, React Flow, etc.
 */
export function buildCoreAliases(): Record<string, string> {
  const aliases: Record<string, string> = {}
  for (const pkg of ALIAS_PACKAGES) {
    aliases[pkg] = resolvePackageDir(pkg)
  }
  return aliases
}

/**
 * Creates per-package symlinks in wireframes/node_modules/ for packages
 * that need filesystem-level resolution (e.g. by @tailwindcss/vite's
 * enhanced-resolve). Only creates symlinks for packages NOT already
 * installed by the user. Returns a cleanup function.
 */
export function linkFilesystemDeps(wireframesDir: string): () => void {
  const created: string[] = []
  const nodeModules = path.join(wireframesDir, "node_modules")

  for (const pkg of FILESYSTEM_PACKAGES) {
    const target = path.join(nodeModules, pkg)
    if (!fs.existsSync(target)) {
      const source = resolvePackageDir(pkg)
      fs.mkdirSync(nodeModules, { recursive: true })
      fs.symlinkSync(source, target, "junction")
      created.push(target)
    }
  }

  return () => {
    for (const link of created) {
      try { fs.unlinkSync(link) } catch {}
    }
    // Remove node_modules dir if we created it and it's now empty
    try {
      const remaining = fs.readdirSync(nodeModules)
      if (remaining.length === 0) fs.rmdirSync(nodeModules)
    } catch {}
  }
}
