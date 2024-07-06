import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import { visualizer } from "rollup-plugin-visualizer"

/** @type {import('rollup').RollupOptions} */
const config = {
  input: "index.ts", // Path to your worker file
  output: {
    file: "dist/index.js",
    format: "es"
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    terser(),
    visualizer()
  ]
}

export default config
