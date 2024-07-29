import { kununWorkerTemplateExtensionRollupPlugin } from "@kksh/api/dev"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
// import typescript from "rollup-plugin-typescript2"
import typescript from "@rollup/plugin-typescript"
import { visualizer } from "rollup-plugin-visualizer"

/** @type {import('rollup').RollupOptions} */
const config = {
	input: "index.ts", // Path to your worker file
	output: {
		file: "dist/index.js",
		format: "es"
	},
	plugins: [
		typescript(),
		resolve({
			browser: true
		}),
		commonjs(),
		terser(),
		visualizer(),
		kununWorkerTemplateExtensionRollupPlugin()
	]
}

export default config
