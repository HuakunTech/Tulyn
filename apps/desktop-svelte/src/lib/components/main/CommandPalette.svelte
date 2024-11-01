<!-- This file renders the main command palette, a list of commands -->
<script lang="ts">
	import { getAppConfigContext } from "@/context"
	import { cn } from "@/utils"
	import type { ExtPackageJsonExtra } from "@kksh/api/models"
	import { isExtPathInDev } from "@kksh/extensions"
	import * as Command from "$lib/components/ui/command/index.js"
	import ExtCmdsGroup from "./ExtCmdsGroup.svelte"

	const { extensions, class: className }: { extensions: ExtPackageJsonExtra[]; class?: string } =
		$props()
	const appConfig = getAppConfigContext()
</script>

<Command.Root class={cn("rounded-lg border shadow-md", className)}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List class="h-full max-h-fit">
		<Command.Empty>No results found.</Command.Empty>
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
	<footer
		data-tauri-drag-region
		class="absolute bottom-0 left-0 right-0 h-10 bg-slate-500/40"
	></footer>
</Command.Root>
