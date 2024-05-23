import { defineConfig } from "tsup";

export default defineConfig({
  // Outputs `dist/foo.js` and `dist/bar.js`
  entry: {
    index: "index.ts",
    ui: "ui/index.ts",
  },
  dts: true,
  format: ["cjs", "esm"],
});
