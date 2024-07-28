<script>
	import { updateTheme } from "@/utils"
	import "../app.css"
	import { Toaster } from "$lib/components/ui/sonner"
	import "../lib/registry/themes.css"
	import { config } from "$lib/stores/config"
	import { ModeWatcher } from "mode-watcher"

	$: updateTheme($config)
</script>

<Toaster richColors />
<ModeWatcher />
<slot></slot>
