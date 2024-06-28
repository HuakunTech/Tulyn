<!-- <script setup lang="ts">
// import { Toaster } from "@/components/ui/sonner";
import { Toaster, toast } from 'vue-sonner'

const colorMode = useColorMode();
</script>
<template>
  <Toaster />
  <slot />
</template> -->

<template>
  <Toaster />
  <button @click="() => toast('My first toast')">Give me a toast</button>
  <slot />
</template>

<script lang="ts" setup>
import {
  // Toaster,
  toast,
} from "vue-sonner";
import { Toaster } from "@/components/ui/sonner";
</script>
