import { execSync } from "child_process"
import path from "path"
import fs from "fs-extra"

/* -------------------------------------------------------------------------- */
/*                              Worker Extension                              */
/* -------------------------------------------------------------------------- */
export function cleanWorkerExtension(dir: string) {
  let toRemove = ["node_modules", "bun.lockb", "dist", "stats.html"]
  toRemove = toRemove.map((folder) => path.join(dir, folder))
  toRemove.forEach((dir) => {
    if (fs.existsSync(dir)) {
      //   console.log("Removing: ", dir)
      fs.removeSync(dir)
    }
  })
}

export function patchWatcherExtension(dir: string) {
  console.info("Patching package.json")
  const pkgJsonPath = path.join(dir, "package.json")
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"))
  pkgJson["$schema"] = "https://extensions.jarvis.huakun.tech/schema.json"
  // remove jarvis-api from dependencies
  delete pkgJson.dependencies["jarvis-api"]
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
  // cd into the directory and run `npm install`, and run `npm install jarvis-api`
  console.info(`Running: npm install`)
  execSync("npm install", { cwd: dir, stdio: "inherit" })
  console.info(`Running: npm install jarvis-api`)
  execSync("npm install jarvis-api", { cwd: dir, stdio: "inherit" })
}
