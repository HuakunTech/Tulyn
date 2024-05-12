<script setup lang="ts">
import { ListboxRoot, ListboxContent } from "radix-vue";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <ListboxRoot
    :class="cn('flex flex-col rounded-lg text-green9 mx-auto', props.class)"
  >
    <ListboxContent class="p-2 w-full h-full overflow-auto">
      <slot />
    </ListboxContent>
  </ListboxRoot>
</template>
