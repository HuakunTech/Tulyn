import { $ } from "bun"

process.env.NODE_ENV = "production"

if (Bun.env.NODE_ENV !== "production") {
	console.error("This script should be run in production mode. Set NODE_ENV=production.")
	process.exit(1)
}

await $`rm -rf dist`
await Bun.build({
	entrypoints: ["./cli.ts"],
	outdir: "./dist",
	target: "node",
	minify: true
})
await $`cp -r ./src/docker ./dist/docker`
