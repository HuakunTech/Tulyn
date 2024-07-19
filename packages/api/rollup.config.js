import { readFileSync } from "fs"
import { join } from "path"
import { cwd } from "process"
// import typescript from "@rollup/plugin-typescript"
import typescript from "@rollup/plugin-typescript"
import { visualizer } from "rollup-plugin-visualizer"

const pkg = JSON.parse(readFileSync(join(cwd(), "package.json"), "utf8"))

/** @type {import('rollup').RollupOptions} */
const config = {
  input: [
    "src/index.ts",
    "src/ui/index.ts",
    "src/ui/iframe.ts",
    "src/ui/worker/index.ts",
    "src/models/index.ts",
    "src/commands/index.ts"
  ],
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
    visualizer()
  ]
}

export default config
