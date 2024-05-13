<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { GlobalEventBus } from "~/lib/globalEvents";

const props = defineProps({
  autofocus: {
    type: Boolean,
    default: true,
  },
  class: {
    type: String,
    default: "",
  },
});
const emits = defineEmits<{
  (e: "downpressed"): void;
}>();
const appStore = useAppsStore();
const searchTerm = computed({
  get() {
    return appStore.searchTerm;
  },
  set(val) {
    appStore.searchTerm = val;
  },
});
function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    appStore.searchTerm = "";
  } else if (e.key === "ArrowDown") {
    emits("downpressed");
  }
  // console.log(e.key);
  GlobalEventBus.emit("searchbar:keydown", e.key);
}

onMounted(() => {});
</script>
<template>
  <div :class="cn('relative w-full items-center border-b-2', props.class)">
    <Input
      @keydown="handleKeydown"
      :autofocus="props.autofocus"
      type="text"
      v-model="searchTerm"
      placeholder="Search for Apps and Commands"
      class="pl-10 border-none focus:border-transparent focus-visible:ring-0"
    />
    <span class="absolute inset-y-0 flex items-center justify-center px-2">
      <Search class="size-5 text-muted-foreground" />
    </span>
  </div>
</template>
