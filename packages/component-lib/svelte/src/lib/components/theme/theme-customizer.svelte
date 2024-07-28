<script>
	import { Button } from "$lib/components/ui/button"
	import * as Popover from "$lib/components/ui/popover"
	import Paintbrush from "lucide-svelte/icons/paintbrush"
	import Customizer from "./customizer.svelte"
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]}>
			<Paintbrush class="mr-2 h-4 w-4" />
			Customize
		</Button>
	</Popover.Trigger>
	<Popover.Content
		class="z-40 w-[340px] rounded-[0.5rem] bg-white p-6 dark:bg-zinc-950"
		align="end"
	>
		<Customizer />
	</Popover.Content>
</Popover.Root>
