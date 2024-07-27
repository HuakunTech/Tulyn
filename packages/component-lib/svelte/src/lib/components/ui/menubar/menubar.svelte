<script lang="ts">
	import { cn } from "$lib/utils.js"
	import { Menubar as MenubarPrimitive } from "bits-ui"

	type $$Props = MenubarPrimitive.Props

	let className: $$Props["class"] = undefined
	export { className as class }
</script>

<MenubarPrimitive.Root
	class={cn(
		"bg-background flex h-9 items-center space-x-1 rounded-md border p-1 shadow-sm",
		className
	)}
>
	<slot />
</MenubarPrimitive.Root>
