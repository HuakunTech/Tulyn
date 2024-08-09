import { expect, test } from "bun:test"
import fs from "fs"
import path from "path"
import { parse, safeParse } from "valibot"
import { ExtPackageJson } from "../manifest"

const extensionsDir = path.join(__dirname, "../../../../../extensions")
const templatesDir = path.join(__dirname, "../../../../../templates")

test("Load and parse every extension in this repo", () => {
	// iterate over all extensions in extensionsDir, parse package.json
	console.log(templatesDir)
	;[extensionsDir, templatesDir].forEach((dir) => {
		fs.readdirSync(dir).forEach((extDirName) => {
			const extDir = path.join(dir, extDirName)
			const packageJsonPath = path.join(extDir, "package.json")
			console.log(packageJsonPath)
			if (!fs.existsSync(packageJsonPath)) {
				return
			}
			// read package.json

			const pkgJsonContent = fs.readFileSync(packageJsonPath, "utf-8")
			const pkgJson = JSON.parse(pkgJsonContent)
			// validate package.json
			// const result = parse(ExtPackageJson, pkgJson)
			const parse = safeParse(ExtPackageJson, pkgJson)
			if (parse.issues) {
				console.log(parse.issues)
			}
			expect(parse.success).toBe(true)
		})
	})
})
