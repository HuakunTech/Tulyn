<script setup lang="ts">
import { CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { List, ListView } from "jarvis-api/ui/worker"

const props = defineProps<{ modelValue: ListView }>()
</script>
<template>
  <CommandList class="h-full">
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandItem v-for="item in props.modelValue.items" :value="item.title">
      <span class="truncate">{{ item.title }}</span>
      <CommandShortcut>{{ item.subTitle }}</CommandShortcut>
    </CommandItem>
  </CommandList>
</template>
