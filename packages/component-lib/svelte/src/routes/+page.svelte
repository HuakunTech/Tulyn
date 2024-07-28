<script lang="ts">
	import CommandDemo from "@/components/cmdk/demo.svelte"
	import { ThemeCustomizer, ThemeWrapper } from "@/components/theme"
	import type { ThemeConfig } from "@/components/theme/types"
	import { Button } from "@/components/ui/button"
	import { config as themeConfig } from "$lib/stores/config"
	import { get } from "svelte/store"

	let config: ThemeConfig = {
		radius: get(themeConfig).radius,
		theme: get(themeConfig).theme,
		lightMode: get(themeConfig).lightMode
	}

	$: themeConfig.set(config)
</script>

<ThemeCustomizer bind:config />
<ThemeWrapper>
	<pre>{JSON.stringify(config, null, 2)}</pre>
	<div class="flex flex-col gap-2 p-4">
		<div>
			<Button>Hello</Button>
		</div>
		<CommandDemo class="h-[30em] w-[45em]" />
	</div>
</ThemeWrapper>
