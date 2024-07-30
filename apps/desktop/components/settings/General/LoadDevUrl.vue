<script setup lang="ts">
import { Checkbox } from "@kkui/components/ui/checkbox"
import { useAppConfigStore } from "~/stores/appConfig"
import { computed, ref, watch } from "vue"

const appConfig = useAppConfigStore()
const checked = computed({
	get() {
		return appConfig.devExtLoadUrl
	},
	set(val) {
		appConfig.setDevExtLoadUrl(val)
	}
})
</script>
<template>
	<div class="grid grid-cols-2 gap-4">
		<span class="justify-self-end">Dev Extension URL</span>
		<div class="flex items-center space-x-2">
			<Checkbox id="dev-ext-load-url" v-model:checked="checked" />
			<label
				for="dev-ext-load-url"
				class="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				<span v-if="checked">Live Load UI from Dev Server</span>
				<span v-else>Load from Compiled Static Assets</span>
			</label>
		</div>
	</div>
</template>
