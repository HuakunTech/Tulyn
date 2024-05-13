<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";
import { model } from "@jarvis/api";
import { Icon } from "@iconify/vue";

const props = defineProps<{ class?: HTMLAttributes["class"]; cmd: model.list.TListItem; highlighted: boolean }>();
const emit = defineEmits<{
  (e: "mouseover"): void;
}>();
const element = ref<HTMLElement | null>(null);
// watch(
//   () => props.highlighted,
//   (val) => {
//     if (val) {
//       element.value?.scrollIntoView({ behavior: "smooth" });
//     }
//   },
// );
</script>
<template>
  <li ref="element" :class="cn(props.highlighted ? 'bg-border' : '', props.class)" @mousemove="emit('mouseover')">
    <span class="flex items-center">
      <Button size="sm" variant="ghost" class="pointer-events-none">
        <Icon v-if="cmd.icon.type === model.list.IconType.Enum.iconify" :icon="cmd.icon.value" class="w-5 h-5" />
      </Button>
      <span class="font-semibold text-sm">{{ cmd.title }}</span>
      <pre class="p-0 m-0 ml-4 text-sm">{{ cmd.description }}</pre>
    </span>
    <span class="pr-3 text-muted-foreground capitalize font-mono">{{ cmd.type }}</span>
  </li>
</template>
