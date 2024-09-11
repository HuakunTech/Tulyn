import { ExtPackageJson } from "@kksh/api/models"
import * as v from "valibot"

const pkgJson = await Bun.file(
	"/Users/hacker/Dev/projects/kunkun/kunkun/extensions/demo-worker-template-ext/package.json"
).text()
const parsed = v.parse(ExtPackageJson, JSON.parse(pkgJson))
console.log(parsed)
