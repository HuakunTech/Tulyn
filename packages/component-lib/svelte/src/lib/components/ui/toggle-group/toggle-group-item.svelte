<script lang="ts">
	import { toggleVariants } from "$lib/components/ui/toggle/index.js"
	import { cn } from "$lib/utils.js"
	import { ToggleGroup as ToggleGroupPrimitive } from "bits-ui"
	import { getToggleGroupCtx, type ToggleVariants } from "./index.js"

	type $$Props = ToggleGroupPrimitive.ItemProps & ToggleVariants

	let className: string | undefined | null = undefined

	export { className as class }
	export let variant: $$Props["variant"] = "default"
	export let size: $$Props["size"] = "default"
	export let value: $$Props["value"]

	const ctx = getToggleGroupCtx()
</script>

<ToggleGroupPrimitive.Item
	class={cn(
		toggleVariants({
			variant: ctx.variant || variant,
			size: ctx.size || size
		}),
		className
	)}
	{value}
	{...$$restProps}
>
	<slot />
</ToggleGroupPrimitive.Item>
