import { defineConfig, presetAttributify, presetTagify, presetUno, presetWebFonts } from "unocss"

export default defineConfig({
	presets: [
		presetAttributify(),
		presetUno(),
		presetWebFonts({
			provider: "google"
		}),
		presetTagify({
			prefix: "un-"
		})
	],
	rules: []
})
