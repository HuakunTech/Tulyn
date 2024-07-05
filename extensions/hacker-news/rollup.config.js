import nodeResolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import webWorkerLoader from "rollup-plugin-web-worker-loader"

/** @type {import('rollup').RollupOptions} */
const config = {
  input: ["index.ts"],
  output: [
    // {
    //   dir: "dist",
    //   format: "cjs",
    //   entryFileNames: "[name].cjs",
    //   chunkFileNames: "[name]-[hash].js",
    //   preserveModules: true,
    //   preserveModulesRoot: "src"
    // },
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].js",
      chunkFileNames: "[name]-[hash].js",
      preserveModules: true,
    }
  ],
  // treeshake: true,
  treeshake: true,
  plugins: [
    typescript(),
    // terser(),
    webWorkerLoader(),
    // nodeResolve()
  ]
}

export default config
