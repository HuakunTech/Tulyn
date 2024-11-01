<script lang="ts">
	import AppContext from "@/components/context/AppContext.svelte"
	import "../app.css"
	import { appConfig, appState } from "@/stores"
	import {
		ModeWatcher,
		themeConfigStore,
		ThemeWrapper,
		Toaster,
		updateTheme,
		type ThemeConfig
	} from "@kksh/svelte"
	import type { UnlistenFn } from "@tauri-apps/api/event"
	import { attachConsole } from "@tauri-apps/plugin-log"
	import { onDestroy, onMount } from "svelte"

	let { children } = $props()
	const unlisteners: UnlistenFn[] = []

	onMount(async () => {
		unlisteners.push(await attachConsole())
	})

	onDestroy(() => {
		unlisteners.forEach((unlistener) => unlistener())
	})
</script>

<ModeWatcher />
<Toaster />
<AppContext {appConfig} {appState}>
	<ThemeWrapper>
		{@render children()}
	</ThemeWrapper>
</AppContext>
