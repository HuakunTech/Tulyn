import path from "path"
import select, { Separator } from "@inquirer/select"
import chalk from "chalk"
import { Command, Option } from "commander"
import fs from "fs-extra"
import pkgJson from "./package.json"
import { rootDir, templateRoot } from "./src/constants"
import { cleanWorkerExtension, patchWatcherExtension } from "./src/patch"

const cwd = process.cwd()
console.info(`${chalk.blue("Current Working Directory")}: ${cwd}`)
console.info(`${chalk.blue("Template Root:")}`, templateRoot)
if (!fs.existsSync(templateRoot)) {
  console.error(`Template directory not found; Expected at ${templateRoot}`)
  process.exit(1)
}
const program = new Command()

program
  .version(pkgJson.version)
  .addOption(
    new Option("-t, --template <template>", "Extension Template").choices(["iframe", "worker"])
  )
  .addOption(new Option("-f, --force", "Overwrite existing files").default(false))
  .addOption(new Option("-o, --outdir <outdir>", "Output directory").default(cwd))
  .parse(process.argv)
type Template = "iframe" | "worker"
const options = program.opts<{ template?: Template; outdir: string; force: boolean }>()
let template: Template | undefined = options.template
const outdir = path.resolve(options.outdir)
console.info(`${chalk.blue("Outdir: ")}${outdir}`)
if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir, { recursive: true })
}

;(async function () {
  if (!template) {
    template = await select({
      message: "Select an Extension Template",
      choices: [
        {
          name: "Worker",
          value: "worker",
          description:
            "Write regular TypeScript logic in OOP manner to render extension UI from some presets. "
        },
        {
          name: "Iframe",
          value: "iframe",
          description:
            "Extension will be rendered within iframe as a regular web app. The UI can be arbitrarily complex. Choose this if you want to use React to build complex UI."
        }
      ]
    })
  }

  if (template === "worker") {
    const templateDir = path.join(templateRoot, "template-ext-worker")
    if (!fs.existsSync(templateDir)) {
      console.error(`Worker Extension Template not found at ${templateDir}`)
      process.exit(1)
    }
    console.info(`${chalk.blue("Template Dir:")} ${templateDir}`)
    const templateFolderName = path.basename(templateDir)
    const destDir = path.join(outdir, templateFolderName)
    if (fs.existsSync(destDir)) {
      if (!options.force) {
        console.error(`Destination directory already exists: ${destDir}`)
        process.exit(1)
      } else {
        fs.removeSync(destDir)
      }
    }
    fs.mkdirSync(destDir, { recursive: true })
    console.info(`Worker template copied from ${chalk.blue(templateDir)} to ${chalk.blue(destDir)}`)
    fs.copySync(templateDir, destDir)
    cleanWorkerExtension(destDir)
    patchWatcherExtension(destDir)
  } else if (template === "iframe") {
  } else {
    console.error("Invalid template")
    process.exit(1)
  }
})()
