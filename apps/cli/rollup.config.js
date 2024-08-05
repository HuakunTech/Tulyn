import json from "@rollup/plugin-json"
import replace from "@rollup/plugin-replace"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import { visualizer } from "rollup-plugin-visualizer"

/** @type {import('rollup').RollupOptions} */
const config = {
	input: "cli.ts", // Path to your worker file
	output: {
		file: "dist/cli.js",
		format: "esm"
	},
	plugins: [
		replace({
			preventAssignment: true,
			"process.env.NODE_ENV": "'production'"
		}),
		json(),
		typescript(),
		terser(),
		visualizer()
	]
}

export default config
