<script setup lang="ts">
import Separator from "./Separator.vue"
</script>

<template>
  <div class="flex justify-center items-center space-x-5">
    <span class="w-full">
      <Separator />
    </span>
    <slot />
    <span class="w-full">
      <Separator />
    </span>
  </div>
</template>
