import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import tailwindcss from "tailwindcss"
import { visualizer } from "rollup-plugin-visualizer"
import { peerDependencies, dependencies } from "./package.json"

export default defineConfig({
  build: {
    lib: {
      entry: ["./src/index.ts"],
      name: "@kksh/react",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: [
        ...Object.keys(peerDependencies),
        ...Object.keys(dependencies)
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src"
      },
      plugins: [visualizer()]
    },
    sourcemap: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 500
  },
  plugins: [
    react({
      jsxRuntime: "classic"
    }),
    dts({
      include: ["src/**/*"]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss]
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom"]
  }
})
