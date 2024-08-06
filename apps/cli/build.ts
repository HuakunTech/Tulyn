import { $ } from "bun"
import fs from 'fs-extra'

process.env.NODE_ENV = "production"

if (Bun.env.NODE_ENV !== "production") {
	console.error("This script should be run in production mode. Set NODE_ENV=production.")
	process.exit(1)
}

await $`rm -rf dist`
// building with bun doesn't work with debug
// await Bun.build({
// 	entrypoints: ["./cli.ts"],
// 	outdir: "./dist",
// 	target: "node",
// 	// minify: true,
// 	format: "esm",
// 	external: ["debug"],
// })

await $`pnpm rollup -c`
// await $`cp -r ./src/docker ./dist/docker`
fs.cpSync('./src/docker', './dist/docker', {recursive: true})


