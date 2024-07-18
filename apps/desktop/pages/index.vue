<script setup lang="ts">
import { CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import { getExtensionsFolder, HTMLElementId } from "@/lib/constants"
import { AppsExtension } from "@/lib/extension/apps"
import type { IExtensionBase } from "@/lib/extension/base"
import { BuiltinCmds } from "@/lib/extension/builtin"
import { Extension } from "@/lib/extension/ext"
import { RemoteExtension } from "@/lib/extension/remoteExt"
import { SystemCommandExtension } from "@/lib/extension/systemCmds"
import { $appConfig } from "@/lib/stores/appConfig"
import { setSearchTerm } from "@/lib/stores/appState"
import { getActiveElementNodeName } from "@/lib/utils/dom"
import { useStore } from "@nanostores/vue"
import { getCurrent } from "@tauri-apps/api/window"
import { arch, platform } from "@tauri-apps/plugin-os"
import { useListenToWindowBlur } from "~/composables/useEvents"
import { ComboboxInput } from "radix-vue"

const { $dayjs } = useNuxtApp()
const appConfig = useStore($appConfig)
const appExt = new AppsExtension()
const sysCmdExt = new SystemCommandExtension()
const builtinCmdExt = new BuiltinCmds()
const devExt = new Extension("Dev Extensions", appConfig.value.devExtensionPath, true)
const storeExt = new Extension("Extensions", await getExtensionsFolder())
const remoteExt = new RemoteExtension()
const exts: IExtensionBase[] = [
  devExt,
  remoteExt,
  // storeExt,
  builtinCmdExt,
  sysCmdExt,
  appExt
]
const searchTermInSync = ref("")
let updateSearchTermTimeout: ReturnType<typeof setTimeout>

const appWindow = getCurrent()
const runtimeConfig = useRuntimeConfig()
const cmdInputRef = ref<InstanceType<typeof ComboboxInput> | null>(null)

useListenToWindowBlur(() => {
  if (!runtimeConfig.public.isDev) {
    appWindow.hide()
  }
})

useListenToWindowFocus(() => {
  cmdInputRef.value?.$el.querySelector("input").focus()
})

watch(searchTermInSync, (val) => {
  clearTimeout(updateSearchTermTimeout)
  updateSearchTermTimeout = setTimeout(() => {
    setSearchTerm(val)
  }, 100)
})

onMounted(() => {
  console.log($dayjs().format("YYYY-MM-DD HH:mm:ss"))
  if (platform() !== "macos") {
    appWindow.setDecorations(false)
  }
  Promise.all(exts.map((ext) => ext.load()))
})

// when close window if not focused on input. If input element has content, clear the content
onKeyStroke("Escape", (e) => {
  console.log("escape pressed")
  if (getActiveElementNodeName() === "INPUT") {
    if (searchTermInSync.value !== "") {
      searchTermInSync.value = ""
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
</script>
<template>
  <div class="h-full">
    <CmdPaletteCommand
      class=""
      v-model:searchTerm="searchTermInSync"
      :identity-filter="true"
      v-model:selected-value="highlightedItemValue"
    >
      <CommandInput
        :id="HTMLElementId.MainSearchInput"
        ref="cmdInputRef"
        class="h-12 text-md"
        placeholder="Search for apps or commands..."
      />
      <CommandList class="h-full">
        <CommandEmpty>No results found.</CommandEmpty>
        <MainSearchListGroup v-for="ext in exts" :ext="ext" />
      </CommandList>
      <CmdPaletteFooter />
    </CmdPaletteCommand>
  </div>
</template>
