<script setup lang="ts">
import ExtTemplateListView from "@/components/ExtTemplate/ListView.vue"
import { $appState } from "@/lib/stores/appState"
import { type Remote } from "@huakunshen/comlink"
import { db } from "@kksh/api/commands"
import {
	constructJarvisServerAPIWithPermissions,
	exposeApiToWorker,
	type IUiWorker
} from "@kksh/api/ui"
import {
	// constructJarvisExtDBToServerDbAPI,
	FormNodeNameEnum,
	FormSchema,
	ListSchema,
	NodeNameEnum,
	wrap,
	type IComponent,
	type IDb,
	type WorkerExtension
} from "@kksh/api/ui/worker"
import { useStore } from "@nanostores/vue"
import type { UnlistenFn } from "@tauri-apps/api/event"
import { join } from "@tauri-apps/api/path"
import { exists, readTextFile } from "@tauri-apps/plugin-fs"
import { debug } from "@tauri-apps/plugin-log"
import { loadExtensionManifestFromDisk } from "~/lib/commands/extensions"
import { GlobalEventBus } from "~/lib/utils/events"
import { buildFieldConfig, convertFormToZod } from "~/lib/utils/form"
import { listenToRefreshWorkerExt } from "~/lib/utils/tauri-events"
import { useExtDisplayStore } from "~/stores/extState"
import { parse } from "valibot"
import { toast } from "vue-sonner"

const localePath = useLocalePath()
const appState = useStore($appState)
const loaded = ref(false)
let workerAPI: Remote<WorkerExtension> | undefined = undefined
const loading = ref(false)
const listViewContent = ref<ListSchema.List>()
const formViewContent = ref<FormSchema.Form>()
const formFieldConfig = ref({})
const formViewZodSchema = ref<any>()
const extStateStore = useExtDisplayStore()
const appUiStore = useAppUiStore()
const searchTerm = ref("")
const searchBarPlaceholder = ref("")
const listViewRef = ref<{ onActionSelected: () => void }>()
let unlistenRefreshWorkerExt: UnlistenFn | undefined

const extUiAPI: IUiWorker = {
	async render(view: IComponent<ListSchema.List | FormSchema.Form>) {
		console.log("render called", view)
		if (view.nodeName === NodeNameEnum.List) {
			formViewContent.value = undefined
			listViewContent.value = parse(ListSchema.List, view)
		} else if (view.nodeName === FormNodeNameEnum.Form) {
			listViewContent.value = undefined
			const parsedForm = parse(FormSchema.Form, view)
			formViewContent.value = parsedForm
			const zodSchema = convertFormToZod(parsedForm)
			formViewZodSchema.value = zodSchema
			formFieldConfig.value = buildFieldConfig(parsedForm)
			console.log("fieldConfig", formFieldConfig.value)
			console.log(zodSchema)
		}
	},
	async setScrollLoading(_loading: boolean) {
		loading.value = _loading
	},
	async setSearchTerm(term: string) {
		searchTerm.value = term
	},
	async setSearchBarPlaceholder(placeholder: string) {
		searchBarPlaceholder.value = placeholder
	}
}

function onActionSelected(actionVal: string) {
	listViewRef.value?.onActionSelected()
	if (workerAPI && workerAPI.onActionSelected) {
		workerAPI.onActionSelected(actionVal)
	}
}

async function launchWorkerExt() {
	const currentWorkerExt = extStateStore.currentWorkerExt
	if (!currentWorkerExt) {
		toast.error("No worker extension selected")
		return navigateTo(localePath("/"))
	}
	const manifest = await loadExtensionManifestFromDisk(
		await join(currentWorkerExt.manifest.extPath, "package.json")
	)
	if (!exists(manifest.extPath)) {
		toast.error("Worker extension not found")
		return navigateTo(localePath("/"))
	}

	const cmd = manifest.kunkun.templateUiCmds.find((cmd) => cmd.name === currentWorkerExt.cmdName)
	if (!cmd) {
		toast.error(`Worker extension command ${currentWorkerExt.cmdName} not found`)
		return navigateTo(localePath("/"))
	}
	const scriptPath = await join(manifest.extPath, cmd.main)
	if (!exists(scriptPath)) {
		toast.error(`Worker extension script ${cmd.main} not found`)
		return navigateTo(localePath("/"))
	}
	const extInfoInDB = await db.getExtensionByIdentifier(manifest.kunkun.identifier)
	if (!extInfoInDB) {
		toast.error("Unexpected Error", {
			description: `Worker extension ${manifest.kunkun.identifier} not found in database. Run Troubleshooter.`
		})
		return navigateTo(localePath("/"))
	}

	const workerScript = await readTextFile(scriptPath)
	const blob = new Blob([workerScript], { type: "application/javascript" })
	const blobURL = URL.createObjectURL(blob)
	const worker = new Worker(blobURL)
	// Expose Jarvis APIs to worker with permissions constraints
	const serverAPI: Record<string, any> = constructJarvisServerAPIWithPermissions(
		manifest.kunkun.permissions
	)
	serverAPI.iframeUi = undefined
	serverAPI.workerUi = extUiAPI
	serverAPI.db = new db.JarvisExtDB(extInfoInDB.extId)
	// const extDBApi: IDb = constructJarvisExtDBToServerDbAPI(dbAPI)
	exposeApiToWorker(worker, serverAPI)
	// exposeApiToWorker(worker, {
	// 	...constructJarvisServerAPIWithPermissions(manifest.kunkun.permissions),
	// 	...extUiAPI,
	// 	...extDBApi
	// })
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
	setTimeout(() => {
		loaded.value = true
	}, 300)
})

onUnmounted(() => {
	unlistenRefreshWorkerExt?.()
	GlobalEventBus.offActionSelected(onActionSelected)
})
</script>
<template>
	<FunDance v-if="!loaded" />

	<ExtTemplateFormView
		v-if="loaded && formViewContent && formViewZodSchema"
		:workerAPI="workerAPI!"
		:formViewZodSchema="formViewZodSchema"
		:fieldConfig="formFieldConfig"
	/>
	<ExtTemplateListView
		v-else-if="loaded && listViewContent"
		class=""
		v-model:search-term="searchTerm"
		v-model:search-bar-placeholder="searchBarPlaceholder"
		ref="listViewRef"
		:model-value="listViewContent"
		:workerAPI="workerAPI!"
		:loading="loading"
	/>
</template>
