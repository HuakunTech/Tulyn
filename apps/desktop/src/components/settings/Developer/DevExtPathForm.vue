<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { documentDir, join } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { $appConfig, setDevExtentionPath } from "@/lib/stores/appConfig";
import { useStore } from "@nanostores/vue";
import { pathExists } from "@/lib/commands/fs";

const { toast } = useToast();
const appConfig = useStore($appConfig);
const devExtPath = ref(appConfig.value.devExtentionPath);

async function onSubmit(e: Event) {
  e.preventDefault();

  if (!devExtPath.value || !(await exists(devExtPath.value))) {
    console.log("Invalid Path");

    return toast({
      title: "Invalid Path",
      description: "Please enter an existing path",
      variant: "destructive",
    });
  }
}
</script>

<template>
  <form class="w-full space-y-6" @submit="onSubmit">
    <div class="flex w-full items-center gap-1.5">
      <Input id="dev-ext-path" type="path" placeholder="Enter Path" v-model="devExtPath" />
      <Button type="submit">Set</Button>
    </div>
  </form>
</template>
