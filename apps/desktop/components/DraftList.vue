<script setup lang="ts">
import { GlobalEventBus } from "~/lib/globalEvents";
import { Button } from "~/components/ui/button";
import { system, apps } from "@jarvis/api";
import { Icon } from "@iconify/vue";
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";
import { model } from "@jarvis/api";

const itemRefs = ref<HTMLElement[]>([]);
const itemRef = ref<HTMLUListElement | null>(null);

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const highlightIdx = ref(0);
function itemOnMouseover(idx: number) {
  highlightIdx.value = idx;
}

function isElementInViewport(el: HTMLElement) {
  const parentRect = itemRef.value?.getBoundingClientRect();
  console.log(itemRef.value?.scrollTop);
  console.log(el.scrollTop);
  // console.log(parentRect);

  if (!parentRect) return false;

  const rect = el.getBoundingClientRect();
  // console.log(rect);
  return (
    rect.top >= parentRect.y &&
    rect.left >= parentRect.y &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// function isOutOfViewport(element: HTMLElement) {
//   const rect = element.getBoundingClientRect();
//   console.log(rect);

//   return {
//     top: rect.top < 0,
//     left: rect.left < 0,
//     bottom: rect.bottom > (window.innerHeight || document.documentElement.clientHeight),
//     right: rect.right > (window.innerWidth || document.documentElement.clientWidth),
//   };
// }

function highlight(idx: number) {
  const el = itemRefs.value[highlightIdx.value];
  if (!itemRef.value) return;
  var elHeight = el.offsetHeight;
  var scrollTop = itemRef.value.scrollTop;
  var viewport = scrollTop + itemRef.value.offsetHeight;
  var elOffset = elHeight * idx;
  if (elOffset < scrollTop || (elOffset + elHeight) > viewport) {
    itemRef.value.scrollTop = elOffset;
  }
        // $(ul).scrollTop(elOffset);
}

function onKeydown(e: KeyboardEvent) {
  e.preventDefault();
  if (e.key === "ArrowDown") {
    highlightIdx.value = Math.min(highlightIdx.value + 1, system.systemCommandListItems.length - 1);
    const el = itemRefs.value[highlightIdx.value];
    el.focus();
    // const isOut = isOutOfViewport(el);
    // if (!isElementInViewport(el)) {
    //   el.scrollIntoView({ behavior: "smooth" });
    // }
  } else if (e.key === "ArrowUp") {
    highlightIdx.value = Math.max(highlightIdx.value - 1, 0);
    const el = itemRefs.value[highlightIdx.value];
    el.focus();
    // const isOut = isOutOfViewport(el);
    // if (!isElementInViewport(el)) {
    //   el.scrollIntoView({ behavior: "smooth" });
    // }
  } else if (e.key === "Enter") {
    const cmd = system.systemCommandListItems[highlightIdx.value];
    console.log(cmd);

    if (cmd.type === "app") {
      //   apps.launchApp(cmd.title);
    }
  }
}

onMounted(() => {
  // GlobalEventBus.onSearchBarKeyDown(onKeydown);
  // itemRef.value?.addEventListener("keydown", () => {});
  document.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  // GlobalEventBus.offSearchBarKeyDown(onKeydown);
  document.removeEventListener("keydown", onKeydown);
});
</script>
<template>
  <ul :class="cn('w-full py-2', props.class)" ref="itemRef">
    <li
      v-for="(cmd, idx) in system.systemCommandListItems"
      ref="itemRefs"
      :key="idx"
      class="flex justify-between items-center space-x-4 mx-2 rounded-md py-0.5"
      :class="cn(idx === highlightIdx ? 'bg-border' : '')"
      @mouseover="itemOnMouseover(idx)"
      :cmd="cmd"
      :highlighted="idx === highlightIdx"
    >
      <span class="flex items-center">
        <Button size="sm" variant="ghost" class="pointer-events-none">
          <Icon v-if="cmd.icon.type === model.list.IconType.Enum.iconify" :icon="cmd.icon.value" class="w-5 h-5" />
        </Button>
        <span class="font-semibold text-sm">{{ cmd.title }}</span>
        <pre class="p-0 m-0 ml-4 text-sm">{{ cmd.description }}</pre>
      </span>
      <span class="pr-3 text-muted-foreground capitalize font-mono">{{ cmd.type }}</span>
    </li>
    <!-- <DraftListItem
      v-for="(cmd, idx) in system.systemCommandListItems"
      ref="itemRefs"
      :key="idx"
      class="flex justify-between items-center space-x-4 mx-2 rounded-md py-0.5"
      @mouseover="itemOnMouseover(idx)"
      :cmd="cmd"
      :highlighted="idx === highlightIdx"
    >
      
    </DraftListItem> -->
  </ul>
</template>
