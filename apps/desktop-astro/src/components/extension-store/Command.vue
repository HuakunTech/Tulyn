<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { ComboboxRootEmits, ComboboxRootProps } from "radix-vue";
import { ComboboxRoot, useForwardPropsEmits } from "radix-vue";
import { cn } from "@/lib/utils";
import type { ExtItem } from "./types";

const props = withDefaults(defineProps<ComboboxRootProps & { class?: HTMLAttributes["class"] }>(), {
  open: true,
  modelValue: "",
});

const emits = defineEmits<ComboboxRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>
<template>
  <ComboboxRoot
    v-bind="forwarded"
    :resetSearchTermOnBlur="false"
    :filterFunction="
      (items: ExtItem[], searchTerm: string) => {
        return items.filter((item) => {
          return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.short_description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }
    "
    :class="
      cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        props.class,
      )
    "
  >
    <slot />
  </ComboboxRoot>
</template>
