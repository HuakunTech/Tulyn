<script setup lang="ts">
import DragNDrop from "@/components/DragNDrop.vue"
import IconMultiplexer from "@/components/IconMultiplexer.vue"
import DevExtPathForm from "@/components/settings/Developer/DevExtPathForm.vue"
import DeveloperWarning from "@/components/settings/Developer/Warning.vue"
import { default as TauriLink } from "@/components/tauri/link.vue"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { $appConfig } from "@/lib/stores/appConfig"
import { cn } from "@/lib/utils"
import { installTarball, installTarballUrl } from "@/lib/utils/tarball"
import { getDevExtensionFolder, getExtensionFolder } from "@kksh/api/commands"
import { IconEnum } from "@kksh/api/models"
import { useStore } from "@nanostores/vue"
import { downloadDir, join as pathJoin, tempDir } from "@tauri-apps/api/path"
import { open as openFileSelector } from "@tauri-apps/plugin-dialog"
import axios from "axios"
import { ElMessage, ElNotification } from "element-plus"
import { CloudDownloadIcon, DownloadIcon, ExternalLinkIcon, InfoIcon } from "lucide-vue-next"
import { ref, type HTMLAttributes } from "vue"
import { z } from "zod"
import RemoteURLInstall from "./RemoteURLInstall.vue"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
const appConfig = useStore($appConfig)
const dragging = ref(false)

async function pickProject() {
  const devExtFolder = await getDevExtensionFolder()
  if (!devExtFolder) return
  const selected = await openFileSelector({
    directory: false,
    multiple: false,
    defaultPath: await downloadDir(),
    filters: [
      {
        name: "qrcode",
        extensions: ["tgz", "gz"]
      }
    ]
  })
  if (!selected) {
    return ElMessage.warning("No File Selected")
  }
  installTarball(selected.path, devExtFolder)
}

const downloadUrl = ref<string>("")

async function onDownloadSubmit(e: Event) {
  e.preventDefault()
  const devExtFolder = await getDevExtensionFolder()
  if (!devExtFolder) return
  // check if downloadUrl is valid http url that ends with .tgz
  if (/https?:\/\/[^ ]+\.(?:tgz|tar\.gz)/.test(downloadUrl.value)) {
    // get file name from url
    await installTarballUrl(downloadUrl.value, devExtFolder)
    downloadUrl.value = ""
  } else {
    // assume npm package name is entered, check if package exists
    try {
      await installThroughNpmAPI(`https://registry.npmjs.org/${downloadUrl.value}/latest`)
    } catch (error: any) {
      ElMessage.error("Fail to Install")
      ElMessage.error(error)
    }
  }
}

async function installThroughNpmAPI(url: string) {
  const devExtFolder = await getDevExtensionFolder()
  if (!devExtFolder) return
  return axios
    .get(url)
    .then((res) => {
      const tarball = z.string().parse(res.data?.dist?.tarball)
      if (tarball) {
        return installTarballUrl(tarball, devExtFolder)
      } else {
        ElMessage.error("Tarball Not Found")
      }
    })
    .catch((error: any) => {
      ElMessage.error(error)
    })
}

