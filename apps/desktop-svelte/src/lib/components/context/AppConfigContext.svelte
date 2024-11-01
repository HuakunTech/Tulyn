<script lang="ts">
	import { setAppConfigContext } from "@/context"
	import type { AppConfig } from "@/types/appConfig"
	import type { Snippet } from "svelte"
	import type { Writable } from "svelte/store"

	const { appConfig, children }: { appConfig: Writable<AppConfig>; children: Snippet<[]> } =
		$props()

	setAppConfigContext(appConfig)
</script>

{@render children?.()}
