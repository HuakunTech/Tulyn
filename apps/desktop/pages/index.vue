<script setup lang="ts">
import { CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { getExtensionsFolder, HTMLElementId } from "@/lib/constants"
import { AppsExtension } from "@/lib/extension/apps"
import type { IExtensionBase } from "@/lib/extension/base"
import { BuiltinCmds } from "@/lib/extension/builtin"
import { Extension } from "@/lib/extension/ext"
import { RemoteExtension } from "@/lib/extension/remoteExt"
import { SystemCommandExtension } from "@/lib/extension/systemCmds"
import { $searchTermSync, setSearchTerm } from "@/lib/stores/appState"
import { getActiveElementNodeName } from "@/lib/utils/dom"
import { useStore } from "@nanostores/vue"
import { getCurrent } from "@tauri-apps/api/window"
import { platform } from "@tauri-apps/plugin-os"
import { useListenToWindowBlur } from "~/composables/useEvents"
import { useAppConfigStore } from "~/stores/appConfig"
import { ComboboxInput } from "radix-vue"

const searchTermSync = useStore($searchTermSync)
const appConfig = useAppConfigStore()
await appConfig.init()
const extsObj = reactive({
	appExt: new AppsExtension(),
	sysCmdExt: new SystemCommandExtension(),
	builtinCmdExt: new BuiltinCmds(),
	devExt: new Extension("Dev Extensions", appConfig.devExtensionPath, true),
	storeExt: new Extension("Extensions", await getExtensionsFolder()),
	remoteExt: new RemoteExtension()
})

let exts = computed<IExtensionBase[]>(() => [
	extsObj.devExt,
	extsObj.remoteExt,
	// extsObj.storeExt,
	extsObj.builtinCmdExt,
	extsObj.sysCmdExt,
	extsObj.appExt
])
// const searchTermInSync = ref("")
let updateSearchTermTimeout: ReturnType<typeof setTimeout>

const appWindow = getCurrent()
const runtimeConfig = useRuntimeConfig()
const cmdInputRef = ref<InstanceType<typeof ComboboxInput> | null>(null)

appConfig.$subscribe((mutation, state) => {
	const mutEvts = Array.isArray(mutation.events) ? mutation.events : [mutation.events]
	mutEvts.forEach((evt) => {
		if (evt.key === "devExtensionPath") {
			if (evt.oldValue !== evt.newValue) {
				extsObj.devExt = new Extension("Dev Extensions", state.devExtensionPath, true)
				extsObj.devExt.load()
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
	}, 100)
})

onMounted(async () => {
	if (platform() !== "macos") {
		appWindow.setDecorations(false)
	}
	Promise.all(exts.value.map((ext) => ext.load()))
	appWindow.show()
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
		<CommandInput
			:id="HTMLElementId.MainSearchInput"
			ref="cmdInputRef"
			class="text-md h-12"
			placeholder="Search for apps or commands..."
		/>
		<CommandList class="h-full max-h-screen">
			<CommandEmpty>No results found.</CommandEmpty>
			<MainSearchListGroup v-for="(ext, idx) in exts" :key="ext.id" :ext="ext" />
		</CommandList>
		<CmdPaletteFooter />
	</CmdPaletteCommand>
</template>
