import path from "path"
import madge from "madge"
import { buildEntries } from "./src/common-config.js"

const pkgRoot = path.join(__dirname, ".")
const paths = buildEntries.map((p) => path.join(pkgRoot, p)).map((p) => path.resolve(p))
// const madgeRes = await madge(p)
paths.forEach(async (p) => {
	// expect(await Bun.file(p).exists()).toBe(true)
	const madgeRes = await madge(p)
	console.log(madgeRes.circularGraph());
	
	// const circular = madgeRes.circular()
	// console.log(p, circular)

	// expect(madgeRes.circular()).toEqual([])
})
