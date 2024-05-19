<script setup lang="ts">
import {
  $extensionListItems,
  $devExtensionListItems,
  loadDevExtManifests,
  loadExtManifests,
  $extensionsStore,
} from "@/lib/stores/extensions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { onMounted, ref } from "vue";
import type { TList, TListItem } from "@jarvis/api";
import { useStore } from "@nanostores/vue";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";

const devExtsListItems = useStore($devExtensionListItems);
const extsListItems = useStore($extensionListItems);

onMounted(async () => {
  await loadDevExtManifests();
  await loadExtManifests();
  console.log(devExtsListItems.value);
  console.log($devExtensionListItems.get());
});

function openExtention(item: TListItem) {
  console.log(item);

  console.log($extensionsStore.get().devManifests.find((ext) => item.value === ext.identifier));

  new WebviewWindow("ext", {
    url: `http://localhost:1566/extensions/qrcode/ui/dist`,
  });

  //   const appWindow = new Window("ext");
  //   const webview = new Webview(appWindow, "ext2", {
  //     url: `http://localhost:1566/extensions/qrcode/ui/dist`,
  //   });
  // loading embedded asset:
  //   const webview = new Webview(appWindow, "theUniqueLabel", {
  //     url: "path/to/page.html",
  //   });
  //   // alternatively, load a remote URL:
  //   const webview2 = new Webview(appWindow, "theUniqueLabel", {
  //     url: "https://github.com/tauri-apps/tauri",
  //   });

  //   const appWindow = new Window("my-label");
  //   const webview = new Webview(appWindow, "my-label", {
  //     url: "http://localhost:1566/extensions/qrcode/ui/dist",
  //   });
}
</script>
<template>
  <div class="py-2 max-h-full overflow-auto flex">
    <ScrollArea class="max-h-full w-96 rounded-md border">
      <div class="p-4">
        <h4 class="mb-4 text-sm font-medium leading-none">Extensions</h4>

        <div
          v-for="(ext, idx) in devExtsListItems"
          :key="ext.value + idx"
          @click="() => openExtention(ext as TListItem)"
        >
          <div class="text-sm">
            {{ ext.title }}
          </div>
          <Separator class="my-2" />
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
