import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts", "models/index.ts", "ui/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
});
