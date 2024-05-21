<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FolderCogIcon,
  AlertCircle,
  InfoIcon,
  ExternalLinkIcon,
  CloudDownloadIcon,
  FolderDownIcon,
} from "lucide-vue-next";
import DeveloperWarning from "@/components/settings/Developer/Warning.vue";
import DevExtPathForm from "@/components/settings/Developer/DevExtPathForm.vue";
import DragNDrop from "@/components/DragNDrop.vue";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { default as TauriLink } from "@/components/tauri/link.vue";
import { open } from "@tauri-apps/plugin-dialog";
import { ref, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { download } from "@tauri-apps/plugin-upload";
import { downloadDir, join as pathJoin } from "@tauri-apps/api/path";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

async function pickProject() {
  const selected = await open({
    directory: true,
    multiple: false,
  });
  console.log(selected);
}

const downloadUrl = ref<string>("");

async function onDownloadSubmit(e: Event) {
  e.preventDefault();
  // check if downloadUrl is valid http url that ends with .tgz or .tar.gz
  if (/https?:\/\/[^ ]+\.(?:tgz|tar\.gz)/.test(downloadUrl.value)) {
    // get file name from url
    const filename = downloadUrl.value.split("/").pop();
    if (filename) {
      await download(downloadUrl.value, await pathJoin(await downloadDir(), filename));
    }
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
      <Label class="text-xl" for="pick">Pick Project Folder to Install</Label>
      <div class="flex justify-center">
        <DragNDrop
          @drop="
            (paths) => {
              console.log(paths);
            }
          "
        >
          <Card class="w-96 h-36">
            <div
              class="flex justify-center items-center h-full cursor-pointer"
              @click="pickProject"
            >
              <div class="flex flex-col items-center">
                <FolderCogIcon class="w-10 h-10" />
                <small class="text-xs select-none">Click or Drag and Drop</small>
              </div>
            </div>
          </Card>
        </DragNDrop>
      </div>

      <Label for="url" class="text-xl">
        Download URL
        <Popover>
          <PopoverTrigger as-child>
            <button class="-translate-y-0.5"><InfoIcon class="inline w-4 cursor-pointer" /></button>
          </PopoverTrigger>
          <PopoverContent class="w-96">
            <TauriLink
              class="block"
              href="https://jarvis.huakun.tech/design/extensions/installation/"
            >
              Read Docs For More Details <ExternalLinkIcon class="inline w-4 -translate-y-0.5" />
            </TauriLink>
            <div class="text-xs">
              It can be an npm package URL like
              <TauriLink class="block" href="https://registry.npmjs.org/nest-neo4j/latest"
                >https://registry.npmjs.org/nest-neo4j/latest</TauriLink
              >
              or a tarball url like
              <TauriLink
                class="block"
                href="https://registry.npmjs.org/nest-neo4j/-/nest-neo4j-0.3.1.tgz"
                >https://registry.npmjs.org/nest-neo4j/-/nest-neo4j-0.3.1.tgz</TauriLink
              >
            </div>
          </PopoverContent>
        </Popover>
      </Label>
      <form class="flex w-full items-center gap-1.5" @submit="onDownloadSubmit">
        <Input id="url" type="text" placeholder="Download URL" v-model="downloadUrl" />
        <Button type="submit">Download<FolderDownIcon class="ml-2 h-4 w-4" /></Button>
      </form>

      <Label for="url" class="text-xl">
        Remote URL
        <Popover>
          <PopoverTrigger as-child>
            <button class="-translate-y-0.5"><InfoIcon class="inline w-4 cursor-pointer" /></button>
          </PopoverTrigger>
          <PopoverContent class="w-96">
            <TauriLink
              class="block"
              href="https://jarvis.huakun.tech/design/extensions/installation/"
            >
              Read Docs For More Details <ExternalLinkIcon class="inline w-4 -translate-y-0.5" />
            </TauriLink>
            <div class="text-xs">
              It can be an npm package URL like
              <TauriLink class="block" href="https://registry.npmjs.org/nest-neo4j/latest"
                >https://registry.npmjs.org/nest-neo4j/latest</TauriLink
              >
              or a tarball url like
              <TauriLink
                class="block"
                href="https://registry.npmjs.org/nest-neo4j/-/nest-neo4j-0.3.1.tgz"
                >https://registry.npmjs.org/nest-neo4j/-/nest-neo4j-0.3.1.tgz</TauriLink
              >
            </div>
          </PopoverContent>
        </Popover>
      </Label>
      <div class="flex w-full items-center gap-1.5">
        <Input id="url" type="text" placeholder="Remote URL" />
        <Button type="submit">Install<CloudDownloadIcon class="ml-2 h-4 w-4" /></Button>
      </div>
    </div>
  </div>
</template>
