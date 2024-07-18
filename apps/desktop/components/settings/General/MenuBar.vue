<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox"
import { $appConfig, setShowInTray } from "@/lib/stores/appConfig"
import { useStore } from "@nanostores/vue"
import { computed, ref, watch } from "vue"

const appConfig = useStore($appConfig)
const checked = computed({
  get() {
    return appConfig.value.showInTray
  },
  set(val) {
    setShowInTray(val)
  }
})
</script>
<template>
  <div class="grid grid-cols-2 gap-4">
    <span class="justify-self-end">Menu Bar Icon</span>
    <div class="flex items-center space-x-2">
      <Checkbox id="menu-bar" v-model:checked="checked" />
      <label
        for="menu-bar"
        class="select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Show in Menu Bar
      </label>
    </div>
  </div>
</template>
