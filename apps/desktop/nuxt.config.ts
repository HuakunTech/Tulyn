import { z } from "zod";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@vueuse/nuxt", "@element-plus/nuxt"],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  // elementPlus: {
  //   icon: "ElIcon",
  //   importStyle: "scss",
  //   themes: ["dark"],
  // },
  // app: {
  //   pageTransition: { name: "page", mode: "out-in" },
  // },
  alias: { "@jarvis-plugin": "../../../packages/tauri-plugin-jarvis/guest-js" },
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
    },
  },
});
