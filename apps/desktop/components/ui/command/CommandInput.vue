<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { MagnifyingGlassIcon } from "@radix-icons/vue";
import { ComboboxInput, type ComboboxInputProps, useForwardProps } from "radix-vue";
import { cn } from "@/lib/utils";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<
  ComboboxInputProps & {
    class?: HTMLAttributes["class"];
    alwaysFocus?: boolean;
  }
>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);

const inputRef = ref<HTMLElement>();

/**
 * Force always focus on search bar
 */
function inputOnBlur() {
  setTimeout(() => {
    inputRef.value?.querySelector("input")?.focus();
  }, 200);
}

onMounted(() => {
  if (props.alwaysFocus) {
    inputRef.value?.querySelector("input")?.addEventListener("blur", inputOnBlur);
  }
});

onUnmounted(() => {
  if (props.alwaysFocus) {
    inputRef.value?.querySelector("input")?.removeEventListener("blur", inputOnBlur);
  }
});
</script>

<template>
  <div ref="inputRef" class="flex items-center border-b px-3" cmdk-input-wrapper>
    <MagnifyingGlassIcon class="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <ComboboxInput
      v-bind="{ ...forwardedProps, ...$attrs }"
      auto-focus
      :class="
        cn(
          'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
        )
      "
    />
  </div>
</template>
