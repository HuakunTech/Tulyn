// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false,
  app: {
    // baseURL: '/dev-extensions/trytry/.output/public/'
    // baseURL: '/dev-extensions/trytry/.output/public/'
    baseURL: "./"
    // baseURL: '/trytry/.output/public/'
    // baseURL: '/templates/trytry/.output/public/'
    // baseURL: '/dev-extensions/trytry/.output/public/'
  }
})
