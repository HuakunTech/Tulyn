<!-- This file renders the main command palette, a list of commands -->
<script lang="ts">
	import { getAppConfigContext } from "@/context"
	import { cn } from "@/utils"
	import type { ExtPackageJsonExtra } from "@kksh/api/models"
	import { isExtPathInDev } from "@kksh/extensions"
	import * as Command from "$lib/components/ui/command"
	import ExtCmdsGroup from "./ExtCmdsGroup.svelte"
	import GlobalCommandPaletteFooter from "./GlobalCommandPaletteFooter.svelte"

	const { extensions, class: className }: { extensions: ExtPackageJsonExtra[]; class?: string } =
		$props()
	const appConfig = getAppConfigContext()
</script>

<Command.Root class={cn("flex flex-col rounded-lg border shadow-md", className)}>
	<Command.Input placeholder="Type a command or search..." class="flex-none" />
	<Command.List class="max-h-screen grow">
		<Command.Empty data-tauri-drag-region>No results found.</Command.Empty>
		{#if $appConfig.extensionPath}
			<ExtCmdsGroup
				extensions={extensions.filter((ext) =>
					isExtPathInDev($appConfig.extensionPath!, ext.extPath)
				)}
				heading="Dev Extensions"
				isDev={true}
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
			/>
		{/if}
		<Command.Separator />
	</Command.List>
	<GlobalCommandPaletteFooter class="flex-none" />
</Command.Root>
