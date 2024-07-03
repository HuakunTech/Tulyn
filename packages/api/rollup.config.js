import { readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
// import typescript from "@rollup/plugin-typescript";
import typescript from "rollup-plugin-typescript2";

const pkg = JSON.parse(readFileSync(join(cwd(), "package.json"), "utf8"));

// export default [
//   {
//     input: "index.ts",
//     output: [
//       {
//         file: "./dist/index.js",
//         format: "esm",
//       },
//     ],
//     plugins: [
//       typescript({
//         declaration: true,
//         declarationDir: `./.`,
//       }),
//     ],
//     external: [
//       /^@tauri-apps\/api/,
//       ...Object.keys(pkg.dependencies || {}),
//       ...Object.keys(pkg.peerDependencies || {}),
//     ],
//   },
//   {
//     input: "ui/index.ts",
//     output: [
//       {
//         file: "./dist/ui.js",
//         format: "esm",
//       },
//     ],
//     plugins: [
//       typescript({
//         declaration: true,
//         declarationDir: `./.`,
//       }),
//     ],
//     external: [
//       /^@tauri-apps\/api/,
//       ...Object.keys(pkg.dependencies || {}),
//       ...Object.keys(pkg.peerDependencies || {}),
//     ],
//   },
//   {
//     input: "models/index.ts",
//     output: [
//       {
//         file: "./dist/models.js",
//         format: "esm",
//       },
//     ],
//     plugins: [
//       typescript({
//         declaration: true,
//         declarationDir: `./.`,
//       }),
//     ],
//     external: [
//       /^@tauri-apps\/api/,
//       ...Object.keys(pkg.dependencies || {}),
//       ...Object.keys(pkg.peerDependencies || {}),
//     ],
//   },
// ];

/** @type {import('rollup').RollupOptions} */
const config = {
  input: [
    "src/index.ts",
    "src/native.ts",
    "src/worker.ts",
    "src/iframe.ts",
    "index.ts",
    "ui/index.ts",
    "models/index.ts"
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
  plugins: [typescript()]
};

export default config;
