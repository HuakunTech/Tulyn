<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle.vue";
defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <div class="flex flex-col items-center space-y-5">
    <h1 class="text-3xl">{{ msg }}</h1>
    <ModeToggle />
    <div class="card">
      <div class="flex justify-center mb-5">
        <Button @click="count++">count is {{ count }}</Button>
      </div>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <p>
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the
      official Vue + Vite starter
    </p>
    <p>
      Install
      <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
      in your IDE for a better DX
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
