<script setup lang="ts">
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
// import { setLightMode, type LightMode } from "@/lib/stores/appConfig"
import { cn } from "@/lib/utils"
import { useColorMode, useDark } from "@vueuse/core"

const props = defineProps<{
	class?: string
}>()
// const mode = useColorMode();
const isDark = useDark()
const colorMode = useColorMode()

function changeLightMode(mode: LightMode) {
	colorMode.value = mode
	// setLightMode(mode)
}
</script>

<template>
	<span>
		<DropdownMenu>
			<DropdownMenuTrigger as-child class="">
				<button :class="cn('', props.class)">
					<Icon
						v-if="!isDark"
						name="fxemoji:sunrays"
						class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90"
					/>
					<Icon
						v-if="isDark"
						name="fluent-emoji-flat:crescent-moon"
						class="h-4 w-4 rotate-0 scale-100 transition-all"
					/>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem @click="changeLightMode('light')"> Light </DropdownMenuItem>
				<DropdownMenuItem @click="changeLightMode('dark')"> Dark </DropdownMenuItem>
				<DropdownMenuItem @click="changeLightMode('auto')"> System </DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</span>
</template>
