<script setup lang="ts">
import ListItem from "@/components/MainSearch/list-item.vue"
import {
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "@/components/ui/command"
import { $searchTermSync, setSearchTerm } from "@/lib/stores/appState"
import { getActiveElementNodeName } from "@/lib/utils/dom"
import { useStore } from "@nanostores/vue"
import { getCurrent } from "@tauri-apps/api/window"
import { platform } from "@tauri-apps/plugin-os"
import { useListenToWindowBlur } from "~/composables/useEvents"
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

let updateSearchTermTimeout: ReturnType<typeof setTimeout>

const appWindow = getCurrent()
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
	if (!runtimeConfig.public.isDev) {
		appWindow.hide()
	}
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
	if (platform() !== "macos") {
		appWindow.setDecorations(false)
	}
	// Promise.all(exts.value.map((ext) => ext.load()))
	appWindow.show()
	devExtStore.load()
	extStore.load()
})

// when close window if not focused on input. If input element has content, clear the content
onKeyStroke("Escape", (e) => {
	if (getActiveElementNodeName() === "INPUT") {
		if ($searchTermSync.get() !== "") {
			$searchTermSync.set("")
		} else {
			getCurrent().close()
		}
	} else {
		getCurrent().close()
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
				v-for="extLoader in [
					devExtStore,
					extStore,
					remoteCmdStore,
					sysCmdsStore,
					builtinCmdStore,
					appsStore
				]"
				:heading="extLoader.extensionName"
				:key="extLoader.id"
			>
				<ListItem
					v-for="(item, idx) in extLoader.$filteredListItems"
					:item="item"
					:isDevExt="extLoader.extensionName === 'Dev Extensions'"
					:key="`${extLoader.extensionName}-${item.title}-${item.value}`"
					@select="extLoader.onSelect(item)"
				/>
			</CommandGroup>
		</CommandList>
		<CmdPaletteFooter />
	</CmdPaletteCommand>
</template>
