import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import d2 from "astro-d2";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Jarvis",
      customCss: ["./src/tailwind.css"],
      lastUpdated: true,
      logo: {
        src: "./src/assets/logo.png",
      },
      components: {
        Header: "./src/components/overrides/Header.astro",
      },
      social: {
        github: "https://github.com/HuakunTech/Jarvis",
        discord: "https://discord.gg/bvf6GwxKWX",
      },
      sidebar: [
        {
          label: "Guides",
          autogenerate: {
            directory: "guides",
          },
        },
        {
          label: "Reference",
          autogenerate: {
            directory: "reference",
          },
        },
        {
          label: "Design",
          autogenerate: {
            directory: "design",
          },
        },
        {
          label: "Development",
          autogenerate: {
            directory: "development",
          },
        },
        {
          label: "Extensions",
          autogenerate: {
            directory: "extensions",
          },
        },
        {
          label: "Developer",
          autogenerate: {
            directory: "developer",
          },
        },
      ],
    }),
    d2(),
    tailwind({
      applyBaseStyles: false,
    }),
    vue(),
    react(),
    svelte(),
  ],
});
