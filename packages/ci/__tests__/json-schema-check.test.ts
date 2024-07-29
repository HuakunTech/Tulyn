import { describe, expect, test } from "bun:test"
import path from "path"
import fs from "fs-extra"
import { getExtensionsDir, getTemplatesDir } from "../utils"

describe("Every Extension and Template Should Have JSON Schema", () => {
	test("Extension Templates", () => {
		const targetDir = getTemplatesDir()
		for (const dir of fs.readdirSync(targetDir)) {
			const pkgJsonPath = path.join(targetDir, dir, "package.json")
			console.log(pkgJsonPath)
			if (!fs.existsSync(pkgJsonPath)) {
				continue
			}
			const pkgJson = fs.readJsonSync(pkgJsonPath)
			expect(pkgJson).toHaveProperty("$schema")
		}
	})
	test("Extensions", () => {
		const targetDir = getExtensionsDir()
		for (const dir of fs.readdirSync(targetDir)) {
			const pkgJsonPath = path.join(targetDir, dir, "package.json")
			console.log(pkgJsonPath)
			if (!fs.existsSync(pkgJsonPath)) {
				continue
			}
			const pkgJson = fs.readJsonSync(pkgJsonPath)
			expect(pkgJson).toHaveProperty("$schema")
		}
	})
})
