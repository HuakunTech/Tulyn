/**
 * When running `npm install` with bun shell, it fails in bun test environment, so I simply run everything as regular ts without test()
 */
import os from "os"
import path from "path"
import { $ } from "bun"
import fs from "fs-extra"
import { getRootDir } from "../src/constants"

const testDir = path.join(os.tmpdir(), "kunkun-create-kunkun-test")
console.log("Test Dir: ", testDir)
const distDir = path.join(getRootDir(), "dist")
const indexjsPath = path.join(distDir, "index.mjs")
const templateNames = ["template", "react", "vue", "nuxt", "svelte", "sveltekit"]

fs.rmdirSync(testDir, { recursive: true })
fs.mkdirpSync(testDir)
await Promise.all(
	templateNames.map(async (templateName) => {
		const folderName = `${templateName}-ext`
		await $`node ${indexjsPath} --outdir ${testDir} --name ${folderName} --template ${templateName}`
		const templateDir = path.join(testDir, folderName)
		await $`npm install`.cwd(templateDir).text() // this doesn't work within bun test
		await $`npm run build`.cwd(templateDir).text()
		const expectedOutDir = templateName === "sveltekit" ? "build" : "dist"
		if (!fs.existsSync(path.join(templateDir, expectedOutDir))) {
			throw new Error(`Expected ${expectedOutDir} to exist`)
		}
	})
)
fs.rmdirSync(testDir, { recursive: true })
