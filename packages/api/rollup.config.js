import { readFileSync } from "fs"
import { join } from "path"
import { cwd } from "process"
import terser from "@rollup/plugin-terser"
// import typescript from "@rollup/plugin-typescript"
import typescript from "@rollup/plugin-typescript"
import { visualizer } from "rollup-plugin-visualizer"
import { buildEntries } from "./src/common-config.js"

const pkg = JSON.parse(readFileSync(join(cwd(), "package.json"), "utf8"))

/** @type {import('rollup').RollupOptions} */
const config = {
  input: buildEntries,
  output: [
    {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].cjs",
      chunkFileNames: "[name]-[hash].js",
      preserveModules: true,
      preserveModulesRoot: "src"
    },
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].js",
      chunkFileNames: "[name]-[hash].js",
      preserveModules: true,
      preserveModulesRoot: "src"
    }
  ],
  treeshake: true,
  plugins: [
    typescript({
      // compilerOptions: {
      //   declaration: true,
      //   declarationMap: true
      // }
    }),
    terser(),
    visualizer()
  ]
}

export default config
