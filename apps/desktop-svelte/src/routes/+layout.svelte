<script lang="ts">
	import AppConfigContext from "@/components/context/AppConfigContext.svelte"
	import "../app.css"
	import { appConfig } from "@/stores/appConfig"
	import { ModeWatcher, Toaster } from "@kksh/svelte"
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
<AppConfigContext {appConfig}>
	{@render children()}
</AppConfigContext>
