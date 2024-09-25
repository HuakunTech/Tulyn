<script setup lang="ts">
import { Checkbox } from "@kksh/vue/checkbox"
import { useAppConfigStore } from "~/stores/appConfig"
import { computed } from "vue"

const appConfig = useAppConfigStore()
const checked = computed({
	get() {
		return appConfig.extensionAutoUpgrade
	},
	set(val) {
		appConfig.setExtensionAutoUpgrade(val)
	}
})
</script>
<template>
	<div class="grid grid-cols-2 gap-4">
		<span class="justify-self-end">{{ $t("settings.general.extension-upgrade.name") }}</span>
		<div class="flex items-center space-x-2">
			<Checkbox id="auto-upgrade" v-model:checked="checked" />
			<label
				for="auto-upgrade"
				class="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{{
					$t(
						appConfig.extensionAutoUpgrade
							? "settings.general.extension-upgrade.auto"
							: "settings.general.extension-upgrade.manual"
					)
				}}
			</label>
		</div>
	</div>
</template>
