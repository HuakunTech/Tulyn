<script setup lang="ts">
import { Checkbox } from "@kksh/vue/checkbox"
import { useAppConfigStore } from "~/stores/appConfig"
import { computed } from "vue"

const appConfig = useAppConfigStore()
const checked = computed({
	get() {
		return appConfig.joinBetaProgram
	},
	set(val) {
		appConfig.setJoinBetaProgram(val)
	}
})
</script>
<template>
	<div class="grid grid-cols-2 gap-4">
		<span class="justify-self-end">{{ $t("settings.general.join-beta") }}</span>
		<div class="flex items-center space-x-2">
			<Checkbox id="join-beta" v-model:checked="checked" />
			<label
				for="join-beta"
				class="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{{ $t(appConfig.joinBetaProgram ? "settings.general.join-beta.explain-true" :"settings.general.join-beta.explain-false") }}
			</label>
		</div>
	</div>
</template>
