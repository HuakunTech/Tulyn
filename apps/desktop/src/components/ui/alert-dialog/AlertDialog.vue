<script setup lang="ts">
import {
  type AlertDialogEmits,
  type AlertDialogProps,
  AlertDialogRoot,
  useForwardPropsEmits,
} from "radix-vue";

const props = defineProps<
  AlertDialogProps & {
    open?: boolean;
  }
>();
const emits = defineEmits<AlertDialogEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <AlertDialogRoot v-bind="forwarded" :open="props.open">
    <slot />
  </AlertDialogRoot>
</template>
