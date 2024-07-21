<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
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
import { $appConfig, setDevExtLoadUrl, setShowInTray } from "@/lib/stores/appConfig"
import type { TListItem } from "@akun/schema"
import { useStore } from "@nanostores/vue"

const appConfig = useStore($appConfig)
const props = defineProps<{ item: TListItem; isDevExt: boolean }>()
const emits = defineEmits<{
  (e: "select"): void
}>()
</script>

<template>
  <CommandItem @select="() => emits('select')" :value="`${item.value}`">
    <img
      width="20"
      class="mr-2"
      v-if="item.icon?.type === 'remote-url'"
      :src="item.icon?.value"
      alt=""
    />
    <Icon v-else-if="item.icon?.type === 'iconify'" :name="item.icon.value" class="mr-2 h-5 w-5" />
    <Icon v-else name="mingcute:appstore-fill" class="mr-2 h-5 w-5" />
    <span>{{ item.title }}</span>
    <CommandShortcut class="space-x-1">
      <Icon
        v-if="item.flags.isDev"
        name="ph:dev-to-logo-fill"
        class="inline h-6 w-6 text-green-500"
      />
      <Badge
        v-if="appConfig.devExtLoadUrl && isDevExt"
        class="rounded-sm px-1 py-0.5"
        variant="outline"
        >Live</Badge
      >
      <span>{{ item.type }}</span>
    </CommandShortcut>
  </CommandItem>
</template>
