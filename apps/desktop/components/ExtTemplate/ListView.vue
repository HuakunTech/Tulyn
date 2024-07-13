<script setup lang="ts">
import { CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import type { IListView } from "jarvis-api/ui/worker"

const props = defineProps<{ modelValue: IListView }>()
</script>
<template>
  <CommandList class="h-full">
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandItem v-for="item in props.modelValue.items" :value="item.value">
      <span class="truncate">{{ item.title }}</span>
      <CommandShortcut>{{ item.description }}</CommandShortcut>
    </CommandItem>
  </CommandList>
</template>
