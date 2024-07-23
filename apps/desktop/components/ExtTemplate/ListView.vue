<script setup lang="ts">
import IconMultiplexer from "@/components/IconMultiplexer.vue"
import { CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import StrikeSeparator from "@/components/ui/separator/StrikeSeparator.vue"
import { expose, type Remote } from "@huakunshen/comlink"
import { IconEnum } from "@kunkunsh/api/models"
import { List, ListSchema, WorkerExtension } from "@kunkunsh/api/ui/worker"
import ListItem from "./ListItem.vue"

const props = defineProps<{
  modelValue: ListSchema.List
  workerAPI: Remote<WorkerExtension>
  loading: boolean
}>()
let isScrolling = false

function onScroll(e: Event) {
  const element = e.target as HTMLElement
  if (!isScrolling && element?.scrollHeight - element?.scrollTop === element?.clientHeight) {
    isScrolling = true
    props.workerAPI.onScrolledToBottom()
    setTimeout(() => {
      isScrolling = false
    }, 500)
  }
}
</script>
<template>
  <CommandList class="h-full" @scroll="onScroll">
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup v-for="section in modelValue.sections" :heading="section.title">
      <ListItem v-for="item in section.items" :item="item" />
    </CommandGroup>
    <ListItem v-for="item in modelValue.items" :item="item" />
    <StrikeSeparator v-if="loading" class="h-20"><span>Loading</span></StrikeSeparator>
  </CommandList>
</template>
