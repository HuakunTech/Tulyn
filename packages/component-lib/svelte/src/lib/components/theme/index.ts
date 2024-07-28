import { config, type Config } from "$lib/stores/config"
import Customizer from "./customizer.svelte"
import ModeDropdown from "./mode-dropdown.svelte"
import ModeToggle from "./mode-toggle.svelte"
import ThemeCustomizer from "./theme-customizer.svelte"
import ThemeWrapper from "./theme-wrapper.svelte"

export function setTheme(theme: Config) {
	config.set(theme)
}

export {
	ModeToggle,
	ModeDropdown,
	ThemeWrapper,
	Customizer as InnerThemeCustomizer,
	ThemeCustomizer
}
