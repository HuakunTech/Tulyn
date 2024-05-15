<script setup lang="ts">
import {
  WrenchIcon,
  RefreshCwIcon,
  HomeIcon,
  CogIcon,
  FlaskConicalIcon,
  UserCogIcon,
  TestTubesIcon,
} from "lucide-vue-next";
import ModeToggle from "@/components/ui/ModeToggle.vue";
import { Button } from "@/components/ui/button";
import { toggleDevTools } from "@/lib/commands/tools";
</script>
<template>
  <div data-tauri-drag-region class="h-8">
    <div class="flex space-x-4 float-right px-5 py-2">
      <ModeToggle class="w-4 h-4" />
      <a href="/">
        <Button class="w-4 h-4" size="icon" variant="ghost">
          <HomeIcon />
        </Button>
      </a>
      <a href="./dev">
        <Button v-if="true" class="w-4 h-4" size="icon" variant="ghost">
          <FlaskConicalIcon />
        </Button>
      </a>
      <a href="./workflow-editor">
        <Button class="w-4 h-4" size="icon" variant="ghost">
          <TestTubesIcon />
        </Button>
      </a>
      <a href="./settings">
        <Button class="w-4 h-4" size="icon" variant="ghost">
          <CogIcon />
        </Button>
      </a>
      <Button v-if="true" @click="toggleDevTools" class="w-4 h-4" size="icon" variant="ghost">
        <WrenchIcon />
      </Button>
    </div>
  </div>
</template>
