<script setup lang="ts">
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command"
import { getExtensionsFolder } from "@/lib/constants"
import { AppsExtension } from "@/lib/extension/apps"
import type { IExtensionBase } from "@/lib/extension/base"
import { BuiltinCmds } from "@/lib/extension/builtin"
import { Extension } from "@/lib/extension/ext"
import { RemoteExtension } from "@/lib/extension/remoteExt"
import { SystemCommandExtension } from "@/lib/extension/systemCmds"
import { $appConfig } from "@/lib/stores/appConfig"
import { $appState, setSearchTerm } from "@/lib/stores/appState"
import { getActiveElementNodeName } from "@/lib/utils/dom"
import { getCurrent } from "@tauri-apps/api/window"

const appExt = new AppsExtension()
const sysCmdExt = new SystemCommandExtension()
const builtinCmdExt = new BuiltinCmds()
const devExt = new Extension("Dev Extensions", $appConfig.get().devExtentionPath, true)
const storeExt = new Extension("Extensions", await getExtensionsFolder())
const remoteExt = new RemoteExtension()
const exts: IExtensionBase[] = [devExt, remoteExt, storeExt, builtinCmdExt, sysCmdExt, appExt]
const searchTermInSync = ref("")
let updateSearchTermTimeout: ReturnType<typeof setTimeout>

const curWin = getCurrent()
const rtConfig = useRuntimeConfig()

useListenToWindowBlur((e) => {
  if (!rtConfig.public.isDev) {
    curWin.hide()
  }
})

watch(searchTermInSync, (val) => {
  clearTimeout(updateSearchTermTimeout)
  updateSearchTermTimeout = setTimeout(() => {
    setSearchTerm(val)
  }, 100)
})

onMounted(async () => {
  curWin.setDecorations(false)
  curWin.onCloseRequested(async (event) => {
    console.log("Prevent Exit")
    event.preventDefault()
    curWin.hide()
  })
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
</script>
<template>
  <div class="h-full">
    <CmdPaletteCommand class="" v-model:searchTerm="searchTermInSync" :identity-filter="true">
      <CommandInput class="h-12 text-md" placeholder="Search for apps or commands..." />
      <CommandList class="h-full">
        <CommandEmpty>No results found.</CommandEmpty>
        <MainSearchListGroup v-for="ext in exts" :ext="ext" />
      </CommandList>
      <CmdPaletteFooter />
    </CmdPaletteCommand>
  </div>
</template>
