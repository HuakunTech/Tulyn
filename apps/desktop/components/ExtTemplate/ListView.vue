<script setup lang="ts">
import IconMultiplexer from "@/components/IconMultiplexer.vue"
import { CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { expose, type Remote } from "@huakunshen/comlink"
import { IconEnum } from "jarvis-api/models"
import { List, ListSchema, type IWorkerExtensionBase } from "jarvis-api/ui/worker"

const props = defineProps<{
  modelValue: ListSchema.List
  workerAPI: Remote<IWorkerExtensionBase>
}>()
function onScroll(e: Event) {
  const element = e.target as HTMLElement
  if (element?.scrollHeight - element?.scrollTop === element?.clientHeight) {
    props.workerAPI.onScrolledToBottom()
  }
}
</script>
<template>
  <CommandList class="h-full" @scroll="onScroll">
    <!-- <pre>{{ items.map(item => item.title) }}</pre> -->
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandItem v-for="item in modelValue.items" :value="item" class="gap-2">
      <IconMultiplexer v-if="item.icon" :icon="item.icon" class="w-5 h-5" />
      <span class="truncate">{{ item.title }}</span>
      <CommandShortcut>{{ item.subTitle }}</CommandShortcut>
    </CommandItem>
  </CommandList>
</template>
