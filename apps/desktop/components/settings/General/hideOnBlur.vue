<script setup lang="ts">
import { Checkbox } from "@kksh/vue/checkbox"
import { useAppConfigStore } from "~/stores/appConfig"
import { computed } from "vue"

const appConfig = useAppConfigStore()
const checked = computed({
	get() {
		return appConfig.hideOnBlur
	},
	set(val) {
		appConfig.setHideOnBlur(val)
	}
})
</script>
<template>
	<div class="grid grid-cols-2 gap-4">
		<span class="justify-self-end">{{ $t("settings.general.window-blur-bahavior") }}</span>
		<div class="flex items-center space-x-2">
			<Checkbox id="hide-on-blur" v-model:checked="checked" />
			<label
				for="hide-on-blur"
				class="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{{ $t("settings.general.hide-on-blur") }}
			</label>
		</div>
	</div>
</template>
