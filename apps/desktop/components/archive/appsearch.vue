<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/window";
import { Input } from "@/components/ui/input";
import { appDataDir } from "@tauri-apps/api/path";
import { startServer, stopServer, serverIsRunning } from "@/lib/commands/server";
import { Calculator, Calendar, CreditCard, Settings, Smile, User } from "lucide-vue-next";
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
import { ComboboxInput, type ComboboxInputProps, useForwardProps } from "radix-vue";
import { apps, model } from "@jarvis/api";

const searchTerm = ref("");
const allApps = ref<model.apps.AppInfo[]>([]);
// const foundApps = ref<model.apps.AppInfo[]>([]);
// watch(searchTerm, (value) => {
//   console.log(value);
//   foundApps.value = allApps.value.filter((app: model.apps.AppInfo) => {
//     const appName = app.name.toLowerCase().trim();
//     const searchValue = value.toLowerCase().trim();
//     const match = appName.includes(searchValue);
//     if (app.name === "iTerm2") {
//       console.log(appName, searchValue, match);
//     }
//     return match;
//   });
//   console.log(foundApps.value);
// });

const foundApps = computed<model.apps.AppInfo[]>(() => {
  return allApps.value.filter((app: model.apps.AppInfo) => {
    const appName = app.name.toLowerCase().trim();
    const searchValue = searchTerm.value.toLowerCase().trim();
    const match = appName.includes(searchValue);
    // if (app.name === "iTerm2") {
    console.log(appName, searchValue, match);
    // }
    return match;
  });
});

onMounted(async () => {
  allApps.value = await await apps.getAllApps();
  // allApps.value = [
  //   {
  //     name: "iTerm2",
  //     icon_path: "",
  //     app_path_exe: "",
  //     app_desktop_path: "",
  //   },
  //   {
  //     name: "iTerm3",
  //     icon_path: "",
  //     app_path_exe: "",
  //     app_desktop_path: "",
  //   },
  // ];
  // console.log(allApps.value);
});
</script>
<template>
  <NuxtLayout>
    <div>
      <Command class="rounded-lg border shadow-md" v-model:searchTerm="searchTerm">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList class="h-full max-h-[85vh]">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="Calendar">
              <Calendar class="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem value="Search Emoji">
              <Smile class="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem value="Calculator">
              <Calculator class="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Applications">
            <CommandItem
              v-for="app in foundApps"
              :key="app.app_desktop_path"
              :value="app.app_desktop_path"
              @select="
                (ev) => {
                  console.log(ev);
                }
              "
              >{{ app.name }}
            </CommandItem>
            <CommandItem value="Profile1">
              <User class="mr-2 h-4 w-4" />
              <span>Profile1</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>

            <CommandItem value="iTerm2">
              <CreditCard class="mr-2 h-4 w-4" />
              <span>iTerm2</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem value="Settings">
              <Settings class="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
    <!-- <CmdPalette></CmdPalette> -->

    <!-- <Button @click="startServer">Start Server</Button>
      <Button>
        <NuxtLink to="/extensions">Extensions</NuxtLink>
      </Button>
    <ModeToggle />
    <Input v-model="searchTerm" /> -->
    <!-- <CmdPalette></CmdPalette>
      <Cmd2></Cmd2> -->
    <!-- <pre>
        {{ JSON.stringify(foundApps, null, 2) }}
      </pre> -->
  </NuxtLayout>
</template>
