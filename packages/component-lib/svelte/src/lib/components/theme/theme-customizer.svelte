<script lang="ts">
	import { Button } from "$lib/components/ui/button"
	import { Label } from "$lib/components/ui/label"
	import { themes } from "$lib/registry/themes"
	import { cn } from "$lib/utils.js"
	// import { mode, setMode } from "mode-watcher"
	import { onMount } from "svelte"
	import Check from "svelte-radix/Check.svelte"
	import Moon from "svelte-radix/Moon.svelte"
	import Reset from "svelte-radix/Reset.svelte"
	import Sun from "svelte-radix/Sun.svelte"
	import { toast } from "svelte-sonner"
	import ThemeWrapper from "./theme-wrapper.svelte"
	import type { ThemeConfig } from "./types"

	export let config: ThemeConfig

	onMount(() => {
		toast.success("Hello world!")
	})

	$: mode = config.lightMode !== "auto" ? config.lightMode : undefined
</script>

<ThemeWrapper defaultTheme="zinc" class="flex flex-col space-y-4 md:space-y-6">
	<div class="flex items-start">
		<div class="space-y-1 pr-2">
			<div class="font-semibold leading-none tracking-tight">Customize</div>
			<div class="text-muted-foreground text-xs">Pick a style and color for your components.</div>
		</div>
		<Button
			variant="ghost"
			size="icon"
			class="ml-auto rounded-[0.5rem]"
			on:click={() => {
				config.radius = 0.5
				config.theme = "zinc"
			}}
		>
			<Reset />
			<span class="sr-only"> Reset </span>
		</Button>
	</div>
	<div class="flex flex-1 flex-col space-y-4 md:space-y-6">
		<div class="5 space-y-1">
			<Label class="text-xs">Color</Label>
			<div class="grid grid-cols-3 gap-2">
				{#each themes as theme (theme.name)}
					{@const isActive = config.theme === theme.name}
					<Button
						variant="outline"
						size="sm"
						on:click={() => {
							config.theme = theme.name
						}}
						class={cn("justify-start", isActive && "border-primary border-2")}
						style="--theme-primary: hsl({theme.activeColor[mode ?? 'dark']})"
					>
						<span
							class="mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
						>
							{#if isActive}
								<Check class="h-4 w-4 text-white" />
							{/if}
						</span>
						{theme.label}
					</Button>
				{/each}
			</div>
		</div>
		<div class="space-y-1.5">
			<Label class="text-xs">Radius</Label>
			<div class="grid grid-cols-5 gap-2">
				{#each ["0", "0.3", "0.5", "0.75", "1.0"] as value, _ (value)}
					{@const valueFloat = Number.parseFloat(value)}
					<Button
						variant="outline"
						size="sm"
						on:click={() => {
							config.radius = valueFloat
						}}
						class={cn(config.radius === valueFloat && "border-primary border-2")}
					>
						{value}
					</Button>
				{/each}
			</div>
		</div>
		<div class="space-y-1.5">
			<Label class="text-xs">Mode</Label>
			<div class="grid grid-cols-3 gap-2">
				<Button
					variant="outline"
					size="sm"
					on:click={() => (config.lightMode = "light")}
					class={cn(config.lightMode === "light" && "border-primary border-2")}
				>
					<Sun class="mr-1 -translate-x-1" />
					Light
				</Button>
				<Button
					variant="outline"
					size="sm"
					on:click={() => (config.lightMode = "dark")}
					class={cn(config.lightMode === "dark" && "border-primary border-2")}
				>
					<Moon class="mr-1 -translate-x-1" />
					Dark
				</Button>
			</div>
		</div>
	</div>
</ThemeWrapper>
