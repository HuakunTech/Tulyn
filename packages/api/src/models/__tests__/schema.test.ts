import { expect, test } from "bun:test"
import fs from "fs"
import path from "path"
import { safeParse } from "valibot"
import { ExtPackageJson } from "../manifest"

const extensionsDir = path.join(__dirname, "../../../../../extensions")

test("Load and parse every extension in this repo", () => {
	// iterate over all extensions in extensionsDir, parse package.json
	fs.readdirSync(extensionsDir).forEach((extDirName) => {
		const extDir = path.join(extensionsDir, extDirName)
		const packageJsonPath = path.join(extDir, "package.json")
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
