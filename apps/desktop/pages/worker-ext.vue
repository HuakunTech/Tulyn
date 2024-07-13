<script setup lang="ts">
import { $appState } from "@/lib/stores/appState"
import { useStore } from "@nanostores/vue"
import { join } from "@tauri-apps/api/path"
import { exists, readTextFile } from "@tauri-apps/plugin-fs"
import { onKeyStroke } from "@vueuse/core"
import { loadManifest } from "~/lib/commands/extensions"
import {
  constructJarvisServerAPIWithPermissions,
  exposeApiToWorker,
  type AllJarvisPermission
} from "jarvis-api/ui"
import { toast } from "vue-sonner"

const appState = useStore($appState)

onKeyStroke("Escape", () => navigateTo("/"))

onMounted(async () => {
  const currentWorkerExt = appState.value.currentWorkerExt
  console.log("currentWorkerExt", currentWorkerExt)

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
  exposeApiToWorker(
    worker,
    constructJarvisServerAPIWithPermissions(
      ["clipboard:read-all", "notification:all", "fs:exists"]
      // (manifest.jarvis.permissions as unknown as AllJarvisPermission[]) ?? []
    )
  )
})
</script>
<template></template>
