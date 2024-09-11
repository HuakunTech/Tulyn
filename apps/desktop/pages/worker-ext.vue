<script setup lang="ts">
import ExtTemplateListView from "@/components/ExtTemplate/ListView.vue"
import { $appState } from "@/lib/stores/appState"
import { type Remote } from "@huakunshen/comlink"
import { db } from "@kksh/api/commands"
import type { ExtPackageJsonExtra } from "@kksh/api/models"
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
	MarkdownSchema,
	NodeNameEnum,
	wrap,
	type IComponent,
	type IDb,
	type WorkerExtension
} from "@kksh/api/ui/worker"
import { useStore } from "@nanostores/vue"
import type { UnlistenFn } from "@tauri-apps/api/event"
import { join } from "@tauri-apps/api/path"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { exists, readTextFile } from "@tauri-apps/plugin-fs"
import { debug } from "@tauri-apps/plugin-log"
import { loadExtensionManifestFromDisk } from "~/lib/commands/extensions"
import { GlobalEventBus } from "~/lib/utils/events"
import { buildFieldConfig, convertFormToZod } from "~/lib/utils/form"
import { sendNotificationWithPermission } from "~/lib/utils/notification"
import { listenToRefreshWorkerExt } from "~/lib/utils/tauri-events"
import { useExtDisplayStore } from "~/stores/extState"
import { Command, executeBashScript } from "tauri-plugin-shellx-api"
import { parse } from "valibot"
import * as v from "valibot"
import { toast } from "vue-sonner"

definePageMeta({
	layout: "ui-only"
})
const localePath = useLocalePath()
const route = useRoute()
const appWin = getCurrentWindow()
const appState = useStore($appState)
const loaded = ref(false)
let workerAPI: Remote<WorkerExtension> | undefined = undefined
const loading = ref(false)
const listViewContent = ref<ListSchema.List>()
const formViewContent = ref<FormSchema.Form>()
const markdownViewContent = ref<MarkdownSchema>()
const formFieldConfig = ref({})
const formViewZodSchema = ref<any>()
const extUrl = ref<string>()
// const extStateStore = useExtDisplayStore()
const appUiStore = useAppUiStore()
const searchTerm = ref("")
const searchBarPlaceholder = ref("")
const listViewRef = ref<{ onActionSelected: () => void }>()
const loadedExt = ref<ExtPackageJsonExtra>()
let unlistenRefreshWorkerExt: UnlistenFn | undefined

function clearViewContent(keep?: "list" | "form" | "markdown") {
	if (keep !== "list") {
		listViewContent.value = undefined
	}
	if (keep !== "form") {
		formViewContent.value = undefined
	}
	if (keep !== "markdown") {
		markdownViewContent.value = undefined
	}
}

function goBack() {
	if (appWin.label === "main") {
		navigateTo(localePath("/"))
	} else {
		appWin.close()
	}
}

const extUiAPI: IUiWorker = {
	async render(view: IComponent<ListSchema.List | FormSchema.Form>) {
		if (view.nodeName === NodeNameEnum.List) {
			clearViewContent("list")
			const parsedListView = parse(ListSchema.List, view)
			if (parsedListView.updateDetailOnly) {
				if (listViewContent.value) {
					listViewContent.value.detail = parsedListView.detail
				} else {
					listViewContent.value = parsedListView
				}
			} else {
				listViewContent.value = parsedListView
			}
		} else if (view.nodeName === FormNodeNameEnum.Form) {
			listViewContent.value = undefined
			clearViewContent("form")
			const parsedForm = parse(FormSchema.Form, view)
			formViewContent.value = parsedForm
			const zodSchema = convertFormToZod(parsedForm)
			formViewZodSchema.value = zodSchema
			formFieldConfig.value = buildFieldConfig(parsedForm)
		} else if (view.nodeName === NodeNameEnum.Markdown) {
			clearViewContent("markdown")
			markdownViewContent.value = parse(MarkdownSchema, view)
		} else {
			toast.error(`Unsupported view type: ${view.nodeName}`)
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
	},
	async goBack() {
		goBack()
	}
}

function onActionSelected(actionVal: string) {
	listViewRef.value?.onActionSelected()
	if (workerAPI && workerAPI.onActionSelected) {
		workerAPI.onActionSelected(actionVal)
	}
}

async function launchWorkerExt() {
	// const currentWorkerExt = extStateStore.currentWorkerExt
	const route = useRoute()
	console.log(route.query)
	// const parseUrl = v.safeParse(v.string(), route.query.url)

	// if (!parseUrl.success) {
	// 	sendNotificationWithPermission("Invalid Extension URL", "")
	// 	if (appWin.label !== "main") {
	// 		return appWin.close()
	// 	} else {
	// 		return navigateTo(localePath("/"))
	// 	}
	// }
	// extUrl.value = parseUrl.output
	const parseExtPath = v.safeParse(v.string(), route.query.extPath)
	if (!parseExtPath.success) {
		sendNotificationWithPermission("Invalid Extension Path", "")
		return goBack()
	}
	const extPath = parseExtPath.output
	const parseCmdName = v.safeParse(v.string(), route.query.cmdName)
	if (!parseCmdName.success) {
		console.error("Invalid Command Name")

		sendNotificationWithPermission("Invalid Command Name", "")
		return goBack()
	}
	const cmdName = parseCmdName.output
	try {
		loadedExt.value = await loadExtensionManifestFromDisk(await join(extPath, "package.json"))
	} catch (error) {
		console.error("Error loading extension", error)
		sendNotificationWithPermission("Error loading extension", "")
		goBack()
	}
	if (!loadedExt.value) {
		console.error("No loaded extension")
		return
	}
	// const identifier = loadedExt.value.kunkun.identifier
	// if (!identifier) {
	// 	return navigateTo(localePath("/"))
	// }

	// if (!currentWorkerExt) {
	// 	toast.error("No worker extension selected")
	// 	return navigateTo(localePath("/"))
	// }
	// const manifest = await loadExtensionManifestFromDisk(
	// 	await join(currentWorkerExt.manifest.extPath, "package.json")
	// )
	// if (!exists(manifest.extPath)) {
	// 	toast.error("Worker extension not found")
	// 	return navigateTo(localePath("/"))
	// }

	const cmd = loadedExt.value.kunkun.templateUiCmds.find((cmd) => cmd.name === cmdName)
	if (!cmd) {
		toast.error(`Worker extension command ${cmdName} not found`)
		return goBack()
	}
	const scriptPath = await join(loadedExt.value.extPath, cmd.main)
	if (!exists(scriptPath)) {
		toast.error(`Worker extension script ${cmd.main} not found`)
		return goBack()
	}
	const extInfoInDB = await db.getExtensionByIdentifier(loadedExt.value.kunkun.identifier)
	if (!extInfoInDB) {
		toast.error("Unexpected Error", {
			description: `Worker extension ${loadedExt.value.kunkun.identifier} not found in database. Run Troubleshooter.`
		})
		return goBack()
	}

	const workerScript = await readTextFile(scriptPath)
	const blob = new Blob([workerScript], { type: "application/javascript" })
	const blobURL = URL.createObjectURL(blob)
	const worker = new Worker(blobURL)
	// Expose Jarvis APIs to worker with permissions constraints
	const serverAPI: Record<string, any> = constructJarvisServerAPIWithPermissions(
		loadedExt.value.kunkun.permissions,
		loadedExt.value.extPath
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
	setTimeout(() => {
		appWin.show()
	}, 100)
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
	<ExtTemplateMarkdownView
		v-else-if="loaded && markdownViewContent"
		:markdown="markdownViewContent.content"
	/>
</template>
