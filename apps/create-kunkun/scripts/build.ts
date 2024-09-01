import { $ } from "bun"

await $`rm -rf dist`.env
await $`bun build index.ts --outfile=dist/index.mjs --target node`.env({
	NODE_ENV: "production"
})
