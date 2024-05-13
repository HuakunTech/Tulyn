<script setup lang="ts">
import { ListboxRoot, ListboxContent } from "radix-vue";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  modelValue?: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", payload: any): void;
}>();
</script>

<template>
  <ListboxRoot
    :highlight-on-hover="true"
    @highlight="e => console.log(e)"
    :model-value="props.modelValue"
    @update:model-value="(e) => emits('update:modelValue', e)"
    :class="cn('flex flex-col rounded-lg text-green9 mx-auto', props.class)"
  >
    <ListboxContent class="p-2 w-full h-full overflow-auto">
      <slot />
    </ListboxContent>
  </ListboxRoot>
</template>
