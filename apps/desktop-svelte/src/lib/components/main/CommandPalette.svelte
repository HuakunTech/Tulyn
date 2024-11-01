<!-- This file renders the main command palette, a list of commands -->
<script lang="ts">
	import { type CommandLaunchers } from "@/cmds"
	import { getAppConfigContext } from "@/context"
	import { appState } from "@/stores/appState"
	import { cn } from "@/utils"
	import type { ExtPackageJsonExtra } from "@kksh/api/models"
	import { isExtPathInDev } from "@kksh/extensions"
	import * as Command from "$lib/components/ui/command"
	import ExtCmdsGroup from "./ExtCmdsGroup.svelte"
	import GlobalCommandPaletteFooter from "./GlobalCommandPaletteFooter.svelte"

	const {
		extensions,
		class: className,
		commandLaunchers
	}: {
		extensions: ExtPackageJsonExtra[]
		class?: string
		commandLaunchers: CommandLaunchers
	} = $props()
	const appConfig = getAppConfigContext()

	let highlightedCmd = $state("")
	let searchTerm = $state("")
</script>

<span>{searchTerm}</span>
<Command.Root
	class={cn("rounded-lg border shadow-md", className)}
	bind:value={$appState.highlightedCmd}
	loop
>
	<Command.Input placeholder="Type a command or search..." bind:value={$appState.searchTerm} />
	<Command.List class="max-h-screen grow">
		<Command.Empty data-tauri-drag-region>No results found.</Command.Empty>
		{#if $appConfig.extensionPath}
			<ExtCmdsGroup
				extensions={extensions.filter((ext) =>
					isExtPathInDev($appConfig.extensionPath!, ext.extPath)
				)}
				heading="Dev Extensions"
				isDev={true}
				onExtCmdSelect={commandLaunchers.onExtCmdSelect}
				hmr={$appConfig.hmr}
			/>
		{/if}
		{#if $appConfig.extensionPath}
			<ExtCmdsGroup
				extensions={extensions.filter(
					(ext) => !isExtPathInDev($appConfig.extensionPath!, ext.extPath)
				)}
				heading="Extensions"
				isDev={false}
				hmr={false}
				onExtCmdSelect={commandLaunchers.onExtCmdSelect}
			/>
		{/if}
		<Command.Separator />
	</Command.List>
	<GlobalCommandPaletteFooter />
</Command.Root>
