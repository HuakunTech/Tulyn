<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { exists } from "@tauri-apps/plugin-fs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { $appConfig, setDevExtentionPath } from "@/lib/stores/appConfig";
import { useStore } from "@nanostores/vue";
import { pathExists } from "@/lib/commands/fs";
import { onMount } from "nanostores";
import { loadDevExtManifests, loadExtManifests, $extensionsStore } from "@/lib/stores/extensions";
import { open } from "@tauri-apps/plugin-dialog";

const { toast } = useToast();
const appConfig = useStore($appConfig);
const devExtPath = ref(appConfig.value.devExtentionPath);

const lock = ref(true);

async function pickDirectory() {
  const dir = await open({
    multiple: false,
    directory: true,
  });

  if (dir && (await pathExists(dir))) {
    devExtPath.value = dir;
    setDevExtentionPath(devExtPath.value);
    await loadExtManifests();
    await loadDevExtManifests();
    // $extensionsStore.get().devManifests.length
    toast({
      title: "Dev Extension Path Set",
      description: `${$extensionsStore.get().devManifests.length} dev extensions loaded.`,
    });
  } else {
    return toast({
      title: "Invalid Path",
      description: "Please enter an existing path",
      variant: "destructive",
    });
  }
}

async function onSubmit(e: Event) {
  e.preventDefault();

  if (!devExtPath.value || !(await pathExists(devExtPath.value))) {
    console.log("Invalid Path");

    return toast({
      title: "Invalid Path",
      description: "Please enter an existing path",
      variant: "destructive",
    });
  }

  setDevExtentionPath(devExtPath.value);
  loadExtManifests();
  loadDevExtManifests();
  lock.value = true;
}
</script>

<template>
  <form class="w-full space-y-6" @submit="onSubmit">
    <div class="flex w-full items-center gap-1.5">
      <Input
        id="dev-ext-path"
        type="path"
        placeholder="Enter Path"
        v-model="devExtPath"
        :disabled="lock"
      />
      <!-- <Input id="folder" type="text" placeholder="Click to select a folder" class="cursor-pointer" disabled /> -->

      <Button type="button" @click="pickDirectory">
        Edit
        <Icon icon="flowbite:edit-outline" class="w-5 h-5 ml-2" />
      </Button>
      <!-- <Button v-else type="submit">Set</Button> -->
    </div>
  </form>
</template>
