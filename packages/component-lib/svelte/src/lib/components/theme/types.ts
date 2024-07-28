import type { Theme } from "@/registry/themes"

export type ThemeConfig = {
	theme: Theme["name"]
	radius: number
	lightMode: "auto" | "light" | "dark"
}
