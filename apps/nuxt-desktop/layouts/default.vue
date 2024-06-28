<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";

const colorMode = useColorMode();
</script>
<template>
  <Toaster />
  <slot />
</template>
