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
      title: "Kunkun",
      customCss: ["./src/tailwind.css"],
      // tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },
      lastUpdated: true,
      logo: {
        src: "./src/assets/kunkun-logo-gray.svg"
      },
      components: {
        Header: "./src/components/overrides/Header.astro"
      },
      social: {
        github: "https://github.com/HuakunTech/kunkun",
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
          },
          collapsed: true
        },
        {
          label: "Extensions",
          autogenerate: {
            directory: "extensions"
          },
          collapsed: true
        },
        {
          label: "Developer",
          autogenerate: {
            directory: "developer"
          },
          collapsed: true
        },
        {
          label: "Reference",
          autogenerate: {
            directory: "reference"
          },
          collapsed: true
        },
        {
          label: "Blog",
          autogenerate: {
            directory: "blog"
          },
          collapsed: true
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
