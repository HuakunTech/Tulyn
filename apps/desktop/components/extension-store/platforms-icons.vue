<script setup lang="ts">
import { IconEnum, type OSPlatformEnum } from "@kksh/api/models";

const props = defineProps<{
  platforms: OSPlatformEnum[];
}>();
</script>
<template>
  <div flex gap-2>
    <IconMultiplexer
      :icon="{
        type: IconEnum.Iconify,
        value: 'logos:linux-tux',
      }"
    />
    <IconMultiplexer
      :icon="{
        type: IconEnum.Iconify,
        value: 'basil:apple-solid',
      }"
    />
    <IconMultiplexer
      :icon="{
        type: IconEnum.Iconify,
        value: 'devicon:windows8',
      }"
    />
  </div>
</template>
