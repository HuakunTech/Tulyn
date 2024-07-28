<script>
	import { updateTheme } from "@/utils"
	import "../app.css"
	// import "../lib/registry/themes.css"
	import { config } from "$lib/stores/config"
	import { ModeWatcher } from "mode-watcher"

	$: updateTheme($config.theme)
</script>

<svelte:head>
	<style>
		@import "/registry/themes.css";
		:root {
			--vis-color0: var(--primary);
			--vis-color1: #ffffff;
			--vis-color2: #ffffff;
			--vis-color3: #ffffff;
			--vis-color4: #ffffff;
		}
	</style>
</svelte:head>
<ModeWatcher />
<slot></slot>
