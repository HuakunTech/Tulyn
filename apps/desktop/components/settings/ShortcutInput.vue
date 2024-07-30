<script lang="ts" setup>
import { Input } from "@kkui/components/ui/input"
import { onKeyPressed } from "@vueuse/core"
import { cn } from "~/lib/utils"
import { isShortcut } from "~/lib/utils/common"
import { keyCodeToKey, keyCombToDisplay } from "~/lib/utils/js"

const recording = defineModel<boolean>("recording", { required: true })
const keys = defineModel<string[]>("keys", { required: true })
const savedShortcut = ref<Set<string> | null>(null)
const keyCombination = computed(() => {
	return savedShortcut.value !== null
		? keyCombToDisplay(Array.from(savedShortcut.value))
		: keyCombToDisplay(keys.value)
})
onMounted(() => {
	recording.value = true
})

function onKeyDown(e: KeyboardEvent) {
	e.preventDefault()
	if (recording.value) {
		const newKeys = [...keys.value, keyCodeToKey(e.code)]
		keys.value = newKeys
		if (isShortcut(newKeys)) {
			//   console.log("shortcut detected", newKeys)
			savedShortcut.value = new Set(newKeys)
			recording.value = false // stop recording
		}
	}
}

function onKeyUp(e: KeyboardEvent) {
	e.preventDefault()
	if (recording.value) {
		keys.value = keys.value.filter((k) => k !== keyCodeToKey(e.code))
	}
}
</script>
<template>
	<div class="text-center">
		<Input
			:value="keyCombination"
			:onkeydown="onKeyDown"
			:onkeyup="onKeyUp"
			autofocusss
			placeholder=""
			:class="cn('h-8 w-32 border-2 text-center caret-transparent')"
		/>
		<span class="font-mono text-xs" v-if="recording">Recording...</span>
	</div>
</template>
