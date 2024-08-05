import os from "os"
import path from "path"
import { getRootDir } from "@/constants"
import { buildWithDocker, buildWithDockerAndValidate } from "@/utils"
import { $ } from "bun"
import { afterAll, beforeAll, describe, expect, test } from "bun:test"
import fs from "fs-extra"

const rootDir = getRootDir()
const createKKDir = path.join(rootDir, "../create-kunkun")
const createKKDistDir = path.join(createKKDir, "dist")
const createKKIndexjsPath = path.join(createKKDistDir, "index.mjs")
const testDir = path.join(os.tmpdir(), "kunkun-cli-test")
console.log("Test Dir: ", testDir)

fs.rmdirSync(testDir, { recursive: true })
fs.mkdirpSync(testDir)

await $`node ${createKKIndexjsPath} --outdir ${testDir} --name svelte-ext --template svelte`
const templateDir = path.join(testDir, "svelte-ext")
expect(fs.existsSync(templateDir)).toBeTrue()
const buildResult = await buildWithDockerAndValidate(templateDir)
console.log(buildResult)

test("Build extension with docker", async () => {
	const expectedTarballPath = path.join(templateDir, buildResult.tarballFilename)

	expect(buildResult).toBeTruthy()
	expect(await Bun.file(expectedTarballPath).exists()).toBeTrue()
})

afterAll(() => {
	fs.rmdirSync(testDir, { recursive: true })
})
