import path from "path"
import { describe, expect, test } from "bun:test"
import madge from "madge"
import * as v from "valibot"
import { buildEntries } from "../src/common-config.js"

describe("Verify Bundled Package", () => {
  test("Test Circular Dependency", async () => {
    const pkgRoot = path.join(__dirname, "..")
    const paths = buildEntries.map((p) => path.join(pkgRoot, p)).map((p) => path.resolve(p))
    // expect each paths to exist
    paths.forEach(async (p) => {
      expect(await Bun.file(p).exists()).toBe(true)
      const madgeRes = await madge(p)
      expect(madgeRes.circular()).toEqual([])
    })
  })

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
        console.log(resolvedPath)
        expect(await Bun.file(resolvedPath).exists()).toBe(true)
      })
    })
  })
})
