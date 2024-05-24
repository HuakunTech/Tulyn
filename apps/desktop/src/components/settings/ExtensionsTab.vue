<script setup lang="ts">
import {
  $extensionListItems,
  $devExtensionListItems,
  loadDevExtManifests,
  loadExtManifests,
  $extensionsStore,
  getCmdFromValue,
  $extCmdMap,
  loadAllExtensionsManifest,
  $allExtensionListItems,
  cmdType,
} from "@/lib/stores/extensions";
import ExtRow from "./Extensions/ExtRow.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import { onMounted, ref } from "vue";
import { UiCmd, type TList, type TListItem } from "jarvis-api";
import { useStore } from "@nanostores/vue";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Window } from "@tauri-apps/api/window";
import { Webview } from "@tauri-apps/api/webview";
import {
  $remoteExtensions,
  $remoteExtListItem,
  removeRemoteExt,
} from "@/lib/stores/remoteExtensions";
import { useToast } from "@/components/ui/toast/use-toast";

const devExtsListItems = useStore($devExtensionListItems);
const allExtensionListItems = useStore($allExtensionListItems);
const extsListItems = useStore($extensionListItems);
const remoteExtStore = useStore($remoteExtensions);
const remoteExtListItems = useStore($remoteExtListItem);
const { toast } = useToast();

onMounted(async () => {
  await loadAllExtensionsManifest();
  // console.log(devExtsListItems.value);
  // console.log($devExtensionListItems.get());
});

function openExtention(item: TListItem) {
  // const cmd = getCmdFromValue(item.value);
  // console.log(cmd);
  // if (cmd?.cmdType === cmdType.Enum.UI) {
  //   console.log(cmd.cmd);

  //   const uiCmdParse = UiCmd.safeParse(cmd.cmd);
  //   if (uiCmdParse.success) {
  //     const uiCmd = uiCmdParse.data;
  //     console.log(uiCmd);
  //     new WebviewWindow("ext", {
  //       url: `http://localhost:1566/extensions/${cmd.manifest.extFolderName}/${uiCmd.main}`,
  //     });
  //   } else {
  //     console.error(uiCmdParse.error);
  //   }
  // }
}

function deleteRemoteUrlExt(item: TListItem) {
  // item.value is uuid for the remote ext item
  removeRemoteExt(item.value);
  toast({
    title: `Deleted Remote Ext: ${item.title}`,
  });
}
</script>
<template>
  <div class="py-2 max-h-full overflow-auto flex">
    <ScrollArea class="max-h-full w-full rounded-md border">
      <div class="p-4 space-y-2">
        <h4 class="mb-4 text-sm font-medium leading-none">Extensions</h4>
        <ExtRow
          v-for="(ext, idx) in allExtensionListItems"
          :key="ext.value + idx"
          :item="ext as TListItem"
          @click="() => openExtention(ext as TListItem)"
        />
        <ExtRow
          v-for="(ext, idx) in remoteExtListItems"
          :key="ext.value + idx"
          :item="ext as TListItem"
          @click="() => openExtention(ext as TListItem)"
          @delete="deleteRemoteUrlExt"
        />
      </div>
    </ScrollArea>
  </div>
</template>
