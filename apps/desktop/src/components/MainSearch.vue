<script setup lang="ts">
import { User } from "lucide-vue-next";
import { open } from "@tauri-apps/plugin-shell";
import { Icon } from "@iconify/vue";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { getAllApps, refreshApplicationsList } from "@/lib/commands/apps";
import { systemCommands } from "@/lib/commands/system";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { IconType, UiCmd, type AppInfo, type TCommand, type TListItem } from "@jarvis/api";
import {
  AlertDialogControlled,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { loadAllExtensions } from "@/lib/commands/manifest";
import { Button } from "@/components/ui/button";
import { convertFileSrc } from "@tauri-apps/api/core";
import { $appState, setSearchTerm, setAllApps } from "@/lib/stores/appState";
import { useStore } from "@nanostores/vue";
import {
  $allExtensionListItems,
  cmdType,
  getCmdFromValue,
  loadAllExtensionsManifest,
} from "@/lib/stores/extensions";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const appState = useStore($appState);

const allExtensionListItems = useStore($allExtensionListItems);

const searchTerm = computed({
  get: () => appState.value.searchTerm,
  set: (value) => setSearchTerm(value),
});

/**
 * searchTermInSync is used for debouncing the searching triggered by searchTerm
 * This is to prevent the search term from being updated on every key press
 */
const searchTermInSync = ref("");
let updateSearchTermTimeout: NodeJS.Timeout;
watch(searchTermInSync, (val) => {
  clearTimeout(updateSearchTermTimeout);
  updateSearchTermTimeout = setTimeout(() => {
    setSearchTerm(val);
  }, 200);
});

// const filteredApps = useStore($filteredApps);
const filteredApps = computed(() => {
  if (searchTerm.value.length > 1) {
    return appState.value.allApps.filter((app) => {
      return app.name.toLowerCase().includes(searchTerm.value.toLowerCase());
    });
  } else {
    return [];
  }
});

const currentPendingcmd = ref<TCommand | null>(null);
const alertdialogOpen = ref(false);
onMounted(async () => {
  loadAllExtensionsManifest();
  refreshApplicationsList()
    .then(() => getAllApps())
    .then((apps) => {
      setAllApps(apps);
    });
});

function executePendingCmd() {
  if (currentPendingcmd.value) {
    currentPendingcmd.value.function();
    currentPendingcmd.value = null;
    alertdialogOpen.value = false;
  }
}

function systemCmdOnSelect(cmd: TCommand) {
  if (cmd.confirmRequired) {
    setTimeout(() => {
      alertdialogOpen.value = true;
      currentPendingcmd.value = cmd;
    }, 300);
  } else {
    cmd.function();
  }
}

const filteredSysCmds = computed(() => {
  return systemCommands.filter((cmd) => {
    return cmd.name.toLowerCase().includes(searchTerm.value.toLowerCase());
  });
});

const filteredExtensionListItems = computed(() =>
  allExtensionListItems.value.filter((ext) => {
    return ext.title.toLowerCase().includes(searchTerm.value.toLowerCase());
  }),
);

function openExtention(item: TListItem) {
  const cmd = getCmdFromValue(item.value);
  if (cmd?.cmdType === cmdType.Enum.UI) {
    const uiCmdParse = UiCmd.safeParse(cmd.cmd);
    if (uiCmdParse.success) {
      const uiCmd = uiCmdParse.data;

      console.log(uiCmd.width, uiCmd.height);
      if (cmd.isDev && uiCmd.devMain) {
        new WebviewWindow("ext", {
          title: item.title,
          url: uiCmd.devMain,
          width: uiCmd.width ?? undefined,
          height: uiCmd.height ?? undefined,
        });
      } else {
        if (uiCmd.main.startsWith("http")) {
          new WebviewWindow("ext", {
            title: item.title,
            url: uiCmd.main,
            width: uiCmd.width ?? undefined,
            height: uiCmd.height ?? undefined,
          });
        } else {
          const postfix = !uiCmd.main.endsWith(".html") && !uiCmd.main.endsWith("/") ? "/" : "";
          const url = `http://localhost:1566/extensions/${cmd.manifest.extFolderName}/${uiCmd.main}${postfix}`;
          new WebviewWindow("ext", {
            title: item.title,
            url,
            width: uiCmd.width ?? undefined,
            height: uiCmd.height ?? undefined,
          });
        }
      }
    } else {
      console.error(uiCmdParse.error);
    }
  }
}
</script>
<template>
  <Command class="" v-model:searchTerm="searchTermInSync" :identity-filter="true">
    <!-- <img width="40":src="convertFileSrc('/Applications/Google Chrome.app/Contents/Resources/app.icns', 'macicns')" alt="">
    <img width="40":src="convertFileSrc('/Applications/Visual Studio Code.app/Contents/Resources/Code.icns', 'macicns')" alt=""> -->
    <CommandInput placeholder="Search for apps or commands..." :always-focus="true" />
    <div>
      <AlertDialogControlled v-model:open="alertdialogOpen">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              >Are you sure you want to "{{ currentPendingcmd?.name }}"?</AlertDialogTitle
            >
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              >Cancel<Icon class="ml-2 h-4 w-4" icon="f7:escape"
            /></AlertDialogCancel>
            <AlertDialogAction @click="executePendingCmd">
              Continue <Icon class="ml-2 h-4 w-4" icon="icon-park-solid:enter-key"
            /></AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogControlled>
    </div>
    <CommandList class="px-2">
      <CommandEmpty>No results found.</CommandEmpty>

      <CommandGroup heading="Extensions">
        <CommandItem
          v-for="(ext, idx) in filteredExtensionListItems"
          :key="ext.value"
          :value="ext.value"
          @select="openExtention(ext as TListItem)"
        >
          <Icon
            v-if="ext.icon && ext.icon.type === IconType.Enum.iconify"
            :icon="ext.icon.value"
            class="mr-2 h-5 w-5"
          />
          <span class="">{{ ext.title }}</span>
          <span class="mx-3">-</span>
          <span class="text-muted-foreground">{{ ext.description }}</span>
          <CommandShortcut class="capitalize">{{ ext.type }}</CommandShortcut>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="System Commands">
        <CommandItem
          v-for="(cmd, idx) in filteredSysCmds"
          :key="cmd.name"
          :value="cmd.value"
          @select="systemCmdOnSelect(cmd)"
        >
          <Icon v-if="cmd.icon" :icon="cmd.icon" class="mr-2 h-5 w-5" />
          <span class="">{{ cmd.name }}</span>
          <span class="mx-3">-</span>
          <span class="text-muted-foreground">System</span>
          <CommandShortcut class="capitalize">Command</CommandShortcut>
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="Applications">
        <CommandItem
          v-for="(app, idx) in filteredApps"
          :key="app.app_desktop_path"
          :value="app.app_desktop_path"
          @select="open(app.app_desktop_path)"
        >
          <!-- TODO: Loading all icons is extremely slow, Consider Lazy Loading or display only found apps rather than all apps -->
          <img
            width="20"
            class="mr-2"
            v-if="app.icon_path"
            :src="convertFileSrc(app.icon_path, 'macicns')"
            alt=""
          />
          <Icon v-else icon="ri:app-store-fill" class="w-5 h-5 mr-2" />
          <span>{{ app.name }}</span>
          <CommandShortcut>Application</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
