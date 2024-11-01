<script lang="ts">
	import IconMultiplexer from "@/components/common/IconMultiplexer.svelte"
	import Cmd from "@/components/main/cmd.svelte"
	import CommandPalette from "@/components/main/CommandPalette.svelte"
	import { appConfig } from "@/stores/appConfig"
	import { extensions } from "@/stores/extensions"
	import Icon from "@iconify/svelte"
	import { IconEnum } from "@kksh/api/models"
	import { loadAllExtensionsFromDb } from "@kksh/extensions"
	import { Button } from "@kksh/svelte"
	import * as tauriPath from "@tauri-apps/api/path"
	import { load, Store } from "@tauri-apps/plugin-store"
	import { onMount } from "svelte"
	import { get } from "svelte/store"

	onMount(async () => {
		extensions.init()
		appConfig.init()
	})
</script>
<CommandPalette extensions={$extensions} class="h-screen" />
