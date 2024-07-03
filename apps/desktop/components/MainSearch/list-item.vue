<script setup lang="ts">
import { Icon } from "@iconify/vue"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command"
import type { TListItem } from "jarvis-api/models"
import { Badge } from "@/components/ui/badge"
import { $appConfig, setDevExtLoadUrl, setShowInTray } from "@/lib/stores/appConfig"
import { useStore } from "@nanostores/vue"

const appConfig = useStore($appConfig)
const props = defineProps<{ item: TListItem; isDevExt: boolean }>()
const emits = defineEmits<{
  (e: "select"): void
}>()
</script>

<template>
  <CommandItem @select="() => emits('select')" :value="item.value">
    <img
      width="20"
      class="mr-2"
      v-if="item.icon?.type === 'remote-url'"
      :src="item.icon?.value"
      alt=""
    />
    <Icon v-else-if="item.icon?.type === 'iconify'" :icon="item.icon.value" class="w-5 h-5 mr-2" />
    <Icon v-else icon="mingcute:appstore-fill" class="w-5 h-5 mr-2" />
    <span>{{ item.title }}</span>
    <CommandShortcut class="space-x-1">
      <Icon
        v-if="item.flags.isDev"
        icon="ph:dev-to-logo-fill"
        class="inline w-6 h-6 text-green-500"
      />
      <Badge
        v-if="appConfig.devExtLoadUrl && isDevExt"
        class="rounded-sm py-0.5 px-1"
        variant="outline"
        >Live</Badge
      >
      <span>{{ item.type }}</span>
    </CommandShortcut>
  </CommandItem>
</template>
