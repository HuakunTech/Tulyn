import path from "path"
import fs from "fs-extra"
import { getRootDir, isProduction } from "../src/constants"

/**
 * Obtain the current package verisons of all packages in the monorepo
 * This function is used only in development mode
 * @returns
 */
export function findPkgVersions() {
	if (isProduction) {
		throw new Error("This function is only available in development mode")
	}
	const pkgVersions: Record<string, string> = {}
	const root = getRootDir()
	const repoRoot = path.join(root, "../../")
	const searchFolders = [
		path.join(repoRoot, "apps"),
		path.join(repoRoot, "packages"),
		path.join(repoRoot, "packages", "component-lib")
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
	return pkgVersions
}
