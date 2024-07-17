<script setup lang="ts">
import IconMultiplexer from "@/components/IconMultiplexer.vue"
import { CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import StrikeSeparator from "@/components/ui/separator/StrikeSeparator.vue"
import { expose, type Remote } from "@huakunshen/comlink"
import { IconEnum } from "jarvis-api/models"
import { List, ListSchema, type IWorkerExtensionBase } from "jarvis-api/ui/worker"

const props = defineProps<{
  modelValue: ListSchema.List
  workerAPI: Remote<IWorkerExtensionBase>
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
    <CommandItem v-for="item in modelValue.items" :value="item" class="gap-2">
      <IconMultiplexer v-if="item.icon" :icon="item.icon" class="w-5 h-5" />
      <span class="truncate">{{ item.title }}</span>
      <span class="text-muted-foreground">{{ item.subTitle }}</span>
      <CommandShortcut>
        <div class="flex gap-2">
          <span v-for="acc in item.accessories" class="flex items-center gap-1">
            <IconMultiplexer v-if="acc.icon" :icon="acc.icon" class="w-4 h-4" />
            <span>{{ acc.text }}</span>
          </span>
        </div>
      </CommandShortcut>
    </CommandItem>
    <StrikeSeparator v-if="loading" class="h-20"><span>Loading</span></StrikeSeparator>
  </CommandList>
</template>
