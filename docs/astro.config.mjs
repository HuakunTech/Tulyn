import react from "@astrojs/react"
import starlight from "@astrojs/starlight"
import svelte from "@astrojs/svelte"
import tailwind from "@astrojs/tailwind"
import vue from "@astrojs/vue"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "Kunkun",
			lastUpdated: true,
			logo: {
				// src: "./src/assets/kunkun-logo-gray.svg"
				light: "./src/assets/kunkun-logo.svg",
				dark: "./src/assets/kunkun-logo-inverted.svg"
			},
			social: {
				github: "https://github.com/HuakunTech/kunkun",
				discord: "https://discord.gg/bvf6GwxKWX"
			},
			components: {
				// ThemeSelect: "./src/components/overrides/ThemeSelect.astro", // no longer needed, imported in Header.astro
				Header: "./src/components/overrides/Header.astro"
			},

			customCss: ["./src/tailwind.css"],
			sidebar: [
				{
					label: "Guides",
					autogenerate: {
						directory: "guides"
					}
				},
				{
					label: "Milestones",
					autogenerate: {
						directory: "milestones"
					},
					collapsed: true
				},
				{
					label: "Extensions",
					autogenerate: {
						directory: "extensions"
					},
					collapsed: false
				},
				{
					label: "Developer",
					autogenerate: {
						directory: "developer"
					},
					collapsed: false
				},
				{
					label: "Reference",
					autogenerate: {
						directory: "reference"
					},
					collapsed: false
				},
				{
					label: "Blog",
					autogenerate: {
						directory: "blog"
					},
					collapsed: false
				}
			]
		}),
		tailwind({
			applyBaseStyles: false
		}),
		vue(),
		svelte(),
		react()
	]
})
