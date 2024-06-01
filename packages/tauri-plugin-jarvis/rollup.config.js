import { readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import typescript from "@rollup/plugin-typescript";

const pkg = JSON.parse(readFileSync(join(cwd(), "package.json"), "utf8"));

export default [
  {
    input: "guest-js/commands/index.ts",
    output: [
      {
        file: "./dist-js/commands.js",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: `./.`,
      }),
    ],
    external: [
      /^@tauri-apps\/api/,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  {
    input: "guest-js/models/index.ts",
    output: [
      {
        file: "./dist-js/models.js",
        format: "esm",
      },
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: `./.`,
      }),
    ],
    external: [
      /^@tauri-apps\/api/,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
];
