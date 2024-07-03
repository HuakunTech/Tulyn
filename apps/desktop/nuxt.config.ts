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
  alias: { "@jarvis-plugin": "../../../packages/tauri-plugin-jarvis/guest-js" },
  runtimeConfig: {
    public: {
      SUPABASE_URL: z.string().parse(process.env.SUPABASE_URL),
      SUPABASE_ANON_KEY: z.string().parse(process.env.SUPABASE_ANON_KEY),
      SUPABASE_GRAPHQL_ENDPOINT: z.string().parse(process.env.SUPABASE_GRAPHQL_ENDPOINT),
    },
  },
});
