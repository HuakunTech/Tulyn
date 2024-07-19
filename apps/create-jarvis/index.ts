import path from "path"
import select, { Separator } from "@inquirer/select"
import { Command, Option } from "commander"
import fs from "fs-extra"
import pkgJson from "./package.json"
import { rootDir, templateRoot } from "./src/constants"

const cwd = process.cwd()
console.log(`Current Working Directory: ${cwd}`)
console.log("Template Root:", templateRoot)
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
  .addOption(new Option("-o, --outdir <outdir>", "Output directory").default(cwd))
  .parse(process.argv)
type Template = "iframe" | "worker"
const options = program.opts<{ template?: Template; outdir: string }>()
let template: Template | undefined = options.template ?? "worker"
const outdir = path.resolve(options.outdir)
console.log("Outdir: ", outdir)
if (!fs.existsSync(outdir)) {
  console.error(`Output directory not found; Expected at ${outdir}`)
  process.exit(1)
}

if (template === "worker") {
  const templateDir = path.join(templateRoot, "template-ext-worker")
  if (!fs.existsSync(templateDir)) {
    console.error(`Worker Extension Template not found at ${templateDir}`)
    process.exit(1)
  }
  console.log("Template Dir: ", templateDir)
  const templateFolderName = path.basename(templateDir)
  fs.copySync(templateDir, path.join(outdir, templateFolderName), {
    filter: (src, dest) => {
      if (src.includes("node_modules")) {
        return false
      }
      return true
    }
  })
  console.log("Worker template copied to ", outdir)
  // const files = fs.readdirSync(templateDir)
  // files.forEach(file => {
  //   const src = path.join(templateDir, file)
  //   const dest = path.join(outdir, file)
  //   fs.copyFileSync(src, dest)
  //   console.log("Copied: ", src, dest)
  // })
} else if (template === "iframe") {
} else {
  console.error("Invalid template")
  process.exit(1)
}

// if (!template) {
//   template = await select({
//     message: "Select an Extension Template",
//     choices: [
//       {
//         name: "Worker",
//         value: "worker",
//         description:
//           "Write regular TypeScript logic in OOP manner to render extension UI from some presets. "
//       },
//       {
//         name: "Iframe",
//         value: "iframe",
//         description:
//           "Extension will be rendered within iframe as a regular web app. The UI can be arbitrarily complex. Choose this if you want to use React to build complex UI."
//       }
//     ]
//   })
// }
