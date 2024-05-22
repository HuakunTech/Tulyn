<script setup lang="ts">
import { getDevExtensionFolder, getExtensionFolder } from "@/lib/commands/server";
import { Button } from "@/components/ui/button";
import { onMounted, ref } from "vue";
import { open } from "@jarvis/api-ui";
import { Icon } from "@iconify/vue";

const extFolder = ref<string | null>();
const devExtFolder = ref<string | null>();

async function refreshFolderFetch() {
  extFolder.value = await getExtensionFolder();
  devExtFolder.value = await getDevExtensionFolder();
}

onMounted(async () => {
  refreshFolderFetch();
});
</script>
<template>
  <div class="flex justify-between pr-5">
    <ul>
      <li
        class="text-muted-foreground cursor-pointer flex space-x-2 items-center"
        @click="extFolder && open(extFolder)"
      >
        <span>{{ extFolder }}</span
        ><Icon icon="ion:open-outline" />
      </li>
      <li
        class="text-muted-foreground cursor-pointer flex space-x-2 items-center"
        @click="devExtFolder && open(devExtFolder)"
      >
        <span>{{ devExtFolder }}</span
        ><Icon icon="ion:open-outline" />
      </li>
    </ul>
    <Button class="" size="xs" @click="refreshFolderFetch">Refresh</Button>
  </div>
</template>
