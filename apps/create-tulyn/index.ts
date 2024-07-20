#!/usr/bin/env node
import path from "path"
import { input, select } from "@inquirer/prompts"
import chalk from "chalk"
import { Command, Option } from "commander"
import fs from "fs-extra"
import pkgJson from "./package.json"
import { getTemplateRoot } from "./src/constants"
import { cleanExtension, patchApiPkg, patchInstallAPI, patchManifestSchema } from "./src/patch"

const cwd = process.cwd()
const templateRoot = getTemplateRoot()
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
    new Option("-t, --template <template>", "Extension Template").choices(["react", "template"])
  )
  .addOption(new Option("-n, --name <name>", "Extension Name"))
  .addOption(new Option("-f, --force", "Overwrite existing files").default(false))
  .addOption(new Option("-o, --outdir <outdir>", "Output directory").default(cwd))
  .parse(process.argv)
type Template = "react" | "template"
const options = program.opts<{
  template?: Template
  outdir: string
  force: boolean
  name?: string
}>()
let template: Template | undefined = options.template
let name = options.name
console.log(options)

const outdir = path.resolve(options.outdir)
console.info(`${chalk.blue("Outdir: ")}${outdir}`)
if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir, { recursive: true })
}

function copyTemplate(templateDir: string, targetFolderName: string) {
  if (!fs.existsSync(templateDir)) {
    console.error(`Worker Extension Template not found at ${templateDir}`)
    process.exit(1)
  }
  console.info(`${chalk.blue("Template Dir:")} ${templateDir}`)
  const destDir = path.join(outdir, targetFolderName)
  if (fs.existsSync(destDir)) {
    if (!options.force) {
      console.error(`Destination directory already exists: ${destDir}`)
      process.exit(1)
    } else {
      fs.removeSync(destDir)
    }
  }
  fs.mkdirSync(destDir, { recursive: true })
  console.info(
    `Template copied from \n\t${chalk.blue(templateDir)} \nto \n\t${chalk.blue(destDir)}`
  )
  fs.copySync(templateDir, destDir)
  return destDir
}

;(async function () {
  if (!template) {
    template = await select({
      message: "Select an Extension Template",
      choices: [
        {
          name: "Preset Template",
          value: "template",
          description:
            "Write regular TypeScript logic in OOP manner to render extension UI from some presets. "
        },
        {
          name: "React Custom UI",
          value: "react",
          description:
            "Extension will be rendered within iframe as a regular web app. The UI can be arbitrarily complex. Choose this if you want to use React to build complex UI."
        }
      ]
    })
  }
  if (!name) {
    name = await input({
      message: "Enter Extension Name",
      default: "tulyn-extension"
    })
  }

  if (template === "template") {
    const destDir = copyTemplate(path.join(templateRoot, "template-ext-worker"), name)
    cleanExtension(destDir)
    const pkgJsonPath = path.join(destDir, "package.json")
    patchManifestSchema(pkgJsonPath)
    patchApiPkg(pkgJsonPath)
    patchInstallAPI(destDir)
  } else if (template === "react") {
    const destDir = copyTemplate(path.join(templateRoot, "template-ext-react"), name)
    cleanExtension(destDir)
    const pkgJsonPath = path.join(destDir, "package.json")
    patchManifestSchema(pkgJsonPath)
    patchApiPkg(pkgJsonPath)
    patchInstallAPI(destDir)
  } else {
    console.error("Invalid template")
    process.exit(1)
  }
})()
