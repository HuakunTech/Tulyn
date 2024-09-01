import { watch } from "fs"
import { join } from "path"
import { prettyBytes, sendRefreshWorkerExtensionRequest } from "@kksh/api/dev"

async function build() {
	await Bun.build({
		entrypoints: ["./src/index.ts"],
		outdir: "./dist",
		minify: true,
		target: "browser",
		splitting: false
	})
	await sendRefreshWorkerExtensionRequest()
	console.log("Build size:", prettyBytes(Bun.file("dist/index.js").size))
}

const srcDir = join(import.meta.dir, "src")

if (Bun.argv.includes("dev")) {
	console.log(`Watching ${srcDir} for changes...`)
	watch(srcDir, { recursive: true }, async (event, filename) => {
		await build()
	})
} else {
	await build()
}
