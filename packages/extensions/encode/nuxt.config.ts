// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@nuxtjs/color-mode"],
  colorMode: {
    classSuffix: "",
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
    componentDir: "./components/ui",
  },
  ssr: false,
  app: {
    baseURL:
      // process.env.NODE_ENV === "production" ? "/extensions/encode/dist/" : "/",
      process.env.NODE_ENV === "production" ? "/extensions/encode/dist/" : "/",
    // buildAssetsDir: ""
  },
});
