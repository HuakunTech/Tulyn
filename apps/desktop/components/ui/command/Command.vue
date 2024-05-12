<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import type { ComboboxRootEmits, ComboboxRootProps } from "radix-vue";
import { ComboboxRoot, useForwardPropsEmits } from "radix-vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<
    ComboboxRootProps & { class?: HTMLAttributes["class"]; searchTerm: string }
  >(),
  {
    open: true,
    modelValue: "",
    // searchTerm: "",
  },
);

const emits = defineEmits<
  ComboboxRootEmits & {
    // (e: "update:searchTerm", value: string): void;
    // "update:searchTerm": [value: string];
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ComboboxRoot
    v-bind="forwarded"
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
