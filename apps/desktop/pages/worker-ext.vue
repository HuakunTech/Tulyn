<script setup lang="ts">
import CmdInput from "@/components/cmd-palette/CommandInput.vue"
import ExtTemplateListView from "@/components/ExtTemplate/ListView.vue"
import { HTMLElementId } from "@/lib/constants"
import { $appState } from "@/lib/stores/appState"
import { expose, type Remote } from "@huakunshen/comlink"
import { db, JarvisExtDB } from "@kksh/api/commands"
import {
	constructJarvisServerAPIWithPermissions,
	exposeApiToWorker,
	getWorkerApiClient,
	type IUiWorkerServer
} from "@kksh/api/ui"
import {
	constructJarvisExtDBToServerDbAPI,
	FormNodeNameEnum,
	FormSchema,
	List,
	ListSchema,
	NodeNameEnum,
	wrap,
	type IComponent,
	type IDbServer,
	type WorkerExtension
} from "@kksh/api/ui/worker"
import { AutoForm } from "@kksh/vue/auto-form"
import { Button } from "@kksh/vue/button"
import { useStore } from "@nanostores/vue"
import { ArrowLeftIcon } from "@radix-icons/vue"
import type { UnlistenFn } from "@tauri-apps/api/event"
import { join } from "@tauri-apps/api/path"
import { exists, readTextFile } from "@tauri-apps/plugin-fs"
import { debug } from "@tauri-apps/plugin-log"
import { onKeyStroke } from "@vueuse/core"
import { Command, CommandList } from "~/components/ui/command"
import { loadExtensionManifestFromDisk } from "~/lib/commands/extensions"
import { GlobalEventBus } from "~/lib/utils/events"
import { convertFormToZod } from "~/lib/utils/form"
import { listenToRefreshWorkerExt } from "~/lib/utils/tauri-events"
import type { ComboboxInput } from "radix-vue"
import { flatten, parse, safeParse } from "valibot"
import { toast } from "vue-sonner"

const appState = useStore($appState)
let workerAPI: Remote<WorkerExtension> | undefined = undefined
const loading = ref(false)
const listViewContent = ref<ListSchema.List>()
const formViewContent = ref<FormSchema.Form>()
const formViewZodSchema = ref<any>()
const extStore = useExtStore()
const cmdInputRef = ref<InstanceType<typeof ComboboxInput> | null>(null)
const appUiStore = useAppUiStore()
const searchTerm = ref("")
const searchBarPlaceholder = ref("")
function getWorkerExtInputEle(): HTMLInputElement | null {
	return cmdInputRef.value?.$el.querySelector("input")
}
let unlistenRefreshWorkerExt: UnlistenFn | undefined

useListenToWindowFocus(() => {
	getWorkerExtInputEle()?.focus()
})

onKeyStroke("Escape", () => {
	if (document.activeElement === getWorkerExtInputEle()) {
		if (searchTerm.value.length > 0) {
			searchTerm.value = ""
			return
		} else {
			return navigateTo("/")
		}
	} else {
		getWorkerExtInputEle()?.focus()
	}
})

const extUiAPI: IUiWorkerServer = {
	async workerUiRender(view: IComponent<ListSchema.List | FormSchema.Form>) {
		console.log("render called", view)
		if (view.nodeName === NodeNameEnum.List) {
			formViewContent.value = undefined
			listViewContent.value = parse(ListSchema.List, view)
		} else if (view.nodeName === FormNodeNameEnum.Form) {
			listViewContent.value = undefined
			formViewContent.value = parse(FormSchema.Form, view)
			console.log("parsed form", parse(FormSchema.Form, view))
			const zodSchema = convertFormToZod(parse(FormSchema.Form, view))
			formViewZodSchema.value = zodSchema
			console.log(zodSchema)
		}
	},
	async workerUiSetScrollLoading(_loading: boolean) {
		loading.value = _loading
	},
	async workerUiSetSearchTerm(term: string) {
		searchTerm.value = term
	},
	async workerUiSetSearchBarPlaceholder(placeholder: string) {
		searchBarPlaceholder.value = placeholder
	}
}

function onActionSelected(actionVal: string) {
	getWorkerExtInputEle()?.focus() // Focus back to worker extension search input box
	if (workerAPI && workerAPI.onActionSelected) {
		workerAPI.onActionSelected(actionVal)
	}
}

function onEnterKeyPressed() {
	if (workerAPI) {
		debug("Enter key pressed")
		workerAPI.onEnterPressedOnSearchBar()
	}
}

