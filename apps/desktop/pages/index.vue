<script setup lang="ts">
import ListItem from "@/components/MainSearch/list-item.vue"
import { CommandEmpty, CommandGroup, CommandList } from "@/components/ui/command"
import { $searchTermSync, setSearchTerm } from "@/lib/stores/appState"
import { getActiveElementNodeName } from "@/lib/utils/dom"
import { useStore } from "@nanostores/vue"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { platform } from "@tauri-apps/plugin-os"
import { useListenToWindowBlur } from "~/composables/useEvents"
import { initStores } from "~/lib/utils/stores"
import { useAppConfigStore } from "~/stores/appConfig"
import { useAppsLoaderStore } from "~/stores/appLoader"
import { useAppStateStore } from "~/stores/appState"
import { useBuiltInCmdStore } from "~/stores/builtinCmdLoader"
import { useDevExtStore, useExtStore } from "~/stores/extensionLoader"
import { useRemoteCmdStore } from "~/stores/remoteCmds"
import { useSystemCmdsStore } from "~/stores/systemCmds"
import { ComboboxInput } from "radix-vue"

const builtinCmdStore = useBuiltInCmdStore()
const appsStore = useAppsLoaderStore()
const sysCmdsStore = useSystemCmdsStore()
const appStateStore = useAppStateStore()
const remoteCmdStore = useRemoteCmdStore()
const devExtStore = useDevExtStore()
const extStore = useExtStore()

const searchTermSync = useStore($searchTermSync)
const appConfig = useAppConfigStore()
await appConfig.init()
const extLoaders = ref([
	devExtStore,
	extStore,
	builtinCmdStore,
	remoteCmdStore,
	sysCmdsStore,
	appsStore
])

let updateSearchTermTimeout: ReturnType<typeof setTimeout>

const appWindow = getCurrentWindow()
const runtimeConfig = useRuntimeConfig()
const cmdInputRef = ref<InstanceType<typeof ComboboxInput> | null>(null)

appConfig.$subscribe((mutation, state) => {
	const mutEvts = Array.isArray(mutation.events) ? mutation.events : [mutation.events]
	mutEvts.forEach((evt) => {
		if (evt.key === "devExtensionPath") {
			if (evt.oldValue !== evt.newValue) {
				// extsObj.devExt = new Extension("Dev Extensions", state.devExtensionPath, true)
				// extsObj.devExt.load()
				// TODO
			}
		}
	})
})

useListenToWindowBlur(() => {
	const win = getCurrentWebviewWindow()
	win.isFocused().then((isFocused) => {
		// this extra is focused check may be needed because blur event got triggered somehow when window show()
		// for edge case: when settings page is opened and focused, switch to main window, the blur event is triggered for main window
		if (!isFocused) {
			if (appConfig.hideOnBlur) {
				appWindow.hide()
			}
		}
	})
})

useListenToWindowFocus(() => {
	cmdInputRef.value?.$el.querySelector("input").focus()
})

$searchTermSync.subscribe((val, oldVal) => {
	clearTimeout(updateSearchTermTimeout)
	updateSearchTermTimeout = setTimeout(() => {
		setSearchTerm(val)
		appStateStore.setSearchTerm(val)
	}, 100)
})

onMounted(async () => {
	// fetch("ext://template-ext-sveltekit.ext/build/about/")
	// 	.then((res) => res.text())
	// 	.then(console.log)
	// fetch("ext://template-ext-sveltekit.ext/build/about/_app/immutable/chunks/entry.D9f0aZyR.js")
	// 	.then((res) => res.text())
	// 	.then(console.log)
	if (platform() !== "macos") {
		appWindow.setDecorations(false)
	}
	appWindow.show()
	// force rerender groups
	const cache = extLoaders.value
	extLoaders.value = []
	setTimeout(() => {
		extLoaders.value = cache
	}, 10)
})

// when close window if not focused on input. If input element has content, clear the content
onKeyStroke("Escape", (e) => {
	if (getActiveElementNodeName() === "INPUT") {
		if ($searchTermSync.get() !== "") {
			$searchTermSync.set("")
		} else {
			getCurrentWindow().close()
		}
	} else {
		getCurrentWindow().close()
	}
})

// focus on input element when slash is pressed
onKeyStroke("/", (e) => {
	if (getActiveElementNodeName() !== "INPUT") {
		const inputsEle = document.getElementsByTagName("input")
		if (inputsEle.length > 0) {
			inputsEle[0].focus()
		}
	}
})
const highlightedItemValue = ref<string | undefined>()
watch(highlightedItemValue, (newVal, oldVal) => {
	if ((!newVal || newVal.length === 0) && oldVal) {
		setTimeout(() => {
			highlightedItemValue.value = oldVal
		}, 1)
	}
})

const searchTermSyncProxy = computed({
	get: () => searchTermSync.value,
	set: (val: string) => {
		$searchTermSync.set(val)
	}
})
</script>
<template>
	<iframe src="ext://template-ext-sveltekit.ext/about.html" class="w-full h-96" frameborder="0"></iframe>
	<CmdPaletteCommand
		class=""
		v-model:searchTerm="searchTermSyncProxy"
		:identity-filter="true"
		v-model:selected-value="highlightedItemValue"
	>
		<CmdPaletteMainSearchBar />
		<CommandList class="h-full max-h-screen">
			<CommandEmpty>No results found.</CommandEmpty>
			<CommandGroup
				v-for="extLoader in extLoaders"
				:heading="extLoader.extensionName"
				:key="extLoader.id"
			>
				<ListItem
					v-for="(item, idx) in extLoader.$filteredListItems"
					:item="item"
					:isDevExt="extLoader.extensionName === 'Dev Extensions'"
					@select="extLoader.onSelect(item)"
				/>
			</CommandGroup>
		</CommandList>
		<CmdPaletteFooter />
	</CmdPaletteCommand>
</template>
