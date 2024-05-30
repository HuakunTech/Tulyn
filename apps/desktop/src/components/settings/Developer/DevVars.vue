<script setup lang="ts">
import { getDevExtensionFolder, getExtensionFolder } from "@/lib/commands/server";
import { Button } from "@/components/ui/button";
import { onMounted, ref } from "vue";
import { open } from "jarvis-api/ui";
import { Icon } from "@iconify/vue";
import { SUPABASE_URL } from "@/lib/constants";

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
  <div class="flex flex-col space-y-3 pr-5">
    <ul>
      <li
        class="text-muted-foreground cursor-pointer flex space-x-2 items-center"
        @click="extFolder && open(extFolder)"
      >
        <strong>Extension Path: </strong><span class="">{{ extFolder }}</span
        ><Icon icon="ion:open-outline" />
      </li>
      <li
        class="text-muted-foreground cursor-pointer flex space-x-2 items-center"
        @click="devExtFolder && open(devExtFolder)"
      >
        <strong>Dev Extension Path: </strong><span>{{ devExtFolder }}</span
        ><Icon icon="ion:open-outline" />
      </li>

      <!-- <li class="text-muted-foreground cursor-pointer flex space-x-2 items-center">
        <strong>Supabase GraphQL Endpoint</strong><span>{{ SUPABASE_URL }}</span
        ><Icon icon="ion:open-outline" />
      </li> -->
    </ul>
    <Button class="" size="xs" @click="refreshFolderFetch">Refresh</Button>
  </div>
</template>
