import { defineConfig } from "tsup"

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/ui/index.ts",
		"src/ui/iframe.ts",
		"src/ui/worker/index.ts",
		"src/models/index.ts",
		"src/commands/index.ts"
	],
	splitting: false,
	sourcemap: true,
	clean: true,
	dts: true,
	format: ["cjs", "esm"]
})
