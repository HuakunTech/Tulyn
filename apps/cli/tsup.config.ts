import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["mod.ts", "cli.ts"],
	splitting: false,
	sourcemap: true,
	clean: true,
	dts: true,
	format: ["esm"]
})
