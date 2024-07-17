<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HTMLElementId } from "@/lib/constants"
import { useAppUiStore } from "@/stores/ui"
import { Icon } from "@iconify/vue"
import { GlobalEventBus } from "~/lib/utils/events"
import { ref } from "vue"

const appUiStore = useAppUiStore()
const { meta, k, escape } = useMagicKeys()
const open = ref(false)
const cmdk = computed(() => meta.value && k.value)
watch(cmdk, (val) => {
  if (val) {
    open.value = true
  }
})
watch(escape, (val) => {
  if (val) {
    open.value = false
  }
})
function onActionSelected(val: string) {
  GlobalEventBus.emitActionSelected(val)
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger>
      <Button variant="ghost" role="combobox" :aria-expanded="open" class="justify-between gap-2">
        <span>Action</span>
        <span class="flex items-center gap-0.5">
          <Icon icon="ph-command" />
          <kbd>K</kbd>
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command @update:model-value="(v) => onActionSelected(v as string)">
        <CommandInput
          class="h-9"
          placeholder="Pick Action..."
          :id="HTMLElementId.ActionPanelInputId"
        />
        <CommandEmpty>No action found.</CommandEmpty>
        <CommandList>
          <CommandItem
            v-if="appUiStore.actionPanel"
            v-for="action in appUiStore.actionPanel?.items"
            :value="action.title"
            class="gap-2"
          >
            <IconMultiplexer v-if="action.icon" :icon="action.icon" />
            <span>{{ action.title }}</span>
          </CommandItem>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
