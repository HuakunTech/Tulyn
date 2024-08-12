<script setup lang="ts">
import { clipboard, initCustomExtension, toast, ui } from "@kksh/api/ui/iframe"
import { updateTheme } from "@kksh/vue"
import { computed, onMounted, ref, watch } from "vue"
import ContextMenu from "./components/context-menu.vue"
import PreferencesComponent from "./components/preference.vue"
import { getPreferences } from "./lib/db"
import { Preferences, PreferencesSchema } from "./lib/model"
import { cn } from "./lib/utils"

const displayPreference = ref(false)
const preferences = ref<Preferences>()
const showInstructions = ref(true)

watch(preferences, (val) => {
	console.log("latest preferences", val)

	if (val) {
		setTransparentBackground(val.transparentBackground)
		displayPreference.value = false
	} else {
		displayPreference.value = true
	}
})

function setTransparentBackground(transparent: boolean) {
	document.body.style.backgroundColor = transparent ? "transparent" : ""
}
const url = computed(() => {
	if (!preferences.value) {
		return null
	}
	const p = preferences.value
	const params = new URLSearchParams({
		enableZoom: p.enableZoom ? "true" : "false",
		enablePan: p.enablePanning ? "true" : "false",
		enableDamping: p.enableDamping ? "true" : "false",
		autoRotate: p.enableAutoRotate ? "true" : "false",
		autoRotateSpeed: p.autoRotateSpeed.toString()
	})
	return `https://git-skyline.huakun.tech/contribution/github/huakunshen/embed?${params.toString()}`
})

onMounted(async () => {
	initCustomExtension()
	ui.setTransparentWindowBackground(true)
	// ui.goHome()
	// ui.goBack()
	// ui.hideMoveButton() // enable this after fixing window cannot be moved bug in extension production build
	ui.getTheme().then((theme) => {
		updateTheme(theme)
	})
	console.log("mounted")
	clipboard.readText().then((text) => {
		console.log("clipboard text", text)
	})

	const pref = await getPreferences()
	console.log(pref)

	if (pref) {
		displayPreference.value = false
		preferences.value = pref
		setTransparentBackground(preferences.value.transparentBackground)
	} else {
		toast.error("Failed to load preferences")
		displayPreference.value = true
	}
	setTimeout(() => {
		showInstructions.value = false
	}, 5000)
})
</script>

<template>
	<div class="h-screen" v-if="displayPreference">
		<PreferencesComponent v-model="preferences" />
	</div>
	<div class="absolute z-0 h-screen w-full" v-if="!displayPreference && url">
		<iframe width="100%" height="100%" frameBorder="0" class="grow" :src="url" frameborder="0" />
	</div>
	<div class="flex h-screen flex-col">
		<div class="z-50 h-32" data-tauri-drag-region>
			<div
				:class="
					cn(
						'kunkun-drag-region flex h-full w-full items-center justify-center',
						showInstructions ? 'border border-green-400' : ''
					)
				"
			>
				<h1 v-if="showInstructions" class="kunkun-drag-region z-0 select-none text-3xl">
					Left Click and Drag this region to move this window
				</h1>
			</div>
		</div>
		<div class="grow"></div>
		<div class="z-50 h-32">
			<div class="h-full w-full">
				<ContextMenu
					:showInstructions="showInstructions"
					v-model:displayPreference="displayPreference"
				/>
			</div>
		</div>
	</div>
</template>
