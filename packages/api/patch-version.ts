import fs from "fs"
import { version } from "./package.json"

const versionTsContent = fs.readFileSync("./src/version.ts", "utf-8")
const lines = versionTsContent.split("\n").filter((line) => !line.includes("export const version"))
lines.push(`export const version = "${version}"\n`)
fs.writeFileSync("./src/version.ts", lines.join("\n"))
