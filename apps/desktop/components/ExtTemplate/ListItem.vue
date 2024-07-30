<script setup lang="ts">
import { List, ListSchema, WorkerExtension } from "@kksh/api/ui/worker"
import { CommandGroup, CommandItem, CommandList, CommandShortcut } from "@kksh/vue"

defineProps<{ item: ListSchema.Item }>()
</script>
<template>
	<CommandItem :value="item" class="gap-2">
		<IconMultiplexer v-if="item.icon" :icon="item.icon" class="h-5 w-5" />
		<span class="truncate">{{ item.title }}</span>
		<span class="text-muted-foreground">{{ item.subTitle }}</span>
		<CommandShortcut>
			<div class="flex gap-2">
				<span v-for="acc in item.accessories" class="flex items-center gap-1">
					<IconMultiplexer v-if="acc.icon" :icon="acc.icon" class="h-4 w-4" />
					<span>{{ acc.text }}</span>
				</span>
			</div>
		</CommandShortcut>
	</CommandItem>
</template>
