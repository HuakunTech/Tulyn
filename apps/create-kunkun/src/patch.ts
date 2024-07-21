import { execSync } from "child_process"
import path from "path"
import fs from "fs-extra"

/* -------------------------------------------------------------------------- */
/*                              Worker Extension                              */
/* -------------------------------------------------------------------------- */
export function cleanExtension(dir: string) {
  let toRemove = ["node_modules", "bun.lockb", "dist", "stats.html", ".turbo"]
  toRemove = toRemove.map((folder) => path.join(dir, folder))
  toRemove.forEach((dir) => {
    if (fs.existsSync(dir)) {
      //   console.log("Removing: ", dir)
      fs.removeSync(dir)
    }
  })
}

export function patchManifestSchema(pkgJsonPath: string) {
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
  pkgJson["$schema"] = "https://extensions.jarvis.huakun.tech/schema.json"
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
}

export function patchApiPkg(pkgJsonPath: string) {
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
  delete pkgJson.dependencies["@kunkunsh/react"]
  delete pkgJson.dependencies["@kunkunsh/api"]
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
}

export function patchInstallAPI(dir: string) {
  // cd into the directory and run `npm install`, and run `npm install @kunkunsh/react`
  console.info(`Running: npm install`)
  execSync("npm install", { cwd: dir, stdio: "inherit" })
  // TODO: Uncomment the following line after @kunkunsh/react is published
  // console.info(`Running: npm install @kunkunsh/react`)
  // execSync("npm install @kunkunsh/react", { cwd: dir, stdio: "inherit" })
}
