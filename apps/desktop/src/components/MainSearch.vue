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
import { computed, onMounted, onUnmounted, ref } from "vue";
import { UiCmd, type AppInfo, type TCommand, type TListItem } from "@jarvis/api";
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
import { $appState, setSearchTerm, $filteredApps, setAllApps } from "@/lib/stores/appState";
import { useStore } from "@nanostores/vue";
import {
  $allExtensionListItems,
  cmdType,
  getCmdFromValue,
  loadAllExtensionsManifest,
} from "@/lib/stores/extensions";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const appState = useStore($appState);
const filteredApps = useStore($filteredApps);
const allExtensionListItems = useStore($allExtensionListItems);

const searchTerm = computed({
  get: () => appState.value.searchTerm,
  set: (value) => setSearchTerm(value),
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
      if (!cmd.isDev && uiCmd.devMain) {
        new WebviewWindow("ext", {
          url: uiCmd.devMain,
        });
      } else {
        if (uiCmd.main.startsWith("http")) {
          new WebviewWindow("ext", {
            url: uiCmd.main,
          });
        } else {
          new WebviewWindow("ext", {
            url: `http://localhost:1566/extensions/${cmd.manifest.extFolderName}/${uiCmd.main}`,
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
  <Command class="" v-model:searchTerm="searchTerm" :identity-filter="true">
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
          <!-- @select="systemCmdOnSelect(cmd)" -->
          <!-- <Icon v-if="cmd.icon" :icon="cmd.icon" class="mr-2 h-5 w-5" /> -->
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
          <!-- <img
            width="20"
            class="mr-2"
            v-if="app.icon_path"
            :src="convertFileSrc(app.icon_path, 'mac-icns')"
            alt=""
          />
          <User v-else class="mr-2 h-4 w-4" /> -->
          <span>{{ app.name }}</span>
          <CommandShortcut>Application</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
