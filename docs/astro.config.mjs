import react from "@astrojs/react"
import starlight from "@astrojs/starlight"
import svelte from "@astrojs/svelte"
// import d2 from "astro-d2";
import tailwind from "@astrojs/tailwind"
import vue from "@astrojs/vue"
import { defineConfig } from "astro/config"
import { visualizer } from "rollup-plugin-visualizer"

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Jarvis",
      customCss: ["./src/tailwind.css"],
      lastUpdated: true,
      logo: {
        src: "./src/assets/logo.png"
      },
      components: {
        Header: "./src/components/overrides/Header.astro"
      },
      social: {
        github: "https://github.com/HuakunTech/Jarvis",
        discord: "https://discord.gg/bvf6GwxKWX"
      },
      sidebar: [
        {
          label: "Guides",
          autogenerate: {
            directory: "guides"
          }
        },
        {
          label: "Development",
          autogenerate: {
            directory: "development"
          }
        },
        {
          label: "Extensions",
          autogenerate: {
            directory: "extensions"
          }
        },
        {
          label: "Developer",
          autogenerate: {
            directory: "developer"
          }
        },
        {
          label: "Reference",
          autogenerate: {
            directory: "reference"
          }
        }
      ]
    }),
    // d2(),
    tailwind({
      applyBaseStyles: false
    }),
    vue(),
    react(),
    svelte()
  ],
  vite: {
    plugins: [visualizer()]
  }
})
