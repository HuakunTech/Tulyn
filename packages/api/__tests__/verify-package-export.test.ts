import path from "path"
import { expect, test } from "bun:test"
import * as v from "valibot"

test("Verify Package Export Path", async () => {
  const pkgRoot = path.join(__dirname, "..")
  const pkgJsonPath = path.join(pkgRoot, "package.json")
  const file = Bun.file(pkgJsonPath)
  const pkgJson = await file.json()
  const exports = pkgJson["exports"]
  Object.entries(exports).forEach(([key, value]) => {
    const exportPaths = v.parse(v.record(v.string(), v.string()), value)
    Object.values(exportPaths).forEach(async (_path: string) => {
      const resolvedPath = path.join(pkgRoot, _path)
      expect(await Bun.file(resolvedPath).exists()).toBe(true)
    })
  })
})
