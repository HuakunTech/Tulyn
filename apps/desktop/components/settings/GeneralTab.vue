<script setup lang="ts">
import {
	BetaProgram,
	DevExtMode,
	ExtensionAutoUpgrade,
	HideOnBlur,
	Language,
	MenuBar,
	Startup,
	Theme,
	ThemeCustomizer,
	TriggerHotkey
} from "@/components/settings/General"
import StrikeSeparator from "@/components/StrikeSeparator.vue"
import { Card } from "@kksh/vue/card"
import { Separator } from "@kksh/vue/separator"
import { emitRefreshConfig } from "~/lib/utils/tauri-events"
import { useAppConfigStore } from "~/stores/appConfig"
import { toast } from "vue-sonner"

const appConfig = useAppConfigStore()
const savedHotkey = ref<string[]>([])
onMounted(async () => {
	await appConfig.init() // This is necessary to get the saved hotkey, as savedHotkey doesn't subscribe to the store
	savedHotkey.value = appConfig.triggerHotkey ?? []
})
function updateHotkey(keys: string[]) {
	return appConfig
		.setTriggerHotkey(keys)
		.then(() => {
			toast.info(`Hotkey set to ${keys.join("+")} successfully`)
			emitRefreshConfig()
			savedHotkey.value = keys
		})
		.catch((err) => {
			toast.error(`Failed to set hotkey: ${err}`)
		})
}
</script>
<template>
	<Card class="flex flex-col space-y-4 border-none bg-transparent py-5 shadow-none">
		<Startup />
		<TriggerHotkey :saved-hotkey="savedHotkey" @update:saved-hotkey="updateHotkey" />
		<MenuBar />
		<Theme />
		<HideOnBlur />
		<ExtensionAutoUpgrade />
		<!-- <StrikeSeparator>
			<span class="font-mono whitespace-nowrap break-normal text-muted-foreground">{{ $t("developerSettings") }}</span>
		</StrikeSeparator> -->
		<Separator class="font-mono" :label="$t('settings.general.developerSettings')" />
		<DevExtMode />
		<Language />
		<BetaProgram />
	</Card>
</template>
