import { allColors, Theme } from "@/lib/themes/themes"
import { useColorMode } from "@vueuse/core"
import { atom, map } from "nanostores"

export type ThemeConfig = {
	theme: Theme["name"]
	radius: number
	lightMode: "auto" | "light" | "dark"
}
export const $themeConfig = atom<ThemeConfig>({
	theme: "neutral",
	radius: 0.5,
	lightMode: "auto"
})
export function setThemeColor(color: Theme["name"]) {
	$themeConfig.set({ ...$themeConfig.get(), theme: color })
}

export function setRadius(radius: number) {
	$themeConfig.set({ ...$themeConfig.get(), radius })
}

export function setLightMode(mode: ThemeConfig["lightMode"]) {
	$themeConfig.set({ ...$themeConfig.get(), lightMode: mode })
}

/**
 * Apply theme config to the document
 * @param config
 */
export function updateTheme(config: ThemeConfig) {
	document.documentElement.style.setProperty("--radius", `${config.radius}rem`)
	document.documentElement.classList.remove(...allColors.map((color) => `theme-${color}`))
	document.documentElement.classList.add(`theme-${config.theme}`)
	const colorMode = useColorMode()
	colorMode.value = config.lightMode ?? "auto"
}

$themeConfig.subscribe((config) => {
	document.documentElement.style.setProperty("--radius", `${config.radius}rem`)
	document.documentElement.classList.remove(...allColors.map((color) => `theme-${color}`))
	document.documentElement.classList.add(`theme-${config.theme}`)
	const colorMode = useColorMode()
	colorMode.value = config.lightMode ?? "auto"
})
