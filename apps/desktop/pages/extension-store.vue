<script setup lang="ts">
import CommandInput from "@/components/cmd-palette/CommandInput.vue"
import ExtListItem from "@/components/extension-store/ext-list-item.vue"
import ExtDrawer from "@/components/extension-store/ExtDrawer.vue"
// import Command from "@/components/extension-store/Command.vue";
import { ExtItem, ExtItemParser } from "@/components/extension-store/types"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command"
import { getExtensionsFolder, SUPABASE_ANON_KEY, SUPABASE_GRAPHQL_ENDPOINT } from "@/lib/constants"
import { Extension } from "@/lib/extension/ext"
import { $appConfig } from "@/lib/stores/appConfig"
import { gqlClient } from "@/lib/utils/graphql"
import { ApolloClient, gql, HttpLink, InMemoryCache, type ApolloQueryResult } from "@apollo/client"
import { AllExtensionsDocument, type AllExtensionsQuery } from "@jarvis/gql"
import { type Tables } from "@jarvis/supabase"
import { ArrowLeftIcon } from "@radix-icons/vue"
import { ElMessage } from "element-plus"
import type { ExtPackageJsonExtra } from "jarvis-api/models"
import { computed, onMounted, ref, watch } from "vue"

const ext = new Extension("Extensions", await getExtensionsFolder())
const selectedExt = ref<ExtItem>()
const extDrawerOpen = ref(false)
const extList = ref<ExtItem[]>([])
const installedManifests = ref<ExtPackageJsonExtra[]>([])

function refreshListing() {
  return ext.load().then(() => {
    installedManifests.value = ext.manifests
  })
}

onKeyStroke("Escape", () => {
  if (document.activeElement?.nodeName === "INPUT") {
    navigateTo("/")
  }
})

onMounted(async () => {
  refreshListing()
  const response: ApolloQueryResult<AllExtensionsQuery> = await gqlClient.query({
    query: AllExtensionsDocument
  })
  extList.value =
    response.data.extensionsCollection?.edges.map((x) =>
      ExtItem.parse(ExtItemParser.parse(x.node))
    ) ?? []
  console.log(extList.value)
})

function select(item: ExtItem) {
  selectedExt.value = item
  extDrawerOpen.value = true
}

function isInstalled(identifier: string) {
  return !!installedManifests.value.find((x) => x.jarvis.identifier === identifier)
}

function onInstalled(downloads: number) {
  refreshListing()
  if (selectedExt.value) {
    selectedExt.value.downloads = downloads
  }
}

function uninstall(extPublish: Tables<"ext_publish"> | null) {
  if (extPublish) {
    ext.uninstallExt(extPublish.identifier).then((manifest) => {
      ElMessage.success(`Uninstalled: ${manifest.name}`)
      extDrawerOpen.value = false
      refreshListing()
    })
  } else {
    ElMessage.error("No Extension Selected")
  }
}

const filterFunc = (items: ExtItem[], searchTerm: string) => {
  return items.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.short_description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })
}
</script>
<template>
  <div>
    <ExtDrawer
      v-model:open="extDrawerOpen"
      :selectedExt="selectedExt"
      :installed="selectedExt?.identifier ? isInstalled(selectedExt?.identifier) : false"
      @installed="onInstalled"
      @uninstall="uninstall"
    />
    <Command :filterFunction="(val, searchTerm) => filterFunc(val as ExtItem[], searchTerm)">
      <CommandInput placeholder="Type to search..." class="h-12 text-md">
        <Button size="icon" variant="outline" @click="() => navigateTo('/')">
          <ArrowLeftIcon class="h-5 w-5 shrink-0" />
        </Button>
      </CommandInput>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Extensions">
          <ExtListItem
            v-for="item in extList"
            :data="item"
            :installed="isInstalled(item.identifier)"
            @select="select(item)"
          />
        </CommandGroup>
      </CommandList>
    </Command>
  </div>
</template>
