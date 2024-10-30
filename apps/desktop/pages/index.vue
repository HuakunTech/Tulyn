<script setup lang="ts">
import ListItem from "@/components/MainSearch/list-item.vue"
import { CommandEmpty, CommandGroup, CommandList } from "@/components/ui/command"
import { getActiveElementNodeName } from "@/lib/utils/dom"
import { getPeers } from "@kksh/api/commands"
import { getVersion } from "@tauri-apps/api/app"
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { platform } from "@tauri-apps/plugin-os"
import { useListenToWindowBlur } from "~/composables/useEvents"
import { CmdListItemValue, ExtCmdListItemValue, ListItemTypeEnum } from "~/lib/types/list"
import { checkExtensionUpdate, checkUpdateAndInstall } from "~/lib/utils/updater"
import { useAppConfigStore } from "~/stores/appConfig"
import { useAppsLoaderStore } from "~/stores/appLoader"
import { useAppStateStore } from "~/stores/appState"
import { useBuiltInCmdStore } from "~/stores/builtinCmdLoader"
import { useLastTimeStore } from "~/stores/lastTime"
import { findAllArgsInLink, useQuicklinkLoader } from "~/stores/quickLink"
import { useRemoteCmdStore } from "~/stores/remoteCmds"
import { useSystemCmdsStore } from "~/stores/systemCmds"
import { useAppUiStore } from "~/stores/ui"
import { ComboboxInput } from "radix-vue"
import { flatten, parse, safeParse } from "valibot"
import { toast } from "vue-sonner"
import { z } from "zod"

const builtinCmdStore = useBuiltInCmdStore()
const appsStore = useAppsLoaderStore()
const sysCmdsStore = useSystemCmdsStore()
const appStateStore = useAppStateStore()
const appUiStore = useAppUiStore()
const remoteCmdStore = useRemoteCmdStore()
const extStore = useExtensionStore()
const appConfig = useAppConfigStore()
const lastTimeStore = useLastTimeStore()
const quicklinkLoader = useQuicklinkLoader()
const extLoaders = ref([
	extStore,
	quicklinkLoader,
	builtinCmdStore,
	remoteCmdStore,
	sysCmdsStore,
	appsStore
])

const appWindow = getCurrentWindow()
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

onMounted(async () => {
	await appConfig.init()
	await lastTimeStore.init()
	appUiStore.setDefaultAction("Open")
	if (appWindow.label !== "main") {
		setTimeout(() => {
			toast.error("Non-main window should not open this page.")
			appWindow.close()
		}, 2_000)
	}
	if (platform() !== "macos") {
		appWindow.setDecorations(false)
	}

	getVersion().then((v) => {
		const isBeta = v.includes("beta")
		if (lastTimeStore.expired()) {
			checkUpdateAndInstall()
			if (isBeta || appConfig.joinBetaProgram) {
				checkUpdateAndInstall(true)
			}
			checkExtensionUpdate(appConfig.extensionAutoUpgrade)
			lastTimeStore.update()
		}
	})
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
		if (appStateStore.searchTermSync !== "") {
			appStateStore.setSearchTermSync("")
		} else {
			appWindow.close()
		}
	} else {
		appWindow.close()
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
const highlightedItemValue = ref<CmdListItemValue | string | undefined>()
watch(highlightedItemValue, (newVal, oldVal) => {
	if ((!newVal || (typeof newVal === "string" && (newVal as string).length === 0)) && oldVal) {
		setTimeout(() => {
			highlightedItemValue.value = oldVal
		}, 1)
		return
	}
	const parsedItemValue = parse(CmdListItemValue, newVal)
	if (parsedItemValue.type === ListItemTypeEnum.QuickLink) {
		const qlink = z.string().parse(parse(ExtCmdListItemValue, parsedItemValue.data).data)
		const args = findAllArgsInLink(qlink)
		quicklinkLoader.quickLinkInputs = args.map((arg) => ({
			name: arg,
			value: ""
		}))
	} else {
		quicklinkLoader.quickLinkInputs = []
	}
})

const searchTermSyncProxy = computed({
	get: () => appStateStore.searchTermSync,
	set: (val: string) => {
		appStateStore.setSearchTermSync(val)
	}
})

function handleQuicklinkEnter() {
	console.log("handleQuicklinkEnter", highlightedItemValue.value)
	if (highlightedItemValue.value === "") {
		return
	}
	const parse = safeParse(CmdListItemValue, highlightedItemValue.value)
	if (parse.success) {
		quicklinkLoader.onQuicklinkEnter(parse.output)
	} else {
		console.error("handleQuicklinkEnter error:", flatten<typeof CmdListItemValue>(parse.issues))
	}
}
</script>
<template>
	<div class="h-full grow">
		<CmdPaletteCommand
			class=""
			v-model:searchTerm="searchTermSyncProxy"
			:identity-filter="true"
			v-model:selected-value="highlightedItemValue"
		>
			<CmdPaletteMainSearchBar @quicklink-enter="handleQuicklinkEnter" />
			<CommandList class="h-full max-h-screen">
				<LoadingBar v-if="appStateStore.loadingBar" class="absolute" />
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup
					v-for="extLoader in extLoaders"
					:heading="extLoader.extensionName"
					:key="extLoader.id"
				>
					<ListItem
						v-for="(item, idx) in extLoader.$filteredListItems"
						:item="item"
						:key="`${extLoader.extensionName}-${idx}`"
						@select="extLoader.onSelect(item)"
					/>
				</CommandGroup>
			</CommandList>
			<CmdPaletteFooter />
		</CmdPaletteCommand>
	</div>
</template>
