<script lang="ts">
	import { cn } from "$lib/utils.js"
	import { Menubar as MenubarPrimitive } from "bits-ui"

	type $$Props = MenubarPrimitive.SeparatorProps
	let className: $$Props["class"] = undefined
	export { className as class }
</script>

<MenubarPrimitive.Separator class={cn("bg-muted -mx-1 my-1 h-px", className)} {...$$restProps} />
