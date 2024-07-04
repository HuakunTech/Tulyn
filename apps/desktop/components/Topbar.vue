<script setup lang="ts">
import ModeToggle from "@/components/theme/ModeToggle.vue"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/vue"
import {
  CogIcon,
  FlaskConicalIcon,
  HomeIcon,
  RefreshCwIcon,
  TestTubesIcon,
  UserCogIcon,
  WrenchIcon
} from "lucide-vue-next"
import { appIsDev, toggleDevTools } from "tauri-plugin-jarvis-api/commands"
import { onMounted, ref } from "vue"

const isDev = ref(false)

onMounted(async () => {
  isDev.value = await appIsDev()
})
</script>
<template>
  <div data-tauri-drag-region class="h-8">
    <div class="flex space-x-4 float-right px-5 py-2">
      <ModeToggle class="w-4 h-4 -translate-y-0.5" />
      <a href="/">
        <Button class="w-4 h-4" size="icon" variant="ghost">
          <HomeIcon />
        </Button>
      </a>
      <a href="./dev" v-if="isDev">
        <Button class="w-4 h-4" size="icon" variant="ghost">
          <FlaskConicalIcon />
        </Button>
      </a>
      <a href="./link-list" v-if="isDev">
        <Button class="w-4 h-4" size="icon" variant="ghost">
          <TestTubesIcon />
        </Button>
      </a>
      <a href="./extension-store">
        <Button class="w-4 h-4" size="icon" variant="ghost">
          <Icon icon="ri:app-store-fill" class="w-5 h-5" />
        </Button>
      </a>
      <a href="./settings">
        <Button class="w-4 h-4" size="icon" variant="ghost">
          <CogIcon />
        </Button>
      </a>
      <Button v-if="isDev" @click="toggleDevTools" class="w-4 h-4" size="icon" variant="ghost">
        <WrenchIcon />
      </Button>
    </div>
  </div>
</template>
