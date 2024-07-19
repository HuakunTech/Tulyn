<script setup lang="ts">
import CmdInput from "@/components/cmd-palette/CommandInput.vue"
import ExtTemplateListView from "@/components/ExtTemplate/ListView.vue"
import { Command } from "@/components/ui/command"
import { HTMLElementId } from "@/lib/constants"
import { $appState } from "@/lib/stores/appState"
import { expose, type Remote } from "@huakunshen/comlink"
import { useStore } from "@nanostores/vue"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { join } from "@tauri-apps/api/path"
import { exists, readTextFile } from "@tauri-apps/plugin-fs"
import { debug } from "@tauri-apps/plugin-log"
import { onKeyStroke } from "@vueuse/core"
import { loadExtensionManifestFromDisk } from "~/lib/commands/extensions"
import { GlobalEventBus } from "~/lib/utils/events"
import { db, JarvisExtDB } from "jarvis-api/commands"
import {
  constructJarvisServerAPIWithPermissions,
  exposeApiToWorker,
  getWorkerApiClient,
  type IUi
} from "jarvis-api/ui"
import {
  convertJarvisExtDBToServerDbAPI,
  List,
  NodeNameEnum,
  wrap,
  type IComponent,
  type IDbServer,
  type ListSchema,
  type WorkerExtension
} from "jarvis-api/ui/worker"
import type { ComboboxInput } from "radix-vue"
import { toast } from "vue-sonner"

const appState = useStore($appState)
let workerAPI: Remote<WorkerExtension> | undefined = undefined
const loading = ref(false)
const viewContent = ref<ListSchema.List>()
const extStore = useExtStore()
const cmdInputRef = ref<InstanceType<typeof ComboboxInput> | null>(null)
const appUiStore = useAppUiStore()
const searchTerm = ref("")
const searchBarPlaceholder = ref("")
function getWorkerExtInputEle(): HTMLInputElement | null {
  return cmdInputRef.value?.$el.querySelector("input")
}

useListenToWindowFocus(() => {
  getWorkerExtInputEle()?.focus()
})

onKeyStroke("Escape", () => {
  if (document.activeElement === getWorkerExtInputEle()) {
    return navigateTo("/")
  } else {
    getWorkerExtInputEle()?.focus()
  }
})

const extUiAPI: IUi = {
  async render(view: IComponent<ListSchema.List>) {
    viewContent.value = view
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

onMounted(async () => {
  const currentWorkerExt = extStore.currentWorkerExt
  if (!currentWorkerExt) {
    toast.error("No worker extension selected")
    return navigateTo("/")
  }
  if (!exists(currentWorkerExt.extPath)) {
    toast.error("Worker extension not found")
    return navigateTo("/")
  }
  const manifestPath = await join(currentWorkerExt.extPath, "package.json")
  if (!exists(manifestPath)) {
    toast.error("Worker extension manifest not found")
    return navigateTo("/")
  }

  const manifest = await loadExtensionManifestFromDisk(manifestPath)
  const cmd = manifest.jarvis.inlineCmds.find((cmd) => cmd.name === currentWorkerExt.cmdName)
  if (!cmd) {
    toast.error(`Worker extension command ${currentWorkerExt.cmdName} not found`)
    return navigateTo("/")
  }
  const scriptPath = await join(manifest.extPath, cmd.main)
  if (!exists(scriptPath)) {
    toast.error(`Worker extension script ${cmd.main} not found`)
    return navigateTo("/")
  }
  const extInfoInDB = await db.getExtensionByIdentifier(manifest.jarvis.identifier)
  if (!extInfoInDB) {
    toast.error("Unexpected Error", {
      description: `Worker extension ${manifest.jarvis.identifier} not found in database. Run Troubleshooter.`
    })
    return navigateTo("/")
  }

  const workerScript = await readTextFile(scriptPath)
  const blob = new Blob([workerScript], { type: "application/javascript" })
  const blobURL = URL.createObjectURL(blob)
  const worker = new Worker(blobURL)
  // Expose Jarvis APIs to worker with permissions constraints
  const dbAPI = new db.JarvisExtDB(extInfoInDB.extId)
  const extDBApi: IDbServer = convertJarvisExtDBToServerDbAPI(dbAPI)
  exposeApiToWorker(worker, {
    ...constructJarvisServerAPIWithPermissions(manifest.jarvis.permissions),
    ...extUiAPI,
    ...extDBApi
  })
  // exposeApiToWorker(worker, { render }) // Expose render function to worker
  workerAPI = wrap<WorkerExtension>(worker) // Call worker exposed APIs
  await workerAPI.load()

  // cmdInputRef.value = document.getElementById(HTMLElementId.WorkerExtInputId) as HTMLElement | null
  GlobalEventBus.onActionSelected(onActionSelected)
})

onUnmounted(() => {
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
  workerAPI?.onHighlightedItemChanged(itemValue)
  const item = viewContent.value?.items?.find((item) => item.value === itemValue)
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
  <Command
    class=""
    v-model:searchTerm="searchTerm"
    @update:search-term="onSearchTermChange"
    @update:model-value="(v) => workerAPI?.onItemSelected((v as ListSchema.Item).value)"
    v-model:selected-value="highlightedItemValue"
    :identity-filter="false"
    :filterFunction="(items, term) => filterFunction(items as ListSchema.Item[], term)"
  >
    <CmdInput
      :id="HTMLElementId.WorkerExtInputId"
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
      v-if="viewContent"
      :model-value="viewContent"
      :workerAPI="workerAPI!"
      :loading="loading"
    />
    <CmdPaletteFooter />
  </Command>
</template>
