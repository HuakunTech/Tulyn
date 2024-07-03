<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
</script>

<template>
  <main class="h-screen flex flex-col">
    <Toaster :rich-colors="true" />
    <Topbar />
    <slot />
  </main>
</template>
