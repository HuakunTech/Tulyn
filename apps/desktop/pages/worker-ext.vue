<script setup lang="ts">
import CmdInput from "@/components/cmd-palette/CommandInput.vue"
import ExtTemplateListView from "@/components/ExtTemplate/ListView.vue"
import { $appState } from "@/lib/stores/appState"
import { expose, type Remote } from "@huakunshen/comlink"
import { useStore } from "@nanostores/vue"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { join } from "@tauri-apps/api/path"
import { exists, readTextFile } from "@tauri-apps/plugin-fs"
import { onKeyStroke } from "@vueuse/core"
import { loadManifest } from "~/lib/commands/extensions"
import {
  constructJarvisServerAPIWithPermissions,
  exposeApiToWorker,
  getWorkerApiClient
} from "jarvis-api/ui"
import { ListView, wrap, type IWorkerExtensionBase } from "jarvis-api/ui/worker"
import { toast } from "vue-sonner"

const appState = useStore($appState)
let workerAPI: Remote<IWorkerExtensionBase> | undefined = undefined
const viewContent = ref<ListView>()
const extStore = useExtStore()

onKeyStroke("Escape", () => navigateTo("/"))

function render(view: ListView) {
  // viewContent.value = value
  viewContent.value = view
  console.log("render", view)
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

  const manifest = await loadManifest(manifestPath)

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

  const workerScript = await readTextFile(scriptPath)
  const blob = new Blob([workerScript], { type: "application/javascript" })
  const blobURL = URL.createObjectURL(blob)
  const worker = new Worker(blobURL)
  // Expose Jarvis APIs to worker with permissions constraints
  exposeApiToWorker(worker, {
    ...constructJarvisServerAPIWithPermissions(manifest.jarvis.permissions),
    render
  })
  // exposeApiToWorker(worker, { render }) // Expose render function to worker
  workerAPI = wrap<IWorkerExtensionBase>(worker) // Call worker exposed APIs
  await workerAPI.load()
})

function onSearchTermChange(searchTerm: string) {
  workerAPI?.onSearchTermChange(searchTerm)
}

const searchTerm = ref("")
</script>
<template>
  <CmdPaletteCommand
    class=""
    v-model:searchTerm="searchTerm"
    @update:search-term="onSearchTermChange"
    @update:model-value="(v) => workerAPI?.onItemSelected(v as string)"
    :identity-filter="true"
  >
    <CmdInput
      id="worker-ext-search-input"
      class="h-12 text-md"
      placeholder="Search for apps or commands..."
    >
      <Button size="icon" variant="outline" @click="() => navigateTo('/')">
        <ArrowLeftIcon />
      </Button>
    </CmdInput>
    <ExtTemplateListView v-if="viewContent" :model-value="viewContent" />
    <CmdPaletteFooter />
  </CmdPaletteCommand>
</template>
