import { z } from "zod"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	ssr: false,
	css: ["@kksh/vue/css", "@kksh/vue/themes"],
	devtools: { enabled: true },
	modules: [
		"@nuxtjs/i18n",
		"@pinia/nuxt",
		"@pinia-plugin-persistedstate/nuxt",
		"@vueuse/nuxt",
		"@nuxtjs/mdc",
		"@element-plus/nuxt",
		"@nuxt/icon"
	],
	i18n: {
		locales: ["en", "zh"],
		defaultLocale: "en",
		vueI18n: "./i18n/i18n.config.ts"
	},
	nitro: {
		output: {
			publicDir: "dist"
		}
	},
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./components/ui"
	},

	runtimeConfig: {
		public: {
			SUPABASE_URL: z.string().describe("SUPABASE_URL").parse(process.env.SUPABASE_URL),
			SUPABASE_ANON_KEY: z
				.string()
				.describe("SUPABASE_ANON_KEY")
				.parse(process.env.SUPABASE_ANON_KEY),
			SUPABASE_GRAPHQL_ENDPOINT: z
				.string()
				.describe("SUPABASE_GRAPHQL_ENDPOINT")
				.parse(process.env.SUPABASE_GRAPHQL_ENDPOINT),
			isDev: process.env.NODE_ENV === "development",
			posthogPublicKey: z
				.string()
				.describe("POSTHOG_PUBLIC_KEY")
				.parse(process.env.POSTHOG_PUBLIC_KEY),
			posthogHost: z.string().describe("POSTHOG_HOST").parse(process.env.POSTHOG_HOST)
		}
	}
})
