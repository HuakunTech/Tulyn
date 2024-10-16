<script setup lang="ts">
import AboutTab from "@/components/settings/AboutTab.vue"
import DeveloperTab from "@/components/settings/DeveloperTab.vue"
import ExtensionsTab from "@/components/settings/ExtensionsTab.vue"
import GeneralTab from "@/components/settings/GeneralTab.vue"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kksh/vue/tabs"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { BugIcon, CogIcon, InfoIcon, SquareTerminalIcon, UserRoundIcon } from "lucide-vue-next"

definePageMeta({
	layout: "top-bar"
})

onMounted(() => {
	getCurrentWindow().show()
})
</script>
<template>
	<div class="h-full grow">
		<Tabs default-value="general" class="flex h-full w-full flex-col px-1">
			<TabsList class="grid w-full select-none grid-cols-4">
				<TabsTrigger value="general">
					<CogIcon class="mr-2 h-5 w-5" />
					{{ $t("settings.general.name") }}
				</TabsTrigger>
				<TabsTrigger value="extensions">
					<Icon name="fluent:developer-board-lightning-20-regular" class="mr-2 h-5 w-5" />
					{{ $t("settings.extensions.name") }}
				</TabsTrigger>
				<TabsTrigger value="developer">
					<SquareTerminalIcon class="mr-2 h-5 w-5" />
					{{ $t("settings.developer.name") }}
				</TabsTrigger>
				<TabsTrigger value="about">
					<InfoIcon class="mr-2 h-5 w-5" />
					{{ $t("settings.about.name") }}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="general" class="min-h-0 grow">
				<GeneralTab />
			</TabsContent>
			<TabsContent value="extensions" class="min-h-0 grow">
				<ExtensionsTab />
			</TabsContent>
			<TabsContent value="developer" class="min-h-0 grow">
				<DeveloperTab />
			</TabsContent>
			<TabsContent value="about" class="min-h-0 grow">
				<AboutTab class="" />
			</TabsContent>
		</Tabs>
	</div>
</template>
