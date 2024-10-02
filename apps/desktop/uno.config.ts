import {
	defineConfig,
	presetAttributify,
	presetTagify,
	presetTypography,
	presetUno,
	presetWebFonts
} from "unocss"

export default defineConfig({
	presets: [
		presetAttributify(),
		presetUno(),
		presetWebFonts({
			provider: "google"
		}),
		presetTagify({
			prefix: "un-"
		}),
		presetTypography()
	],
	rules: []
})
