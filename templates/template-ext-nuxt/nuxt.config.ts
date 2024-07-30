const isProduction = process.env.KK_NODE_ENV === "production"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	css: ["@kksh/vue/css", "@kksh/vue/themes"],
	devtools: { enabled: true },
	ssr: false,

	devServer: {
		port: 5173 // avoid conflict Desktop App in Dev Mode
	},

	nitro: {
		output: {
			publicDir: "dist"
		}
	},

	app: {
		baseURL: isProduction
			? "/extensions/template-ext-nuxt/dist"
			: "/dev-extensions/template-ext-nuxt/dist"
	},

	modules: ["@nuxtjs/tailwindcss"]
})
