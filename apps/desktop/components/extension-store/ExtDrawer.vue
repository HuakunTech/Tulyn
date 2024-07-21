<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PERMISSIONS_EXPLANATION } from "@/lib/constants"
import { GlobalEventBus } from "@/lib/utils/events"
import { gqlClient } from "@/lib/utils/graphql"
import * as supabase from "@/lib/utils/supabase"
import { supabaseClient } from "@/lib/utils/supabase"
import { installTarballUrl } from "@/lib/utils/tarball"
import { getDevExtensionFolder, getExtensionFolder } from "@akun/api/commands"
import {
  FindLatestExtDocument,
  type FindLatestExtQuery,
  type FindLatestExtQueryVariables
} from "@akun/gql"
import { AkunExtManifest } from "@akun/schema"
import { type Tables } from "@akun/supabase"
import { compareVersions } from "compare-versions"
import { ElMessage } from "element-plus"
import { CircleCheckBigIcon, Trash2Icon } from "lucide-vue-next"
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { z } from "zod"
import DialogImage from "./DialogImage.vue"
import ExtStoreDrawer from "./ExtStoreDrawer.vue"
import { ExtItem } from "./types"

const props = defineProps<{
  open: boolean
  selectedExt?: ExtItem
  installed?: boolean
}>()
const imageDialogOpen = ref(false)
const emits = defineEmits<{
  (e: "update:open", open: boolean): void
  (e: "installed", downloads: number): void
  (e: "uninstall", ext: Tables<"ext_publish"> | null): void
}>()
const currentExt = ref<Tables<"ext_publish"> | null>(null)

watch(
  () => props.open,
  async (open) => {
    if (open) {
      //   const response: ApolloQueryResult<AllExtensionsQuery> = await gqlClient.query({
      //     query: AllExtensionsDocument,
      //   });
      const response = await gqlClient.query<FindLatestExtQuery, FindLatestExtQueryVariables>({
        query: FindLatestExtDocument,
        variables: {
          identifier: props.selectedExt?.identifier
        }
      })
      const exts = response.data.ext_publishCollection?.edges
      if (exts && exts.length > 0) {
        // @ts-ignore
        currentExt.value = exts[0].node
        console.log(currentExt.value)
      }
    } else {
      currentExt.value = null
    }
  }
)

const manifest = computed<AkunExtManifest>(() => {
  if (currentExt.value) {
    // @ts-ignore
    return AkunExtManifest.parse(JSON.parse(currentExt.value?.manifest as string))
  } else {
    return null
  }
})

async function installExt() {
  if (!currentExt.value) {
    return ElMessage.error("Unexpected Error: No Extension Selected")
  }
  const tarballUrl = supabase.getFileUrl(currentExt.value.tarball_path).data.publicUrl
  console.log(`Install tarball: ${tarballUrl}`)

  getExtensionFolder()
    .then((targetInstallDir) => {
      if (!targetInstallDir) {
        return Promise.reject("Unexpected Error: Extension Folder is Null")
      } else {
        return installTarballUrl(tarballUrl, targetInstallDir)
      }
    })
    .then(async () => {
      ElMessage.success(`Plugin ${currentExt.value!.name} Installed`)

      if (currentExt.value) {
        const { data, error } = await supabaseClient.functions.invoke("increment-downloads", {
          body: { identifier: currentExt.value.identifier, version: currentExt.value.version }
        })
        const { downloads } = z.object({ downloads: z.number() }).parse(data)
        emits("update:open", false)
        emits("installed", downloads)
      }
    })
    .catch((err) => {
      ElMessage.error("Fail to install tarball")
      ElMessage.error(err)
    })
}

function onEnterPressed(e: KeyboardEvent) {
  if (e.key === "Enter" && currentExt.value) {
    installExt()
  }
}

onMounted(() => {
  GlobalEventBus.onKeyDown(onEnterPressed)
})

onUnmounted(() => {
  GlobalEventBus.offKeyDown(onEnterPressed)
})

const imageSrcs = computed(() => {
  return currentExt.value?.demo_images.map((src) => supabase.getFileUrl(src).data.publicUrl) ?? []
})
</script>
<template>
  <ExtStoreDrawer :open="props.open" @update:open="(open) => emits('update:open', open)">
    <DrawerContent>
      <DrawerHeader class="flex items-center space-x-5">
        <IconMultiplexer
          v-if="props.selectedExt"
          :icon="props.selectedExt?.icon"
          class="h-12 w-12"
        />
        <div>
          <DrawerTitle class="flex items-center">
            <strong class="text-xl">{{ selectedExt?.name }}</strong>
            <CircleCheckBigIcon v-if="props.installed" class="ml-2 inline text-green-400" />
          </DrawerTitle>
          <DrawerDescription>{{ selectedExt?.short_description }}</DrawerDescription>
          <pre class="text-muted-foreground text-xs">{{ currentExt?.identifier }}</pre>
          <pre class="text-muted-foreground text-xs">Version: {{ currentExt?.version }}</pre>
        </div>
      </DrawerHeader>
      <ScrollArea class="h-[60vh] px-4">
        <div class="mx:auto flex w-full snap-x snap-mandatory space-x-4 overflow-x-scroll">
          <DialogImage v-model:open="imageDialogOpen" :img-src="imageSrcs" />
          <img
            v-for="src in imageSrcs"
            :src="src"
            class="inline h-32 cursor-pointer"
            @click="imageDialogOpen = true"
            alt=""
          />
        </div>
        <Separator class="my-5" />

        <DrawerDescription class="text-md">Security and Privacy</DrawerDescription>
        <li v-for="perm in manifest?.permissions" class="flex items-center space-x-2">
          <!-- TODO: Fix Type Error -->
          <!-- <span>{{ PERMISSIONS_EXPLANATION[perm]?.displayName }}</span> -->
          <HoverCard>
            <HoverCardTrigger>
              <!-- <IconMultiplexer
                :icon="{ type: 'iconify', value: 'material-symbols:info-outline' }"
              /> -->
            </HoverCardTrigger>
            <HoverCardContent class="w-96">
              <!-- {{ PERMISSIONS_EXPLANATION[perm]?.description }} -->
            </HoverCardContent>
          </HoverCard>
        </li>

        <Separator class="my-5" />
        <DrawerDescription class="text-md">Description</DrawerDescription>
        <span class="text-sm">
          {{ selectedExt?.long_description }}
        </span>
        <Separator class="my-5" />
        <DrawerDescription class="text-mg my-3">Commands</DrawerDescription>

        <ul>
          <li v-if="manifest" v-for="cmd in manifest.customUiCmds">
            <div class="flex items-center space-x-3">
              <IconMultiplexer
                v-if="props.selectedExt"
                :icon="props.selectedExt?.icon"
                class="inline h-6 w-6"
              />
              <div>
                <span class="text-dm">{{ cmd.name }}</span>
                <DrawerDescription class="text-xs">{{ cmd.description }}</DrawerDescription>
              </div>
            </div>
            <Separator class="my-3" />
          </li>
        </ul>
      </ScrollArea>
      <DrawerFooter>
        <Button v-if="!props.installed" @click="installExt">
          Install <Icon name="mi:enter" class="ml-2 h-5 w-5" />
        </Button>
        <Button v-else @click="emits('uninstall', currentExt)" variant="destructive">
          Uninstall
          <Trash2Icon class="ml-2 h-5 w-5" />
        </Button>
      </DrawerFooter>
    </DrawerContent>
  </ExtStoreDrawer>
</template>
