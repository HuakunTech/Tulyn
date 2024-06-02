import { readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import typescript from "@rollup/plugin-typescript";

const pkg = JSON.parse(readFileSync(join(cwd(), "package.json"), "utf8"));

export default [
  {
    input: "index.ts",
    output: [
      {
        file: "./dist/index.js",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: `./dist/types`,
      }),
    ],
    external: [
      /^@tauri-apps\/api/,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  {
    input: "ui/index.ts",
    output: [
      {
        file: "./dist/ui.js",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: `./dist/types/ui`,
      }),
    ],
    external: [
      /^@tauri-apps\/api/,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  {
    input: "models/index.ts",
    output: [
      {
        file: "./dist/models.js",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: `./dist/types/models`,
      }),
    ],
    external: [
      /^@tauri-apps\/api/,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
];
