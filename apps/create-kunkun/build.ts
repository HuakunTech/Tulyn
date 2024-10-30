import path from "path"
import { $ } from "bun"
import chalk from "chalk"
import fs from "fs-extra"
import getFolderSize from "get-folder-size"
import { getRootDir } from "./src/constants"
import { cleanExtension, patchManifestJsonSchema, patchPkgJsonDep } from "./src/patch"
import { tarCompress } from "./src/utils"

await $`rm -rf dist`
await $`bun build index.ts --outfile=dist/index.mjs --target node`.env({
	NODE_ENV: "production"
})
console.log("build done")

/* -------------------------------------------------------------------------- */
/*                                 Post Build                                 */
/* -------------------------------------------------------------------------- */

const distPath = path.join(getRootDir(), "dist")
const distTemplatesPath = path.join(distPath, "templates")
const tmpDistTemplatesPath = path.join(distPath, "tmp-templates")
console.log("distPath", distPath)
console.log("distTemplatesPath", distTemplatesPath)
console.log("tmpDistTemplatesPath", tmpDistTemplatesPath)

// clear distTemplatesPath
fs.emptyDirSync(distTemplatesPath)
fs.emptyDirSync(tmpDistTemplatesPath)
console.log("emptyDirSync done")

/* -------------------------------------------------------------------------- */
/*                   copy ../../templates to dist/templates                   */
/* -------------------------------------------------------------------------- */
console.log(getRootDir())

const templatesPath = path.join(getRootDir(), "../..", "templates")
fs.copySync(templatesPath, tmpDistTemplatesPath, { dereference: true })
console.log(`Copy ${templatesPath} to ${tmpDistTemplatesPath} done`)
/* -------------------------------------------------------------------------- */
/*                              Clean Dist Folder                             */
/* -------------------------------------------------------------------------- */
for (const p of fs.readdirSync(tmpDistTemplatesPath)) {
	console.log("Clean Extension", path.join(tmpDistTemplatesPath, p))
	cleanExtension(path.join(tmpDistTemplatesPath, p))
}
console.log("Clean Extension done")
/* -------------------------------------------------------------------------- */
/*                               Patch Templates                              */
/* -------------------------------------------------------------------------- */
for (const p of fs.readdirSync(tmpDistTemplatesPath)) {
	const pkgJsonPath = path.join(tmpDistTemplatesPath, p, "package.json")
	if (fs.existsSync(pkgJsonPath)) {
		/* ----------------------- Patch Package Dependencies ----------------------- */
		// Replace local dependencies (workspace:*) with real dependencies
		await patchPkgJsonDep(pkgJsonPath)
		/* ----------------------- Patch Manifest JSON Schema ----------------------- */
		// Replace local template with remote schema
		patchManifestJsonSchema(pkgJsonPath)
		// remove node_modules
		fs.rmdirSync(path.join(distPath, "templates", p, "node_modules"), { recursive: true })
	}
}
console.log("Patch Templates done")
/* -------------------------------------------------------------------------- */
/*                                Zip Templates                               */
/* -------------------------------------------------------------------------- */
for (const p of fs.readdirSync(tmpDistTemplatesPath)) {
	const src = path.join(tmpDistTemplatesPath, p)
	// skip if src is not a directory
	if (!fs.statSync(src).isDirectory()) {
		continue
	}
	const dest = path.join(distTemplatesPath, `${p}.tgz`)
	console.log(`${chalk.green("Zipping")} ${chalk.blue(src)} to ${chalk.blue(dest)}`)
	await tarCompress(src, dest)
}
console.log("Zip Templates done")

fs.rmSync(tmpDistTemplatesPath, { recursive: true })

// get total folder size of distTemplatesPath
const size = await getFolderSize.loose(distTemplatesPath)
console.log(`dist size ${(size / 1000 / 1000).toFixed(2)} MB`)
console.log("Clean tmpDistTemplatesPath done")
