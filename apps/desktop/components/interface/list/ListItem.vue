<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ListboxItem, ListboxItemIndicator } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <ListboxItem
    value=""
    :class="
      cn(
        'w-full flex items-center px-7 h-[25px] leading-none text-[13px] relative text-green9 select-none outline-none data-[highlighted]:ring-green9 data-[highlighted]:ring-1 focus:ring-green9 focus:ring-2 focus:bg-primary-foreground hover:bg-primary-foreground data-[state=checked]:bg-green9 data-[state=checked]:text-white data-[disabled]:opacity-50 rounded',
        props.class,
      )
    "
  >
    <ListboxItemIndicator
      class="absolute left-0 w-[25px] inline-flex items-center justify-center"
    >
      <Icon icon="radix-icons:check" />
    </ListboxItemIndicator>
    <slot />
  </ListboxItem>
</template>
