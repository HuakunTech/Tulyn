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
import { Icon } from "@iconify/vue"
import { CaretSortIcon, CheckIcon } from "@radix-icons/vue"
import clipboard from "tauri-plugin-clipboard-api"
import { ref } from "vue"
import { toast } from "vue-sonner"

const ActionTypes = {
  CopyPlainText: "Copy Plain Text",
  CopyToClipboard: "Copy to Clipboard"
}

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
// const actions = computed<string[]>(() => {
//   const candidates = [ActionTypes.CopyToClipboard]
//   switch (props.rec?.content_type) {
//     case "Html":
//       candidates.push(ActionTypes.CopyPlainText)
//       break
//     case "Rtf":
//       candidates.push(ActionTypes.CopyPlainText)
//       break
//   }
//   return candidates
// })
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="ghost" role="combobox" :aria-expanded="open" class="justify-between gap-2">
        Actions
        <span class="flex items-center gap-0.5">
          <Icon icon="ph:command" />
          <kbd>K</kbd>
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Pick Action..." id="action-panel-input" />
        <CommandEmpty>No action found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <!-- <CommandItem
              v-for="action in actions"
              :key="action"
              :value="action"
              @select="
                (ev) => {
                  ev.detail.value &&
                    getPromise(ev.detail.value as keyof typeof ActionTypes)
                      .then(() => {
                        toast.success('Copied to clipboard');
                      })
                      .catch((err) => {
                        toast.error('Failed to copy to clipboard', err);
                      });

                  open = false;
                }
              "
            >
              {{ action }}
            </CommandItem> -->
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
