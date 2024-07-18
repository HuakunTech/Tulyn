<script setup lang="ts">
import { Button } from "@/components/ui/button"
import type { TListItem } from "@jarvis/schema"
import { TrashIcon } from "lucide-vue-next"

const props = defineProps<{ item: TListItem }>()
const emits = defineEmits<{
  (e: "delete", item: TListItem): void
}>()
</script>
<template>
  <div class="flex justify-between text-sm">
    <span>{{ props.item.title }}</span>
    <Button size="icon" variant="outline" @click="emits('delete', props.item)"
      ><TrashIcon
    /></Button>
  </div>
  <!-- <Separator class="my-2" /> -->
</template>
