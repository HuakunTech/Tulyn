<script setup lang="ts">
import { cn } from "@/lib/utils"
import type { ComboboxRootEmits, ComboboxRootProps } from "radix-vue"
import { ComboboxRoot, useForwardPropsEmits } from "radix-vue"
import { computed, type HTMLAttributes } from "vue"

const props = withDefaults(
  defineProps<ComboboxRootProps & { class?: HTMLAttributes["class"]; identityFilter: boolean }>(),
  {
    open: true,
    modelValue: "",
    identityFilter: false
  }
)

const emits = defineEmits<ComboboxRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

function customFilter(data: any) {
  // console.log("data", data)
  // do not filter, filtering is done elsewhere
  return data
}

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>
<template>
  <ComboboxRoot
    v-bind="forwarded"
    :filterFunction="props.identityFilter ? customFilter : undefined"
    :resetSearchTermOnBlur="false"
    :class="
      cn(
        'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
        props.class
      )
    "
  >
    <slot />
  </ComboboxRoot>
</template>