async function handleDragNDropInstall(paths: string[]) {
  const devExtFolder = await getDevExtensionFolder()
  if (!devExtFolder) return
  dragging.value = false
  // install all .tar.gz and .tgz
  let numInstalled = 0
  const tarballs = paths.filter((p) => p.endsWith(".tar.gz") || p.endsWith(".tgz"))
  numInstalled += tarballs.length
  if (tarballs.length > 0) {
    let installedCount = 0
    for (const tarball of tarballs) {
      try {
        await installTarball(tarball, devExtFolder)
        installedCount++
      } catch (error: any) {
        ElMessage.error(error)
      }
    }
    if (installedCount > 0) {
      ElMessage.success(`Installed ${installedCount} Tarball${installedCount > 1 ? "s" : ""}`)
    }
  }
  if (numInstalled === 0) {
    ElNotification.error({
      title: "Nothing is Installed",
      message: "Only tarballs (.tar.gz) are supported"
    })
  }
}
</script>
<template>
  <div :class="cn('h-full', props.class)">
    <div class="container grid w-full max-w-2xl items-center gap-1.5">
      <DeveloperWarning />
      <p class="text-xs">
        There are 4 options to install an extension in developer mode. Either load it from your
        local tarball file, a tarball remote URL, npm package name or load from a remote URL.
      </p>
      <Label class="text-xl" for="pick">Set Dev Extension Path</Label>
      <DevExtPathForm />
      <!-- Dev Extensions can only be installed when a dev extension path is set -->
      <div v-if="appConfig.devExtensionPath" class="flex flex-col space-y-2">
        <Label class="text-xl" for="pick"
          >Pick Project Folder to Install

          <Popover>
            <PopoverTrigger as-child>
              <button class="-translate-y-0.5">
                <InfoIcon class="inline w-4 cursor-pointer" />
              </button>
            </PopoverTrigger>
            <PopoverContent class="w-96">
              Drag tarballs to the window to install extensions.
            </PopoverContent>
          </Popover>
        </Label>
        <div class="flex justify-center">
          <DragNDrop
            @drop="handleDragNDropInstall"
            @drag="dragging = true"
            @drag-cancelled="dragging = false"
          >
            <Card :class="cn('h-36 w-96', dragging ? 'border-lime-400/30' : 'text-blue')">
              <div
                class="flex h-full cursor-pointer items-center justify-center"
                @click="pickProject"
              >
                <div :class="cn('flex flex-col items-center', dragging ? 'text-lime-400/70' : '')">
                  <IconMultiplexer
                    :icon="{ value: 'mdi:folder-cog-outline', type: IconEnum.Iconify }"
                    class="h-10 w-10"
                  />
                  <small class="select-none text-xs">Click or Drag and Drop</small>
                </div>
              </div>
            </Card>
          </DragNDrop>
        </div>

        <Label for="url" class="text-xl">
          Tarball URL / NPM Package Name
          <Popover>
            <PopoverTrigger as-child>
              <button class="-translate-y-0.5">
                <InfoIcon class="inline w-4 cursor-pointer" />
              </button>
            </PopoverTrigger>
            <PopoverContent class="w-96">
              <!-- TODO: Fix the Links -->
              <TauriLink
                class="block"
                href="https://jarvis.huakun.tech/design/extensions/installation/"
              >
                Read Docs For More Details <ExternalLinkIcon class="inline w-4 -translate-y-0.5" />
              </TauriLink>
              <div class="text-xs">
                It can be an npm package name like
                <TauriLink class="block" href="@huakunshen/jarvis-ext-myip">
                  @huakunshen/jarvis-ext-myip
                </TauriLink>
                or a tarball url like
                <TauriLink class="block" href="https://jarvis-extensions.huakun.tech/qrcode.tar.gz">
                  https://jarvis-extensions.huakun.tech/qrcode.tar.gz
                </TauriLink>
              </div>
            </PopoverContent>
          </Popover>
        </Label>
        <form class="flex w-full items-center gap-1.5" @submit="onDownloadSubmit">
          <Input
            id="url"
            type="text"
            placeholder="Tarball URL / NPM Package Name"
            v-model="downloadUrl"
          />
          <Button type="submit" size="sm">Download<DownloadIcon class="ml-2 h-4 w-4" /></Button>
        </form>

        <Label for="url" class="text-xl">
          Remote URL
          <Popover>
            <PopoverTrigger as-child>
              <button class="-translate-y-0.5">
                <InfoIcon class="inline w-4 cursor-pointer" />
              </button>
            </PopoverTrigger>
            <PopoverContent class="ml-5 w-[45em] text-xs">
              <!-- TODO: Fix the Links -->
              Akun allows you to install a remote url as a command. Instead of loading UI from
              locally-installed extension, Akun will load UI from the remote website. The website
              may call Akun API to access native APIs and file system.
              <TauriLink
                class="block"
                href="https://docs.jarvis.huakun.tech/design/extensions/installation/"
              >
                Read Docs For More Details <ExternalLinkIcon class="inline w-4 -translate-y-0.5" />
              </TauriLink>
              <Alert variant="destructive" class="my-2 dark:border-red-600 dark:text-red-600">
                <IconMultiplexer
                  :icon="{ value: 'material-symbols:warning-outline', type: IconEnum.Iconify }"
                  class="h-5 w-5 dark:text-red-600"
                />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Installing a remote website as extension is extremely dangerous. Website
                  maintainer could change the code any time to execute anything on your computer.
                  Only install website extensions you trust. Or even better, only websites you own.
                  This feature is designed for developer only.
                </AlertDescription>
              </Alert>
              <p>
                It can be a remote website URL like
                <TauriLink class="" href="https://jarvis-ext-ip.pages.dev/">
                  https://jarvis-ext-ip.pages.dev/
                </TauriLink>
                or even
                <TauriLink class="" href="https://google.com"> https://google.com </TauriLink>

                I recommend you to only install localhost remote url to facilitate development. Such
                as
                <TauriLink class="" href="http://localhost:3000/">
                  http://localhost:3000/
                </TauriLink>
                and name it <strong class="text-green-500">Localhost 3000</strong>.
              </p>
              <p>
                As of now, a remote extension has the same permissions a regular extension have, but
                I may limit the permissions in the future on non-localhost URLs to prohibit code
                execution and FS access. Only most basic APIs will be exposed to a remote extension
                (e.g. write clipboard).
              </p>
            </PopoverContent>
          </Popover>
        </Label>
        <RemoteURLInstall />
      </div>
    </div>
  </div>
</template>
