<script lang="ts" setup>
import { Button } from "@kksh/vue/button"
import { Popover, PopoverContent, PopoverTrigger } from "@kksh/vue/popover"
import { keyCombToDisplay } from "~/lib/utils/js"

const savedHotkey = defineModel<string[]>("savedHotkey", { required: true })
const recording = ref(false)
const keys = ref<string[]>([])
function onRecordClick() {
	recording.value = true
	keys.value = []
}
</script>
<template>
	<div class="grid grid-cols-2 gap-4">
		<span class="justify-self-end">Trigger Hotkey</span>
		<Popover v-model:open="recording">
			<PopoverTrigger class="w-fit" @click="onRecordClick">
				<Button v-if="savedHotkey.length === 0" variant="ghost" size="sm" class="w-fit">
					Record Hotkey
				</Button>
				<Button v-else variant="outline" size="sm" class="w-32 gap-2">
					{{ keyCombToDisplay(savedHotkey) }}
				</Button>
			</PopoverTrigger>
			<PopoverContent class="flex w-fit justify-center">
				<SettingsShortcutInput
					:recording="recording"
					@update:recording="
						(val) => {
							console.log('setting recording', val)

							recording = val
							if (val === false) {
								savedHotkey = keys
							}
						}
					"
					v-model:keys="keys"
				/>
			</PopoverContent>
		</Popover>
	</div>
</template>
