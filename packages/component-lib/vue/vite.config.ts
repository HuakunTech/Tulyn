import path from "path"
import vue from "@vitejs/plugin-vue"
import autoprefixer from "autoprefixer"
import tailwind from "tailwindcss"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { dependencies, peerDependencies } from "./package.json"

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			// entry: ["./src/index3.ts"],
			entry: ["./src/index.ts"],
			name: "shadcn-vue-components",
			formats: ["es", "cjs"]
		},
		rollupOptions: {
			external: [...Object.keys(peerDependencies), ...Object.keys(dependencies)],
			output: {
				preserveModules: true,
				preserveModulesRoot: "src",
				exports: "named"
			}
		},
		sourcemap: true,
		emptyOutDir: true,
		chunkSizeWarningLimit: 500
	},
	css: {
		postcss: {
			plugins: [tailwind(), autoprefixer()]
		}
	},
	plugins: [
		vue(),
		dts({
			include: ["src/**/*"]
		})
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	}
})
