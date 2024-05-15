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
import { onMounted, onUnmounted, ref } from "vue";
import type { AppInfo } from "@/lib/model/apps";
import type { TCommand } from "@/lib/model/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const currentPendingcmd = ref<TCommand | null>(null);
const allApps = ref<AppInfo[]>([]);
const alertdialogOpen = ref(false);
onMounted(async () => {
  refreshApplicationsList()
    .then(() => getAllApps())
    .then((apps) => {
      allApps.value = apps;
    });
});

function executePendingCmd() {
  if (currentPendingcmd.value) {
    currentPendingcmd.value.function();
    currentPendingcmd.value = null;
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

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && alertdialogOpen.value) {
    // execute pending command
    executePendingCmd();
  } else if (e.key === "Escape") {
    alertdialogOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", onKeydown);
});
</script>
<template>
  <Command class="">
    <CommandInput placeholder="Search for apps or commands..." :always-focus="true" />
    <div>
      <AlertDialog v-model:open="alertdialogOpen">
        <!-- <AlertDialogTrigger as-child>
        <Button variant="outline"> Show Dialog </Button>
      </AlertDialogTrigger> -->
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
            <AlertDialogAction @click="executePendingCmd"
              >Continue <Icon class="ml-2 h-4 w-4" icon="icon-park-solid:enter-key"
            /></AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    <CommandList class="px-2">
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="System Commands">
        <CommandItem
          v-for="(cmd, idx) in systemCommands"
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
