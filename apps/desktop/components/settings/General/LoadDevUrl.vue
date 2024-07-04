<script setup lang="ts">
import { Checkbox } from "@/components/ui/checkbox"
import { $appConfig, setDevExtLoadUrl, setShowInTray } from "@/lib/stores/appConfig"
import { useStore } from "@nanostores/vue"
import { computed, ref, watch } from "vue"

const appConfig = useStore($appConfig)
const checked = computed({
  get() {
    return appConfig.value.devExtLoadUrl
  },
  set(val) {
    setDevExtLoadUrl(val)
  }
})
</script>
<template>
  <div class="grid grid-cols-2 gap-4">
    <span class="justify-self-end">Dev Extension URL</span>
    <div class="flex items-center space-x-2">
      <Checkbox id="dev-ext-load-url" v-model:checked="checked" />
      <label
        for="dev-ext-load-url"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
      >
        <span v-if="checked">Live Load UI from Dev Server</span>
        <span v-else>Load from Compiled Static Assets</span>
      </label>
    </div>
  </div>
</template>
