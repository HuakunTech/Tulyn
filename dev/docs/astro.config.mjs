import starlight from "@astrojs/starlight"
import { defineConfig } from "astro/config"

// import d2 from "astro-d2";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Jarvis",
      social: {
        github: "https://github.com/withastro/starlight"
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            {
              label: "Example Guide",
              link: "/guides/example/"
            }
          ]
        },
        {
          label: "Reference",
          autogenerate: {
            directory: "reference"
          }
        },
        {
          label: "Design",
          autogenerate: {
            directory: "design"
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
        }
      ]
    })
    // d2()
  ]
})
