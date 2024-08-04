import path from "path"
import fs from "fs-extra"
import * as v from "valibot"
import { getRootDir, isProduction } from "../src/constants"

export function getLatestNpmPkgInfo(pkgName: string): Promise<Record<string, any>> {
	return fetch(`https://registry.npmjs.org/${pkgName}/latest`).then((res) => res.json())
}

export function getLatestNpmPkgVersion(pkgName: string): Promise<string> {
	return getLatestNpmPkgInfo(pkgName).then(
		(data) => v.parse(v.object({ version: v.string() }), data).version
	)
}

/**
 * Obtain the current package verisons of all packages in the monorepo
 * This function is used only in development mode
 * @returns
 */
export async function findPkgVersions() {
	if (isProduction) {
		throw new Error("This function is only available in development mode")
	}
	const pkgVersions: Record<string, string> = {}
	const root = getRootDir()
	const repoRoot = path.join(root, "../../")
	const searchFolders = [
		path.join(repoRoot, "apps"),
		path.join(repoRoot, "packages"),
	]
	for (const folder of searchFolders) {
		const packages = fs.readdirSync(folder)
		// console.log("Packages: ", packages);

		for (const pkg of packages) {
			const pkgJsonPath = path.join(folder, pkg, "package.json")
			if (fs.existsSync(pkgJsonPath)) {
				const pkgJson = fs.readJsonSync(pkgJsonPath)
				pkgVersions[pkgJson.name] = pkgJson.version
			}
		}
	}
	for (const pkgName of ["@kksh/vue", "@kksh/react", "@kksh/svelte"]) {
		const version = await getLatestNpmPkgVersion(pkgName)
		pkgVersions[pkgName] = version
	}
	return pkgVersions
}
