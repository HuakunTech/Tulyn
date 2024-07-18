<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner"
</script>

<template>
  <main class="flex h-screen flex-col">
    <Toaster :rich-colors="true" />
    <Topbar />
    <slot />
  </main>
</template>
