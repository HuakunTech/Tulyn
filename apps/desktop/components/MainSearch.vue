<script setup lang="ts">
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from "lucide-vue-next";
import { open } from "@tauri-apps/api/shell";
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
import { system, apps } from "@jarvis/api";
import type { AppInfo } from "@jarvis/api/webview-dist/src/model/apps";

const allApps = ref<AppInfo[]>([]);

onMounted(async () => {
  apps
    .refreshApplicationsList()
    .then(() => apps.getAllApps())
    .then((apps) => {
      allApps.value = apps;
    });
});
</script>
<template>
  <Command class="">
    <CommandInput placeholder="Search for apps or commands..." :always-focus="true" />
    <CommandList class="px-2">
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="System Commands">
        <CommandItem
          v-for="(cmd, idx) in system.systemCommands"
          :key="cmd.name"
          :value="cmd.value"
          @select="cmd.function()"
        >
          <Icon :icon="cmd.icon" class="mr-2 h-5 w-5" />
          <span class="">{{ cmd.name }}</span>
          <span class="mx-3">-</span>
          <span class="text-muted-foreground">System</span>
          <CommandShortcut class="capitalize">Command</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem
          v-for="(app, idx) in allApps"
          :key="app.app_desktop_path"
          :value="app.app_desktop_path"
          @select="open(app.app_desktop_path)"
        >
          <User class="mr-2 h-4 w-4" />
          <span>{{ app.name }}</span>
          <CommandShortcut>Application</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
