import cac from "cac"
import { runInit } from "../src/cli/init"
import { runDev } from "../src/cli/dev"

const cli = cac("designflow")

cli
  .command("init", "Scaffold wireframes directory with example screens")
  .option("--dir <dir>", "Target directory", { default: "./wireframes" })
  .option("--tailwind", "Generate Tailwind config", { default: false })
  .option("--name <name>", "Project name")
  .action(async (options) => {
    try {
      await runInit({ dir: options.dir, tailwind: options.tailwind, name: options.name })
      console.log(`Scaffolded wireframes in ${options.dir}`)
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  })

cli
  .command("dev", "Start the canvas dev server")
  .option("--dir <dir>", "Wireframes directory", { default: "./wireframes" })
  .option("--port <port>", "Dev server port", { default: 4800 })
  .action(async (options) => {
    try {
      await runDev({ dir: options.dir, port: Number(options.port) })
    } catch (err: any) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  })

cli.help()
cli.version("0.1.0")
cli.parse()
