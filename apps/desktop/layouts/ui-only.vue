<script setup lang="ts">
import { Toaster } from "@kksh/vue/sonner"
import { Toaster as Toaster2 } from "@kksh/vue/toast"
import { TooltipProvider } from "@kksh/vue/tooltip"

useColorMode()
</script>
<template>
	<TooltipProvider>
		<main class="z-10 h-screen">
			<Toaster :rich-colors="true" :expand="true" />
			<Toaster2 />
			<slot />
		</main>
	</TooltipProvider>
</template>
