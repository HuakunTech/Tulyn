<script setup lang="ts">
import IconMultiplexer from "@/components/IconMultiplexer.vue"
import { CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { IconEnum } from "jarvis-api/models"
import { List, ListSchema } from "jarvis-api/ui/worker"

const props = defineProps<{ modelValue: ListSchema.List }>()
</script>
<template>
  <CommandList class="h-full">
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandItem v-for="item in props.modelValue.items" :value="item.title" class="gap-2">
      <IconMultiplexer v-if="item.icon" :icon="item.icon" class="w-5 h-5" />
      <span class="truncate">{{ item.title }}</span>
      <CommandShortcut>{{ item.subTitle }}</CommandShortcut>
    </CommandItem>
  </CommandList>
</template>
