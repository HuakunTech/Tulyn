import path, { resolve } from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import tailwindcss from "tailwindcss"
import terser from "@rollup/plugin-terser"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  build: {
    lib: {
      entry: [
        // resolve(__dirname, "./src/index.ts")
        "./src/index.ts",
        "./src/button.ts"
      ],
      name: "@kksh/react",
      // fileName: (format) => `index.${format}.js`,
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react-dom", "tailwindcss"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          tailwindcss: "tailwindcss"
        }
      },
      plugins: [terser(), visualizer()]
    },
    sourcemap: true,
    emptyOutDir: true,
    chunkSizeWarningLimit: 500
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        outDir: "dist"
      }
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
