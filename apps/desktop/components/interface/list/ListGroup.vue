<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ListboxGroup, ListboxGroupLabel } from "radix-vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  heading?: string;
}>();
</script>
<template>
  <ListboxGroup>
    <ListboxGroupLabel
      :class="cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', props.class)"
    >
      {{ props.heading }}
    </ListboxGroupLabel>
    <slot />
  </ListboxGroup>
</template>
