<script setup lang="ts">
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@kksh/vue/select"
import { useAppConfigStore } from "~/stores/appConfig"
import { computed, ref, watch } from "vue"

const ready = ref(false)
const mode = ref("prod")
const appConfig = useAppConfigStore()
// let initVal = appConfig.devExtLoadUrl
// console.log(initVal)
const checked = computed({
	get() {
		return appConfig.devExtLoadUrl
	},
	set(val) {
		appConfig.setDevExtLoadUrl(val)
	}
})

watch(
	() => appConfig.devExtLoadUrl,
	(newVal, oldVal) => {
		// there is a delay to obtain devExtLoadUrl and set default value for select
		// have to set value via v-model after it's loaded
		if (newVal !== oldVal) {
			mode.value = newVal ? "dev" : "prod"
		}
	}
)

onMounted(() => {
	mode.value = appConfig.devExtLoadUrl ? "dev" : "prod"
})
function onModeChange(devMode: string) {
	appConfig.setDevExtLoadUrl(devMode === "dev")
}
</script>
<template>
	<div class="grid grid-cols-2 items-center gap-4">
		<span class="justify-self-end">{{ $t("settings.general.devExtLoadMode") }}</span>
		<div class="w-48">
			<Select
				@update:model-value="onModeChange"
				v-model:model-value="mode"
				:default-value="appConfig.devExtLoadUrl ? 'dev' : 'prod'"
			>
				<SelectTrigger>
					<SelectValue :placeholder="$t('settings.general.pickDevExtensionLoadMode')" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="dev">{{ $t("settings.general.devMode") }}</SelectItem>
					<SelectItem value="prod">{{ $t("settings.general.prodMode") }}</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</div>
</template>
