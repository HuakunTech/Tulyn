<script lang="ts">
	// import { Button } from "$lib/components/ui/button"
	import IconMultiplexer from "@/components/common/IconMultiplexer.svelte"
	import Cmd from "@/components/main/cmd.svelte"
	import Icon from "@iconify/svelte"
	import { IconEnum } from "@kksh/api/models"
	import { Button } from "@kksh/svelte"
	

	$effect(() => {
		console.log("mounted index page")

	})
</script>

<Button>Click me</Button>
<Cmd />
<IconMultiplexer icon={{ type: IconEnum.Iconify, value: "mingcute:appstore-fill" }} />
