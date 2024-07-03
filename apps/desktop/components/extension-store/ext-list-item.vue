<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { humanReadableNumber } from "@/lib/utils/format"
import { CircleCheckBigIcon } from "lucide-vue-next"
import { CommandItem } from "@/components/ui/command"
import { ExtItem } from "./types"
import IconMultiplexer from "@/components/IconMultiplexer.vue"

const props = defineProps<{
  data: ExtItem
  installed: boolean
}>()

const emits = defineEmits<{
  (e: "select"): void
}>()
</script>
<template>
  <CommandItem :value="props.data" class="" @select="emits('select')">
    <div class="flex justify-between items-center w-full">
      <div class="flex items-center space-x-4">
        <IconMultiplexer :icon="props.data.icon" class="w-6 h-6" />
        <div>
          <div class="font-semibold">{{ props.data.name }}</div>
          <div class="text-xs text-muted-foreground font-mono">
            {{ props.data.short_description }}
          </div>
        </div>
      </div>
      <div class="flex space-x-4">
        <CircleCheckBigIcon v-if="props.installed" class="w-4 text-green-400" />
        <div class="flex items-center space-x-1">
          <Icon icon="ic:round-download" class="w-5 h-5 inline" />
          <span class="w-8 text-center">{{ humanReadableNumber(props.data.downloads) }}</span>
        </div>
      </div>
    </div>
  </CommandItem>
</template>