async function launchWorkerExt() {
	const currentWorkerExt = extStore.currentWorkerExt
	if (!currentWorkerExt) {
		toast.error("No worker extension selected")
		return navigateTo("/")
	}
	const manifest = await loadExtensionManifestFromDisk(
		await join(currentWorkerExt.manifest.extPath, "package.json")
	)
	if (!exists(manifest.extPath)) {
		toast.error("Worker extension not found")
		return navigateTo("/")
	}

	const cmd = manifest.kunkun.templateUiCmds.find((cmd) => cmd.name === currentWorkerExt.cmdName)
	if (!cmd) {
		toast.error(`Worker extension command ${currentWorkerExt.cmdName} not found`)
		return navigateTo("/")
	}
	const scriptPath = await join(manifest.extPath, cmd.main)
	if (!exists(scriptPath)) {
		toast.error(`Worker extension script ${cmd.main} not found`)
		return navigateTo("/")
	}
	const extInfoInDB = await db.getExtensionByIdentifier(manifest.kunkun.identifier)
	if (!extInfoInDB) {
		toast.error("Unexpected Error", {
			description: `Worker extension ${manifest.kunkun.identifier} not found in database. Run Troubleshooter.`
		})
		return navigateTo("/")
	}

	const workerScript = await readTextFile(scriptPath)
	const blob = new Blob([workerScript], { type: "application/javascript" })
	const blobURL = URL.createObjectURL(blob)
	const worker = new Worker(blobURL)
	// Expose Jarvis APIs to worker with permissions constraints
	const dbAPI = new db.JarvisExtDB(extInfoInDB.extId)
	const extDBApi: IDbServer = constructJarvisExtDBToServerDbAPI(dbAPI)
	exposeApiToWorker(worker, {
		...constructJarvisServerAPIWithPermissions(manifest.kunkun.permissions),
		...extUiAPI,
		...extDBApi
	})
	// exposeApiToWorker(worker, { render }) // Expose render function to worker
	workerAPI = wrap<WorkerExtension>(worker) // Call worker exposed APIs
	await workerAPI.load()
}

onMounted(async () => {
	unlistenRefreshWorkerExt = await listenToRefreshWorkerExt(() => {
		debug("Refreshing Worker Extension")
		launchWorkerExt()
	})
	launchWorkerExt()
	GlobalEventBus.onActionSelected(onActionSelected)
})

onUnmounted(() => {
	unlistenRefreshWorkerExt?.()
	GlobalEventBus.offActionSelected(onActionSelected)
})

function onSearchTermChange(searchTerm: string) {
	workerAPI?.onSearchTermChange(searchTerm)
}

function filterFunction(items: ListSchema.Item[], searchTerm: string) {
	return items.filter((item) => {
		if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
			return true
		}
		for (const keyword of item?.keywords ?? []) {
			if (keyword.toLowerCase().includes(searchTerm.toLowerCase())) {
				return true
			}
		}
		return false
	})
}

function onHighlightedItemChanged(itemValue: string) {
	workerAPI?.onHighlightedListItemChanged(itemValue)
	const item = listViewContent.value?.items?.find((item) => item.value === itemValue)
	appUiStore.setActionPanel(item?.actions)
	appUiStore.setDefaultAction(item?.defaultAction)
}

/* ------ Preserve highlighted item when mouse moves away from the list ----- */
const highlightedItemValue = ref<ListSchema.Item | undefined>()
watch(highlightedItemValue, (newVal, oldVal) => {
	if (!newVal && oldVal) {
		setTimeout(() => {
			highlightedItemValue.value = oldVal
		}, 1)
	}
	if (newVal) {
		onHighlightedItemChanged(newVal.value)
	}
})
</script>
<template>
	<!-- <pre>{{ JSON.stringify(formViewContent ?? {}, null, 2) }}</pre> -->
	<AutoForm v-if="formViewContent && formViewZodSchema" :schema="formViewZodSchema" />
	<Command
		class=""
		:id="HTMLElementId.WorkerExtInputId"
		v-model:searchTerm="searchTerm"
		@update:search-term="onSearchTermChange"
		@update:model-value="(v) => workerAPI?.onListItemSelected((v as ListSchema.Item).value)"
		v-model:selected-value="highlightedItemValue"
		:identity-filter="false"
		:filterFunction="(items, term) => filterFunction(items as ListSchema.Item[], term)"
	>
		<CmdInput
			ref="cmdInputRef"
			class="text-md h-12"
			:placeholder="searchBarPlaceholder ?? 'Search...'"
			@keydown.enter="onEnterKeyPressed"
		>
			<Button size="icon" variant="outline" @click="() => navigateTo('/')">
				<ArrowLeftIcon />
			</Button>
		</CmdInput>
		<ExtTemplateListView
			v-if="listViewContent"
			class=""
			:model-value="listViewContent"
			:workerAPI="workerAPI!"
			:loading="loading"
		/>
		<CommandList v-else class="h-full"></CommandList>
		<CmdPaletteFooter />
	</Command>
</template>
