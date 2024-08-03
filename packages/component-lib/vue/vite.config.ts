import path from "path"
import vue from "@vitejs/plugin-vue"
import autoprefixer from "autoprefixer"
import tailwind from "tailwindcss"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { dependencies, peerDependencies } from "./package.json"

const uiComponents = [
	"accordion",
	"alert",
	"alert-dialog",
	"aspect-ratio",
	"auto-form",
	"avatar",
	"badge",
	"breadcrumb",
	"button",
	"calendar",
	"card",
	"carousel",
	"chart",
	"chart-area",
	"chart-bar",
	"chart-donut",
	"chart-line",
	"checkbox",
	"collapsible",
	"command",
	"command-extra",
	"context-menu",
	"dialog",
	"drawer",
	"dropdown-menu",
	"form",
	"hover-card",
	"input",
	"label",
	"menubar",
	"navigation-menu",
	"number-field",
	"pagination",
	"pin-input",
	"popover",
	"progress",
	"radio-group",
	"range-calendar",
	"resizable",
	"scroll-area",
	"select",
	"separator",
	"sheet",
	"skeleton",
	"slider",
	"sonner",
	"stepper",
	"switch",
	"table",
	"tabs",
	"tags-input",
	"textarea",
	"toast",
	"toggle",
	"toggle-group",
	"tooltip",
	"v-calendar"
]

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: [
				"./src/index.ts",
				"./src/components/command-extra/index.ts",
				...uiComponents.map((component) => `./src/components/ui/${component}/index.ts`)
				// "./src/components/ui/button/index.ts",
				// "./src/components/ui/command/index.ts"
			],
			// entry: ["./src/index.ts", "./src/dev.ts"],
			name: "@kksh/vue",
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
			plugins: [
				tailwind()
				// autoprefixer()
			]
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
