<script setup lang="ts">
import { IconEnum, KunkunExtManifest } from "@kksh/api/models"
import { AllKunkunPermission, FsPermissionMap, permissionDescriptions } from "@kksh/api/permissions"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@kksh/vue/hover-card"
import { ScrollArea, ScrollBar } from "@kksh/vue/scroll-area"
import type { HTMLAttributes } from "vue"

const props = defineProps<{ manifest: KunkunExtManifest; class?: HTMLAttributes["class"] }>()
</script>
<template>
	<ul :class="props.class">
		<li v-for="perm in manifest?.permissions" class="flex h-8 items-center gap-2">
			<span class="font-mono text-sm">{{ typeof perm === "string" ? perm : perm.permission }}</span>
			<HoverCard>
				<HoverCardTrigger class="flex items-center">
					<IconMultiplexer
						class="border"
						:icon="{ type: IconEnum.Iconify, value: 'material-symbols:info-outline' }"
					/>
				</HoverCardTrigger>
				<HoverCardContent class="max-h-96 w-96 overflow-x-auto overflow-y-auto">
					<ScrollArea class="whitespace-nowrap">
						<span class="text-sm">{{
							permissionDescriptions[typeof perm === "string" ? perm : perm.permission]
						}}</span>
						<pre class="text-xs">{{ perm }}</pre>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</HoverCardContent>
			</HoverCard>
		</li>
	</ul>
</template>
