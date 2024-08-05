import os from "os"
import path from "path"
import { getRootDir } from "@/constants"
import type { BuildResult } from "@/types"
import { buildWithDocker, buildWithDockerAndValidate } from "@/utils"
import { $ } from "bun"
import { afterAll, beforeAll, describe, expect, test } from "bun:test"
import fs from "fs-extra"

const rootDir = getRootDir()
const createKKDir = path.join(rootDir, "../create-kunkun")
// const extensionsDir = path.join(rootDir, "../extensions")
// const extensionNames = fs.readdirSync(extensionsDir)
// const extensionsDirs = extensionNames
// 	.map((name) => path.join(extensionsDir, name))
// 	.filter((p) => fs.existsSync(path.join(p, "package.json")))

const createKKDistDir = path.join(createKKDir, "dist")
const createKKIndexjsPath = path.join(createKKDistDir, "index.mjs")
const testDir = path.join(os.tmpdir(), "kunkun-cli-test")
console.log("Test Dir: ", testDir)
const templateNames = ["template", "react", "vue", "nuxt", "svelte", "sveltekit"]

fs.rmdirSync(testDir, { recursive: true })
fs.mkdirpSync(testDir)

const templateData: Record<string, { dir: string; buildResult: BuildResult }> = {}
// const extensionData: Record<string, { dir: string; buildResult: BuildResult }> = {}

await Promise.all(
	templateNames.map(async (templateName) => {
		const folderName = `${templateName}-ext`
		await $`node ${createKKIndexjsPath} --outdir ${testDir} --name ${folderName} --template ${templateName}`
		const templateDir = path.join(testDir, folderName)
		const buildResult = await buildWithDockerAndValidate(templateDir)
		templateData[templateName] = {
			dir: templateDir,
			buildResult
		}
	})
)

test("Template Exist", () => {
	Object.entries(templateData).forEach(async ([templateName, { dir }]) => {
		expect(await Bun.file(dir).exists()).toBeTrue()
	})
})

test("Build Result Tarball Exist", () => {
	Object.entries(templateData).forEach(async ([templateName, { buildResult, dir }]) => {
		const expectedTarballPath = path.join(dir, buildResult.tarballFilename)
		expect(await Bun.file(expectedTarballPath).exists()).toBeTrue()
	})
})

afterAll(() => {
	fs.rmdirSync(testDir, { recursive: true })
})
