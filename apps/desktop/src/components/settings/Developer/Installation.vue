<script setup lang="ts">
import { toast as sonner } from "vue-sonner";
import axios from "axios";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InfoIcon, ExternalLinkIcon, CloudDownloadIcon, DownloadIcon } from "lucide-vue-next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@iconify/vue";
import DeveloperWarning from "@/components/settings/Developer/Warning.vue";
import DevExtPathForm from "@/components/settings/Developer/DevExtPathForm.vue";
import DragNDrop from "@/components/DragNDrop.vue";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { default as TauriLink } from "@/components/tauri/link.vue";
import { open as openFileSelector } from "@tauri-apps/plugin-dialog";
import { ref, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { download } from "@tauri-apps/plugin-upload";
import * as fs from "@tauri-apps/plugin-fs";
import { tempDir, join as pathJoin, downloadDir } from "@tauri-apps/api/path";
import { installTarball } from "@/lib/utils/tarball";
import { useStore } from "@nanostores/vue";
import { $appConfig } from "@/lib/stores/appConfig";
import { useToast } from "@/components/ui/toast";

const { toast } = useToast();

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
const appConfig = useStore($appConfig);
const dragging = ref(false);

async function pickProject() {
  const selected = await openFileSelector({
    directory: false,
    multiple: false,
    defaultPath: await downloadDir(),
    filters: [
      {
        name: "qrcode",
        extensions: ["tgz", "gz"],
      },
    ],
  });
  if (!selected) {
    return sonner.warning("No File Selected");
  }
  installTarball(selected.path);
}

const downloadUrl = ref<string>("");

async function onDownloadSubmit(e: Event) {
  e.preventDefault();
  // check if downloadUrl is valid http url that ends with .tgz
  if (/https?:\/\/[^ ]+\.(?:tgz|tar\.gz)/.test(downloadUrl.value)) {
    // get file name from url
    await installTarballUrl(downloadUrl.value);
    downloadUrl.value = "";
  } else {
    // assume npm package name is entered, check if package exists
    try {
      await installThroughNpmAPI(`https://registry.npmjs.org/${downloadUrl.value}/latest`);
    } catch (error: any) {
      toast({ title: error, variant: "destructive" });
    }
  }
}

async function installTarballUrl(tarballUrl: string) {
  const filename = tarballUrl.split("/").pop();
  if (filename) {
    try {
      const tempDirPath = await tempDir();
      let tarballPath = await pathJoin(tempDirPath, filename);
      await download(tarballUrl, tarballPath);
      await installTarball(tarballPath);
      sonner.success(`Installed 1 Tarball`);
      await fs.remove(tarballPath);
    } catch (error: any) {
      toast({ title: error, variant: "destructive" });
    }
  }
}

function installThroughNpmAPI(url: string) {
  return axios
    .get(url)
    .then((res) => {
      const tarball = z.string().parse(res.data?.dist?.tarball);
      if (tarball) {
        return installTarballUrl(tarball);
      } else {
        toast({ title: "Tarball Not Found", variant: "destructive" });
      }
    })
    .catch((error: any) => {
      toast({ title: error, variant: "destructive" });
    });
}

async function handleDragNDropInstall(paths: string[]) {
  dragging.value = false;
  // install all .tar.gz and .tgz
  let numInstalled = 0;
  const tarballs = paths.filter((p) => p.endsWith(".tar.gz") || p.endsWith(".tgz"));
  numInstalled += tarballs.length;
  if (tarballs.length > 0) {
    let installedCount = 0;
    for (const tarball of tarballs) {
      try {
        await installTarball(tarball);
        installedCount++;
      } catch (error: any) {
        toast({ title: error, variant: "destructive" });
      }
    }
    sonner.success(`Installed ${tarballs.length} Tarball${installedCount > 1 ? "s" : ""}`);
  }
  if (numInstalled === 0) {
    toast({
      title: "Nothing is Installed",
      variant: "destructive",
      description: "Only tarballs (.tar.gz) are supported",
    });
  }
}
</script>
<template>
  <div :class="cn('h-full', props.class)">
    <div class="container grid w-full max-w-2xl items-center gap-1.5">
      <DeveloperWarning />
      <p class="text-xs">
        There are 3 options to install an extension in developer mode. Either load it from your
        local folder, download from URL or load from a remote URL directly.
      </p>

      <DevExtPathForm />
      <!-- Dev Extensions can only be installed when a dev extension path is set -->
      <div v-if="appConfig.devExtentionPath" class="flex flex-col space-y-2">
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
            <Card :class="cn('w-96 h-36', dragging ? 'border-lime-400/30' : 'text-blue')">
              <div
                class="flex justify-center items-center h-full cursor-pointer"
                @click="pickProject"
              >
                <div :class="cn('flex flex-col items-center', dragging ? 'text-lime-400/70' : '')">
                  <Icon icon="mdi:folder-cog-outline" class="w-10 h-10" />
                  <small class="text-xs select-none">Click or Drag and Drop</small>
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
                It can be an npm package URL like
                <TauriLink class="block" href="https://registry.npmjs.org/nest-neo4j/latest">
                  https://registry.npmjs.org/nest-neo4j/latest
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
          <Input id="url" type="text" placeholder="Tarball URL / NPM Package Name" v-model="downloadUrl" />
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
            <PopoverContent class="w-96">
              <!-- TODO: Fix the Links -->
              <TauriLink
                class="block"
                href="https://jarvis.huakun.tech/design/extensions/installation/"
              >
                Read Docs For More Details <ExternalLinkIcon class="inline w-4 -translate-y-0.5" />
              </TauriLink>
              <Alert variant="destructive" class="dark:text-red-600 dark:border-red-600 my-2">
                <Icon icon="material-symbols:warning-outline" class="h-5 w-5 dark:text-red-600" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Installing a remote website as extension is extremely dangerous. Website
                  maintainer could change the code any time. Only install website extensions you
                  trust.
                </AlertDescription>
              </Alert>
              <div class="text-xs">
                It can be a remote website URL like
                <TauriLink class="block" href="https://qrcode-ext.jarvis.huakun.tech">
                  https://qrcode-ext.jarvis.huakun.tech
                </TauriLink>
              </div>
            </PopoverContent>
          </Popover>
        </Label>
        <div class="flex w-full items-center gap-1.5">
          <Input id="url" type="text" placeholder="Remote URL" />
          <Button type="submit" size="sm">Install<CloudDownloadIcon class="ml-2 h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  </div>
</template>
