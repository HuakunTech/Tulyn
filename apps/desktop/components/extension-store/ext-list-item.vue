<script setup lang="ts">
import IconMultiplexer from "@/components/IconMultiplexer.vue"
import { humanReadableNumber } from "@/lib/utils/format"
import { CommandItem } from "@kksh/vue"
import { CircleCheckBigIcon } from "lucide-vue-next"
import { ExtItem } from "./types"

const props = defineProps<{
	data: ExtItem
	installed: boolean
}>()

const emits = defineEmits<{
	(e: "select"): void
}>()
</script>
<template>
	<CommandItem :value="props.data" class="" @select="emits('select')">
		<div class="flex w-full items-center justify-between">
			<div class="flex items-center space-x-4">
				<IconMultiplexer :icon="props.data.icon" class="h-6 w-6" />
				<div>
					<div class="font-semibold">{{ props.data.name }}</div>
					<div class="text-muted-foreground font-mono text-xs">
						{{ props.data.short_description }}
					</div>
				</div>
			</div>
			<div class="flex space-x-4">
				<CircleCheckBigIcon v-if="props.installed" class="w-4 text-green-400" />
				<div class="flex items-center space-x-1">
					<Icon name="ic:round-download" class="inline h-5 w-5" />
					<span class="w-8 text-center">{{ humanReadableNumber(props.data.downloads) }}</span>
				</div>
			</div>
		</div>
	</CommandItem>
</template>
