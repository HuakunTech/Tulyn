<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Icon } from "@iconify/vue"
import { exists } from "@tauri-apps/plugin-fs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"
import { $appConfig, setDevExtentionPath } from "@/lib/stores/appConfig"
import { useStore } from "@nanostores/vue"
import { pathExists } from "tauri-plugin-jarvis-api/commands"
import { onMount } from "nanostores"
// import { loadDevExtManifests, loadExtManifests, $extensionsStore } from "@/lib/stores/extensions";
import { open } from "@tauri-apps/plugin-dialog"
import { Extension } from "@/lib/extension/ext"

const devExt = new Extension("Dev Extensions", $appConfig.get().devExtentionPath, true)
const { toast } = useToast()
const appConfig = useStore($appConfig)
const devExtPath = ref(appConfig.value.devExtentionPath)

const lock = ref(true)

async function pickDirectory() {
  const dir = await open({
    multiple: false,
    directory: true
  })

  if (dir && (await pathExists(dir))) {
    devExtPath.value = dir
    setDevExtentionPath(devExtPath.value)
    await devExt.load()
    toast({
      title: "Dev Extension Path Set",
      description: `${devExt.manifests.length} dev extensions loaded.`
    })
  } else {
    return toast({
      title: "Invalid Path",
      description: "Please enter an existing path",
      variant: "destructive"
    })
  }
}

function clear() {
  devExtPath.value = undefined
  return setDevExtentionPath(devExtPath.value)
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
      <Icon icon="material-symbols:delete-outline" class="w-5 h-5 ml-1" />
    </Button>
    <Button size="sm" type="button" @click="pickDirectory">
      Edit
      <Icon icon="flowbite:edit-outline" class="w-5 h-5 ml-1" />
    </Button>
  </div>
</template>
