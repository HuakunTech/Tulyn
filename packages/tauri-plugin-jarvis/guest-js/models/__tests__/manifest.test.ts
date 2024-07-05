import fs from "fs"
import { join } from "path"
import { expect, test } from "bun:test"
import { ExtPackageJson } from "../manifest"

test("Load extension manifest in this repo", () => {
  const extensionsDir = join(__dirname, "../../../../../vendors/extensions/extensions")
  console.log(extensionsDir)

  for (const extJsonPath of [
    join(extensionsDir, "qrcode/package.json"),
    join(extensionsDir, "ip-info/package.json"),
    join(extensionsDir, "jwt/package.json"),
    join(extensionsDir, "download-twitter-video/package.json"),
    join(extensionsDir, "video-processor/package.json")
  ]) {
    const manifestStr = fs.readFileSync(extJsonPath).toString()
    ExtPackageJson.parse(JSON.parse(manifestStr))
  }
})
