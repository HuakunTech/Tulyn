<script setup lang="ts">
import ModeToggle from "@/components/theme/ModeToggle.vue"
import { Button } from "@/components/ui/button"
import { appIsDev, toggleDevTools } from "@kunkunsh/api/commands"
import {
  CogIcon,
  FlaskConicalIcon,
  HomeIcon,
  RefreshCwIcon,
  TestTubesIcon,
  UserCogIcon,
  WrenchIcon
} from "lucide-vue-next"
import { onMounted, ref } from "vue"

const isDev = ref(false)

onMounted(async () => {
  isDev.value = await appIsDev()
})
</script>
<template>
  <div data-tauri-drag-region class="h-8">
    <div class="float-right flex space-x-4 px-5 py-2">
      <ModeToggle class="h-4 w-4 -translate-y-0.5" />
      <a href="/">
        <Button class="h-4 w-4" size="icon" variant="ghost">
          <HomeIcon />
        </Button>
      </a>
      <a href="./dev" v-if="isDev">
        <Button class="h-4 w-4" size="icon" variant="ghost">
          <FlaskConicalIcon />
        </Button>
      </a>
      <a href="./link-list" v-if="isDev">
        <Button class="h-4 w-4" size="icon" variant="ghost">
          <TestTubesIcon />
        </Button>
      </a>
      <a href="./extension-store">
        <Button class="h-4 w-4" size="icon" variant="ghost">
          <Icon name="ri:app-store-fill" class="h-5 w-5" />
        </Button>
      </a>
      <a href="./settings">
        <Button class="h-4 w-4" size="icon" variant="ghost">
          <CogIcon />
        </Button>
      </a>
      <Button v-if="isDev" @click="toggleDevTools" class="h-4 w-4" size="icon" variant="ghost">
        <WrenchIcon />
      </Button>
    </div>
  </div>
</template>
