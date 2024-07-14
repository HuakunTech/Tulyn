<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Extension } from "@/lib/extension/ext"
import { $appConfig, setDevExtensionPath } from "@/lib/stores/appConfig"
import { Icon } from "@iconify/vue"
import { useStore } from "@nanostores/vue"
// import { loadDevExtManifests, loadExtManifests, $extensionsStore } from "@/lib/stores/extensions";
import { open } from "@tauri-apps/plugin-dialog"
import { exists } from "@tauri-apps/plugin-fs"
import { debug } from "@tauri-apps/plugin-log"
import { onMount } from "nanostores"
import { pathExists } from "tauri-plugin-jarvis-api/commands"
import { onMounted, ref } from "vue"
import { toast } from "vue-sonner"

const devExt = new Extension("Dev Extensions", $appConfig.get().devExtensionPath, true)
const appConfig = useStore($appConfig)
const devExtPath = ref(appConfig.value.devExtensionPath)
const lock = ref(true)

async function pickDirectory() {
  const dir = await open({
    multiple: false,
    directory: true
  })
  debug(`dir: ${dir}`)
  if (dir && (await pathExists(dir))) {
    devExtPath.value = dir
    await setDevExtensionPath(devExtPath.value)
    console.log($appConfig.get().devExtensionPath)

    await devExt.load()
    toast.success("Dev Extension Path Set", {
      description: `${devExt.manifests.length} dev extensions loaded.`
    })
  } else {
    return toast.error("Invalid Path")
  }
}

function clear() {
  devExtPath.value = undefined
  return setDevExtensionPath(devExtPath.value)
    .then(() => {
      return toast({
        title: "Cleared"
      })
    })
    .catch(() => {
      return toast({
        title: "Failed To Clear",
        variant: "destructive"
      })
    })
}
</script>

<template>
  <div class="flex w-full items-center gap-1.5">
    <Input
      id="dev-ext-path"
      type="path"
      placeholder="Enter Path"
      v-model="devExtPath"
      :disabled="lock"
    />
    <Button size="sm" type="button" @click="clear">
      Clear
      <Icon name="material-symbols:delete-outline" class="w-5 h-5 ml-1" />
    </Button>
    <Button size="sm" type="button" @click="pickDirectory">
      Edit
      <Icon name="flowbite:edit-outline" class="w-5 h-5 ml-1" />
    </Button>
  </div>
</template>
