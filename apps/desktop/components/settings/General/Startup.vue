<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox";
</script>
<template>
  <div class="grid grid-cols-2 gap-4">
    <span class="justify-self-end">Startup</span>
    <div class="flex items-center space-x-2">
      <Checkbox id="startup" />
      <label
        for="startup"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
      >
        Launch at login
      </label>
    </div>
  </div>
</template>
