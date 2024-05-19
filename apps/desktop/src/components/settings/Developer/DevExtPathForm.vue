<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import {
  appCacheDir,
  appConfigDir,
  appDataDir,
  appLocalDataDir,
  appLogDir,
  documentDir,
  join,
} from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { $appConfig, setDevExtentionPath } from "@/lib/stores/appConfig";
import { useStore } from "@nanostores/vue";
import { pathExists } from "@/lib/commands/fs";
import { onMount } from "nanostores";
import { loadDevExtManifests, loadExtManifests } from "@/lib/stores/extensions";

const { toast } = useToast();
const appConfig = useStore($appConfig);
const devExtPath = ref(appConfig.value.devExtentionPath);

const lock = ref(true);

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
      <Button v-if="lock" type="button" @click="lock = !lock">Edit</Button>
      <Button v-else type="submit">Set</Button>
    </div>
  </form>
</template>
