import path from "path"
import fs from "fs-extra"
import { getRootDir } from "../src/constants"
import { cleanExtension, patchManifestJsonSchema, patchPkgJsonDep } from "../src/patch"

const distPath = path.join(getRootDir(), "dist")
/* -------------------------------------------------------------------------- */
/*                              Clean Dist Folder                             */
/* -------------------------------------------------------------------------- */
for (const p of fs.readdirSync(path.join(distPath, "templates"))) {
	cleanExtension(path.join(distPath, "templates", p))
}

/* -------------------------------------------------------------------------- */
/*                               Patch Templates                              */
/* -------------------------------------------------------------------------- */
for (const p of fs.readdirSync(path.join(distPath, "templates"))) {
	const pkgJsonPath = path.join(distPath, "templates", p, "package.json")
	if (fs.existsSync(pkgJsonPath)) {
		/* ----------------------- Patch Package Dependencies ----------------------- */
		// Replace local dependencies (workspace:*) with real dependencies
		patchPkgJsonDep(pkgJsonPath)
		/* ----------------------- Patch Manifest JSON Schema ----------------------- */
		// Replace local template with remote schema
		patchManifestJsonSchema(pkgJsonPath)
	}
}
