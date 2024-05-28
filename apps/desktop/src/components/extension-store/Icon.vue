<script setup lang="ts">
import { Icon, IconType } from "jarvis-api";
import { Icon as IconifyIcon } from "@iconify/vue";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  icon: Icon;
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <IconifyIcon
    :class="props.class"
    :icon="props.icon.icon"
    v-if="props.icon.type === IconType.Enum.iconify"
  />
  <img :class="props.class" v-else :src="props.icon.icon" alt="" />
</template>
