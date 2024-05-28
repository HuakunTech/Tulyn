<script setup lang="ts">
import Icon from "./Icon.vue";
import { Icon as Iconify } from "@iconify/vue";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ExtStoreDrawer from "./ExtStoreDrawer.vue";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExtItem } from "./types";
import { computed, onMounted, ref, watch } from "vue";
import { ApolloClient, HttpLink, InMemoryCache, type ApolloQueryResult } from "@apollo/client";
import {
  type FindLatestExtQuery,
  type FindLatestExtQueryVariables,
  FindLatestExtDocument,
} from "@jarvis/gql";
import { gqlClient } from "@/lib/utils/graphql";
import { compareVersions } from "compare-versions";
import { type Tables } from "@jarvis/ext-api/supabase/types/supabase";
import * as supabase from "@/lib/utils/supabase";
import { JarvisExtManifest } from "jarvis-api";
import { Separator } from "@/components/ui/separator";
import { GlobalEventBus } from "@/lib/utils/events";

const props = defineProps<{
  open: boolean;
  selectedExt?: ExtItem;
}>();

const emits = defineEmits<{
  (e: "update:open", open: boolean): void;
}>();
type ExtPublish = Tables<"ext_publish"> & {
  // demo_images: (string | null)[];
  // nodeId: string;
  // __typename: string;
};
const currentExt = ref<ExtPublish | null>(null);

watch(
  () => props.open,
  async (open) => {
    if (open) {
      //   const response: ApolloQueryResult<AllExtensionsQuery> = await gqlClient.query({
      //     query: AllExtensionsDocument,
      //   });
      const response = await gqlClient.query<FindLatestExtQuery, FindLatestExtQueryVariables>({
        query: FindLatestExtDocument,
        variables: {
          identifier: props.selectedExt?.identifier,
        },
      });
      const exts = response.data.ext_publishCollection?.edges;
      if (exts && exts.length > 0) {
        // @ts-ignore
        currentExt.value = exts[0].node;
        console.log(currentExt.value);
      }
    } else {
      currentExt.value = null;
    }
  },
);

const manifest = computed(() => {
  if (currentExt.value) {
    // @ts-ignore
    return JarvisExtManifest.parse(JSON.parse(currentExt.value?.manifest as string));
  } else {
    return null;
  }
});

onMounted(() => {
  GlobalEventBus.onKeyDown((e) => {
    if (e.key === "Enter" && currentExt.value) {
      // run installation
      const tarballUrl = supabase.getFileUrl(currentExt.value.tarball_path).data.publicUrl;

    }
  });
});
</script>
<template>
  <ExtStoreDrawer :open="props.open" @update:open="(open) => emits('update:open', open)">
    <!-- <DrawerTrigger>Open</DrawerTrigger> -->
    <DrawerContent>
      <DrawerHeader class="flex space-x-5 items-center">
        <Icon v-if="props.selectedExt" :icon="props.selectedExt?.icon" class="w-12 h-12" />
        <div>
          <DrawerTitle>
            <strong class="text-xl">{{ selectedExt?.name }}</strong>
          </DrawerTitle>
          <DrawerDescription>{{ selectedExt?.short_description }}</DrawerDescription>
        </div>
      </DrawerHeader>
      <ScrollArea class="h-[60vh] px-4">
        <ScrollArea dir="ltr">
          <img
            v-for="ext in currentExt?.demo_images"
            :src="supabase.getFileUrl(ext).data.publicUrl"
            class="h-32"
            alt=""
          />
        </ScrollArea>
        <Separator class="my-5" />
        <DrawerDescription class="text-lg">Description</DrawerDescription>
        <span>
          {{ selectedExt?.long_description }}
        </span>
        <Separator class="my-5" />
        <DrawerDescription class="text-lg">Commands</DrawerDescription>

        <ul>
          <li v-if="manifest" v-for="cmd in manifest.uiCmds">
            <div class="flex items-center space-x-3">
              <Icon
                v-if="props.selectedExt"
                :icon="props.selectedExt?.icon"
                class="w-8 h-8 inline"
              />
              <span class="text-xl">{{ cmd.name }}</span>
            </div>
            <DrawerDescription>cmd.description</DrawerDescription>
            <Separator class="my-3" />
            <!-- <span>{{ cmd.description }}</span> -->
          </li>
        </ul>
      </ScrollArea>
      <DrawerFooter>
        <!-- <Button>Submit</Button>
        <DrawerClose>
          <Button variant="outline"> Cancel </Button>
        </DrawerClose> -->
        <Button @click=""
          >Install <kbd><Iconify icon="mi:enter" class="w-5 h-5 ml-2" /></kbd
        ></Button>
      </DrawerFooter>
    </DrawerContent>
  </ExtStoreDrawer>
</template>
