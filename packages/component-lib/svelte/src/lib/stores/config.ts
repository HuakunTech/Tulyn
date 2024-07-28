import type { Theme } from "$lib/registry/themes"
import { writable } from "svelte/store"

type Config = {
	theme: Theme["name"]
	radius: number
	lightMode: "auto" | "light" | "dark"
}

export const config = writable<Config>({
	theme: "zinc",
	radius: 0.5,
	lightMode: "auto"
})
