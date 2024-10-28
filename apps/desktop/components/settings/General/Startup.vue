<script setup lang="ts">
import { Checkbox } from "@kksh/vue/checkbox"
import { useAppConfigStore } from "~/stores/appConfig"
import { computed, ref, watch } from "vue"

const appConfig = useAppConfigStore()
const checked = computed({
	get() {
		return appConfig.launchAtLogin
	},
	set(val) {
		appConfig.setLaunchAtLogin(val)
	}
})
</script>
<template>
	<div class="grid grid-cols-2 gap-4">
		<span class="justify-self-end">{{ $t("settings.general.startup") }}</span>
		<div class="flex items-center space-x-2">
			<Checkbox id="startup" v-model:checked="checked" />
			<label
				for="startup"
				class="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{{ $t("settings.general.launchAtLogin") }}
			</label>
		</div>
	</div>
</template>
