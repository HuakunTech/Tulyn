<script setup lang="ts">
import { CommandItem, CommandShortcut } from "@/components/ui/command"
import type { TListItem } from "@/lib/types/list"
import { IconEnum } from "@kksh/api/models"
import { Badge } from "@kksh/vue/badge"
import { useAppConfigStore } from "~/stores/appConfig"

const appConfig = useAppConfigStore()
const props = defineProps<{ item: TListItem }>()
const emits = defineEmits<{
	(e: "select"): void
}>()
</script>

<template>
	<CommandItem @select="() => emits('select')" :value="item.value">
		<img
			width="20"
			class="mr-2"
			v-if="item.icon?.type === 'remote-url'"
			:src="item.icon?.value"
			alt=""
		/>
		<Icon v-else-if="item.icon?.type === 'iconify'" :name="item.icon.value" class="mr-2 h-5 w-5" />
		<Icon v-else name="mingcute:appstore-fill" class="mr-2 h-5 w-5" />
		<span>{{ item.title }}</span>
		<CommandShortcut class="flex items-center space-x-1">
			<Icon v-if="item.flags.isDev" name="fa6-brands:dev" class="h-5 w-5 border bg-green-500" />
			<Badge
				v-if="appConfig.devExtLoadUrl && item.flags.isDev"
				class="rounded-sm px-1 py-0.5"
				variant="outline"
				>Live</Badge
			>
			<span>{{ item.type }}</span>
		</CommandShortcut>
	</CommandItem>
</template>
