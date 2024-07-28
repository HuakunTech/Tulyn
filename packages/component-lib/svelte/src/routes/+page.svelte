<script lang="ts">
	import CommandDemo from "@/components/cmdk/demo.svelte"
	import { ThemeCustomizer, ThemeWrapper } from "@/components/theme"
	import { Button } from "@/components/ui/button"
</script>

<ThemeWrapper>
	<div class="flex flex-col gap-2 p-4">
		<div>
			<ThemeCustomizer />
			<Button>Hello</Button>
		</div>
		<CommandDemo class="h-[30em] w-[45em]" />
	</div>
</ThemeWrapper>
